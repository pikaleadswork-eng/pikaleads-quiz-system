# Read CRM.tsx
with open('client/src/pages/CRM.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# Add bulk actions dialog before the closing CRMLayout tag
bulk_dialog = '''
      {/* Bulk Actions Dialog */}
      <Dialog open={showBulkActionsDialog} onOpenChange={setShowBulkActionsDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t("crm.bulkActionTitle")}</DialogTitle>
            <DialogDescription>
              {bulkAction === "assign" && t("crm.bulkAssignDescription")}
              {bulkAction === "status" && t("crm.bulkStatusDescription")}
              {bulkAction === "delete" && t("crm.bulkDeleteDescription")}
            </DialogDescription>
          </DialogHeader>
          
          {bulkAction === "assign" && (
            <div className="space-y-4">
              <Select value={bulkAssignManager} onValueChange={setBulkAssignManager}>
                <SelectTrigger>
                  <SelectValue placeholder={t("crm.selectManager")} />
                </SelectTrigger>
                <SelectContent>
                  {managers?.map((manager) => (
                    <SelectItem key={manager.id} value={manager.id.toString()}>
                      {manager.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
          
          {bulkAction === "status" && (
            <div className="space-y-4">
              <Select value={bulkChangeStatus} onValueChange={setBulkChangeStatus}>
                <SelectTrigger>
                  <SelectValue placeholder={t("crm.selectStatus")} />
                </SelectTrigger>
                <SelectContent>
                  {statuses?.map((status) => (
                    <SelectItem key={status.id} value={status.id.toString()}>
                      <Badge style={{ backgroundColor: status.color }}>
                        {status.name}
                      </Badge>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
          
          <div className="flex justify-end gap-2 mt-4">
            <Button variant="outline" onClick={() => setShowBulkActionsDialog(false)}>
              {t("common.cancel")}
            </Button>
            <Button 
              onClick={executeBulkAction}
              variant={bulkAction === "delete" ? "destructive" : "default"}
              disabled={
                (bulkAction === "assign" && !bulkAssignManager) ||
                (bulkAction === "status" && !bulkChangeStatus)
              }
            >
              {t("crm.execute")}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
'''

# Find the closing CRMLayout tag and insert dialog before it
content = content.replace(
    '    </CRMLayout>',
    bulk_dialog + '    </CRMLayout>'
)

# Write back
with open('client/src/pages/CRM.tsx', 'w', encoding='utf-8') as f:
    f.write(content)

print("✅ Added bulk actions dialog to CRM.tsx")
