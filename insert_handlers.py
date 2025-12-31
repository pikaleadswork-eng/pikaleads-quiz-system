# Read CRM.tsx
with open('client/src/pages/CRM.tsx', 'r', encoding='utf-8') as f:
    lines = f.readlines()

# Find line 169 (after sendMessageMutation closing brace)
handlers = '''
  // Bulk operations mutations
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

# Insert after line 169 (index 168)
lines.insert(169, handlers)

# Write back
with open('client/src/pages/CRM.tsx', 'w', encoding='utf-8') as f:
    f.writelines(lines)

print("✅ Inserted bulk handlers at line 170")
