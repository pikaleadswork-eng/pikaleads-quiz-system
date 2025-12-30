import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Plus, Edit, Trash2, Eye, EyeOff, FileText } from "lucide-react";
import { toast } from "sonner";

export default function AdminCaseStudies() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingCase, setEditingCase] = useState<any>(null);
  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    client: "",
    industry: "",
    description: "",
    content: "",
    coverImage: "",
    results: "{}",
    tags: "[]",
    pageVisibility: "[]",
    author: "",
    isPublished: false,
    orderIndex: 0,
  });

  const { data: caseStudies, refetch } = trpc.caseStudies.getAll.useQuery({});
  const createMutation = trpc.caseStudies.create.useMutation();
  const updateMutation = trpc.caseStudies.update.useMutation();
  const deleteMutation = trpc.caseStudies.delete.useMutation();

  const availablePages = [
    { id: "home", label: "Головна" },
    { id: "quiz", label: "Квіз" },
    { id: "facebook-ads", label: "Facebook Ads" },
    { id: "google-ads", label: "Google Ads" },
    { id: "tiktok-ads", label: "TikTok Ads" },
    { id: "youtube-ads", label: "YouTube Ads" },
    { id: "seo", label: "SEO" },
    { id: "crm", label: "CRM" },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const dataToSubmit = {
        ...formData,
        isPublished: formData.isPublished ? true : false,
      };

      if (editingCase) {
        await updateMutation.mutateAsync({
          id: editingCase.id,
          ...dataToSubmit,
        });
        toast.success("Кейс оновлено!");
      } else {
        await createMutation.mutateAsync(dataToSubmit);
        toast.success("Кейс додано!");
      }
      
      refetch();
      setDialogOpen(false);
      resetForm();
    } catch (error) {
      toast.error("Помилка при збереженні");
    }
  };

  const handleEdit = (caseStudy: any) => {
    setEditingCase(caseStudy);
    setFormData({
      title: caseStudy.title,
      slug: caseStudy.slug,
      client: caseStudy.client,
      industry: caseStudy.industry || "",
      description: caseStudy.description,
      content: caseStudy.content,
      coverImage: caseStudy.coverImage || "",
      results: caseStudy.results || "{}",
      tags: caseStudy.tags || "[]",
      pageVisibility: caseStudy.pageVisibility || "[]",
      author: caseStudy.author || "",
      isPublished: caseStudy.isPublished,
      orderIndex: caseStudy.orderIndex,
    });
    setDialogOpen(true);
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Видалити цей кейс?")) return;
    
    try {
      await deleteMutation.mutateAsync({ id });
      toast.success("Кейс видалено!");
      refetch();
    } catch (error) {
      toast.error("Помилка при видаленні");
    }
  };

  const resetForm = () => {
    setEditingCase(null);
    setFormData({
      title: "",
      slug: "",
      client: "",
      industry: "",
      description: "",
      content: "",
      coverImage: "",
      results: "{}",
      tags: "[]",
      pageVisibility: "[]",
      author: "",
      isPublished: false,
      orderIndex: 0,
    });
  };

  const togglePageVisibility = (pageId: string) => {
    try {
      const currentPages = JSON.parse(formData.pageVisibility);
      const newPages = currentPages.includes(pageId)
        ? currentPages.filter((p: string) => p !== pageId)
        : [...currentPages, pageId];
      setFormData({ ...formData, pageVisibility: JSON.stringify(newPages) });
    } catch {
      setFormData({ ...formData, pageVisibility: JSON.stringify([pageId]) });
    }
  };

  const isPageSelected = (pageId: string) => {
    try {
      const pages = JSON.parse(formData.pageVisibility);
      return pages.includes(pageId);
    } catch {
      return false;
    }
  };

  return (
    <div className="p-6 bg-zinc-900 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Кейси</h1>
            <p className="text-gray-400">Управління портфоліо успішних проектів</p>
          </div>
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={resetForm} className="bg-cyan-500 hover:bg-cyan-600">
                <Plus className="mr-2 h-4 w-4" />
                Додати кейс
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-zinc-800 text-white max-w-4xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>{editingCase ? "Редагувати кейс" : "Новий кейс"}</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Назва кейсу *</Label>
                    <Input
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      required
                      className="bg-zinc-700 border-zinc-600"
                    />
                  </div>
                  <div>
                    <Label>Slug (URL) *</Label>
                    <Input
                      value={formData.slug}
                      onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                      required
                      placeholder="e-com-v-ukraini"
                      className="bg-zinc-700 border-zinc-600"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Клієнт *</Label>
                    <Input
                      value={formData.client}
                      onChange={(e) => setFormData({ ...formData, client: e.target.value })}
                      required
                      className="bg-zinc-700 border-zinc-600"
                    />
                  </div>
                  <div>
                    <Label>Індустрія</Label>
                    <Input
                      value={formData.industry}
                      onChange={(e) => setFormData({ ...formData, industry: e.target.value })}
                      placeholder="E-commerce, Інфобізнес"
                      className="bg-zinc-700 border-zinc-600"
                    />
                  </div>
                </div>

                <div>
                  <Label>Автор</Label>
                  <Input
                    value={formData.author}
                    onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                    placeholder="Roman Hrybuk"
                    className="bg-zinc-700 border-zinc-600"
                  />
                </div>

                <div>
                  <Label>Короткий опис *</Label>
                  <Textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    required
                    rows={3}
                    className="bg-zinc-700 border-zinc-600"
                  />
                </div>

                <div>
                  <Label>Повний контент (Markdown) *</Label>
                  <Textarea
                    value={formData.content}
                    onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                    required
                    rows={10}
                    className="bg-zinc-700 border-zinc-600 font-mono text-sm"
                  />
                </div>

                <div>
                  <Label>URL обкладинки</Label>
                  <Input
                    value={formData.coverImage}
                    onChange={(e) => setFormData({ ...formData, coverImage: e.target.value })}
                    placeholder="https://..."
                    className="bg-zinc-700 border-zinc-600"
                  />
                </div>

                <div>
                  <Label>Результати (JSON)</Label>
                  <Textarea
                    value={formData.results}
                    onChange={(e) => setFormData({ ...formData, results: e.target.value })}
                    rows={4}
                    placeholder='{"budget": "1,890,561$", "leads": "30,124", "roas": "2.67"}'
                    className="bg-zinc-700 border-zinc-600 font-mono text-sm"
                  />
                </div>

                <div>
                  <Label>Теги (JSON Array)</Label>
                  <Textarea
                    value={formData.tags}
                    onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                    rows={2}
                    placeholder='["Meta Ads", "E-commerce", "ROAS 5x"]'
                    className="bg-zinc-700 border-zinc-600 font-mono text-sm"
                  />
                </div>

                <div>
                  <Label className="mb-3 block">Відображати на сторінках:</Label>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {availablePages.map((page) => (
                      <div key={page.id} className="flex items-center space-x-2">
                        <Checkbox
                          id={`page-${page.id}`}
                          checked={isPageSelected(page.id)}
                          onCheckedChange={() => togglePageVisibility(page.id)}
                          className="border-zinc-600"
                        />
                        <Label htmlFor={`page-${page.id}`} className="cursor-pointer">
                          {page.label}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Порядок відображення</Label>
                    <Input
                      type="number"
                      value={formData.orderIndex}
                      onChange={(e) => setFormData({ ...formData, orderIndex: parseInt(e.target.value) || 0 })}
                      className="bg-zinc-700 border-zinc-600"
                    />
                  </div>
                  <div className="flex items-center space-x-2 pt-7">
                    <Checkbox
                      id="isPublished"
                      checked={formData.isPublished}
                      onCheckedChange={(checked) => setFormData({ ...formData, isPublished: checked as boolean })}
                      className="border-zinc-600"
                    />
                    <Label htmlFor="isPublished" className="cursor-pointer">
                      Опубліковано
                    </Label>
                  </div>
                </div>

                <div className="flex gap-2 pt-4">
                  <Button type="submit" className="bg-cyan-500 hover:bg-cyan-600">
                    {editingCase ? "Оновити" : "Створити"}
                  </Button>
                  <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
                    Скасувати
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        <div className="grid gap-4">
          {caseStudies?.map((caseStudy: any) => {
            let pages: string[] = [];
            try {
              pages = JSON.parse(caseStudy.pageVisibility || "[]");
            } catch {}

            return (
              <div key={caseStudy.id} className="bg-zinc-800 rounded-lg p-6 border border-zinc-700">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-xl font-bold text-white">{caseStudy.title}</h3>
                      {caseStudy.isPublished ? (
                        <span className="px-2 py-1 bg-green-500/20 text-green-400 text-xs rounded">
                          <Eye className="inline h-3 w-3 mr-1" />
                          Опубліковано
                        </span>
                      ) : (
                        <span className="px-2 py-1 bg-gray-500/20 text-gray-400 text-xs rounded">
                          <EyeOff className="inline h-3 w-3 mr-1" />
                          Чернетка
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-400 mb-2">
                      <strong>Клієнт:</strong> {caseStudy.client} | <strong>Індустрія:</strong> {caseStudy.industry || "—"}
                    </p>
                    <p className="text-gray-300 mb-3">{caseStudy.description}</p>
                    {caseStudy.author && (
                      <p className="text-sm text-cyan-400 mb-2">
                        <strong>Автор:</strong> {caseStudy.author}
                      </p>
                    )}
                    {pages.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {pages.map((pageId: string) => {
                          const page = availablePages.find(p => p.id === pageId);
                          return page ? (
                            <span key={pageId} className="px-2 py-1 bg-cyan-500/20 text-cyan-400 text-xs rounded">
                              {page.label}
                            </span>
                          ) : null;
                        })}
                      </div>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleEdit(caseStudy)}
                      className="border-zinc-600 hover:bg-zinc-700"
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleDelete(caseStudy.id)}
                      className="border-zinc-600 hover:bg-red-900/50 text-red-400"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            );
          })}

          {(!caseStudies || caseStudies.length === 0) && (
            <div className="text-center py-12 bg-zinc-800 rounded-lg border border-zinc-700">
              <FileText className="h-12 w-12 text-gray-600 mx-auto mb-3" />
              <p className="text-gray-400">Немає кейсів. Додайте перший!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
