import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Loader2, Plus, Edit, Trash2, FileText } from "lucide-react";
import { useAuth } from "@/_core/hooks/useAuth";
import { Link } from "wouter";
import { toast } from "sonner";

export default function SalesScripts() {
  const { user, loading: authLoading } = useAuth();
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingScript, setEditingScript] = useState<any | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  const [formData, setFormData] = useState({
    title: "",
    category: "Cold Call" as "Cold Call" | "Follow-up" | "Objection Handling" | "Closing",
    content: "",
  });

  const { data: scripts, isLoading, refetch } = trpc.salesScripts.getAll.useQuery();

  const createMutation = trpc.salesScripts.create.useMutation({
    onSuccess: () => {
      toast.success("Script created successfully");
      setIsCreateOpen(false);
      resetForm();
      refetch();
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to create script");
    },
  });

  const updateMutation = trpc.salesScripts.update.useMutation({
    onSuccess: () => {
      toast.success("Script updated successfully");
      setEditingScript(null);
      resetForm();
      refetch();
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to update script");
    },
  });

  const deleteMutation = trpc.salesScripts.delete.useMutation({
    onSuccess: () => {
      toast.success("Script deleted successfully");
      refetch();
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to delete script");
    },
  });

  const resetForm = () => {
    setFormData({
      title: "",
      category: "Cold Call",
      content: "",
    });
  };

  const handleCreate = () => {
    if (!formData.title || !formData.content) {
      toast.error("Please fill in all required fields");
      return;
    }

    createMutation.mutate(formData);
  };

  const handleUpdate = () => {
    if (!editingScript || !formData.title || !formData.content) {
      toast.error("Please fill in all required fields");
      return;
    }

    updateMutation.mutate({
      id: editingScript.id,
      ...formData,
    });
  };

  const handleEdit = (script: any) => {
    setEditingScript(script);
    setFormData({
      title: script.title,
      category: script.category,
      content: script.content,
    });
  };

  const handleDelete = (id: number) => {
    if (confirm("Are you sure you want to delete this script?")) {
      deleteMutation.mutate({ id });
    }
  };

  if (authLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  if (!user) {
    window.location.href = "/login";
    return null;
  }

  if (user.role !== "admin") {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <h1 className="text-2xl font-bold mb-4">Access Denied</h1>
        <p className="text-muted-foreground mb-4">You need admin privileges to access this page.</p>
        <Link href="/admin">
          <Button>Return Home</Button>
        </Link>
      </div>
    );
  }

  // Filter scripts
  const filteredScripts = scripts?.filter((script) =>
    selectedCategory === "all" || script.category === selectedCategory
  );

  // Group by category
  const scriptsByCategory = {
    "Cold Call": filteredScripts?.filter((s) => s.category === "Cold Call") || [],
    "Follow-up": filteredScripts?.filter((s) => s.category === "Follow-up") || [],
    "Objection Handling": filteredScripts?.filter((s) => s.category === "Objection Handling") || [],
    "Closing": filteredScripts?.filter((s) => s.category === "Closing") || [],
  };

  const categoryLabels = {
    "Cold Call": "Cold Call",
    "Follow-up": "Follow-up",
    "Objection Handling": "Objection Handling",
    "Closing": "Closing",
  };

  const categoryColors = {
    "Cold Call": "bg-blue-500/10 text-blue-500 border-blue-500/20",
    "Follow-up": "bg-green-500/10 text-green-500 border-green-500/20",
    "Objection Handling": "bg-yellow-500/10 text-yellow-500 border-yellow-500/20",
    "Closing": "bg-purple-500/10 text-purple-500 border-purple-500/20",
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="container mx-auto py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <Link href="/admin">
              <Button variant="ghost" className="mb-4">
                ← Back to Admin
              </Button>
            </Link>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              Sales Scripts
            </h1>
            <p className="text-gray-400 mt-2">
              Manage your sales scripts and templates
            </p>
          </div>
          <Button onClick={() => setIsCreateOpen(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Create Script
          </Button>
        </div>

        {/* Category Filter */}
        <Card className="bg-zinc-900 border-zinc-800 mb-6">
          <CardHeader>
            <CardTitle className="text-sm">Filter by Category</CardTitle>
          </CardHeader>
          <CardContent>
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-64">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="Cold Call">Cold Call</SelectItem>
                <SelectItem value="Follow-up">Follow-up</SelectItem>
                <SelectItem value="Objection Handling">Objection Handling</SelectItem>
                <SelectItem value="Closing">Closing</SelectItem>
              </SelectContent>
            </Select>
          </CardContent>
        </Card>

        {/* Scripts Grid */}
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin" />
          </div>
        ) : (
          <div className="space-y-6">
            {Object.entries(scriptsByCategory).map(([category, categoryScripts]) => {
              if (selectedCategory !== "all" && selectedCategory !== category) return null;
              if (categoryScripts.length === 0) return null;

              return (
                <div key={category}>
                  <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                    <FileText className="w-6 h-6" />
                    {categoryLabels[category as keyof typeof categoryLabels]}
                    <Badge variant="outline" className="ml-2">
                      {categoryScripts.length}
                    </Badge>
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {categoryScripts.map((script) => (
                      <Card key={script.id} className="bg-zinc-900 border-zinc-800">
                        <CardHeader>
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <CardTitle className="text-lg mb-2">{script.title}</CardTitle>
                              <Badge
                                variant="outline"
                                className={categoryColors[script.category as keyof typeof categoryColors]}
                              >
                                {categoryLabels[script.category as keyof typeof categoryLabels]}
                              </Badge>
                            </div>
                            <div className="flex gap-2">
                              <Button
                                size="icon"
                                variant="ghost"
                                onClick={() => handleEdit(script)}
                              >
                                <Edit className="w-4 h-4" />
                              </Button>
                              <Button
                                size="icon"
                                variant="ghost"
                                onClick={() => handleDelete(script.id)}
                              >
                                <Trash2 className="w-4 h-4 text-red-500" />
                              </Button>
                            </div>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <p className="text-sm text-gray-400 line-clamp-4 whitespace-pre-wrap">
                            {script.content}
                          </p>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              );
            })}

            {filteredScripts?.length === 0 && (
              <Card className="bg-zinc-900 border-zinc-800">
                <CardContent className="py-12 text-center">
                  <FileText className="w-12 h-12 mx-auto mb-4 text-gray-600" />
                  <p className="text-gray-400">No scripts found</p>
                  <Button onClick={() => setIsCreateOpen(true)} className="mt-4">
                    Create your first script
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        )}

        {/* Create/Edit Dialog */}
        <Dialog
          open={isCreateOpen || editingScript !== null}
          onOpenChange={(open) => {
            if (!open) {
              setIsCreateOpen(false);
              setEditingScript(null);
              resetForm();
            }
          }}
        >
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>
                {editingScript ? "Edit Script" : "Create New Script"}
              </DialogTitle>
              <DialogDescription>
                {editingScript
                  ? "Update your sales script"
                  : "Add a new sales script to your library"}
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4">
              <div>
                <Label htmlFor="title">Title *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g., Introduction Script"
                />
              </div>

              <div>
                <Label htmlFor="category">Category *</Label>
                <Select
                  value={formData.category}
                  onValueChange={(value: any) => setFormData({ ...formData, category: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Cold Call">Cold Call</SelectItem>
                    <SelectItem value="Follow-up">Follow-up</SelectItem>
                    <SelectItem value="Objection Handling">Objection Handling</SelectItem>
                    <SelectItem value="Closing">Closing</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="content">Script Content *</Label>
                <Textarea
                  id="content"
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  placeholder="Enter your sales script here..."
                  rows={12}
                  className="font-mono text-sm"
                />
              </div>

              <div className="flex justify-end gap-2">
                <Button
                  variant="outline"
                  onClick={() => {
                    setIsCreateOpen(false);
                    setEditingScript(null);
                    resetForm();
                  }}
                >
                  Cancel
                </Button>
                <Button
                  onClick={editingScript ? handleUpdate : handleCreate}
                  disabled={createMutation.isPending || updateMutation.isPending}
                >
                  {(createMutation.isPending || updateMutation.isPending) && (
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  )}
                  {editingScript ? "Update Script" : "Create Script"}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
