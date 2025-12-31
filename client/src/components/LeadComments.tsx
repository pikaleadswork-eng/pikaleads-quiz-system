import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Loader2, MessageSquare } from "lucide-react";
import { useTranslation } from "react-i18next";
import { formatDistanceToNow } from "date-fns";
import { uk, ru, enUS } from "date-fns/locale";

interface LeadCommentsProps {
  leadId: number;
}

export function LeadComments({ leadId }: LeadCommentsProps) {
  const { t, i18n } = useTranslation();
  const [newComment, setNewComment] = useState("");

  const { data: comments, isLoading, refetch } = trpc.comments.getByLeadId.useQuery({ leadId });

  const addCommentMutation = trpc.comments.add.useMutation({
    onSuccess: () => {
      toast.success(t('comments.added'));
      setNewComment("");
      refetch();
    },
    onError: (error: any) => {
      toast.error(error.message || t('comments.error'));
    },
  });

  const handleAddComment = () => {
    if (!newComment.trim()) {
      toast.error(t('comments.empty'));
      return;
    }

    addCommentMutation.mutate({
      leadId,
      comment: newComment,
    });
  };

  const getDateLocale = () => {
    switch (i18n.language) {
      case 'uk':
        return uk;
      case 'ru':
        return ru;
      default:
        return enUS;
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-4">
        <Loader2 className="w-5 h-5 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Add Comment */}
      <div className="space-y-2">
        <Textarea
          className="bg-zinc-800 border-zinc-700"
          placeholder={t('comments.placeholder')}
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          rows={3}
        />
        <Button
          onClick={handleAddComment}
          disabled={addCommentMutation.isPending || !newComment.trim()}
          size="sm"
        >
          {addCommentMutation.isPending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
          <MessageSquare className="w-4 h-4 mr-2" />
          {t('comments.add')}
        </Button>
      </div>

      {/* Comments List */}
      {comments && comments.length > 0 ? (
        <div className="space-y-3 max-h-96 overflow-y-auto">
          {comments.map((comment: any) => (
            <div
              key={comment.id}
              className="bg-zinc-800 border border-zinc-700 rounded-lg p-3"
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-purple-600 flex items-center justify-center text-white text-sm font-semibold">
                    {comment.userName?.[0]?.toUpperCase() || 'U'}
                  </div>
                  <div>
                    <p className="text-sm font-medium">{comment.userName || t('comments.unknown')}</p>
                    <p className="text-xs text-muted-foreground">
                      {formatDistanceToNow(new Date(comment.createdAt), {
                        addSuffix: true,
                        locale: getDateLocale(),
                      })}
                    </p>
                  </div>
                </div>
              </div>
              <p className="text-sm text-zinc-300 whitespace-pre-wrap">{comment.comment}</p>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-8 text-muted-foreground">
          <MessageSquare className="w-12 h-12 mx-auto mb-2 opacity-50" />
          <p>{t('comments.noComments')}</p>
        </div>
      )}
    </div>
  );
}
