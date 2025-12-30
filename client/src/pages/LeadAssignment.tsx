import { useState } from "react";
import { useTranslation } from "react-i18next";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { Plus, Trash2, Edit, Power } from "lucide-react";

export default function LeadAssignment() {
  const { t } = useTranslation();
  const utils = trpc.useUtils();
  
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [editingRule, setEditingRule] = useState<any>(null);
  
  // Form state
  const [ruleName, setRuleName] = useState("");
  const [ruleType, setRuleType] = useState<"manual" | "workload" | "source" | "campaign">("manual");
  const [assignmentStrategy, setAssignmentStrategy] = useState<"specific" | "balance_workload">("specific");
  const [selectedManagerId, setSelectedManagerId] = useState<number | undefined>();
  const [conditionsSource, setConditionsSource] = useState("");
  const [conditionsCampaign, setConditionsCampaign] = useState("");
  const [priority, setPriority] = useState(0);
  
  // Queries
  const { data: rules = [], isLoading } = trpc.assignmentRules.list.useQuery();
  const { data: managers = [] } = trpc.admin.getManagers.useQuery();
  
  // Mutations
  const createMutation = trpc.assignmentRules.create.useMutation({
    onSuccess: () => {
      utils.assignmentRules.list.invalidate();
      toast.success(t("assignmentRules.created"));
      closeDialog();
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });
  
  const updateMutation = trpc.assignmentRules.update.useMutation({
    onSuccess: () => {
      utils.assignmentRules.list.invalidate();
      toast.success(t("assignmentRules.updated"));
      closeDialog();
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });
  
  const deleteMutation = trpc.assignmentRules.delete.useMutation({
    onSuccess: () => {
      utils.assignmentRules.list.invalidate();
      toast.success(t("assignmentRules.deleted"));
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });
  
  const toggleMutation = trpc.assignmentRules.toggle.useMutation({
    onSuccess: () => {
      utils.assignmentRules.list.invalidate();
      toast.success(t("assignmentRules.toggled"));
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });
  
  const closeDialog = () => {
    setIsCreateDialogOpen(false);
    setEditingRule(null);
    setRuleName("");
    setRuleType("manual");
    setAssignmentStrategy("specific");
    setSelectedManagerId(undefined);
    setConditionsSource("");
    setConditionsCampaign("");
    setPriority(0);
  };
  
  const openEditDialog = (rule: any) => {
    setEditingRule(rule);
    setRuleName(rule.name);
    setRuleType(rule.type);
    setAssignmentStrategy(rule.assignmentStrategy);
    setSelectedManagerId(rule.managerId);
    setPriority(rule.priority);
    
    // Parse conditions
    if (rule.conditions) {
      try {
        const conditions = JSON.parse(rule.conditions);
        setConditionsSource(conditions.source || "");
        setConditionsCampaign(conditions.campaign || "");
      } catch (e) {
        console.error("Failed to parse conditions:", e);
      }
    }
    
    setIsCreateDialogOpen(true);
  };
  
  const handleSubmit = () => {
    if (!ruleName.trim()) {
      toast.error(t("assignmentRules.nameRequired"));
      return;
    }
    
    if (assignmentStrategy === "specific" && !selectedManagerId) {
      toast.error(t("assignmentRules.managerRequired"));
      return;
    }
    
    // Build conditions JSON
    const conditions: any = {};
    if (conditionsSource) conditions.source = conditionsSource;
    if (conditionsCampaign) conditions.campaign = conditionsCampaign;
    
    const data = {
      name: ruleName,
      type: ruleType,
      assignmentStrategy,
      managerId: assignmentStrategy === "specific" ? selectedManagerId : undefined,
      conditions: Object.keys(conditions).length > 0 ? JSON.stringify(conditions) : undefined,
      priority,
      isActive: 1,
    };
    
    if (editingRule) {
      updateMutation.mutate({ id: editingRule.id, ...data });
    } else {
      createMutation.mutate(data);
    }
  };
  
  const handleDelete = (id: number) => {
    if (confirm(t("assignmentRules.confirmDelete"))) {
      deleteMutation.mutate({ id });
    }
  };
  
  const handleToggle = (id: number, currentStatus: number) => {
    toggleMutation.mutate({ id, isActive: currentStatus === 1 ? 0 : 1 });
  };
  
  return (
    <div className="container py-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold">{t("assignmentRules.title")}</h1>
          <p className="text-muted-foreground mt-2">{t("assignmentRules.description")}</p>
        </div>
        <Button onClick={() => setIsCreateDialogOpen(true)}>
          <Plus className="w-4 h-4 mr-2" />
          {t("assignmentRules.createRule")}
        </Button>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>{t("assignmentRules.rulesListTitle")}</CardTitle>
          <CardDescription>{t("assignmentRules.rulesListDescription")}</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <p>{t("common.loading")}</p>
          ) : rules.length === 0 ? (
            <p className="text-muted-foreground">{t("assignmentRules.noRules")}</p>
          ) : (
            <div className="space-y-4">
              {rules.map((rule) => (
                <div key={rule.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex-1">
                    <div className="flex items-center gap-3">
                      <h3 className="font-semibold">{rule.name}</h3>
                      <span className="text-xs px-2 py-1 rounded bg-primary/10 text-primary">
                        {t(`assignmentRules.type.${rule.type}`)}
                      </span>
                      {rule.isActive === 1 ? (
                        <span className="text-xs px-2 py-1 rounded bg-green-500/10 text-green-500">
                          {t("assignmentRules.active")}
                        </span>
                      ) : (
                        <span className="text-xs px-2 py-1 rounded bg-gray-500/10 text-gray-500">
                          {t("assignmentRules.inactive")}
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">
                      {rule.assignmentStrategy === "specific" && rule.managerName
                        ? `${t("assignmentRules.assignTo")}: ${rule.managerName}`
                        : t("assignmentRules.balanceWorkload")}
                    </p>
                    {rule.conditions && (
                      <p className="text-xs text-muted-foreground mt-1">
                        {t("assignmentRules.conditions")}: {rule.conditions}
                      </p>
                    )}
                    <p className="text-xs text-muted-foreground mt-1">
                      {t("assignmentRules.priority")}: {rule.priority}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleToggle(rule.id, rule.isActive)}
                    >
                      <Power className={`w-4 h-4 ${rule.isActive === 1 ? "text-green-500" : "text-gray-500"}`} />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => openEditDialog(rule)}
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDelete(rule.id)}
                    >
                      <Trash2 className="w-4 h-4 text-destructive" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
      
      {/* Create/Edit Dialog */}
      <Dialog open={isCreateDialogOpen} onOpenChange={closeDialog}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingRule ? t("assignmentRules.editRule") : t("assignmentRules.createRule")}
            </DialogTitle>
            <DialogDescription>
              {t("assignmentRules.dialogDescription")}
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div>
              <Label htmlFor="ruleName">{t("assignmentRules.ruleName")}</Label>
              <Input
                id="ruleName"
                value={ruleName}
                onChange={(e) => setRuleName(e.target.value)}
                placeholder={t("assignmentRules.ruleNamePlaceholder")}
                className="mt-1"
              />
            </div>
            
            <div>
              <Label htmlFor="ruleType">{t("assignmentRules.ruleType")}</Label>
              <Select value={ruleType} onValueChange={(value: any) => setRuleType(value)}>
                <SelectTrigger className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="manual">{t("assignmentRules.type.manual")}</SelectItem>
                  <SelectItem value="workload">{t("assignmentRules.type.workload")}</SelectItem>
                  <SelectItem value="source">{t("assignmentRules.type.source")}</SelectItem>
                  <SelectItem value="campaign">{t("assignmentRules.type.campaign")}</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label htmlFor="assignmentStrategy">{t("assignmentRules.assignmentStrategy")}</Label>
              <Select value={assignmentStrategy} onValueChange={(value: any) => setAssignmentStrategy(value)}>
                <SelectTrigger className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="specific">{t("assignmentRules.strategy.specific")}</SelectItem>
                  <SelectItem value="balance_workload">{t("assignmentRules.strategy.balanceWorkload")}</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            {assignmentStrategy === "specific" && (
              <div>
                <Label htmlFor="manager">{t("assignmentRules.selectManager")}</Label>
                <Select value={selectedManagerId?.toString()} onValueChange={(value) => setSelectedManagerId(parseInt(value))}>
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder={t("assignmentRules.selectManagerPlaceholder")} />
                  </SelectTrigger>
                  <SelectContent>
                    {managers.map((manager: any) => (
                      <SelectItem key={manager.id} value={manager.id.toString()}>
                        {manager.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
            
            {(ruleType === "source" || ruleType === "campaign") && (
              <div className="space-y-4">
                <p className="text-sm text-muted-foreground">{t("assignmentRules.conditionsHelp")}</p>
                
                {ruleType === "source" && (
                  <div>
                    <Label htmlFor="conditionsSource">{t("assignmentRules.sourceCondition")}</Label>
                    <Input
                      id="conditionsSource"
                      value={conditionsSource}
                      onChange={(e) => setConditionsSource(e.target.value)}
                      placeholder="facebook, google, instagram..."
                      className="mt-1"
                    />
                  </div>
                )}
                
                {ruleType === "campaign" && (
                  <div>
                    <Label htmlFor="conditionsCampaign">{t("assignmentRules.campaignCondition")}</Label>
                    <Input
                      id="conditionsCampaign"
                      value={conditionsCampaign}
                      onChange={(e) => setConditionsCampaign(e.target.value)}
                      placeholder="summer_sale_2025, black_friday..."
                      className="mt-1"
                    />
                  </div>
                )}
              </div>
            )}
            
            <div>
              <Label htmlFor="priority">{t("assignmentRules.priority")}</Label>
              <Input
                id="priority"
                type="number"
                value={priority}
                onChange={(e) => setPriority(parseInt(e.target.value) || 0)}
                className="mt-1"
              />
              <p className="text-xs text-muted-foreground mt-1">{t("assignmentRules.priorityHelp")}</p>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={closeDialog}>
              {t("common.cancel")}
            </Button>
            <Button onClick={handleSubmit} disabled={createMutation.isPending || updateMutation.isPending}>
              {editingRule ? t("common.save") : t("common.create")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
