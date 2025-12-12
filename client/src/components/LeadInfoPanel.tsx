import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, MessageSquare, Phone, User, Mail, Video } from "lucide-react";
import { toast } from "sonner";

interface LeadInfoPanelProps {
  leadId: number;
}

export function LeadInfoPanel({ leadId }: LeadInfoPanelProps) {
  const { t } = useTranslation();
  const [scheduleMessageOpen, setScheduleMessageOpen] = useState(false);
  const [scheduleCallOpen, setScheduleCallOpen] = useState(false);
  const [scheduleMeetingOpen, setScheduleMeetingOpen] = useState(false);
  const [noteText, setNoteText] = useState("");
  const [selectedChannel, setSelectedChannel] = useState<"phone" | "telegram" | "whatsapp">("phone");

  // Fetch lead info
  const { data: leadInfo, isLoading, refetch } = trpc.messaging.getLeadInfo.useQuery({ leadId });
  
  // Fetch statuses
  const { data: statuses } = trpc.crm.getStatuses.useQuery();
  
  // Fetch interaction history
  const { data: interactions } = trpc.messaging.getInteractionHistory.useQuery({ leadId });

  // Mutations
  const updateStatus = trpc.messaging.updateLeadStatus.useMutation({
    onSuccess: () => {
      toast.success("Status updated");
      refetch();
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const scheduleMessage = trpc.messaging.scheduleMessage.useMutation({
    onSuccess: () => {
      toast.success("Message scheduled");
      setScheduleMessageOpen(false);
      refetch();
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const scheduleCall = trpc.messaging.scheduleCall.useMutation({
    onSuccess: () => {
      toast.success("Call scheduled");
      setScheduleCallOpen(false);
      refetch();
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const addNote = trpc.messaging.addNote.useMutation({
    onSuccess: () => {
      toast.success("Note added");
      setNoteText("");
      refetch();
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const initiateCall = trpc.messaging.initiateCall.useMutation({
    onSuccess: () => {
      toast.success("Call initiated");
      refetch();
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const scheduleMeeting = trpc.messaging.scheduleMeeting.useMutation({
    onSuccess: () => {
      toast.success("Meeting scheduled");
      setScheduleMeetingOpen(false);
      refetch();
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  if (isLoading) {
    return (
      <div className="w-full h-full bg-black border-l border-zinc-800 p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-zinc-800 rounded"></div>
          <div className="h-24 bg-zinc-800 rounded"></div>
          <div className="h-32 bg-zinc-800 rounded"></div>
        </div>
      </div>
    );
  }

  if (!leadInfo) {
    return (
      <div className="w-full h-full bg-black border-l border-zinc-800 p-6">
        <p className="text-zinc-500">Lead not found</p>
      </div>
    );
  }

  const getStatusColor = (statusName?: string) => {
    if (!statusName) return "bg-zinc-700";
    const lower = statusName.toLowerCase();
    if (lower.includes("new")) return "bg-blue-600";
    if (lower.includes("contacted")) return "bg-yellow-600";
    if (lower.includes("qualified")) return "bg-purple-600";
    if (lower.includes("won") || lower.includes("converted")) return "bg-green-600";
    if (lower.includes("lost")) return "bg-red-600";
    return "bg-zinc-700";
  };

  return (
    <div className="w-full h-full bg-black border-l border-zinc-800 overflow-y-auto">
      <div className="p-6 space-y-6">
        {/* Lead Contact Info */}
        <Card className="bg-zinc-900 border-zinc-800">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <User className="w-5 h-5 text-purple-400" />
              Contact Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <Label className="text-zinc-400 text-xs">Name</Label>
              <p className="text-white font-medium">{leadInfo.name}</p>
            </div>
            <div>
              <Label className="text-zinc-400 text-xs">Phone</Label>
              <div className="flex items-center gap-2 mt-1">
                <p className="text-white flex-1">{leadInfo.phone}</p>
                <div className="flex gap-1">
                  <Button
                    size="sm"
                    onClick={() => {
                      setSelectedChannel("phone");
                      initiateCall.mutate({ leadId, phone: leadInfo.phone });
                    }}
                    className="bg-yellow-500 hover:bg-yellow-600 text-black h-7 px-2"
                  >
                    <Phone className="w-3 h-3 mr-1" />
                    Call
                  </Button>
                  {leadInfo.telegram && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setSelectedChannel("telegram")}
                      className="h-7 px-2 border-blue-500 text-blue-400 hover:bg-blue-500/20"
                    >
                      <MessageSquare className="w-3 h-3" />
                    </Button>
                  )}
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setSelectedChannel("whatsapp")}
                    className="h-7 px-2 border-green-500 text-green-400 hover:bg-green-500/20"
                  >
                    <MessageSquare className="w-3 h-3" />
                  </Button>
                </div>
              </div>
            </div>
            {leadInfo.email && (
              <div>
                <Label className="text-zinc-400 text-xs">Email</Label>
                <p className="text-white">{leadInfo.email}</p>
              </div>
            )}
            {leadInfo.telegram && (
              <div>
                <Label className="text-zinc-400 text-xs">Telegram</Label>
                <p className="text-white">{leadInfo.telegram}</p>
              </div>
            )}
            <div>
              <Label className="text-zinc-400 text-xs">Quiz</Label>
              <p className="text-white">{leadInfo.quizName}</p>
            </div>
            <div>
              <Label className="text-zinc-400 text-xs">Lead Score</Label>
              <Badge className="bg-yellow-600">{leadInfo.leadScore}/100</Badge>
            </div>
          </CardContent>
        </Card>

        {/* Status Management */}
        <Card className="bg-zinc-900 border-zinc-800">
          <CardHeader>
            <CardTitle className="text-white text-sm">Status</CardTitle>
          </CardHeader>
          <CardContent>
            <Select
              value={leadInfo.statusId?.toString() || ""}
              onValueChange={(value) => {
                updateStatus.mutate({
                  leadId,
                  statusId: parseInt(value),
                });
              }}
            >
              <SelectTrigger className="bg-zinc-800 border-zinc-700 text-white">
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent className="bg-zinc-900 border-zinc-800">
                {statuses?.map((status: any) => (
                  <SelectItem
                    key={status.id}
                    value={status.id.toString()}
                    className="text-white hover:bg-zinc-800"
                  >
                    <div className="flex items-center gap-2">
                      <div
                        className={`w-2 h-2 rounded-full ${getStatusColor(status.name)}`}
                      ></div>
                      {status.name}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </CardContent>
        </Card>

        {/* Schedule Actions */}
        <Card className="bg-zinc-900 border-zinc-800">
          <CardHeader>
            <CardTitle className="text-white text-sm">Schedule</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <Button
              onClick={() => setScheduleCallOpen(!scheduleCallOpen)}
              className="w-full bg-purple-600 hover:bg-purple-700 text-white"
              size="sm"
            >
              <Phone className="w-4 h-4 mr-2" />
              Schedule Call
            </Button>
            {scheduleCallOpen && (
              <div className="space-y-3 p-3 bg-zinc-800 rounded-lg">
                <div>
                  <Label className="text-white text-xs">Date & Time</Label>
                  <Input
                    type="datetime-local"
                    className="bg-zinc-900 border-zinc-700 text-white mt-1"
                    onChange={(e) => {
                      const date = new Date(e.target.value);
                      scheduleCall.mutate({
                        leadId,
                        scheduledAt: date,
                        duration: 30,
                      });
                    }}
                  />
                </div>
              </div>
            )}

            <Button
              onClick={() => setScheduleMeetingOpen(!scheduleMeetingOpen)}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white"
              size="sm"
            >
              <Video className="w-4 h-4 mr-2" />
              Schedule Meeting
            </Button>
            {scheduleMeetingOpen && (
              <div className="space-y-3 p-3 bg-zinc-800 rounded-lg">
                <div>
                  <Label className="text-white text-xs">Platform</Label>
                  <Select defaultValue="google_meet">
                    <SelectTrigger className="bg-zinc-900 border-zinc-700 text-white mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-zinc-900 border-zinc-800">
                      <SelectItem value="google_meet" className="text-white">
                        Google Meet
                      </SelectItem>
                      <SelectItem value="zoom" className="text-white">
                        Zoom
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label className="text-white text-xs">Title</Label>
                  <Input
                    placeholder="Meeting title"
                    className="bg-zinc-900 border-zinc-700 text-white mt-1"
                  />
                </div>
                <div>
                  <Label className="text-white text-xs">Date & Time</Label>
                  <Input
                    type="datetime-local"
                    className="bg-zinc-900 border-zinc-700 text-white mt-1"
                  />
                </div>
                <Button
                  size="sm"
                  className="w-full bg-purple-600 hover:bg-purple-700"
                  onClick={() => {
                    // Will implement with proper state management
                    toast.info("Meeting scheduling coming soon");
                  }}
                >
                  Create Meeting
                </Button>
              </div>
            )}

            <Button
              onClick={() => setScheduleMessageOpen(!scheduleMessageOpen)}
              className="w-full bg-yellow-600 hover:bg-yellow-700 text-black"
              size="sm"
            >
              <MessageSquare className="w-4 h-4 mr-2" />
              Schedule Message
            </Button>
            {scheduleMessageOpen && (
              <div className="space-y-3 p-3 bg-zinc-800 rounded-lg">
                <div>
                  <Label className="text-white text-xs">Channel</Label>
                  <Select>
                    <SelectTrigger className="bg-zinc-900 border-zinc-700 text-white mt-1">
                      <SelectValue placeholder="Select channel" />
                    </SelectTrigger>
                    <SelectContent className="bg-zinc-900 border-zinc-800">
                      <SelectItem value="telegram" className="text-white">
                        Telegram
                      </SelectItem>
                      <SelectItem value="whatsapp" className="text-white">
                        WhatsApp
                      </SelectItem>
                      <SelectItem value="email" className="text-white">
                        Email
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label className="text-white text-xs">Message</Label>
                  <Textarea
                    placeholder="Type your message..."
                    className="bg-zinc-900 border-zinc-700 text-white mt-1"
                  />
                </div>
                <div>
                  <Label className="text-white text-xs">Send At</Label>
                  <Input
                    type="datetime-local"
                    className="bg-zinc-900 border-zinc-700 text-white mt-1"
                  />
                </div>
                <Button
                  size="sm"
                  className="w-full bg-purple-600 hover:bg-purple-700"
                >
                  Schedule
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Notes */}
        <Card className="bg-zinc-900 border-zinc-800">
          <CardHeader>
            <CardTitle className="text-white text-sm">Add Note</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <Textarea
              value={noteText}
              onChange={(e) => setNoteText(e.target.value)}
              placeholder={t("leadInfo.typeNote")}
              className="bg-zinc-800 border-zinc-700 text-white"
            />
            <Button
              onClick={() => {
                if (noteText.trim()) {
                  addNote.mutate({ leadId, note: noteText });
                }
              }}
              disabled={!noteText.trim()}
              size="sm"
              className="w-full bg-purple-600 hover:bg-purple-700"
            >
              Add Note
            </Button>
          </CardContent>
        </Card>

        {/* Interaction History */}
        <Card className="bg-zinc-900 border-zinc-800">
          <CardHeader>
            <CardTitle className="text-white text-sm">Activity Timeline</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {interactions && interactions.length > 0 ? (
                interactions.map((interaction, index) => (
                  <div key={index} className="flex gap-3 text-sm">
                    <div className="flex flex-col items-center">
                      <div className="w-2 h-2 rounded-full bg-purple-500 mt-2"></div>
                      {index < interactions.length - 1 && (
                        <div className="w-px h-full bg-zinc-700 mt-1"></div>
                      )}
                    </div>
                    <div className="flex-1 pb-4">
                      <p className="text-zinc-400 text-xs">
                        {new Date(interaction.createdAt).toLocaleString()}
                      </p>
                      <p className="text-white mt-1">
                        <Badge className="bg-zinc-700 text-xs mr-2">
                          {interaction.type}
                        </Badge>
                        {interaction.message}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-zinc-500 text-sm">No activity yet</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
