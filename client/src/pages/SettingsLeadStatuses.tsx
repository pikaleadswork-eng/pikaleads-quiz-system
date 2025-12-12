import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { trpc } from "@/lib/trpc";
import { Plus, Edit, Trash2 } from "lucide-react";
import { toast } from "sonner";

export function SettingsLeadStatuses() {
  const { t } = useTranslation();
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [newStatus, setNewStatus] = useState({ name: "", color: "#3B82F6", order: 0, isDefault: false });
  const [editingStatus, setEditingStatus] = useState<any>(null);

  const { data: statuses, refetch: refetchStatuses } = trpc.settings.getLeadStatuses.useQuery();
  
  const createStatusMutation = trpc.settings.createLeadStatus.useMutation({
    onSuccess: () => {
      toast.success(t("common.success"));
      setIsCreateDialogOpen(false);
      setNewStatus({ name: "", color: "#3B82F6", order: 0, isDefault: false });
      refetchStatuses();
    },
    onError: (error: any) => {
      toast.error(error.message);
    },
  });

  const updateStatusMutation = trpc.settings.updateLeadStatus.useMutation({
    onSuccess: () => {
      toast.success(t("common.success"));
      setIsEditDialogOpen(false);
      setEditingStatus(null);
      refetchStatuses();
    },
    onError: (error: any) => {
      toast.error(error.message);
    },
  });

  const deleteStatusMutation = trpc.settings.deleteLeadStatus.useMutation({
    onSuccess: () => {
      toast.success(t("common.success"));
      refetchStatuses();
    },
    onError: (error: any) => {
      toast.error(error.message);
    },
  });

  const handleCreateStatus = () => {
    createStatusMutation.mutate({
      name: newStatus.name,
      color: newStatus.color,
      order: statuses ? statuses.length : 0,
      isDefault: newStatus.isDefault,
    });
  };

  const handleEditStatus = (status: any) => {
    setEditingStatus(status);
    setIsEditDialogOpen(true);
  };

  const handleUpdateStatus = () => {
    if (!editingStatus) return;
    updateStatusMutation.mutate({
      id: editingStatus.id,
      name: editingStatus.name,
      color: editingStatus.color,
      order: editingStatus.order,
      isDefault: editingStatus.isDefault,
    });
  };

  const handleDeleteStatus = (id: number) => {
    if (confirm(t("leadStatuses.deleteConfirm"))) {
      deleteStatusMutation.mutate({ id });
    }
  };

  return (
    <div className="container mx-auto py-8 space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">{t("leadStatuses.title")}</h1>
          <p className="text-muted-foreground mt-2">{t("leadStatuses.description")}</p>
        </div>
        <Button onClick={() => setIsCreateDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          {t("leadStatuses.addStatus")}
        </Button>
      </div>

      {/* Statuses List */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {statuses?.map((status: any) => (
          <Card key={status.id}>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div 
                    className="w-4 h-4 rounded-full" 
                    style={{ backgroundColor: status.color }}
                  />
                  {status.name}
                </div>
                <div className="flex gap-2">
                  <Button 
                    variant="ghost" 
                    size="icon"
                    onClick={() => handleEditStatus(status)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="icon"
                    onClick={() => handleDeleteStatus(status.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardTitle>
              <CardDescription>
                {t("leadStatuses.order")}: {status.order}
                {status.isDefault === 1 && (
                  <span className="ml-2 inline-flex items-center rounded-md bg-green-50 px-2 py-1 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-700/10">
                    {t("leadStatuses.isDefault")}
                  </span>
                )}
              </CardDescription>
            </CardHeader>
          </Card>
        ))}
      </div>

      {/* Create Status Dialog */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t("leadStatuses.addStatus")}</DialogTitle>
            <DialogDescription>{t("leadStatuses.description")}</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label className="mb-2"htmlFor="statusName" className="mb-2 block">{t("leadStatuses.statusName")}</Label>
              <Input
                className="bg-zinc-800 border-zinc-700"
                id="statusName"
                value={newStatus.name}
                onChange={(e) => setNewStatus({ ...newStatus, name: e.target.value })}
                placeholder="e.g., Qualified"
              />
            </div>
            <div>
              <Label className="mb-2"htmlFor="statusColor" className="mb-2 block">{t("leadStatuses.statusColor")}</Label>
              <div className="flex gap-2">
                <Input
                  id="statusColor"
                  type="color"
                  value={newStatus.color}
                  onChange={(e) => setNewStatus({ ...newStatus, color: e.target.value })}
                  className="w-20 h-10 bg-zinc-800 border-zinc-700"
                />
                <Input
                  className="bg-zinc-800 border-zinc-700"
                  value={newStatus.color}
                  onChange={(e) => setNewStatus({ ...newStatus, color: e.target.value })}
                  placeholder="#3B82F6"
                />
              </div>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="isDefault"
                checked={newStatus.isDefault}
                onChange={(e) => setNewStatus({ ...newStatus, isDefault: e.target.checked })}
              />
              <Label className="mb-2"htmlFor="isDefault">{t("leadStatuses.isDefault")}</Label>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
              {t("common.cancel")}
            </Button>
            <Button onClick={handleCreateStatus} disabled={createStatusMutation.isPending}>
              {t("common.create")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Status Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="bg-zinc-900 border-zinc-800">
          <DialogHeader>
            <DialogTitle>{t("leadStatuses.editStatus")}</DialogTitle>
            <DialogDescription>{t("leadStatuses.description")}</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label className="mb-2"htmlFor="editStatusName" className="mb-2 block">{t("leadStatuses.statusName")}</Label>
              <Input
                className="bg-zinc-800 border-zinc-700"
                id="editStatusName"
                value={editingStatus?.name || ""}
                onChange={(e) => setEditingStatus({ ...editingStatus, name: e.target.value })}
                placeholder="e.g., Qualified"
              />
            </div>
            <div>
              <Label className="mb-2"htmlFor="editStatusColor" className="mb-2 block">{t("leadStatuses.statusColor")}</Label>
              <div className="flex gap-2">
                <Input
                  id="editStatusColor"
                  type="color"
                  value={editingStatus?.color || "#3B82F6"}
                  onChange={(e) => setEditingStatus({ ...editingStatus, color: e.target.value })}
                  className="w-20 h-10 bg-zinc-800 border-zinc-700"
                />
                <Input
                  className="bg-zinc-800 border-zinc-700"
                  value={editingStatus?.color || "#3B82F6"}
                  onChange={(e) => setEditingStatus({ ...editingStatus, color: e.target.value })}
                  placeholder="#3B82F6"
                />
              </div>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="editIsDefault"
                checked={editingStatus?.isDefault || false}
                onChange={(e) => setEditingStatus({ ...editingStatus, isDefault: e.target.checked })}
              />
              <Label className="mb-2"htmlFor="editIsDefault">{t("leadStatuses.isDefault")}</Label>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              {t("common.cancel")}
            </Button>
            <Button onClick={handleUpdateStatus} disabled={updateStatusMutation.isPending}>
              {t("common.update")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
