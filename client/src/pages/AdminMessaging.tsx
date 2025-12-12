import { useState } from "react";
import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "../lib/trpc";
import { Link } from "wouter";
import { Button } from "../components/ui/button";
import { Card } from "../components/ui/card";
import { Textarea } from "../components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import { MessageSquare, Send, TrendingUp, Mail, MessageCircle } from "lucide-react";
import { toast } from "sonner";

export default function AdminMessaging() {
  const { user, loading } = useAuth();
  const [channel, setChannel] = useState<"telegram" | "instagram" | "whatsapp" | "email">("telegram");
  const [message, setMessage] = useState("");
  const [isSending, setIsSending] = useState(false);

  const { data: stats } = trpc.messaging.getMessagingStats.useQuery();
  const { data: recentMessages } = trpc.messaging.getRecentMessages.useQuery({
    limit: 20,
    channel: "all",
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <p className="text-white text-lg">Loading...</p>
      </div>
    );
  }

  if (!user || user.role !== "admin") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <Card className="bg-slate-800/50 border-slate-700 p-8 max-w-md">
          <h1 className="text-2xl font-bold text-red-400 mb-4">Access Denied</h1>
          <p className="text-gray-300 mb-6">
            You need administrator privileges to access the Messaging Center.
          </p>
          <Link href="/">
            <Button className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700">Return Home</Button>
          </Link>
        </Card>
      </div>
    );
  }

  const sendMutation = trpc.messaging.sendBulkMessage.useMutation({
    onSuccess: (data) => {
      toast.success(`Messages sent to ${data.successCount} recipients via ${data.channel}`);
      setMessage("");
      setIsSending(false);
    },
    onError: (error) => {
      toast.error(error.message || "Failed to send messages");
      setIsSending(false);
    },
  });

  const handleSend = () => {
    if (!message.trim()) {
      toast.error("Please enter a message to send");
      return;
    }

    setIsSending(true);
    sendMutation.mutate({
      channel,
      message,
    });
  };

  const getChannelIcon = (ch: string) => {
    switch (ch) {
      case "telegram":
        return <MessageSquare className="h-5 w-5 text-blue-500" />;
      case "instagram":
        return <MessageCircle className="h-5 w-5 text-pink-500" />;
      case "whatsapp":
        return <MessageCircle className="h-5 w-5 text-green-500" />;
      case "email":
        return <Mail className="h-5 w-5 text-purple-500" />;
      default:
        return <MessageSquare className="h-5 w-5" />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-6">
      <div className="container max-w-7xl">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Messaging Center</h1>
          <p className="text-gray-300">Send bulk messages to leads via multiple channels</p>
        </div>

        {/* Statistics Cards */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card className="bg-slate-800/50 border-slate-700 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Total Messages</p>
                  <p className="text-3xl font-bold text-white">{stats.totalMessagesSent}</p>
                </div>
                <TrendingUp className="h-8 w-8 text-blue-500" />
              </div>
            </Card>

            <Card className="bg-slate-800/50 border-slate-700 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Telegram</p>
                  <p className="text-3xl font-bold text-white">{stats.byChannel.telegram.sent}</p>
                  <p className="text-xs text-gray-500">
                    {(stats.byChannel.telegram.successRate * 100).toFixed(1)}% success
                  </p>
                </div>
                <MessageSquare className="h-8 w-8 text-blue-500" />
              </div>
            </Card>

            <Card className="bg-slate-800/50 border-slate-700 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">WhatsApp</p>
                  <p className="text-3xl font-bold text-white">{stats.byChannel.whatsapp.sent}</p>
                  <p className="text-xs text-gray-500">
                    {(stats.byChannel.whatsapp.successRate * 100).toFixed(1)}% success
                  </p>
                </div>
                <MessageCircle className="h-8 w-8 text-green-500" />
              </div>
            </Card>

            <Card className="bg-slate-800/50 border-slate-700 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Email</p>
                  <p className="text-3xl font-bold text-white">{stats.byChannel.email.sent}</p>
                  <p className="text-xs text-gray-500">
                    {(stats.byChannel.email.successRate * 100).toFixed(1)}% success
                  </p>
                </div>
                <Mail className="h-8 w-8 text-purple-500" />
              </div>
            </Card>
          </div>
        )}

        {/* Send Message Form */}
        <Card className="bg-slate-800/50 border-slate-700 p-6 mb-8">
          <h2 className="text-2xl font-bold text-white mb-6">Send Bulk Message</h2>

          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Channel</label>
              <Select value={channel} onValueChange={(v: any) => setChannel(v)}>
                <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="telegram">Telegram</SelectItem>
                  <SelectItem value="instagram">Instagram</SelectItem>
                  <SelectItem value="whatsapp">WhatsApp</SelectItem>
                  <SelectItem value="email">Email</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Message</label>
              <Textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Enter your message here..."
                className="bg-slate-700 border-slate-600 text-white min-h-[150px]"
                rows={6}
              />
              <p className="text-xs text-gray-400 mt-2">
                This message will be sent to all leads with valid {channel} contact information.
              </p>
            </div>

            <div className="flex justify-end gap-4">
              <Button
                variant="outline"
                onClick={() => setMessage("")}
                className="bg-slate-700 border-slate-600 text-white hover:bg-slate-600"
              >
                Clear
              </Button>
              <Button
                onClick={handleSend}
                disabled={isSending || !message.trim()}
                className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
              >
                <Send className="h-4 w-4 mr-2" />
                {isSending ? "Sending..." : "Send Message"}
              </Button>
            </div>
          </div>
        </Card>

        {/* Recent Messages History */}
        <Card className="bg-slate-800/50 border-slate-700 p-6">
          <h2 className="text-2xl font-bold text-white mb-6">Recent Messages</h2>

          <div className="space-y-4">
            {recentMessages && recentMessages.length > 0 ? (
              recentMessages.map((msg) => (
                <div
                  key={msg.id}
                  className="bg-slate-700/50 border border-slate-600 rounded-lg p-4 hover:bg-slate-700/70 transition-colors"
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-3">
                      {getChannelIcon(msg.channel)}
                      <div>
                        <p className="text-white font-medium capitalize">{msg.channel}</p>
                        <p className="text-xs text-gray-400">
                          {new Date(msg.sentAt).toLocaleString()}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-300">
                        {msg.successCount}/{msg.recipientCount} sent
                      </p>
                      {msg.failedCount > 0 && (
                        <p className="text-xs text-red-400">{msg.failedCount} failed</p>
                      )}
                    </div>
                  </div>
                  <p className="text-gray-300 text-sm">{msg.message}</p>
                  <p className="text-xs text-gray-500 mt-2">Sent by {msg.sentBy}</p>
                </div>
              ))
            ) : (
              <div className="text-center py-12">
                <MessageSquare className="h-12 w-12 text-gray-600 mx-auto mb-4" />
                <p className="text-gray-400">No messages sent yet</p>
                <p className="text-sm text-gray-500 mt-2">
                  Send your first bulk message using the form above
                </p>
              </div>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}
