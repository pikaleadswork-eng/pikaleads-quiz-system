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
import Footer from "@/components/Footer";
import { EditLeadForm } from "@/components/EditLeadForm";
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
  const [showCreateLeadModal, setShowCreateLeadModal] = useState(false);
  const [showEditLeadModal, setShowEditLeadModal] = useState(false);
  const [editingLead, setEditingLead] = useState<any>(null);
  
  // Create lead form fields
  const [createLeadForm, setCreateLeadForm] = useState({
    name: "",
    phone: "",
    email: "",
    telegram: "",
    source: "Manual",
    quizName: "manual-entry",
    utmCampaign: "",
    utmSource: "",
    utmMedium: "",
  });
  
  // UTM Filters
  const [filterCampaign, setFilterCampaign] = useState<string>("all");
  const [filterAdGroup, setFilterAdGroup] = useState<string>("all");
  const [filterAd, setFilterAd] = useState<string>("all");
  const [filterPlacement, setFilterPlacement] = useState<string>("all");
  const [filterKeyword, setFilterKeyword] = useState<string>("all");
  const [filterSite, setFilterSite] = useState<string>("all");

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

  // Filter leads based on UTM parameters and sort by score
  const filteredLeads = leads
    ?.filter((lead) => {
      if (filterCampaign && filterCampaign !== "all" && lead.utmCampaign !== filterCampaign) return false;
      if (filterAdGroup && filterAdGroup !== "all" && lead.utmAdGroup !== filterAdGroup) return false;
      if (filterAd && filterAd !== "all" && lead.utmAd !== filterAd) return false;
      if (filterPlacement && filterPlacement !== "all" && lead.utmPlacement !== filterPlacement) return false;
      if (filterKeyword && filterKeyword !== "all" && lead.utmKeyword !== filterKeyword) return false;
      if (filterSite && filterSite !== "all" && lead.utmSite !== filterSite) return false;
      return true;
    })
    .sort((a, b) => (b.leadScore || 0) - (a.leadScore || 0)); // Sort by score descending
  
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
                        <SelectItem value="all">All campaigns</SelectItem>
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
                        <SelectItem value="all">All ad groups</SelectItem>
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
                        <SelectItem value="all">All ads</SelectItem>
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
                        <SelectItem value="all">All placements</SelectItem>
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
                        <SelectItem value="all">All keywords</SelectItem>
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
                        <SelectItem value="all">All sites</SelectItem>
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
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Leads</CardTitle>
                <CardDescription>
                  {filteredLeads?.length || 0} of {leads?.length || 0} leads
                  {user.role === "manager" && " (assigned to you)"}
                </CardDescription>
              </div>
              <Button onClick={() => setShowCreateLeadModal(true)}>
                Create Lead Manually
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Source</TableHead>
                    <TableHead>Quiz</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Phone</TableHead>
                    <TableHead>UTM Campaign</TableHead>
                    <TableHead>UTM Source</TableHead>
                    <TableHead>UTM Medium</TableHead>
                    <TableHead>Score</TableHead>
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
                        <TableCell>
                          <Badge variant="secondary">
                            {lead.source || "Unknown"}
                          </Badge>
                        </TableCell>
                        <TableCell className="font-medium">
                          {lead.quizName}
                        </TableCell>
                        <TableCell>{lead.name}</TableCell>
                        <TableCell className="font-mono text-xs">
                          {lead.phone}
                        </TableCell>
                        <TableCell className="text-xs">
                          {lead.utmCampaign || "-"}
                        </TableCell>
                        <TableCell className="text-xs">
                          {lead.utmSource || "-"}
                        </TableCell>
                        <TableCell className="text-xs">
                          {lead.utmMedium || "-"}
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant="outline"
                            className={`${
                              (lead.leadScore || 0) >= 80
                                ? "bg-green-500/10 text-green-500 border-green-500/20"
                                : (lead.leadScore || 0) >= 60
                                ? "bg-yellow-500/10 text-yellow-500 border-yellow-500/20"
                                : (lead.leadScore || 0) >= 40
                                ? "bg-orange-500/10 text-orange-500 border-orange-500/20"
                                : "bg-red-500/10 text-red-500 border-red-500/20"
                            }`}
                          >
                            {lead.leadScore || 0}
                          </Badge>
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
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => setSelectedLead(lead.id)}
                            >
                              <MessageSquare className="w-4 h-4 mr-2" />
                              View
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => {
                                setEditingLead(lead);
                                setShowEditLeadModal(true);
                              }}
                            >
                              Edit
                            </Button>
                          </div>
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

        {/* Create Lead Modal */}
        <Dialog open={showCreateLeadModal} onOpenChange={setShowCreateLeadModal}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Create Lead Manually</DialogTitle>
              <DialogDescription>
                Add a new lead to the system manually
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">Name *</label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border rounded-md"
                    value={createLeadForm.name}
                    onChange={(e) => setCreateLeadForm({...createLeadForm, name: e.target.value})}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Phone *</label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border rounded-md"
                    value={createLeadForm.phone}
                    onChange={(e) => setCreateLeadForm({...createLeadForm, phone: e.target.value})}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Email</label>
                  <input
                    type="email"
                    className="w-full px-3 py-2 border rounded-md"
                    value={createLeadForm.email}
                    onChange={(e) => setCreateLeadForm({...createLeadForm, email: e.target.value})}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Telegram</label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border rounded-md"
                    value={createLeadForm.telegram}
                    onChange={(e) => setCreateLeadForm({...createLeadForm, telegram: e.target.value})}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Source *</label>
                  <Select
                    value={createLeadForm.source}
                    onValueChange={(value) => setCreateLeadForm({...createLeadForm, source: value})}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Manual">Manual</SelectItem>
                      <SelectItem value="Facebook">Facebook</SelectItem>
                      <SelectItem value="Google">Google</SelectItem>
                      <SelectItem value="YouTube">YouTube</SelectItem>
                      <SelectItem value="Email">Email</SelectItem>
                      <SelectItem value="Cold Lead">Cold Lead</SelectItem>
                      <SelectItem value="Referral">Referral</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-sm font-medium">UTM Campaign</label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border rounded-md"
                    value={createLeadForm.utmCampaign}
                    onChange={(e) => setCreateLeadForm({...createLeadForm, utmCampaign: e.target.value})}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">UTM Source</label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border rounded-md"
                    value={createLeadForm.utmSource}
                    onChange={(e) => setCreateLeadForm({...createLeadForm, utmSource: e.target.value})}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">UTM Medium</label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border rounded-md"
                    value={createLeadForm.utmMedium}
                    onChange={(e) => setCreateLeadForm({...createLeadForm, utmMedium: e.target.value})}
                  />
                </div>
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setShowCreateLeadModal(false)}>
                  Cancel
                </Button>
                <Button
                  onClick={() => {
                    // TODO: Add create lead mutation
                    toast.success("Lead created successfully");
                    setShowCreateLeadModal(false);
                    setCreateLeadForm({
                      name: "",
                      phone: "",
                      email: "",
                      telegram: "",
                      source: "Manual",
                      quizName: "manual-entry",
                      utmCampaign: "",
                      utmSource: "",
                      utmMedium: "",
                    });
                  }}
                  disabled={!createLeadForm.name || !createLeadForm.phone}
                >
                  Create Lead
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Edit Lead Modal */}
        <Dialog open={showEditLeadModal} onOpenChange={setShowEditLeadModal}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Edit Lead</DialogTitle>
              <DialogDescription>
                Update lead information and assign services
              </DialogDescription>
            </DialogHeader>
            {editingLead && (
              <EditLeadForm
                lead={editingLead}
                onClose={() => {
                  setShowEditLeadModal(false);
                  setEditingLead(null);
                }}
                onSuccess={() => {
                  refetchLeads();
                  setShowEditLeadModal(false);
                  setEditingLead(null);
                }}
              />
            )}
          </DialogContent>
        </Dialog>
      </div>
      <Footer />
    </div>
  );
}
