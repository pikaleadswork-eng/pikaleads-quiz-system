import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { trpc } from "@/lib/trpc";
import { Plus, Edit, Trash2, Users } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";

export function SettingsRoles() {
  const { t } = useTranslation();
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isInviteDialogOpen, setIsInviteDialogOpen] = useState(false);
  const [newRole, setNewRole] = useState({ 
    name: "", 
    description: "", 
    permissions: {
      leads: { read: false, write: false },
      messaging: { read: false, write: false },
      sales: { read: false, write: false },
      services: { read: false, write: false },
      analytics: { read: false, write: false },
      settings: { read: false, write: false }
    }
  });
  const [inviteEmail, setInviteEmail] = useState("");
  const [selectedRole, setSelectedRole] = useState("");

  const { data: roles, refetch: refetchRoles } = trpc.settings.getRoles.useQuery();
  const { data: invitations } = trpc.settings.getUserInvitations.useQuery();
  
  const createRoleMutation = trpc.settings.createRole.useMutation({
    onSuccess: () => {
      toast.success(t("common.success"));
      setIsCreateDialogOpen(false);
      setNewRole({ 
        name: "", 
        description: "", 
        permissions: {
          leads: { read: false, write: false },
          messaging: { read: false, write: false },
          sales: { read: false, write: false },
          services: { read: false, write: false },
          analytics: { read: false, write: false },
          settings: { read: false, write: false }
        }
      });
      refetchRoles();
    },
    onError: (error: any) => {
      toast.error(error.message);
    },
  });

  const inviteUserMutation = trpc.settings.inviteUser.useMutation({
    onSuccess: () => {
      toast.success(t("common.success"));
      setIsInviteDialogOpen(false);
      setInviteEmail("");
      setSelectedRole("");
    },
    onError: (error: any) => {
      toast.error(error.message);
    },
  });

  const handleCreateRole = () => {
    createRoleMutation.mutate({
      name: newRole.name,
      description: newRole.description,
      permissions: JSON.stringify(newRole.permissions),
    });
  };
  
  const togglePermission = (module: string, action: 'read' | 'write') => {
    setNewRole(prev => ({
      ...prev,
      permissions: {
        ...prev.permissions,
        [module]: {
          ...prev.permissions[module as keyof typeof prev.permissions],
          [action]: !prev.permissions[module as keyof typeof prev.permissions][action]
        }
      }
    }));
  };

  const handleInviteUser = () => {
    inviteUserMutation.mutate({
      email: inviteEmail,
      roleName: selectedRole,
    });
  };

  return (
    <div className="container mx-auto py-8 space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">{t("roles.title")}</h1>
          <p className="text-muted-foreground mt-2">{t("roles.description")}</p>
        </div>
        <div className="flex gap-2">
          <Button onClick={() => setIsInviteDialogOpen(true)}>
            <Users className="mr-2 h-4 w-4" />
            {t("roles.inviteUser")}
          </Button>
          <Button onClick={() => setIsCreateDialogOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            {t("roles.createRole")}
          </Button>
        </div>
      </div>

      {/* Roles List */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {roles?.map((role: any) => (
          <Card key={role.id}>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                {role.name}
                {!role.isSystem && (
                  <div className="flex gap-2">
                    <Button variant="ghost" size="icon">
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                )}
              </CardTitle>
              <CardDescription>{role.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-sm text-muted-foreground">
                {role.isSystem && (
                  <span className="inline-flex items-center rounded-md bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-700/10">
                    System Role
                  </span>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Pending Invitations */}
      {invitations && invitations.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Pending Invitations</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {invitations.map((invitation: any) => (
                <div key={invitation.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <p className="font-medium">{invitation.email}</p>
                    <p className="text-sm text-muted-foreground">{invitation.roleName}</p>
                  </div>
                  <span className="text-xs text-muted-foreground">
                    {invitation.status}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Create Role Dialog */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t("roles.createRole")}</DialogTitle>
            <DialogDescription>{t("roles.description")}</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="roleName" className="mb-2 block">{t("roles.roleName")}</Label>
              <Input
                className="bg-zinc-800 border-zinc-700"
                id="roleName"
                value={newRole.name}
                onChange={(e) => setNewRole({ ...newRole, name: e.target.value })}
                placeholder="e.g., Sales Manager"
              />
            </div>
            <div>
              <Label htmlFor="roleDescription" className="mb-2 block">Description</Label>
              <Textarea
                className="bg-zinc-800 border-zinc-700"
                id="roleDescription"
                value={newRole.description}
                onChange={(e) => setNewRole({ ...newRole, description: e.target.value })}
                placeholder="Describe this role..."
              />
            </div>
            <div>
              <Label className="mb-3 block">{t("roles.permissions")}</Label>
              <div className="space-y-4 border border-zinc-700 rounded-lg p-4 bg-zinc-800/50">
                {Object.keys(newRole.permissions).map((module) => (
                  <div key={module} className="space-y-2">
                    <h4 className="font-medium text-sm capitalize">{module}</h4>
                    <div className="flex gap-6 ml-4">
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id={`${module}-read`}
                          checked={newRole.permissions[module as keyof typeof newRole.permissions].read}
                          onCheckedChange={() => togglePermission(module, 'read')}
                        />
                        <label
                          htmlFor={`${module}-read`}
                          className="text-sm font-normal cursor-pointer"
                        >
                          Read
                        </label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id={`${module}-write`}
                          checked={newRole.permissions[module as keyof typeof newRole.permissions].write}
                          onCheckedChange={() => togglePermission(module, 'write')}
                        />
                        <label
                          htmlFor={`${module}-write`}
                          className="text-sm font-normal cursor-pointer"
                        >
                          Write
                        </label>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
              {t("common.cancel")}
            </Button>
            <Button onClick={handleCreateRole} disabled={createRoleMutation.isPending}>
              {t("common.create")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Invite User Dialog */}
      <Dialog open={isInviteDialogOpen} onOpenChange={setIsInviteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t("roles.inviteUser")}</DialogTitle>
            <DialogDescription>{t("roles.sendInvitation")}</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="userEmail">{t("roles.userEmail")}</Label>
              <Input
                id="userEmail"
                type="email"
                value={inviteEmail}
                onChange={(e) => setInviteEmail(e.target.value)}
                placeholder="user@example.com"
              />
            </div>
            <div>
              <Label htmlFor="selectRole">{t("roles.selectRole")}</Label>
              <select
                id="selectRole"
                className="w-full rounded-md border border-input bg-background px-3 py-2"
                value={selectedRole}
                onChange={(e) => setSelectedRole(e.target.value)}
              >
                <option value="">Select a role...</option>
                <option value="admin">{t("roles.admin")}</option>
                <option value="manager">{t("roles.manager")}</option>
                <option value="viewer">{t("roles.viewer")}</option>
                {roles?.map((role: any) => (
                  <option key={role.id} value={role.name}>
                    {role.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsInviteDialogOpen(false)}>
              {t("common.cancel")}
            </Button>
            <Button onClick={handleInviteUser} disabled={inviteUserMutation.isPending}>
              {t("roles.sendInvitation")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
