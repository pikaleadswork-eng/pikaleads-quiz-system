import re

# Read CRM.tsx
with open('client/src/pages/CRM.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Add checkbox column header (before ID column)
content = content.replace(
    '<TableHeader>\n                  <TableRow>\n                    <TableHead>{t(\'common.id\')}</TableHead>',
    '<TableHeader>\n                  <TableRow>\n                    <TableHead className="w-12">\n                      <Checkbox\n                        checked={selectedLeads.size === filteredLeads?.length && filteredLeads?.length > 0}\n                        onCheckedChange={toggleSelectAll}\n                      />\n                    </TableHead>\n                    <TableHead>{t(\'common.id\')}</TableHead>'
)

# 2. Add checkbox cell in table rows (before ID cell)
content = content.replace(
    'filteredLeads.map((lead) => (\n                      <TableRow key={lead.id}>\n                        <TableCell className="font-mono text-xs">',
    'filteredLeads.map((lead) => (\n                      <TableRow key={lead.id}>\n                        <TableCell className="w-12">\n                          <Checkbox\n                            checked={selectedLeads.has(lead.id)}\n                            onCheckedChange={() => toggleLeadSelection(lead.id)}\n                          />\n                        </TableCell>\n                        <TableCell className="font-mono text-xs">'
)

# 3. Add bulk actions toolbar (before the table)
bulk_toolbar = '''          {/* Bulk Actions Toolbar */}
          {selectedLeads.size > 0 && (
            <Card className="mb-4 bg-blue-500/10 border-blue-500/20">
              <CardContent className="py-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <span className="text-sm font-medium">
                      {selectedLeads.size} {t("crm.leadsSelected")}
                    </span>
                    <div className="flex gap-2">
                      {user?.role === "admin" && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleBulkAction("assign")}
                        >
                          <Users className="w-4 h-4 mr-2" />
                          {t("crm.assignManager")}
                        </Button>
                      )}
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleBulkAction("status")}
                      >
                        <Tag className="w-4 h-4 mr-2" />
                        {t("crm.changeStatus")}
                      </Button>
                      {user?.role === "admin" && (
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => handleBulkAction("delete")}
                        >
                          <X className="w-4 h-4 mr-2" />
                          {t("crm.delete")}
                        </Button>
                      )}
                    </div>
                  </div>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => setSelectedLeads(new Set())}
                  >
                    {t("common.cancel")}
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

'''

# Insert bulk toolbar before the Leads card
content = content.replace(
    '          <Card>\n            <CardHeader className="flex flex-row items-center justify-between">',
    bulk_toolbar + '          <Card>\n            <CardHeader className="flex flex-row items-center justify-between">'
)

# Write back
with open('client/src/pages/CRM.tsx', 'w', encoding='utf-8') as f:
    f.write(content)

print("✅ Added bulk operations UI to CRM table")
