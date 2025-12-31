import re

# Read CRM.tsx
with open('client/src/pages/CRM.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# Add Checkbox import
content = content.replace(
    'import { Badge } from "@/components/ui/badge";',
    'import { Badge } from "@/components/ui/badge";\nimport { Checkbox } from "@/components/ui/checkbox";'
)

# Add bulk mutations after other mutations
mutations_addition = '''
  const bulkAssignMutation = trpc.crm.bulkAssignLeads.useMutation({
    onSuccess: () => {
      toast.success(t("crm.bulkAssignSuccess"));
      refetchLeads();
      setSelectedLeads(new Set());
      setShowBulkActionsDialog(false);
    },
  });

  const bulkStatusMutation = trpc.crm.bulkUpdateStatus.useMutation({
    onSuccess: () => {
      toast.success(t("crm.bulkStatusSuccess"));
      refetchLeads();
      setSelectedLeads(new Set());
      setShowBulkActionsDialog(false);
    },
  });

  const bulkDeleteMutation = trpc.crm.bulkDeleteLeads.useMutation({
    onSuccess: () => {
      toast.success(t("crm.bulkDeleteSuccess"));
      refetchLeads();
      setSelectedLeads(new Set());
      setShowBulkActionsDialog(false);
    },
  });

  // Bulk operations handlers
  const toggleLeadSelection = (leadId: number) => {
    const newSelected = new Set(selectedLeads);
    if (newSelected.has(leadId)) {
      newSelected.delete(leadId);
    } else {
      newSelected.add(leadId);
    }
    setSelectedLeads(newSelected);
  };

  const toggleSelectAll = () => {
    if (selectedLeads.size === filteredLeads?.length) {
      setSelectedLeads(new Set());
    } else {
      setSelectedLeads(new Set(filteredLeads?.map(l => l.id) || []));
    }
  };

  const handleBulkAction = (action: "assign" | "status" | "delete") => {
    setBulkAction(action);
    setShowBulkActionsDialog(true);
  };

  const executeBulkAction = () => {
    const leadIds = Array.from(selectedLeads);
    
    if (bulkAction === "assign" && bulkAssignManager) {
      bulkAssignMutation.mutate({
        leadIds,
        managerId: parseInt(bulkAssignManager),
      });
    } else if (bulkAction === "status" && bulkChangeStatus) {
      bulkStatusMutation.mutate({
        leadIds,
        statusId: parseInt(bulkChangeStatus),
      });
    } else if (bulkAction === "delete") {
      bulkDeleteMutation.mutate({ leadIds });
    }
  };
'''

# Find where to insert mutations (after createLeadMutation)
content = re.sub(
    r'(const createLeadMutation = trpc\.crm\.createLead\.useMutation\({[^}]+}\);)',
    r'\1\n' + mutations_addition,
    content,
    count=1
)

# Write back
with open('client/src/pages/CRM.tsx', 'w', encoding='utf-8') as f:
    f.write(content)

print("✅ Added bulk operations UI code to CRM.tsx")
