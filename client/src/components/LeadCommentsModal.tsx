import { useState } from "react";
import { trpc } from "@/lib/trpc";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Loader2, MessageSquare } from "lucide-react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";

interface LeadCommentsModalProps {
  leadId: number;
  leadName: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function LeadCommentsModal({ leadId, leadName, open, onOpenChange }: LeadCommentsModalProps) {
  const { t } = useTranslation();
  const [newComment, setNewComment] = useState("");
  
  // Fetch comments
  const { data: comments, isLoading, refetch } = trpc.comments.getByLeadId.useQuery(
    { leadId },
    { enabled: open }
  );
  
  // Add comment mutation
  const addCommentMutation = trpc.comments.add.useMutation({
    onSuccess: () => {
      toast.success(t('common.success') || 'Comment added');
      setNewComment("");
      refetch();
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to add comment');
    },
  });
  
  const handleAddComment = () => {
    if (!newComment.trim()) {
      toast.error(t('common.required') || 'Comment text is required');
      return;
    }
    
    addCommentMutation.mutate({
      leadId,
      comment: newComment.trim(),
    });
  };
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <MessageSquare className="w-5 h-5" />
            {t('comments.title') || 'Коментарі'} - {leadName}
          </DialogTitle>
          <DialogDescription>
            {t('comments.description') || 'Історія коментарів та нотаток по ліду'}
          </DialogDescription>
        </DialogHeader>
        
        <div className="flex-1 overflow-y-auto space-y-4 py-4">
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="w-6 h-6 animate-spin" />
            </div>
          ) : comments && comments.length > 0 ? (
            comments.map((comment: any) => (
              <div key={comment.id} className="flex gap-3 p-3 rounded-lg bg-zinc-800/50">
                <Avatar className="w-8 h-8">
                  <AvatarFallback className="bg-purple-600 text-white text-xs">
                    {comment.userName?.charAt(0).toUpperCase() || 'U'}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-medium text-sm">{comment.userName || 'Unknown User'}</span>
                    <span className="text-xs text-gray-400">
                      {new Date(comment.createdAt).toLocaleString('uk-UA', {
                        day: '2-digit',
                        month: '2-digit',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </span>
                  </div>
                  <p className="text-sm text-gray-300 whitespace-pre-wrap">{comment.comment}</p>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-8 text-gray-400">
              <MessageSquare className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p>{t('comments.empty') || 'Коментарів поки немає'}</p>
            </div>
          )}
        </div>
        
        <div className="border-t border-zinc-800 pt-4 space-y-3">
          <Textarea
            placeholder={t('comments.placeholder') || 'Напишіть коментар...'}
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            className="min-h-[80px] bg-zinc-800 resize-none"
            disabled={addCommentMutation.isPending}
          />
          <div className="flex justify-end gap-2">
            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={addCommentMutation.isPending}
            >
              {t('common.close') || 'Закрити'}
            </Button>
            <Button
              onClick={handleAddComment}
              disabled={addCommentMutation.isPending || !newComment.trim()}
              className="bg-gradient-to-r from-purple-600 to-pink-600"
            >
              {addCommentMutation.isPending ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  {t('common.saving') || 'Збереження...'}
                </>
              ) : (
                <>{t('comments.add') || 'Додати коментар'}</>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
