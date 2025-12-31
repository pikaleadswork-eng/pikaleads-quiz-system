import { useState } from "react";
import { useLocation } from "wouter";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { ArrowLeft, Plus, Pencil, Trash2 } from "lucide-react";

export default function AdminAssignmentRules() {
  const [, setLocation] = useLocation();
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [editingRule, setEditingRule] = useState<any>(null);

  const { data: rules, refetch: refetchRules } = trpc.admin.getAssignmentRules.useQuery();
  const { data: managers } = trpc.admin.getManagers.useQuery();
  
  const createRule = trpc.admin.createAssignmentRule.useMutation({
    onSuccess: () => {
      toast.success("Assignment rule created");
      refetchRules();
      setIsCreateDialogOpen(false);
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const updateRule = trpc.admin.updateAssignmentRule.useMutation({
    onSuccess: () => {
      toast.success("Assignment rule updated");
      refetchRules();
      setEditingRule(null);
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const deleteRule = trpc.admin.deleteAssignmentRule.useMutation({
    onSuccess: () => {
      toast.success("Assignment rule deleted");
      refetchRules();
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const toggleRule = trpc.admin.toggleAssignmentRule.useMutation({
    onSuccess: () => {
      refetchRules();
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const handleCreateRule = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    createRule.mutate({
      name: formData.get("name") as string,
      quizName: formData.get("quizName") as string,
      managerId: parseInt(formData.get("managerId") as string),
      priority: parseInt(formData.get("priority") as string) || 10,
    });
  };

  const handleUpdateRule = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    updateRule.mutate({
      id: editingRule.id,
      name: formData.get("name") as string,
      quizName: formData.get("quizName") as string,
      managerId: parseInt(formData.get("managerId") as string),
      priority: parseInt(formData.get("priority") as string) || 10,
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto py-8 px-4">
        <div className="flex items-center gap-4 mb-8">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setLocation("/admin")}
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-foreground">Assignment Rules</h1>
            <p className="text-muted-foreground mt-1">
              Configure automatic lead assignment rules
            </p>
          </div>
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Create Rule
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create Assignment Rule</DialogTitle>
                <DialogDescription>
                  Define a new rule for automatic lead assignment
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleCreateRule} className="space-y-4">
                <div>
                  <Label htmlFor="name">Rule Name</Label>
                  <Input
                    id="name"
                    name="name"
                    placeholder="e.g., Furniture Quiz Auto-Assignment"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="quizName">Quiz Name</Label>
                  <Input
                    id="quizName"
                    name="quizName"
                    placeholder="e.g., Furniture"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="managerId">Manager</Label>
                  <Select name="managerId" required>
                    <SelectTrigger>
                      <SelectValue placeholder="Select manager" />
                    </SelectTrigger>
                    <SelectContent>
                      {managers?.map((manager) => (
                        <SelectItem key={manager.id} value={manager.id.toString()}>
                          {manager.name} ({manager.email})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="priority">Priority (higher = first)</Label>
                  <Input
                    id="priority"
                    name="priority"
                    type="number"
                    defaultValue={10}
                    min={1}
                    max={100}
                  />
                </div>
                <Button type="submit" className="w-full" disabled={createRule.isPending}>
                  {createRule.isPending ? "Creating..." : "Create Rule"}
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        <div className="grid gap-4">
          {rules?.map((rule) => (
            <Card key={rule.id} className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-lg font-semibold">{rule.name}</h3>
                    <Switch
                      checked={Boolean(rule.isActive)}
                      onCheckedChange={(checked) =>
                        toggleRule.mutate({ id: rule.id, isActive: checked })
                      }
                    />
                  </div>
                  <div className="space-y-1 text-sm text-muted-foreground">
                    <p>
                      <span className="font-medium">Quiz:</span> {rule.quizName}
                    </p>
                    <p>
                      <span className="font-medium">Manager:</span>{" "}
                      {managers?.find((m) => m.id === rule.managerId)?.name || "Unknown"}
                    </p>
                    <p>
                      <span className="font-medium">Priority:</span> {rule.priority}
                    </p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Dialog open={editingRule?.id === rule.id} onOpenChange={(open) => !open && setEditingRule(null)}>
                    <DialogTrigger asChild>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => setEditingRule(rule)}
                      >
                        <Pencil className="w-4 h-4" />
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Edit Assignment Rule</DialogTitle>
                      </DialogHeader>
                      <form onSubmit={handleUpdateRule} className="space-y-4">
                        <div>
                          <Label htmlFor="edit-name">Rule Name</Label>
                          <Input
                            id="edit-name"
                            name="name"
                            defaultValue={rule.name}
                            required
                          />
                        </div>
                        <div>
                          <Label htmlFor="edit-quizName">Quiz Name</Label>
                          <Input
                            id="edit-quizName"
                            name="quizName"
                            defaultValue={rule.quizName || ""}
                            required
                          />
                        </div>
                        <div>
                          <Label htmlFor="edit-managerId">Manager</Label>
                          <Select name="managerId" defaultValue={rule.managerId?.toString() || ""} required>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {managers?.map((manager) => (
                                <SelectItem key={manager.id} value={manager.id.toString()}>
                                  {manager.name} ({manager.email})
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label htmlFor="edit-priority">Priority</Label>
                          <Input
                            id="edit-priority"
                            name="priority"
                            type="number"
                            defaultValue={rule.priority}
                            min={1}
                            max={100}
                          />
                        </div>
                        <Button type="submit" className="w-full" disabled={updateRule.isPending}>
                          {updateRule.isPending ? "Updating..." : "Update Rule"}
                        </Button>
                      </form>
                    </DialogContent>
                  </Dialog>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => {
                      if (confirm("Are you sure you want to delete this rule?")) {
                        deleteRule.mutate({ id: rule.id });
                      }
                    }}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </Card>
          ))}

          {rules?.length === 0 && (
            <Card className="p-12 text-center">
              <p className="text-muted-foreground mb-4">No assignment rules yet</p>
              <Button onClick={() => setIsCreateDialogOpen(true)}>
                <Plus className="w-4 h-4 mr-2" />
                Create Your First Rule
              </Button>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
