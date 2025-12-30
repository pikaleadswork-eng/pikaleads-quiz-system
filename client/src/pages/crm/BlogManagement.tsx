import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
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
import { toast } from "sonner";
import { Plus, Edit, Trash2, Eye, FileText } from "lucide-react";
import { RichTextEditor } from "@/components/RichTextEditor";

export default function BlogManagement() {
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingPost, setEditingPost] = useState<any>(null);
  const [showSeo, setShowSeo] = useState(false);

  const { data: posts, isLoading, refetch } = trpc.blog.listAll.useQuery({ limit: 50, offset: 0 });
  const { data: categories } = trpc.blog.getCategories.useQuery();

  const createMutation = trpc.blog.create.useMutation({
    onSuccess: () => {
      toast.success("Статтю створено!");
      setIsCreateOpen(false);
      refetch();
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const updateMutation = trpc.blog.update.useMutation({
    onSuccess: () => {
      toast.success("Статтю оновлено!");
      setEditingPost(null);
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
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    excerpt: "",
    content: "",
    coverImage: "",
    categoryId: undefined as number | undefined,
    status: "draft" as "draft" | "published" | "archived",
    seo: {
      metaTitle: "",
      metaDescription: "",
      keywords: "",
      ogImage: "",
      ogTitle: "",
      ogDescription: "",
    },
  });

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9а-яіїєґ]+/g, "-")
      .replace(/^-+|-+$/g, "");
  };

  const handleTitleChange = (title: string) => {
    setFormData((prev) => ({
      ...prev,
      title,
      slug: generateSlug(title),
    }));
  };

  const handleSubmit = () => {
    if (!formData.title || !formData.slug || !formData.excerpt || !formData.content) {
      toast.error("Заповніть всі обов'язкові поля");
      return;
    }

    if (editingPost) {
      updateMutation.mutate({
        id: editingPost.id,
        ...formData,
        categoryId: formData.categoryId || undefined,
      });
    } else {
      createMutation.mutate({
        ...formData,
        categoryId: formData.categoryId || undefined,
      });
    }
  };

  const handleEdit = (post: any) => {
    setEditingPost(post);
    setFormData({
      title: post.title,
      slug: post.slug,
      excerpt: post.excerpt,
      content: post.content,
      coverImage: post.coverImage || "",
      categoryId: post.categoryId || undefined,
      status: post.status,
      seo: post.seo || {
        metaTitle: "",
        metaDescription: "",
        keywords: "",
        ogImage: "",
        ogTitle: "",
        ogDescription: "",
      },
    });
  };

  const handleDelete = (id: number) => {
    if (confirm("Ви впевнені, що хочете видалити цю статтю?")) {
      deleteMutation.mutate({ id });
    }
  };

  const resetForm = () => {
    setFormData({
      title: "",
      slug: "",
      excerpt: "",
      content: "",
      coverImage: "",
      categoryId: undefined,
      status: "draft",
      seo: {
        metaTitle: "",
        metaDescription: "",
        keywords: "",
        ogImage: "",
        ogTitle: "",
        ogDescription: "",
      },
    });
    setEditingPost(null);
    setShowSeo(false);
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Управління блогом</h1>
          <p className="text-gray-400 mt-1">Створюйте та редагуйте статті для блогу</p>
        </div>
        <Dialog open={isCreateOpen || !!editingPost} onOpenChange={(open) => {
          if (!open) resetForm();
          setIsCreateOpen(open);
        }}>
          <DialogTrigger asChild>
            <Button className="bg-yellow-400 hover:bg-yellow-500 text-black">
              <Plus className="w-4 h-4 mr-2" />
              Створити статтю
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-zinc-900 border-zinc-800">
            <DialogHeader>
              <DialogTitle className="text-white">
                {editingPost ? "Редагувати статтю" : "Нова стаття"}
              </DialogTitle>
              <DialogDescription className="text-gray-400">
                Заповніть інформацію про статтю
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 mt-4">
              {/* Title */}
              <div>
                <Label htmlFor="title" className="text-white">Заголовок *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => handleTitleChange(e.target.value)}
                  className="bg-zinc-800 border-zinc-700 text-white mt-2"
                  placeholder="Введіть заголовок статті"
                />
              </div>

              {/* Slug */}
              <div>
                <Label htmlFor="slug" className="text-white">URL (slug) *</Label>
                <Input
                  id="slug"
                  value={formData.slug}
                  onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                  className="bg-zinc-800 border-zinc-700 text-white mt-2"
                  placeholder="url-statji"
                />
              </div>

              {/* Excerpt */}
              <div>
                <Label htmlFor="excerpt" className="text-white">Короткий опис *</Label>
                <Textarea
                  id="excerpt"
                  value={formData.excerpt}
                  onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                  className="bg-zinc-800 border-zinc-700 text-white mt-2"
                  placeholder="Короткий опис для картки статті"
                  rows={3}
                />
              </div>

              {/* Content - Rich Text Editor */}
              <div>
                <Label className="text-white">Контент *</Label>
                <div className="mt-2">
                  <RichTextEditor
                    content={formData.content}
                    onChange={(content: string) => setFormData({ ...formData, content })}
                  />
                </div>
              </div>

              {/* Cover Image */}
              <div>
                <Label htmlFor="coverImage" className="text-white">Обкладинка (URL)</Label>
                <Input
                  id="coverImage"
                  value={formData.coverImage}
                  onChange={(e) => setFormData({ ...formData, coverImage: e.target.value })}
                  className="bg-zinc-800 border-zinc-700 text-white mt-2"
                  placeholder="https://example.com/image.jpg"
                />
              </div>

              {/* Category */}
              <div>
                <Label htmlFor="category" className="text-white">Категорія</Label>
                <Select
                  value={formData.categoryId?.toString()}
                  onValueChange={(value) => setFormData({ ...formData, categoryId: parseInt(value) })}
                >
                  <SelectTrigger className="bg-zinc-800 border-zinc-700 text-white mt-2">
                    <SelectValue placeholder="Виберіть категорію" />
                  </SelectTrigger>
                  <SelectContent className="bg-zinc-800 border-zinc-700">
                    {categories?.map((cat) => (
                      <SelectItem key={cat.id} value={cat.id.toString()} className="text-white">
                        {cat.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Status */}
              <div>
                <Label htmlFor="status" className="text-white">Статус</Label>
                <Select
                  value={formData.status}
                  onValueChange={(value: any) => setFormData({ ...formData, status: value })}
                >
                  <SelectTrigger className="bg-zinc-800 border-zinc-700 text-white mt-2">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-zinc-800 border-zinc-700">
                    <SelectItem value="draft" className="text-white">Чернетка</SelectItem>
                    <SelectItem value="published" className="text-white">Опубліковано</SelectItem>
                    <SelectItem value="archived" className="text-white">Архів</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* SEO Settings Toggle */}
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowSeo(!showSeo)}
                className="w-full border-zinc-700 text-white hover:bg-zinc-800"
              >
                <FileText className="w-4 h-4 mr-2" />
                {showSeo ? "Сховати" : "Показати"} SEO налаштування
              </Button>

              {/* SEO Settings */}
              {showSeo && (
                <div className="space-y-4 p-4 bg-zinc-800/50 rounded-lg border border-zinc-700">
                  <h3 className="text-white font-semibold">SEO налаштування</h3>
                  
                  <div>
                    <Label htmlFor="metaTitle" className="text-white">Meta Title</Label>
                    <Input
                      id="metaTitle"
                      value={formData.seo.metaTitle}
                      onChange={(e) => setFormData({ ...formData, seo: { ...formData.seo, metaTitle: e.target.value } })}
                      className="bg-zinc-800 border-zinc-700 text-white mt-2"
                    />
                  </div>

                  <div>
                    <Label htmlFor="metaDescription" className="text-white">Meta Description</Label>
                    <Textarea
                      id="metaDescription"
                      value={formData.seo.metaDescription}
                      onChange={(e) => setFormData({ ...formData, seo: { ...formData.seo, metaDescription: e.target.value } })}
                      className="bg-zinc-800 border-zinc-700 text-white mt-2"
                      rows={3}
                    />
                  </div>

                  <div>
                    <Label htmlFor="keywords" className="text-white">Keywords (через кому)</Label>
                    <Input
                      id="keywords"
                      value={formData.seo.keywords}
                      onChange={(e) => setFormData({ ...formData, seo: { ...formData.seo, keywords: e.target.value } })}
                      className="bg-zinc-800 border-zinc-700 text-white mt-2"
                    />
                  </div>

                  <div>
                    <Label htmlFor="ogImage" className="text-white">OG Image URL</Label>
                    <Input
                      id="ogImage"
                      value={formData.seo.ogImage}
                      onChange={(e) => setFormData({ ...formData, seo: { ...formData.seo, ogImage: e.target.value } })}
                      className="bg-zinc-800 border-zinc-700 text-white mt-2"
                    />
                  </div>

                  <div>
                    <Label htmlFor="ogTitle" className="text-white">OG Title</Label>
                    <Input
                      id="ogTitle"
                      value={formData.seo.ogTitle}
                      onChange={(e) => setFormData({ ...formData, seo: { ...formData.seo, ogTitle: e.target.value } })}
                      className="bg-zinc-800 border-zinc-700 text-white mt-2"
                    />
                  </div>

                  <div>
                    <Label htmlFor="ogDescription" className="text-white">OG Description</Label>
                    <Textarea
                      id="ogDescription"
                      value={formData.seo.ogDescription}
                      onChange={(e) => setFormData({ ...formData, seo: { ...formData.seo, ogDescription: e.target.value } })}
                      className="bg-zinc-800 border-zinc-700 text-white mt-2"
                      rows={3}
                    />
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="flex gap-2 justify-end pt-4">
                <Button
                  variant="outline"
                  onClick={resetForm}
                  className="border-zinc-700 text-white hover:bg-zinc-800"
                >
                  Скасувати
                </Button>
                <Button
                  onClick={handleSubmit}
                  disabled={createMutation.isPending || updateMutation.isPending}
                  className="bg-yellow-400 hover:bg-yellow-500 text-black"
                >
                  {editingPost ? "Зберегти" : "Створити"}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Posts Table */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-lg overflow-hidden">
        <table className="w-full">
          <thead className="bg-zinc-800 border-b border-zinc-700">
            <tr>
              <th className="text-left p-4 text-white font-semibold">Заголовок</th>
              <th className="text-left p-4 text-white font-semibold">Статус</th>
              <th className="text-left p-4 text-white font-semibold">Перегляди</th>
              <th className="text-left p-4 text-white font-semibold">Дата</th>
              <th className="text-right p-4 text-white font-semibold">Дії</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan={5} className="text-center p-8 text-gray-400">
                  Завантаження...
                </td>
              </tr>
            ) : posts && posts.length > 0 ? (
              posts.map((post) => (
                <tr key={post.id} className="border-b border-zinc-800 hover:bg-zinc-800/50">
                  <td className="p-4 text-white">{post.title}</td>
                  <td className="p-4">
                    <span
                      className={`px-2 py-1 rounded text-xs font-semibold ${
                        post.status === "published"
                          ? "bg-green-500/20 text-green-400"
                          : post.status === "draft"
                          ? "bg-yellow-500/20 text-yellow-400"
                          : "bg-gray-500/20 text-gray-400"
                      }`}
                    >
                      {post.status === "published" ? "Опубліковано" : post.status === "draft" ? "Чернетка" : "Архів"}
                    </span>
                  </td>
                  <td className="p-4 text-gray-400">{post.views || 0}</td>
                  <td className="p-4 text-gray-400">
                    {post.publishedAt ? new Date(post.publishedAt).toLocaleDateString("uk-UA") : "-"}
                  </td>
                  <td className="p-4">
                    <div className="flex gap-2 justify-end">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => window.open(`/blog/${post.slug}`, "_blank")}
                        className="border-zinc-700 text-white hover:bg-zinc-800"
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleEdit(post)}
                        className="border-zinc-700 text-white hover:bg-zinc-800"
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleDelete(post.id)}
                        className="border-red-700 text-red-400 hover:bg-red-900/20"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="text-center p-8 text-gray-400">
                  Статей поки немає. Створіть першу!
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
