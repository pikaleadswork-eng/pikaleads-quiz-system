import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Loader2, MessageSquare, Mail, Send, Filter, MessageCircle } from "lucide-react";
import { format } from "date-fns";
import { useAuth } from "@/_core/hooks/useAuth";
import CRMLayout from "@/components/CRMLayout";
import { ChatWindow } from "@/components/ChatWindow";
import { Link } from "wouter";

export default function MessagingInbox() {
  const { user, loading: authLoading } = useAuth();
  const [channelFilter, setChannelFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedChat, setSelectedChat] = useState<{
    recipientId: string;
    recipientName: string;
    channel: "telegram" | "whatsapp" | "email" | "instagram";
  } | null>(null);

  const { data: messages, isLoading } = trpc.messaging.getRecentMessages.useQuery({ limit: 100, channel: "all" });

  if (authLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  if (!user) {
    window.location.href = "/login";
    return null;
  }

  if (user.role !== "admin") {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <h1 className="text-2xl font-bold mb-4">Access Denied</h1>
        <p className="text-muted-foreground mb-4">You need admin privileges to access this page.</p>
        <Link href="/admin">
          <Button>Return Home</Button>
        </Link>
      </div>
    );
  }

  // Filter messages
  const filteredMessages = messages?.filter((msg) => {
    const matchesChannel = channelFilter === "all" || msg.channel.toLowerCase() === channelFilter.toLowerCase();
    const matchesSearch = !searchQuery || 
      msg.message.toLowerCase().includes(searchQuery.toLowerCase()) ||
      msg.sentBy.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesChannel && matchesSearch;
  });

  // Count by channel
  const channelCounts = {
    telegram: messages?.filter((m) => m.channel === "telegram").length || 0,
    whatsapp: messages?.filter((m) => m.channel === "whatsapp").length || 0,
    email: messages?.filter((m) => m.channel === "email").length || 0,
    instagram: 0, // Instagram not yet supported
  };

  return (
    <CRMLayout>
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-white mb-2">
          Messaging Inbox
        </h1>
        <p className="text-gray-400 mt-2">
          All messages from Telegram, WhatsApp, Email, and Instagram in one place
        </p>
      </div>

        {/* Channel Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card className="bg-zinc-900 border-zinc-800">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-blue-400 flex items-center gap-2">
                <MessageSquare className="w-4 h-4" />
                Telegram
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{channelCounts.telegram}</div>
            </CardContent>
          </Card>

          <Card className="bg-zinc-900 border-zinc-800">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-green-400 flex items-center gap-2">
                <MessageSquare className="w-4 h-4" />
                WhatsApp
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{channelCounts.whatsapp}</div>
            </CardContent>
          </Card>

          <Card className="bg-zinc-900 border-zinc-800">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-purple-400 flex items-center gap-2">
                <Mail className="w-4 h-4" />
                Email
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{channelCounts.email}</div>
            </CardContent>
          </Card>

          <Card className="bg-zinc-900 border-zinc-800">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-pink-400 flex items-center gap-2">
                <MessageSquare className="w-4 h-4" />
                Instagram
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{channelCounts.instagram}</div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card className="bg-zinc-900 border-zinc-800 mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Filter className="w-5 h-5" />
              Filters
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Channel</label>
                <Select value={channelFilter} onValueChange={setChannelFilter}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Channels</SelectItem>
                    <SelectItem value="telegram">Telegram</SelectItem>
                    <SelectItem value="whatsapp">WhatsApp</SelectItem>
                    <SelectItem value="email">Email</SelectItem>
                    <SelectItem value="instagram">Instagram</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">Search</label>
                <Input
                  placeholder="Search messages..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="bg-zinc-800 border-zinc-700"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Messages Table */}
        <Card className="bg-zinc-900 border-zinc-800">
          <CardHeader>
            <CardTitle>Recent Messages</CardTitle>
            <CardDescription>
              {filteredMessages?.length || 0} messages
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="w-6 h-6 animate-spin" />
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                     <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead>Channel</TableHead>
                      <TableHead>Message</TableHead>
                      <TableHead>Recipients</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Sent By</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredMessages && filteredMessages.length > 0 ? (
                      filteredMessages.map((msg, idx) => (
                        <TableRow key={idx}>
                          <TableCell className="text-xs">
                            {format(new Date(msg.sentAt), "MMM dd, HH:mm")}
                          </TableCell>
                          <TableCell>
                            <Badge
                              variant="outline"
                              className={
                                msg.channel === "telegram"
                                  ? "bg-blue-500/10 text-blue-500 border-blue-500/20"
                                  : msg.channel === "whatsapp"
                                  ? "bg-green-500/10 text-green-500 border-green-500/20"
                                  : msg.channel === "email"
                                  ? "bg-purple-500/10 text-purple-500 border-purple-500/20"
                                  : "bg-pink-500/10 text-pink-500 border-pink-500/20"
                              }
                            >
                              {msg.channel}
                            </Badge>
                          </TableCell>
                          <TableCell className="max-w-md truncate">
                            {msg.message}
                          </TableCell>
                          <TableCell>
                            <span className="text-sm">
                              {msg.recipientCount} recipients
                            </span>
                          </TableCell>
                          <TableCell>
                            <div className="flex flex-col gap-1">
                              <span className="text-sm text-green-500">
                                {msg.successCount} sent
                              </span>
                              {msg.failedCount > 0 && (
                                <span className="text-sm text-red-500">
                                  {msg.failedCount} failed
                                </span>
                              )}
                            </div>
                          </TableCell>
                          <TableCell className="text-xs text-gray-400">
                            {msg.sentBy}
                          </TableCell>
                          <TableCell>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => setSelectedChat({
                                recipientId: `msg_${msg.id}`,
                                recipientName: `Recipient ${msg.id}`,
                                channel: msg.channel as "telegram" | "whatsapp" | "email" | "instagram",
                              })}
                              className="flex items-center gap-1"
                            >
                              <MessageCircle className="w-3 h-3" />
                              View Chat
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                       <TableRow>
                        <TableCell
                          colSpan={7}
                          className="text-center text-muted-foreground py-8"
                        >
                          No messages found
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>

      {/* Chat Window Modal */}
      {selectedChat && (
        <ChatWindow
          recipientId={selectedChat.recipientId}
          recipientName={selectedChat.recipientName}
          channel={selectedChat.channel}
          onClose={() => setSelectedChat(null)}
        />
      )}
    </CRMLayout>
  );
}
