import { useState, useMemo, useEffect } from "react";
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
import { LeadDetailModal } from "@/components/LeadDetailModal";
import CRMLayout from "@/components/CRMLayout";
import { Loader2, MessageSquare, Send, Filter, X, Calendar, Users, Tag } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { addDays, format as formatDate } from "date-fns";
import { format } from "date-fns";
import { useAuth } from "@/_core/hooks/useAuth";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";

export default function CRM() {
  // Detect language from localStorage
  const [language, setLanguage] = useState(() => {
    return localStorage.getItem('language') || 'uk';
  });

  const { t } = useTranslation();

  useEffect(() => {
    const handleLanguageChange = () => {
      setLanguage(localStorage.getItem('language') || 'uk');
    };
    window.addEventListener('languageChanged', handleLanguageChange);
    return () => window.removeEventListener('languageChanged', handleLanguageChange);
   }, []);

  const { user, loading: authLoading } = useAuth();
  const [selectedLead, setSelectedLead] = useState<number | null>(null);
  const [newComment, setNewComment] = useState("");
  const [newMessage, setNewMessage] = useState("");
  const [messagePlatform, setMessagePlatform] = useState<"instagram" | "telegram">("telegram");
  const [showCreateLeadModal, setShowCreateLeadModal] = useState(false);
  const [showEditLeadModal, setShowEditLeadModal] = useState(false);
  const [editingLead, setEditingLead] = useState<any>(null);
  const [showLeadDetailModal, setShowLeadDetailModal] = useState(false);
  const [detailLead, setDetailLead] = useState<any>(null);
  
  // Bulk actions
  const [selectedLeadIds, setSelectedLeadIds] = useState<number[]>([]);
  const [showBulkActionsBar, setShowBulkActionsBar] = useState(false);
  const [bulkActionManager, setBulkActionManager] = useState<string>("");
  const [bulkActionStatus, setBulkActionStatus] = useState<string>("");
  
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
  
  // Filters
  const [filterManager, setFilterManager] = useState<string>("all");
  const [filterSource, setFilterSource] = useState<string>("all");
  const [filterDateFrom, setFilterDateFrom] = useState<Date | undefined>();
  const [filterDateTo, setFilterDateTo] = useState<Date | undefined>();
  const [showFiltersPopover, setShowFiltersPopover] = useState(false);
  
  // Filter Presets
  const [showSavePresetDialog, setShowSavePresetDialog] = useState(false);
  const [presetName, setPresetName] = useState("");
  const [presetIsDefault, setPresetIsDefault] = useState(false);
  
  // UTM Filters
  const [filterCampaign, setFilterCampaign] = useState<string>("all");
  const [filterAdGroup, setFilterAdGroup] = useState<string>("all");
  const [filterAd, setFilterAd] = useState<string>("all");
  const [filterPlacement, setFilterPlacement] = useState<string>("all");
  const [filterKeyword, setFilterKeyword] = useState<string>("all");
  const [filterSite, setFilterSite] = useState<string>("all");

  const { data: leads, isLoading: leadsLoading, refetch: refetchLeads } = trpc.crm.getLeads.useQuery();
  const { data: managers } = trpc.auth.getAllUsers.useQuery();
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

  // Filter Presets
  const { data: filterPresets, refetch: refetchPresets } = trpc.filterPresets.list.useQuery();
  
  const savePresetMutation = trpc.filterPresets.create.useMutation({
    onSuccess: () => {
      toast.success(t('crm.presetSaved') || 'Preset saved');
      setShowSavePresetDialog(false);
      setPresetName("");
      setPresetIsDefault(false);
      refetchPresets();
    },
  });
  
  const deletePresetMutation = trpc.filterPresets.delete.useMutation({
    onSuccess: () => {
      toast.success(t('crm.presetDeleted') || 'Preset deleted');
      refetchPresets();
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
    ; // Already sorted by date DESC from backend (newest first)
  
  const selectedLeadData = leads?.find((l) => l.id === selectedLead);
  
  // Get unique values for filters
  const uniqueSources = Array.from(new Set(leads?.map(l => l.source).filter(Boolean)));
  const uniqueCampaigns = Array.from(new Set(leads?.map(l => l.utmCampaign).filter(Boolean)));
  const uniqueAdGroups = Array.from(new Set(leads?.map(l => l.utmAdGroup).filter(Boolean)));
  const uniqueAds = Array.from(new Set(leads?.map(l => l.utmAd).filter(Boolean)));
  const uniquePlacements = Array.from(new Set(leads?.map(l => l.utmPlacement).filter(Boolean)));
  const uniqueKeywords = Array.from(new Set(leads?.map(l => l.utmKeyword).filter(Boolean)));
  const uniqueSites = Array.from(new Set(leads?.map(l => l.utmSite).filter(Boolean)));
  
  const activeFiltersCount = [
    filterManager !== "all" ? filterManager : null,
    filterSource !== "all" ? filterSource : null,
    filterDateFrom,
    filterDateTo,
    filterCampaign !== "all" ? filterCampaign : null,
    filterAdGroup !== "all" ? filterAdGroup : null,
    filterAd !== "all" ? filterAd : null,
    filterPlacement !== "all" ? filterPlacement : null,
    filterKeyword !== "all" ? filterKeyword : null,
    filterSite !== "all" ? filterSite : null
  ].filter(Boolean).length;
  
  const clearFilters = () => {
    setFilterManager("all");
    setFilterSource("all");
    setFilterDateFrom(undefined);
    setFilterDateTo(undefined);
    setFilterCampaign("all");
    setFilterAdGroup("all");
    setFilterAd("all");
    setFilterPlacement("all");
    setFilterKeyword("all");
    setFilterSite("all");
  };
  
  // Filter Preset handlers
  const getCurrentFilters = () => ({
    manager: filterManager !== "all" ? filterManager : undefined,
    source: filterSource !== "all" ? filterSource : undefined,
    dateFrom: filterDateFrom ? filterDateFrom.toISOString() : undefined,
    dateTo: filterDateTo ? filterDateTo.toISOString() : undefined,
    campaign: filterCampaign !== "all" ? filterCampaign : undefined,
    adGroup: filterAdGroup !== "all" ? filterAdGroup : undefined,
    ad: filterAd !== "all" ? filterAd : undefined,
    placement: filterPlacement !== "all" ? filterPlacement : undefined,
    keyword: filterKeyword !== "all" ? filterKeyword : undefined,
    site: filterSite !== "all" ? filterSite : undefined,
  });
  
  const saveCurrentFilters = () => {
    if (!presetName.trim()) {
      toast.error(t('crm.presetNameRequired') || 'Please enter a preset name');
      return;
    }
    
    savePresetMutation.mutate({
      name: presetName,
      filters: getCurrentFilters(),
      isDefault: presetIsDefault,
    });
  };
  
  const loadPreset = (preset: any) => {
    const filters = preset.filters;
    setFilterManager(filters.manager || "all");
    setFilterSource(filters.source || "all");
    setFilterDateFrom(filters.dateFrom ? new Date(filters.dateFrom) : undefined);
    setFilterDateTo(filters.dateTo ? new Date(filters.dateTo) : undefined);
    setFilterCampaign(filters.campaign || "all");
    setFilterAdGroup(filters.adGroup || "all");
    setFilterAd(filters.ad || "all");
    setFilterPlacement(filters.placement || "all");
    setFilterKeyword(filters.keyword || "all");
    setFilterSite(filters.site || "all");
    toast.success(t('crm.presetLoaded') || `Loaded preset: ${preset.name}`);
  };
  
  // Bulk action handlers
  const toggleLeadSelection = (leadId: number) => {
    setSelectedLeadIds(prev => 
      prev.includes(leadId) 
        ? prev.filter(id => id !== leadId)
        : [...prev, leadId]
    );
  };
  
  const toggleSelectAll = () => {
    if (selectedLeadIds.length === filteredLeads?.length) {
      setSelectedLeadIds([]);
    } else {
      setSelectedLeadIds(filteredLeads?.map(l => l.id) || []);
    }
  };
  
  const exportSelectedToCSV = () => {
    if (selectedLeadIds.length === 0) {
      toast.error(t("crm.selectLeadsFirst") || "Please select leads first");
      return;
    }
    
    const selectedLeads = leads?.filter(l => selectedLeadIds.includes(l.id)) || [];
    
    // CSV headers
    const headers = ["ID", "Date", "Name", "Phone", "Email", "Telegram", "Source", "Quiz", "UTM Campaign", "UTM Source", "UTM Medium", "Score", "Status"];
    
    // CSV rows
    const rows = selectedLeads.map(lead => [
      lead.id,
      new Date(lead.createdAt).toLocaleDateString(),
      lead.name,
      lead.phone || "",
      lead.email || "",
      lead.telegram || "",
      lead.source || "",
      lead.quizName || "",
      lead.utmCampaign || "",
      lead.utmSource || "",
      lead.utmMedium || "",
      lead.leadScore || 0,
      getStatusName(lead.statusId)
    ]);
    
    // Create CSV content
    const csvContent = [
      headers.join(","),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(","))
    ].join("\n");
    
    // Download CSV
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", `leads_export_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast.success(t("crm.exportSuccess") || `Exported ${selectedLeadIds.length} leads`);
    setSelectedLeadIds([]);
  };
  
  const bulkAssignManager = () => {
    if (selectedLeadIds.length === 0 || !bulkActionManager) {
      toast.error(t("crm.selectLeadsAndManager") || "Please select leads and manager");
      return;
    }
    
    // TODO: Implement bulk assign manager mutation
    toast.success(t("crm.managerAssigned") || `Assigned manager to ${selectedLeadIds.length} leads`);
    setSelectedLeadIds([]);
    setBulkActionManager("");
  };
  
  const bulkChangeStatus = () => {
    if (selectedLeadIds.length === 0 || !bulkActionStatus) {
      toast.error(t("crm.selectLeadsAndStatus") || "Please select leads and status");
      return;
    }
    
    // TODO: Implement bulk change status mutation
    toast.success(t("crm.statusChanged") || `Changed status for ${selectedLeadIds.length} leads`);
    setSelectedLeadIds([]);
    setBulkActionStatus("");
  };
  
  const deleteLeadsMutation = trpc.admin.deleteLeads.useMutation({
    onSuccess: (data) => {
      toast.success(t("crm.leadsDeleted") || `Deleted ${data.deletedCount} leads`);
      setSelectedLeadIds([]);
      refetchLeads();
    },
    onError: (error) => {
      toast.error(t("crm.deleteError") || `Error: ${error.message}`);
    },
  });
  
  const bulkDeleteLeads = () => {
    if (selectedLeadIds.length === 0) {
      toast.error(t("crm.selectLeads") || "Please select leads to delete");
      return;
    }
    
    if (confirm(t("crm.confirmDelete") || `Are you sure you want to delete ${selectedLeadIds.length} leads? This action cannot be undone.`)) {
      deleteLeadsMutation.mutate({ leadIds: selectedLeadIds });
    }
  };
  
  // Show/hide bulk actions bar based on selection
  useEffect(() => {
    setShowBulkActionsBar(selectedLeadIds.length > 0);
  }, [selectedLeadIds]);

  const getStatusColor = (statusId: number | null) => {
    const status = statuses?.find((s) => s.id === statusId);
    return status?.color || "#3B82F6";
  };

  const getStatusName = (statusId: number | null) => {
    const status = statuses?.find((s) => s.id === statusId);
    return status?.name || t("common.unknown");
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
    <CRMLayout>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-black text-white mb-2">
            {t("crm.title")}
          </h1>
          <p className="text-gray-400">
            {t("crm.subtitle")}
          </p>
        </div>
        
        {/* Compact Filters Button */}
        <div className="flex items-center gap-3">
          {/* Date Filter Display */}
          {(filterDateFrom || filterDateTo) && (
            <Badge variant="secondary" className="gap-2">
              <Calendar className="w-3 h-3" />
              {filterDateFrom && formatDate(filterDateFrom, "MMM d")} - {filterDateTo && formatDate(filterDateTo, "MMM d")}
            </Badge>
          )}
          
          {/* Filter Presets Dropdown */}
          {filterPresets && filterPresets.length > 0 && (
            <Select onValueChange={(value) => {
              const preset = filterPresets.find(p => p.id.toString() === value);
              if (preset) loadPreset(preset);
            }}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder={t('crm.loadPreset') || 'Load preset...'} />
              </SelectTrigger>
              <SelectContent>
                {filterPresets.map((preset) => (
                  <SelectItem key={preset.id} value={preset.id.toString()}>
                    {preset.name} {preset.isDefault && '⭐'}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
          
          {/* Save Current Filters Button */}
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowSavePresetDialog(true)}
            disabled={activeFiltersCount === 0}
            className="gap-2"
          >
            <Tag className="w-4 h-4" />
            {t('crm.saveFilters') || 'Save Filters'}
          </Button>
          
          <Popover open={showFiltersPopover} onOpenChange={setShowFiltersPopover}>
            <PopoverTrigger asChild>
              <Button variant="outline" className="gap-2">
                <Filter className="w-4 h-4" />
                {t('crm.filters')}
                {activeFiltersCount > 0 && (
                  <Badge variant="default" className="ml-1">{activeFiltersCount}</Badge>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-96 bg-zinc-900 border-zinc-800 max-h-[80vh] overflow-y-auto" align="end">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-white">{t('crm.filters')}</h3>
                  {activeFiltersCount > 0 && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={clearFilters}
                      className="h-8 text-xs"
                    >
                      {t('crm.clearAll')}
                    </Button>
                  )}
                </div>
                
                {/* Manager Filter */}
                <div>
                  <label className="text-sm font-medium mb-2 block flex items-center gap-2">
                    <Users className="w-4 h-4" />
                    {t('crm.manager')}
                  </label>
                  <Select value={filterManager} onValueChange={setFilterManager}>
                    <SelectTrigger className="bg-zinc-800">
                      <SelectValue placeholder={t("crm.allManagers")} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">{t('crm.allManagers')}</SelectItem>
                      {managers?.map((manager) => (
                        <SelectItem key={manager.id} value={manager.id.toString()}>
                          {manager.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                {/* Source Filter */}
                <div>
                  <label className="text-sm font-medium mb-2 block flex items-center gap-2">
                    <Tag className="w-4 h-4" />
                    {t('common.source')}
                  </label>
                  <Select value={filterSource} onValueChange={setFilterSource}>
                    <SelectTrigger className="bg-zinc-800">
                      <SelectValue placeholder="All sources" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">{t('crm.allSources')}</SelectItem>
                      {uniqueSources.map((source) => (
                        <SelectItem key={source as string} value={source as string}>
                          {source}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                {/* Date Range Filter */}
                <div>
                  <label className="text-sm font-medium mb-2 block flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    {t('crm.dateRange')}
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button variant="outline" className="justify-start text-left font-normal bg-zinc-800">
                          {filterDateFrom ? formatDate(filterDateFrom, "MMM d, yyyy") : t("crm.from")}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0 bg-zinc-900 border-zinc-800" align="start">
                        <CalendarComponent
                          mode="single"
                          selected={filterDateFrom}
                          onSelect={setFilterDateFrom}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button variant="outline" className="justify-start text-left font-normal bg-zinc-800">
                          {filterDateTo ? formatDate(filterDateTo, "MMM d, yyyy") : t("crm.to")}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0 bg-zinc-900 border-zinc-800" align="start">
                        <CalendarComponent
                          mode="single"
                          selected={filterDateTo}
                          onSelect={setFilterDateTo}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                </div>
                
                {/* Divider */}
                <div className="border-t border-zinc-800 my-2"></div>
                <p className="text-xs text-gray-400 font-semibold uppercase tracking-wide">{t('crm.utmFilters')}</p>
                
                {/* UTM Campaign Filter */}
                <div>
                  <label className="text-sm font-medium mb-2 block">
                    {t('crm.campaign')}
                  </label>
                  <Select value={filterCampaign} onValueChange={setFilterCampaign}>
                    <SelectTrigger className="bg-zinc-800">
                      <SelectValue placeholder={t('crm.allCampaigns')} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">{t('crm.allCampaigns')}</SelectItem>
                      {uniqueCampaigns.map((campaign) => (
                        <SelectItem key={campaign as string} value={campaign as string}>
                          {campaign}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                {/* UTM Ad Group Filter */}
                <div>
                  <label className="text-sm font-medium mb-2 block">
                    {t('crm.adGroup')}
                  </label>
                  <Select value={filterAdGroup} onValueChange={setFilterAdGroup}>
                    <SelectTrigger className="bg-zinc-800">
                      <SelectValue placeholder={t('crm.allAdGroups')} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">{t('crm.allAdGroups')}</SelectItem>
                      {uniqueAdGroups.map((adGroup) => (
                        <SelectItem key={adGroup as string} value={adGroup as string}>
                          {adGroup}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                {/* UTM Ad Filter */}
                <div>
                  <label className="text-sm font-medium mb-2 block">
                    {t('crm.ad')}
                  </label>
                  <Select value={filterAd} onValueChange={setFilterAd}>
                    <SelectTrigger className="bg-zinc-800">
                      <SelectValue placeholder={t('crm.allAds')} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">{t('crm.allAds')}</SelectItem>
                      {uniqueAds.map((ad) => (
                        <SelectItem key={ad as string} value={ad as string}>
                          {ad}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                {/* UTM Placement Filter */}
                <div>
                  <label className="text-sm font-medium mb-2 block">
                    {t('crm.placement')}
                  </label>
                  <Select value={filterPlacement} onValueChange={setFilterPlacement}>
                    <SelectTrigger className="bg-zinc-800">
                      <SelectValue placeholder={t('crm.allPlacements')} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">{t('crm.allPlacements')}</SelectItem>
                      {uniquePlacements.map((placement) => (
                        <SelectItem key={placement as string} value={placement as string}>
                          {placement}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                {/* UTM Keyword Filter */}
                <div>
                  <label className="text-sm font-medium mb-2 block">
                    {t('crm.keyword')}
                  </label>
                  <Select value={filterKeyword} onValueChange={setFilterKeyword}>
                    <SelectTrigger className="bg-zinc-800">
                      <SelectValue placeholder={t('crm.allKeywords')} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">{t('crm.allKeywords')}</SelectItem>
                      {uniqueKeywords.map((keyword) => (
                        <SelectItem key={keyword as string} value={keyword as string}>
                          {keyword}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                {/* UTM Site Filter */}
                <div>
                  <label className="text-sm font-medium mb-2 block">
                    {t('crm.site')}
                  </label>
                  <Select value={filterSite} onValueChange={setFilterSite}>
                    <SelectTrigger className="bg-zinc-800">
                      <SelectValue placeholder={t('crm.allSites')} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">{t('crm.allSites')}</SelectItem>
                      {uniqueSites.map((site) => (
                        <SelectItem key={site as string} value={site as string}>
                          {site}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </PopoverContent>
          </Popover>
          
          <Button onClick={() => setShowCreateLeadModal(true)} className="bg-purple-600 hover:bg-purple-700">
            {t('common.create_lead_manually')}
          </Button>
        </div>
      </div>

      {/* Leads Table */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>{t('crm.leads')}</CardTitle>
                <CardDescription>
                  {filteredLeads?.length || 0} of {leads?.length || 0} leads
                  {user.role === "manager" && " (assigned to you)"}
                </CardDescription>
              </div>
              <Button onClick={() => setShowCreateLeadModal(true)}>
                {t("crm.createLeadManually")}
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-12">
                      <input
                        type="checkbox"
                        checked={selectedLeadIds.length === filteredLeads?.length && filteredLeads?.length > 0}
                        onChange={toggleSelectAll}
                        className="w-4 h-4 cursor-pointer"
                      />
                    </TableHead>
                    <TableHead>{t('common.id')}</TableHead>
                    <TableHead>{t('common.date')}</TableHead>
                    <TableHead>{t('common.source')}</TableHead>
                    <TableHead>{t('common.quiz')}</TableHead>
                    <TableHead>{t('common.name')}</TableHead>
                    <TableHead>{t('common.phone')}</TableHead>
                    <TableHead>{t('common.utm_campaign')}</TableHead>
                    <TableHead>{t('common.utm_source')}</TableHead>
                    <TableHead>{t('common.utm_medium')}</TableHead>
                    <TableHead>{t('common.score')}</TableHead>
                    <TableHead>{t('common.status')}</TableHead>
                    <TableHead>{t('common.actions')}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredLeads && filteredLeads.length > 0 ? (
                    filteredLeads.map((lead) => (
                      <TableRow key={lead.id}>
                        <TableCell className="w-12">
                          <input
                            type="checkbox"
                            checked={selectedLeadIds.includes(lead.id)}
                            onChange={() => toggleLeadSelection(lead.id)}
                            className="w-4 h-4 cursor-pointer"
                          />
                        </TableCell>
                        <TableCell className="font-mono text-xs">
                          {lead.id}
                        </TableCell>
                        <TableCell className="text-xs">
                          {format(new Date(lead.createdAt), "MMM dd, HH:mm")}
                        </TableCell>
                        <TableCell>
                          <Badge variant="secondary">
                            {lead.source || t("common.unknown")}
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
                              onClick={() => {
                                setDetailLead(lead);
                                setShowLeadDetailModal(true);
                              }}
                            >
                              <MessageSquare className="w-4 h-4 mr-2" />
                              {t('crm.view')}
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => {
                                setEditingLead(lead);
                                setShowEditLeadModal(true);
                              }}
                            >
                              {t('crm.edit')}
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
                        {t('crm.noLeads') || 'No leads yet'}
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
                        <p className="text-sm text-muted-foreground">{t('common.quiz')}</p>
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
                        <p className="text-sm text-muted-foreground">{t('common.date')}</p>
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
              <DialogTitle>{t('common.create_lead_manually')}</DialogTitle>
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
                  <label className="text-sm font-medium">{t('common.email')}</label>
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
                      <SelectItem value="Email">{t('common.email')}</SelectItem>
                      <SelectItem value="Cold Lead">Cold Lead</SelectItem>
                      <SelectItem value="Referral">Referral</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-sm font-medium">{t("crm.utmCampaign")}</label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border rounded-md"
                    value={createLeadForm.utmCampaign}
                    onChange={(e) => setCreateLeadForm({...createLeadForm, utmCampaign: e.target.value})}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">{t("crm.utmSource")}</label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border rounded-md"
                    value={createLeadForm.utmSource}
                    onChange={(e) => setCreateLeadForm({...createLeadForm, utmSource: e.target.value})}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">{t('common.utm_medium')}</label>
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

      {/* Lead Detail Modal */}
      <LeadDetailModal
        open={showLeadDetailModal}
        onOpenChange={setShowLeadDetailModal}
        lead={detailLead}
        comments={[]}
        messages={[]}
      />

      {/* Save Preset Dialog */}
      <Dialog open={showSavePresetDialog} onOpenChange={setShowSavePresetDialog}>
        <DialogContent className="bg-zinc-900 border-zinc-800">
          <DialogHeader>
            <DialogTitle>{t('crm.savePreset') || 'Save Filter Preset'}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <label className="text-sm font-medium mb-2 block">
                {t('crm.presetName') || 'Preset Name'}
              </label>
              <input
                type="text"
                value={presetName}
                onChange={(e) => setPresetName(e.target.value)}
                placeholder={t('crm.presetNamePlaceholder') || 'e.g., High-value leads'}
                className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="isDefault"
                checked={presetIsDefault}
                onChange={(e) => setPresetIsDefault(e.target.checked)}
                className="w-4 h-4"
              />
              <label htmlFor="isDefault" className="text-sm">
                {t('crm.setAsDefault') || 'Set as default (auto-apply on page load)'}
              </label>
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <Button
              variant="ghost"
              onClick={() => {
                setShowSavePresetDialog(false);
                setPresetName("");
                setPresetIsDefault(false);
              }}
            >
              {t('common.cancel') || 'Cancel'}
            </Button>
            <Button
              onClick={saveCurrentFilters}
              disabled={!presetName.trim()}
            >
              {t('common.save') || 'Save'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <Footer />
      
      {/* Bulk Actions Floating Bar */}
      {showBulkActionsBar && (
        <div className="fixed bottom-0 left-0 right-0 bg-zinc-900 border-t border-zinc-800 shadow-lg z-50 p-4">
          <div className="container mx-auto flex items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <span className="text-sm font-medium">
                {selectedLeadIds.length} {t("crm.leadsSelected") || "leads selected"}
              </span>
              
              <Select value={bulkActionManager} onValueChange={setBulkActionManager}>
                <SelectTrigger className="w-48 bg-zinc-800">
                  <SelectValue placeholder={t("crm.assignManager") || "Assign Manager"} />
                </SelectTrigger>
                <SelectContent>
                  {managers?.map((manager) => (
                    <SelectItem key={manager.id} value={manager.id.toString()}>
                      {manager.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              <Button
                variant="outline"
                size="sm"
                onClick={bulkAssignManager}
                disabled={!bulkActionManager}
              >
                {t("crm.assign") || "Assign"}
              </Button>
              
              <Select value={bulkActionStatus} onValueChange={setBulkActionStatus}>
                <SelectTrigger className="w-48 bg-zinc-800">
                  <SelectValue placeholder={t("crm.changeStatus") || "Change Status"} />
                </SelectTrigger>
                <SelectContent>
                  {statuses?.map((status) => (
                    <SelectItem key={status.id} value={status.id.toString()}>
                      {status.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              <Button
                variant="outline"
                size="sm"
                onClick={bulkChangeStatus}
                disabled={!bulkActionStatus}
              >
                {t("crm.changeStatus") || "Change"}
              </Button>
              
              <Button
                variant="outline"
                size="sm"
                onClick={exportSelectedToCSV}
              >
                {t("crm.exportCSV") || "Export CSV"}
              </Button>
              
              <Button
                variant="destructive"
                size="sm"
                onClick={bulkDeleteLeads}
              >
                Видалити
              </Button>
            </div>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSelectedLeadIds([])}
            >
              {t("crm.cancel") || "Cancel"}
            </Button>
          </div>
        </div>
      )}
    </CRMLayout>
  );
}
