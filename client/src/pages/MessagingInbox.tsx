import { useState, useEffect } from "react";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2, MessageSquare, Mail, Send, Search, User } from "lucide-react";
import { format } from "date-fns";
import { useAuth } from "@/_core/hooks/useAuth";
import CRMLayout from "@/components/CRMLayout";
import { Link } from "wouter";
import { cn } from "@/lib/utils";
import { LeadInfoPanel } from "@/components/LeadInfoPanel";
import { useTranslation } from "react-i18next";

export default function MessagingInbox() {
  const { t } = useTranslation();

  const { user, loading: authLoading } = useAuth();
  const [channelFilter, setChannelFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedChatId, setSelectedChatId] = useState<string | null>(null);
  const [messageInput, setMessageInput] = useState("");

  const { data: messages, isLoading } = trpc.messaging.getRecentMessages.useQuery({ limit: 100, channel: "all" });
  const sendMessageMutation = trpc.messaging.sendMessage.useMutation();

  // Get conversation for selected chat
  const { data: conversation } = trpc.messaging.getConversation.useQuery(
    { recipientId: selectedChatId || "", channel: "telegram" },
    { enabled: !!selectedChatId }
  );

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
        <h1 className="text-2xl font-bold mb-4">{t("common.error")}</h1>
        <p className="text-muted-foreground mb-4">{t("common.error")}</p>
        <Link href="/admin">
          <Button>{t("common.cancel")}</Button>
        </Link>
      </div>
    );
  }

  // Group messages by recipient to create chat list
  const chatList = messages?.reduce((acc, msg) => {
    const recipientId = `msg-${msg.id}`;
    const recipientName = msg.sentBy || t("leadInfo.name");
    const existingChat = acc.find(c => c.recipientId === recipientId);
    if (existingChat) {
      if (msg.sentAt > existingChat.lastMessageTime) {
        existingChat.lastMessage = msg.message;
        existingChat.lastMessageTime = msg.sentAt;
      }
    } else {
      acc.push({
        recipientId,
        recipientName,
        channel: msg.channel,
        lastMessage: msg.message,
        lastMessageTime: msg.sentAt,
        unreadCount: 0, // TODO: implement unread tracking
      });
    }
    return acc;
  }, [] as Array<{
    recipientId: string;
    recipientName: string;
    channel: string;
    lastMessage: string;
    lastMessageTime: Date;
    unreadCount: number;
  }>);

  // Filter chat list
  const filteredChats = chatList?.filter(chat => {
    const matchesChannel = channelFilter === "all" || chat.channel.toLowerCase() === channelFilter.toLowerCase();
    const matchesSearch = !searchQuery || 
      chat.recipientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      chat.lastMessage.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesChannel && matchesSearch;
  }).sort((a, b) => b.lastMessageTime.getTime() - a.lastMessageTime.getTime());

  // Send message handler
  const handleSendMessage = async () => {
    if (!messageInput.trim() || !selectedChatId) return;

    try {
      await sendMessageMutation.mutateAsync({
        recipientId: selectedChatId,
        channel: "telegram",
        message: messageInput,
      });
      setMessageInput("");
    } catch (error) {
      console.error("Failed to send message:", error);
    }
  };

  // Get channel icon
  const getChannelIcon = (channel: string) => {
    switch (channel.toLowerCase()) {
      case "telegram":
        return <MessageSquare className="w-4 h-4 text-blue-400" />;
      case "whatsapp":
        return <MessageSquare className="w-4 h-4 text-green-400" />;
      case "email":
        return <Mail className="w-4 h-4 text-purple-400" />;
      case "instagram":
        return <MessageSquare className="w-4 h-4 text-pink-400" />;
      default:
        return <MessageSquare className="w-4 h-4" />;
    }
  };

  // Get channel badge color
  const getChannelBadgeColor = (channel: string) => {
    switch (channel.toLowerCase()) {
      case "telegram":
        return "bg-blue-500/20 text-blue-400 border-blue-500/30";
      case "whatsapp":
        return "bg-green-500/20 text-green-400 border-green-500/30";
      case "email":
        return "bg-purple-500/20 text-purple-400 border-purple-500/30";
      case "instagram":
        return "bg-pink-500/20 text-pink-400 border-pink-500/30";
      default:
        return "bg-gray-500/20 text-gray-400 border-gray-500/30";
    }
  };

  return (
    <CRMLayout>
      <div className="flex flex-col h-[calc(100vh-120px)]">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-white mb-2">
            {t("messaging.title")}
          </h1>
          <p className="text-gray-400">
            {t("messaging.subtitle")}
          </p>
        </div>

        {/* Tabs */}
        <Tabs value={channelFilter} onValueChange={setChannelFilter} className="mb-4">
          <TabsList className="bg-zinc-900 border-zinc-800">
            <TabsTrigger value="all">{t("messaging.allMessages")}</TabsTrigger>
            <TabsTrigger value="telegram">Telegram</TabsTrigger>
            <TabsTrigger value="whatsapp">WhatsApp</TabsTrigger>
            <TabsTrigger value="email">Email</TabsTrigger>
            <TabsTrigger value="instagram">Instagram</TabsTrigger>
          </TabsList>
        </Tabs>

        {/* 3-Column Layout */}
        <div className="flex gap-4 flex-1 overflow-hidden">
          {/* Left Sidebar - Chat List (25%) */}
          <Card className="w-1/4 bg-zinc-900 border-zinc-800 flex flex-col">
            {/* Search */}
            <div className="p-4 border-b border-zinc-800">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  placeholder={t("messaging.searchChats")}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 bg-zinc-800 border-zinc-700"
                />
              </div>
            </div>

            {/* Chat List */}
            <div className="flex-1 overflow-y-auto">
              {isLoading ? (
                <div className="flex items-center justify-center h-full">
                  <Loader2 className="w-6 h-6 animate-spin text-gray-400" />
                </div>
              ) : filteredChats && filteredChats.length > 0 ? (
                filteredChats.map((chat) => (
                  <div
                    key={chat.recipientId}
                    onClick={() => setSelectedChatId(chat.recipientId)}
                    className={cn(
                      "p-4 border-b border-zinc-800 cursor-pointer hover:bg-zinc-800/50 transition-colors",
                      selectedChatId === chat.recipientId && "bg-zinc-800"
                    )}
                  >
                    <div className="flex items-start gap-3">
                      <div className="flex-shrink-0 mt-1">
                        {getChannelIcon(chat.channel)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <h3 className="font-semibold text-white truncate">{chat.recipientName}</h3>
                          <span className="text-xs text-gray-400 flex-shrink-0 ml-2">
                            {format(chat.lastMessageTime, "HH:mm")}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge className={cn("text-xs", getChannelBadgeColor(chat.channel))}>
                            {chat.channel}
                          </Badge>
                          {chat.unreadCount > 0 && (
                            <Badge className="bg-purple-500 text-white text-xs">
                              {chat.unreadCount}
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-gray-400 truncate mt-1">{chat.lastMessage}</p>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="flex flex-col items-center justify-center h-full text-gray-400">
                  <MessageSquare className="w-12 h-12 mb-2" />
                  <p>{t("common.loading")}</p>
                </div>
              )}
            </div>
          </Card>

          {/* Center Panel - Conversation View (50%) */}
          <Card className="w-1/2 bg-zinc-900 border-zinc-800 flex flex-col">
            {selectedChatId ? (
              <>
                {/* Conversation Header */}
                <div className="p-4 border-b border-zinc-800">
                  <div className="flex items-center gap-3">
                    {getChannelIcon(filteredChats?.find(c => c.recipientId === selectedChatId)?.channel || "")}
                    <div>
                      <h2 className="font-semibold text-white">
                        {filteredChats?.find(c => c.recipientId === selectedChatId)?.recipientName}
                      </h2>
                      <Badge className={cn("text-xs", getChannelBadgeColor(filteredChats?.find(c => c.recipientId === selectedChatId)?.channel || ""))}>
                        {filteredChats?.find(c => c.recipientId === selectedChatId)?.channel}
                      </Badge>
                    </div>
                  </div>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                  {conversation && conversation.length > 0 ? (
                    conversation.map((msg, idx) => (
                      <div
                        key={idx}
                        className={cn(
                          "flex",
                          msg.direction === "sent" ? "justify-end" : "justify-start"
                        )}
                      >
                        <div
                          className={cn(
                            "max-w-[70%] rounded-lg p-3",
                            msg.direction === "sent"
                              ? "bg-purple-600 text-white"
                              : "bg-zinc-800 text-white"
                          )}
                        >
                          <p className="text-sm">{msg.content}</p>
                          <span className="text-xs opacity-70 mt-1 block">
                            {format(msg.createdAt, "HH:mm")}
                          </span>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="flex items-center justify-center h-full text-gray-400">
                      <p>{t("common.loading")}</p>
                    </div>
                  )}
                </div>

                {/* Message Input */}
                <div className="p-4 border-t border-zinc-800">
                  <div className="flex gap-2">
                    <Input
                      placeholder={t("messaging.typeMessage")}
                      value={messageInput}
                      onChange={(e) => setMessageInput(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                      className="flex-1 bg-zinc-800 border-zinc-700"
                    />
                    <Button
                      onClick={handleSendMessage}
                      disabled={!messageInput.trim() || sendMessageMutation.isPending}
                      className="bg-purple-600 hover:bg-purple-700"
                    >
                      {sendMessageMutation.isPending ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <Send className="w-4 h-4" />
                      )}
                    </Button>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-gray-400">
                <MessageSquare className="w-16 h-16 mb-4" />
                <h3 className="text-lg font-semibold mb-2">{t("messaging.selectChat")}</h3>
                <p className="text-sm">{t("messaging.selectChatDescription")}</p>
              </div>
            )}
          </Card>

          {/* Right Panel - Lead Info (25%) */}
          {selectedChatId ? (
            <div className="w-1/4">
              <LeadInfoPanel leadId={1} />
            </div>
          ) : (
            <Card className="w-1/4 bg-zinc-900 border-zinc-800 flex items-center justify-center">
              <div className="text-center text-gray-400 p-6">
                <User className="w-12 h-12 mx-auto mb-3 opacity-50" />
                <p className="text-sm">
                  {t("leadInfo.selectLead")}
                </p>
              </div>
            </Card>
          )}
        </div>
      </div>
    </CRMLayout>
  );
}
