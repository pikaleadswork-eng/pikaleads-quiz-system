import { useState } from "react";
import { trpc } from "@/lib/trpc";
import DashboardLayout from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus, Edit, Trash2, Eye, EyeOff, Save, X } from "lucide-react";
import { toast } from "sonner";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function AdminBlog() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    excerpt: "",
    content: "",
    coverImage: "",
    categoryId: "",
    status: "draft" as "draft" | "published" | "archived",
    // SEO fields
    metaTitle: "",
    metaDescription: "",
    keywords: "",
    ogImage: "",
    ogTitle: "",
    ogDescription: "",
  });

  const { data: posts, refetch } = trpc.blog.listAll.useQuery({ limit: 50, offset: 0 });
  const { data: categories } = trpc.blog.getCategories.useQuery();

  const createMutation = trpc.blog.create.useMutation({
    onSuccess: () => {
      toast.success("Статтю створено!");
      setIsDialogOpen(false);
      resetForm();
      refetch();
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const updateMutation = trpc.blog.update.useMutation({
    onSuccess: () => {
      toast.success("Статтю оновлено!");
      setIsDialogOpen(false);
      resetForm();
      refetch();
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const deleteMutation = trpc.blog.delete.useMutation({
    onSuccess: () => {
      toast.success("Статтю видалено!");
      refetch();
    },
  });

  const resetForm = () => {
    setFormData({
      title: "",
      slug: "",
      excerpt: "",
      content: "",
      coverImage: "",
      categoryId: "",
      status: "draft",
      metaTitle: "",
      metaDescription: "",
      keywords: "",
      ogImage: "",
      ogTitle: "",
      ogDescription: "",
    });
    setEditingId(null);
  };

  const handleEdit = (post: any) => {
    setEditingId(post.id);
    setFormData({
      title: post.title,
      slug: post.slug,
      excerpt: post.excerpt,
      content: post.content,
      coverImage: post.coverImage || "",
      categoryId: post.categoryId?.toString() || "",
      status: post.status,
      metaTitle: "",
      metaDescription: "",
      keywords: "",
      ogImage: "",
      ogTitle: "",
      ogDescription: "",
    });
    setIsDialogOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const data = {
      title: formData.title,
      slug: formData.slug,
      excerpt: formData.excerpt,
      content: formData.content,
      coverImage: formData.coverImage || null,
      categoryId: formData.categoryId ? parseInt(formData.categoryId) : null,
      status: formData.status,
      seo: {
        metaTitle: formData.metaTitle || null,
        metaDescription: formData.metaDescription || null,
        keywords: formData.keywords || null,
        ogImage: formData.ogImage || null,
        ogTitle: formData.ogTitle || null,
        ogDescription: formData.ogDescription || null,
      },
    };

    if (editingId) {
      updateMutation.mutate({ id: editingId, ...data });
    } else {
      createMutation.mutate(data);
    }
  };

  return (
    <DashboardLayout>
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Блог</h1>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={resetForm}>
                <Plus className="w-4 h-4 mr-2" />
                Додати статтю
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>{editingId ? "Редагувати статтю" : "Нова стаття"}</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Basic Info */}
                <div className="space-y-4">
                  <h3 className="font-semibold text-lg">Основна інформація</h3>
                  <Input
                    placeholder="Заголовок *"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    required
                  />
                  <Input
                    placeholder="Slug (URL) *"
                    value={formData.slug}
                    onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                    required
                  />
                  <Textarea
                    placeholder="Короткий опис (excerpt) *"
                    value={formData.excerpt}
                    onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                    rows={3}
                    required
                  />
                  <Textarea
                    placeholder="Повний контент (HTML) *"
                    value={formData.content}
                    onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                    rows={10}
                    required
                  />
                  <Input
                    placeholder="URL обкладинки"
                    value={formData.coverImage}
                    onChange={(e) => setFormData({ ...formData, coverImage: e.target.value })}
                  />
                  <Select value={formData.status} onValueChange={(value: any) => setFormData({ ...formData, status: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Статус" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="draft">Чернетка</SelectItem>
                      <SelectItem value="published">Опубліковано</SelectItem>
                      <SelectItem value="archived">Архів</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* SEO Settings */}
                <div className="space-y-4 border-t pt-4">
                  <h3 className="font-semibold text-lg">SEO налаштування</h3>
                  <Input
                    placeholder="Meta Title"
                    value={formData.metaTitle}
                    onChange={(e) => setFormData({ ...formData, metaTitle: e.target.value })}
                  />
                  <Textarea
                    placeholder="Meta Description"
                    value={formData.metaDescription}
                    onChange={(e) => setFormData({ ...formData, metaDescription: e.target.value })}
                    rows={3}
                  />
                  <Input
                    placeholder="Keywords (через кому)"
                    value={formData.keywords}
                    onChange={(e) => setFormData({ ...formData, keywords: e.target.value })}
                  />
                </div>

                {/* Open Graph */}
                <div className="space-y-4 border-t pt-4">
                  <h3 className="font-semibold text-lg">Open Graph (соцмережі)</h3>
                  <Input
                    placeholder="OG Title"
                    value={formData.ogTitle}
                    onChange={(e) => setFormData({ ...formData, ogTitle: e.target.value })}
                  />
                  <Textarea
                    placeholder="OG Description"
                    value={formData.ogDescription}
                    onChange={(e) => setFormData({ ...formData, ogDescription: e.target.value })}
                    rows={2}
                  />
                  <Input
                    placeholder="OG Image URL"
                    value={formData.ogImage}
                    onChange={(e) => setFormData({ ...formData, ogImage: e.target.value })}
                  />
                </div>

                <div className="flex gap-2 pt-4">
                  <Button type="submit" disabled={createMutation.isPending || updateMutation.isPending}>
                    <Save className="w-4 h-4 mr-2" />
                    {editingId ? "Оновити" : "Створити"}
                  </Button>
                  <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                    <X className="w-4 h-4 mr-2" />
                    Скасувати
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Posts List */}
        <div className="grid gap-4">
          {posts?.map((post: any) => (
            <div key={post.id} className="border rounded-lg p-4 flex justify-between items-start">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <h3 className="font-semibold text-lg">{post.title}</h3>
                  {post.status === "published" ? (
                    <Eye className="w-4 h-4 text-green-500" />
                  ) : (
                    <EyeOff className="w-4 h-4 text-gray-400" />
                  )}
                </div>
                <p className="text-sm text-gray-600 mb-2">{post.excerpt}</p>
                <div className="flex gap-4 text-xs text-gray-500">
                  <span>Slug: {post.slug}</span>
                  <span>Перегляди: {post.views}</span>
                  <span>Статус: {post.status}</span>
                </div>
              </div>
              <div className="flex gap-2">
                <Button size="sm" variant="outline" onClick={() => handleEdit(post)}>
                  <Edit className="w-4 h-4" />
                </Button>
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={() => {
                    if (confirm("Видалити цю статтю?")) {
                      deleteMutation.mutate({ id: post.id });
                    }
                  }}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}
