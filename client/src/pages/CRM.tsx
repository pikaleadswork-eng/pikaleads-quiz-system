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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Loader2, MessageSquare, Send, Filter, X } from "lucide-react";
import { format } from "date-fns";
import { useAuth } from "@/_core/hooks/useAuth";
import { toast } from "sonner";

export default function CRM() {
  const { user, loading: authLoading } = useAuth();
  const [selectedLead, setSelectedLead] = useState<number | null>(null);
  const [newComment, setNewComment] = useState("");
  const [newMessage, setNewMessage] = useState("");
  const [messagePlatform, setMessagePlatform] = useState<"instagram" | "telegram">("telegram");
  
  // UTM Filters
  const [filterCampaign, setFilterCampaign] = useState<string>("");
  const [filterAdGroup, setFilterAdGroup] = useState<string>("");
  const [filterAd, setFilterAd] = useState<string>("");
  const [filterPlacement, setFilterPlacement] = useState<string>("");
  const [filterKeyword, setFilterKeyword] = useState<string>("");
  const [filterSite, setFilterSite] = useState<string>("");

  const { data: leads, isLoading: leadsLoading, refetch: refetchLeads } = trpc.crm.getLeads.useQuery();
  const { data: statuses } = trpc.crm.getStatuses.useQuery();
  const { data: comments, refetch: refetchComments } = trpc.crm.getComments.useQuery(
    { leadId: selectedLead! },
    { enabled: selectedLead !== null }
  );
  const { data: messages, refetch: refetchMessages } = trpc.crm.getMessages.useQuery(
    { leadId: selectedLead! },
    { enabled: selectedLead !== null }
  );

  const updateStatusMutation = trpc.crm.updateLeadStatus.useMutation({
    onSuccess: () => {
      toast.success("Status updated");
      refetchLeads();
    },
  });

  const addCommentMutation = trpc.crm.addComment.useMutation({
    onSuccess: () => {
      toast.success("Comment added");
      setNewComment("");
      refetchComments();
    },
  });

  const sendMessageMutation = trpc.crm.sendMessage.useMutation({
    onSuccess: () => {
      toast.success("Message sent");
      setNewMessage("");
      refetchMessages();
    },
  });

  // Filter leads based on UTM parameters
  const filteredLeads = leads?.filter((lead) => {
    if (filterCampaign && lead.utmCampaign !== filterCampaign) return false;
    if (filterAdGroup && lead.utmAdGroup !== filterAdGroup) return false;
    if (filterAd && lead.utmAd !== filterAd) return false;
    if (filterPlacement && lead.utmPlacement !== filterPlacement) return false;
    if (filterKeyword && lead.utmKeyword !== filterKeyword) return false;
    if (filterSite && lead.utmSite !== filterSite) return false;
    return true;
  });
  
  const selectedLeadData = leads?.find((l) => l.id === selectedLead);
  
  // Get unique values for filters
  const uniqueCampaigns = Array.from(new Set(leads?.map(l => l.utmCampaign).filter(Boolean)));
  const uniqueAdGroups = Array.from(new Set(leads?.map(l => l.utmAdGroup).filter(Boolean)));
  const uniqueAds = Array.from(new Set(leads?.map(l => l.utmAd).filter(Boolean)));
  const uniquePlacements = Array.from(new Set(leads?.map(l => l.utmPlacement).filter(Boolean)));
  const uniqueKeywords = Array.from(new Set(leads?.map(l => l.utmKeyword).filter(Boolean)));
  const uniqueSites = Array.from(new Set(leads?.map(l => l.utmSite).filter(Boolean)));
  
  const activeFiltersCount = [filterCampaign, filterAdGroup, filterAd, filterPlacement, filterKeyword, filterSite].filter(Boolean).length;
  
  const clearFilters = () => {
    setFilterCampaign("");
    setFilterAdGroup("");
    setFilterAd("");
    setFilterPlacement("");
    setFilterKeyword("");
    setFilterSite("");
  };

  const getStatusColor = (statusId: number | null) => {
    const status = statuses?.find((s) => s.id === statusId);
    return status?.color || "#3B82F6";
  };

  const getStatusName = (statusId: number | null) => {
    const status = statuses?.find((s) => s.id === statusId);
    return status?.name || "Unknown";
  };

  if (authLoading || leadsLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card>
          <CardHeader>
            <CardTitle>Access Denied</CardTitle>
            <CardDescription>Please log in to access the CRM</CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-black text-foreground mb-2">
            CRM Dashboard
          </h1>
          <p className="text-muted-foreground">
            Manage your leads and communicate with clients
          </p>
        </div>

        {/* UTM Filters */}
        {uniqueCampaigns.length > 0 && (
          <Card className="mb-6">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Filter className="w-5 h-5" />
                    UTM Filters
                  </CardTitle>
                  <CardDescription>
                    Filter leads by campaign parameters
                    {activeFiltersCount > 0 && ` (${activeFiltersCount} active)`}
                  </CardDescription>
                </div>
                {activeFiltersCount > 0 && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={clearFilters}
                    className="gap-2"
                  >
                    <X className="w-4 h-4" />
                    Clear Filters
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Campaign Filter */}
                {uniqueCampaigns.length > 0 && (
                  <div>
                    <label className="text-sm font-medium mb-2 block">Campaign</label>
                    <Select value={filterCampaign} onValueChange={setFilterCampaign}>
                      <SelectTrigger>
                        <SelectValue placeholder="All campaigns" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="">All campaigns</SelectItem>
                        {uniqueCampaigns.map((campaign) => (
                          <SelectItem key={campaign as string} value={campaign as string}>
                            {campaign}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}

                {/* Ad Group Filter */}
                {uniqueAdGroups.length > 0 && (
                  <div>
                    <label className="text-sm font-medium mb-2 block">Ad Group</label>
                    <Select value={filterAdGroup} onValueChange={setFilterAdGroup}>
                      <SelectTrigger>
                        <SelectValue placeholder="All ad groups" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="">All ad groups</SelectItem>
                        {uniqueAdGroups.map((adGroup) => (
                          <SelectItem key={adGroup as string} value={adGroup as string}>
                            {adGroup}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}

                {/* Ad Filter */}
                {uniqueAds.length > 0 && (
                  <div>
                    <label className="text-sm font-medium mb-2 block">Ad</label>
                    <Select value={filterAd} onValueChange={setFilterAd}>
                      <SelectTrigger>
                        <SelectValue placeholder="All ads" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="">All ads</SelectItem>
                        {uniqueAds.map((ad) => (
                          <SelectItem key={ad as string} value={ad as string}>
                            {ad}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}

                {/* Placement Filter */}
                {uniquePlacements.length > 0 && (
                  <div>
                    <label className="text-sm font-medium mb-2 block">Placement</label>
                    <Select value={filterPlacement} onValueChange={setFilterPlacement}>
                      <SelectTrigger>
                        <SelectValue placeholder="All placements" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="">All placements</SelectItem>
                        {uniquePlacements.map((placement) => (
                          <SelectItem key={placement as string} value={placement as string}>
                            {placement}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}

                {/* Keyword Filter */}
                {uniqueKeywords.length > 0 && (
                  <div>
                    <label className="text-sm font-medium mb-2 block">Keyword</label>
                    <Select value={filterKeyword} onValueChange={setFilterKeyword}>
                      <SelectTrigger>
                        <SelectValue placeholder="All keywords" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="">All keywords</SelectItem>
                        {uniqueKeywords.map((keyword) => (
                          <SelectItem key={keyword as string} value={keyword as string}>
                            {keyword}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}

                {/* Site Filter */}
                {uniqueSites.length > 0 && (
                  <div>
                    <label className="text-sm font-medium mb-2 block">Site</label>
                    <Select value={filterSite} onValueChange={setFilterSite}>
                      <SelectTrigger>
                        <SelectValue placeholder="All sites" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="">All sites</SelectItem>
                        {uniqueSites.map((site) => (
                          <SelectItem key={site as string} value={site as string}>
                            {site}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Leads Table */}
        <Card>
          <CardHeader>
            <CardTitle>Leads</CardTitle>
            <CardDescription>
              {filteredLeads?.length || 0} of {leads?.length || 0} leads
              {user.role === "manager" && " (assigned to you)"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Quiz</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Phone</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredLeads && filteredLeads.length > 0 ? (
                    filteredLeads.map((lead) => (
                      <TableRow key={lead.id}>
                        <TableCell className="font-mono text-xs">
                          {lead.id}
                        </TableCell>
                        <TableCell className="text-xs">
                          {format(new Date(lead.createdAt), "MMM dd, HH:mm")}
                        </TableCell>
                        <TableCell className="font-medium">
                          {lead.quizName}
                        </TableCell>
                        <TableCell>{lead.name}</TableCell>
                        <TableCell className="font-mono text-xs">
                          {lead.phone}
                        </TableCell>
                        <TableCell>
                          <Select
                            value={lead.statusId?.toString() || "1"}
                            onValueChange={(value) => {
                              updateStatusMutation.mutate({
                                leadId: lead.id,
                                statusId: parseInt(value),
                              });
                            }}
                          >
                            <SelectTrigger className="w-[150px]">
                              <SelectValue>
                                <Badge
                                  style={{
                                    backgroundColor: getStatusColor(
                                      lead.statusId
                                    ),
                                  }}
                                >
                                  {getStatusName(lead.statusId)}
                                </Badge>
                              </SelectValue>
                            </SelectTrigger>
                            <SelectContent>
                              {statuses?.map((status) => (
                                <SelectItem
                                  key={status.id}
                                  value={status.id.toString()}
                                >
                                  <Badge
                                    style={{ backgroundColor: status.color }}
                                  >
                                    {status.name}
                                  </Badge>
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </TableCell>
                        <TableCell>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => setSelectedLead(lead.id)}
                          >
                            <MessageSquare className="w-4 h-4 mr-2" />
                            View
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
                        No leads yet
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        {/* Lead Detail Dialog */}
        <Dialog open={selectedLead !== null} onOpenChange={() => setSelectedLead(null)}>
          <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Lead Details</DialogTitle>
              <DialogDescription>
                {selectedLeadData?.name} - {selectedLeadData?.phone}
              </DialogDescription>
            </DialogHeader>

            {selectedLeadData && (
              <div className="space-y-6">
                {/* Lead Info */}
                <Card>
                  <CardHeader>
                    <CardTitle>Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-muted-foreground">Quiz</p>
                        <p className="font-medium">{selectedLeadData.quizName}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Language</p>
                        <p className="font-medium uppercase">
                          {selectedLeadData.language || "N/A"}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Telegram</p>
                        <p className="font-medium">
                          {selectedLeadData.telegram || "N/A"}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Date</p>
                        <p className="font-medium">
                          {format(
                            new Date(selectedLeadData.createdAt),
                            "PPpp"
                          )}
                        </p>
                      </div>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Answers</p>
                      <p className="text-xs font-mono bg-muted p-2 rounded mt-1">
                        {selectedLeadData.answers}
                      </p>
                    </div>
                  </CardContent>
                </Card>

                {/* Comments */}
                <Card>
                  <CardHeader>
                    <CardTitle>Comments</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {comments && comments.length > 0 ? (
                      comments.map((comment) => (
                        <div
                          key={comment.id}
                          className="border-l-2 border-primary pl-4 py-2"
                        >
                          <p className="text-sm">{comment.comment}</p>
                          <p className="text-xs text-muted-foreground mt-1">
                            {format(new Date(comment.createdAt), "PPpp")}
                          </p>
                        </div>
                      ))
                    ) : (
                      <p className="text-sm text-muted-foreground">
                        No comments yet
                      </p>
                    )}

                    <div className="space-y-2">
                      <Textarea
                        placeholder="Add a comment..."
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                      />
                      <Button
                        onClick={() => {
                          if (newComment.trim()) {
                            addCommentMutation.mutate({
                              leadId: selectedLead!,
                              comment: newComment,
                            });
                          }
                        }}
                        disabled={!newComment.trim()}
                      >
                        Add Comment
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                {/* Messages */}
                <Card>
                  <CardHeader>
                    <CardTitle>Messages</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {messages && messages.length > 0 ? (
                      messages.map((msg) => (
                        <div
                          key={msg.id}
                          className={`p-3 rounded ${
                            msg.direction === "outbound"
                              ? "bg-primary text-primary-foreground ml-8"
                              : "bg-muted mr-8"
                          }`}
                        >
                          <p className="text-sm">{msg.message}</p>
                          <p className="text-xs opacity-70 mt-1">
                            {msg.platform} •{" "}
                            {format(new Date(msg.createdAt), "PPpp")}
                          </p>
                        </div>
                      ))
                    ) : (
                      <p className="text-sm text-muted-foreground">
                        No messages yet
                      </p>
                    )}

                    <div className="space-y-2">
                      <Select
                        value={messagePlatform}
                        onValueChange={(value: "instagram" | "telegram") =>
                          setMessagePlatform(value)
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="telegram">Telegram</SelectItem>
                          <SelectItem value="instagram">Instagram</SelectItem>
                        </SelectContent>
                      </Select>
                      <Textarea
                        placeholder="Type your message..."
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                      />
                      <Button
                        onClick={() => {
                          if (newMessage.trim()) {
                            sendMessageMutation.mutate({
                              leadId: selectedLead!,
                              platform: messagePlatform,
                              message: newMessage,
                            });
                          }
                        }}
                        disabled={!newMessage.trim()}
                      >
                        <Send className="w-4 h-4 mr-2" />
                        Send via {messagePlatform}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
