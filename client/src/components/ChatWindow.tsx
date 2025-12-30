import { useState, useEffect, useRef } from "react";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Loader2, Send, X, MessageCircle, Mail } from "lucide-react";
import { toast } from "sonner";
import { format } from "date-fns";

interface ChatWindowProps {
  recipientId: string;
  recipientName: string;
  channel: "telegram" | "whatsapp" | "email" | "instagram";
  onClose: () => void;
}

export function ChatWindow({ recipientId, recipientName, channel, onClose }: ChatWindowProps) {
  const [message, setMessage] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);
  const utils = trpc.useUtils();

  const { data: messages, isLoading } = trpc.messaging.getConversation.useQuery({
    recipientId,
    channel,
  });

  const sendMessageMutation = trpc.messaging.sendMessage.useMutation({
    onSuccess: () => {
      toast.success("Message sent successfully");
      setMessage("");
      utils.messaging.getConversation.invalidate();
      utils.messaging.getRecentMessages.invalidate();
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to send message");
    },
  });

  const handleSend = () => {
    if (!message.trim()) {
      toast.error("Please enter a message");
      return;
    }

    sendMessageMutation.mutate({
      recipientId,
      channel,
      message: message.trim(),
    });
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  // Scroll to bottom when messages change
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const getChannelIcon = () => {
    switch (channel) {
      case "telegram":
        return <Send className="w-4 h-4 text-blue-400" />;
      case "whatsapp":
        return <MessageCircle className="w-4 h-4 text-green-400" />;
      case "email":
        return <Mail className="w-4 h-4 text-red-400" />;
      case "instagram":
        return <MessageCircle className="w-4 h-4 text-pink-400" />;
    }
  };

  const getChannelColor = () => {
    switch (channel) {
      case "telegram":
        return "from-blue-500 to-cyan-500";
      case "whatsapp":
        return "from-green-500 to-emerald-500";
      case "email":
        return "from-red-500 to-orange-500";
      case "instagram":
        return "from-pink-500 to-purple-500";
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-zinc-900 rounded-lg shadow-xl w-full max-w-2xl h-[600px] flex flex-col border border-zinc-800">
        {/* Header */}
        <div className={`flex items-center justify-between p-4 bg-gradient-to-r ${getChannelColor()} rounded-t-lg`}>
          <div className="flex items-center gap-3">
            <Avatar className="w-10 h-10 border-2 border-white">
              <AvatarFallback className="bg-white text-black font-bold">
                {recipientName.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div>
              <h3 className="font-semibold text-white">{recipientName}</h3>
              <div className="flex items-center gap-1 text-xs text-white/80">
                {getChannelIcon()}
                <span className="capitalize">{channel}</span>
              </div>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="text-white hover:bg-white/20"
          >
            <X className="w-5 h-5" />
          </Button>
        </div>

        {/* Messages */}
        <ScrollArea className="flex-1 p-4" ref={scrollRef}>
          {isLoading ? (
            <div className="flex items-center justify-center h-full">
              <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
            </div>
          ) : messages && messages.length > 0 ? (
            <div className="space-y-4">
              {messages.map((msg: any) => (
                <div
                  key={msg.id}
                  className={`flex ${msg.direction === "sent" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[70%] rounded-lg p-3 ${
                      msg.direction === "sent"
                        ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white"
                        : "bg-zinc-800 text-white"
                    }`}
                  >
                    <p className="text-sm whitespace-pre-wrap break-words">{msg.content}</p>
                    <p className="text-xs mt-1 opacity-70">
                      {format(new Date(msg.createdAt), "MMM dd, HH:mm")}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
              <MessageCircle className="w-12 h-12 mb-2 opacity-50" />
              <p>No messages yet. Start the conversation!</p>
            </div>
          )}
        </ScrollArea>

        {/* Input */}
        <div className="p-4 border-t border-zinc-800">
          <div className="flex gap-2">
            <Input
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type your message..."
              className="flex-1 bg-zinc-800 border-zinc-700"
              disabled={sendMessageMutation.isPending}
            />
            <Button
              onClick={handleSend}
              disabled={sendMessageMutation.isPending || !message.trim()}
              className={`bg-gradient-to-r ${getChannelColor()}`}
            >
              {sendMessageMutation.isPending ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Send className="w-4 h-4" />
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
