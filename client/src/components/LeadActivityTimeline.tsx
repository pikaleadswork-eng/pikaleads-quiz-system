import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { 
  MessageSquare, 
  FileText, 
  Phone, 
  Mail, 
  Upload, 
  Trash2,
  Download,
  Clock
} from "lucide-react";
import { format } from "date-fns";
import { toast } from "sonner";

interface LeadActivityTimelineProps {
  leadId: number;
}

export function LeadActivityTimeline({ leadId }: LeadActivityTimelineProps) {
  const [comment, setComment] = useState("");
  const [noteTitle, setNoteTitle] = useState("");
  const [noteContent, setNoteContent] = useState("");
  const [showNoteForm, setShowNoteForm] = useState(false);

  const utils = trpc.useUtils();
  const { data: activities, isLoading } = trpc.leadActivities.getActivities.useQuery({ leadId });
  
  const addCommentMutation = trpc.leadActivities.addComment.useMutation({
    onSuccess: () => {
      utils.leadActivities.getActivities.invalidate({ leadId });
      setComment("");
      toast.success("Comment added");
    },
  });

  const addNoteMutation = trpc.leadActivities.addNote.useMutation({
    onSuccess: () => {
      utils.leadActivities.getActivities.invalidate({ leadId });
      setNoteTitle("");
      setNoteContent("");
      setShowNoteForm(false);
      toast.success("Note added");
    },
  });

  const deleteActivityMutation = trpc.leadActivities.deleteActivity.useMutation({
    onSuccess: () => {
      utils.leadActivities.getActivities.invalidate({ leadId });
      toast.success("Activity deleted");
    },
  });

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      toast.error("File size must be less than 10MB");
      return;
    }

    const reader = new FileReader();
    reader.onload = async () => {
      const base64 = reader.result?.toString().split(",")[1];
      if (!base64) return;

      try {
        const uploadMutation = trpc.leadActivities.uploadFile.useMutation();
        await uploadMutation.mutateAsync({
          leadId,
          fileName: file.name,
          fileData: base64,
          fileMimeType: file.type,
        });
        utils.leadActivities.getActivities.invalidate({ leadId });
        toast.success("File uploaded");
      } catch (error) {
        toast.error("Failed to upload file");
      }
    };
    reader.readAsDataURL(file);
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case "comment":
        return <MessageSquare className="w-4 h-4" />;
      case "note":
        return <FileText className="w-4 h-4" />;
      case "call":
        return <Phone className="w-4 h-4" />;
      case "email":
        return <Mail className="w-4 h-4" />;
      case "file_upload":
        return <Upload className="w-4 h-4" />;
      default:
        return <Clock className="w-4 h-4" />;
    }
  };

  const getActivityColor = (type: string) => {
    switch (type) {
      case "comment":
        return "bg-blue-500";
      case "note":
        return "bg-purple-500";
      case "call":
        return "bg-green-500";
      case "email":
        return "bg-orange-500";
      case "file_upload":
        return "bg-pink-500";
      default:
        return "bg-gray-500";
    }
  };

  if (isLoading) {
    return <div>Loading activities...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Add Comment */}
      <Card className="p-4">
        <div className="space-y-3">
          <Textarea
            placeholder="Add a comment..."
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            rows={3}
          />
          <div className="flex gap-2">
            <Button
              onClick={() => addCommentMutation.mutate({ leadId, comment })}
              disabled={!comment.trim() || addCommentMutation.isPending}
            >
              <MessageSquare className="w-4 h-4 mr-2" />
              Add Comment
            </Button>
            <Button
              variant="outline"
              onClick={() => setShowNoteForm(!showNoteForm)}
            >
              <FileText className="w-4 h-4 mr-2" />
              Add Note
            </Button>
            <Button variant="outline" asChild>
              <label className="cursor-pointer">
                <Upload className="w-4 h-4 mr-2" />
                Upload File
                <input
                  type="file"
                  className="hidden"
                  onChange={handleFileUpload}
                  accept="image/*,.pdf,.doc,.docx,.xls,.xlsx"
                />
              </label>
            </Button>
          </div>
        </div>

        {/* Note Form */}
        {showNoteForm && (
          <div className="mt-4 space-y-3 pt-4 border-t">
            <Input
              placeholder="Note title..."
              value={noteTitle}
              onChange={(e) => setNoteTitle(e.target.value)}
            />
            <Textarea
              placeholder="Note content..."
              value={noteContent}
              onChange={(e) => setNoteContent(e.target.value)}
              rows={4}
            />
            <div className="flex gap-2">
              <Button
                onClick={() =>
                  addNoteMutation.mutate({ leadId, title: noteTitle, note: noteContent })
                }
                disabled={!noteTitle.trim() || !noteContent.trim() || addNoteMutation.isPending}
              >
                Save Note
              </Button>
              <Button variant="outline" onClick={() => setShowNoteForm(false)}>
                Cancel
              </Button>
            </div>
          </div>
        )}
      </Card>

      {/* Timeline */}
      <div className="space-y-4">
        {activities?.map((activity) => (
          <div key={activity.id} className="flex gap-4">
            {/* Icon */}
            <div className="flex flex-col items-center">
              <div
                className={`w-8 h-8 rounded-full ${getActivityColor(
                  activity.activityType
                )} flex items-center justify-center text-white`}
              >
                {getActivityIcon(activity.activityType)}
              </div>
              <div className="w-0.5 h-full bg-border mt-2" />
            </div>

            {/* Content */}
            <Card className="flex-1 p-4">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <h4 className="font-medium">{activity.title}</h4>
                  <p className="text-sm text-muted-foreground">
                    {activity.userName} • {format(new Date(activity.createdAt), "MMM d, yyyy 'at' h:mm a")}
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => deleteActivityMutation.mutate({ activityId: activity.id })}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>

              {activity.description && (
                <p className="text-sm text-foreground whitespace-pre-wrap mb-2">
                  {activity.description}
                </p>
              )}

              {activity.fileUrl && (
                <a
                  href={activity.fileUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-sm text-blue-500 hover:underline"
                >
                  <Download className="w-4 h-4" />
                  {activity.fileName} ({(activity.fileSize! / 1024).toFixed(1)} KB)
                </a>
              )}
            </Card>
          </div>
        ))}

        {activities?.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            No activities yet. Add a comment or note to get started.
          </div>
        )}
      </div>
    </div>
  );
}
