import { useState, useMemo } from "react";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Plus, Edit, Trash2, Eye, FileText, Image as ImageIcon } from "lucide-react";
import { toast } from "sonner";
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

export default function AdminCaseStudies() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingCase, setEditingCase] = useState<any>(null);
  const [previewMode, setPreviewMode] = useState(false);
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
    { id: "home", label: "Головна", icon: "🏠" },
    { id: "meta-ads", label: "Meta Ads", icon: "📱" },
    { id: "facebook-ads", label: "Facebook Ads", icon: "👍" },
    { id: "google-ads", label: "Google Ads", icon: "🔍" },
    { id: "tiktok-ads", label: "TikTok Ads", icon: "🎵" },
    { id: "youtube-ads", label: "YouTube Ads", icon: "📺" },
    { id: "seo", label: "SEO", icon: "🎯" },
    { id: "crm", label: "CRM", icon: "📊" },
  ];

  const quillModules = useMemo(() => ({
    toolbar: [
      [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ 'list': 'ordered'}, { 'list': 'bullet' }],
      [{ 'color': [] }, { 'background': [] }],
      ['blockquote', 'code-block'],
      ['link', 'image'],
      ['clean']
    ],
  }), []);

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
    setPreviewMode(false);
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

  const getVisiblePages = (pageVisibility: string) => {
    try {
      const pages = JSON.parse(pageVisibility);
      return availablePages
        .filter(p => pages.includes(p.id))
        .map(p => p.label)
        .join(", ");
    } catch {
      return "Немає";
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
          <Dialog open={dialogOpen} onOpenChange={(open) => { setDialogOpen(open); if (!open) resetForm(); }}>
            <DialogTrigger asChild>
              <Button onClick={resetForm} className="bg-cyan-500 hover:bg-cyan-600">
                <Plus className="mr-2 h-4 w-4" />
                Додати кейс
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-zinc-800 text-white max-w-6xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <div className="flex items-center justify-between">
                  <DialogTitle>{editingCase ? "Редагувати кейс" : "Новий кейс"}</DialogTitle>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setPreviewMode(!previewMode)}
                    className="bg-zinc-700 border-zinc-600"
                  >
                    <Eye className="mr-2 h-4 w-4" />
                    {previewMode ? "Редагувати" : "Попередній перегляд"}
                  </Button>
                </div>
              </DialogHeader>

              {previewMode ? (
                <div className="prose prose-invert max-w-none p-6 bg-zinc-900 rounded-lg">
                  {formData.coverImage && (
                    <img src={formData.coverImage} alt={formData.title} className="w-full h-64 object-cover rounded-lg mb-6" />
                  )}
                  <h1 className="text-4xl font-bold text-white mb-2">{formData.title || "Назва кейсу"}</h1>
                  <p className="text-gray-400 mb-4">{formData.client} • {formData.industry}</p>
                  <p className="text-lg text-gray-300 mb-6">{formData.description}</p>
                  <div className="border-t border-zinc-700 pt-6" dangerouslySetInnerHTML={{ __html: formData.content }} />
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Basic Info */}
                  <div className="bg-zinc-900/50 p-4 rounded-lg space-y-4">
                    <h3 className="text-lg font-semibold text-cyan-400 flex items-center gap-2">
                      <FileText className="h-5 w-5" />
                      Основна інформація
                    </h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label>Назва кейсу *</Label>
                        <Input
                          value={formData.title}
                          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                          required
                          placeholder="E-com в Україні"
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

                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <Label>Клієнт *</Label>
                        <Input
                          value={formData.client}
                          onChange={(e) => setFormData({ ...formData, client: e.target.value })}
                          required
                          placeholder="Назва компанії"
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
                      <div>
                        <Label>Автор</Label>
                        <Input
                          value={formData.author}
                          onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                          placeholder="Roman Hrybuk"
                          className="bg-zinc-700 border-zinc-600"
                        />
                      </div>
                    </div>

                    <div>
                      <Label>Короткий опис *</Label>
                      <Textarea
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        required
                        rows={3}
                        placeholder="Короткий опис кейсу для карток і превью"
                        className="bg-zinc-700 border-zinc-600"
                      />
                    </div>
                  </div>

                  {/* Content Editor */}
                  <div className="bg-zinc-900/50 p-4 rounded-lg space-y-4">
                    <h3 className="text-lg font-semibold text-cyan-400">Повний контент</h3>
                    <div className="bg-white rounded-lg">
                      <ReactQuill
                        theme="snow"
                        value={formData.content}
                        onChange={(value: string) => setFormData({ ...formData, content: value })}
                        modules={quillModules}
                        className="h-96"
                      />
                    </div>
                  </div>

                  {/* Media & Metadata */}
                  <div className="bg-zinc-900/50 p-4 rounded-lg space-y-4">
                    <h3 className="text-lg font-semibold text-cyan-400 flex items-center gap-2">
                      <ImageIcon className="h-5 w-5" />
                      Медіа та метадані
                    </h3>
                    <div>
                      <Label>URL обкладинки</Label>
                      <Input
                        value={formData.coverImage}
                        onChange={(e) => setFormData({ ...formData, coverImage: e.target.value })}
                        placeholder="https://..."
                        className="bg-zinc-700 border-zinc-600"
                      />
                      {formData.coverImage && (
                        <img src={formData.coverImage} alt="Preview" className="mt-2 w-full h-32 object-cover rounded" />
                      )}
                    </div>

                    <div className="grid grid-cols-2 gap-4">
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
                          rows={4}
                          placeholder='["Meta Ads", "E-commerce", "ROAS 5x"]'
                          className="bg-zinc-700 border-zinc-600 font-mono text-sm"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Page Visibility */}
                  <div className="bg-zinc-900/50 p-4 rounded-lg space-y-4">
                    <h3 className="text-lg font-semibold text-cyan-400">Відображення на сторінках</h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      {availablePages.map((page) => (
                        <div
                          key={page.id}
                          className={`flex items-center space-x-2 p-3 rounded-lg border transition-all cursor-pointer ${
                            isPageSelected(page.id)
                              ? 'bg-cyan-500/20 border-cyan-500'
                              : 'bg-zinc-800 border-zinc-700 hover:border-zinc-600'
                          }`}
                          onClick={() => togglePageVisibility(page.id)}
                        >
                          <Checkbox
                            id={`page-${page.id}`}
                            checked={isPageSelected(page.id)}
                            onCheckedChange={() => togglePageVisibility(page.id)}
                            className="border-zinc-600"
                          />
                          <Label htmlFor={`page-${page.id}`} className="cursor-pointer flex items-center gap-2">
                            <span>{page.icon}</span>
                            <span>{page.label}</span>
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Publishing Options */}
                  <div className="bg-zinc-900/50 p-4 rounded-lg space-y-4">
                    <h3 className="text-lg font-semibold text-cyan-400">Налаштування публікації</h3>
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
                      <div className="flex items-center space-x-2 pt-6">
                        <Checkbox
                          id="published"
                          checked={formData.isPublished}
                          onCheckedChange={(checked) => setFormData({ ...formData, isPublished: checked as boolean })}
                          className="border-zinc-600"
                        />
                        <Label htmlFor="published" className="cursor-pointer">
                          Опублікувати кейс
                        </Label>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end gap-3 pt-4 border-t border-zinc-700">
                    <Button type="button" variant="outline" onClick={() => setDialogOpen(false)} className="bg-zinc-700 border-zinc-600">
                      Скасувати
                    </Button>
                    <Button type="submit" className="bg-cyan-500 hover:bg-cyan-600">
                      {editingCase ? "Оновити кейс" : "Створити кейс"}
                    </Button>
                  </div>
                </form>
              )}
            </DialogContent>
          </Dialog>
        </div>

        {/* Case Studies List */}
        <div className="grid gap-4">
          {caseStudies?.map((caseStudy: any) => (
            <div key={caseStudy.id} className="bg-zinc-800 rounded-lg p-6 border border-zinc-700 hover:border-cyan-500/50 transition-all">
              <div className="flex items-start gap-4">
                {caseStudy.coverImage && (
                  <img src={caseStudy.coverImage} alt={caseStudy.title} className="w-32 h-32 object-cover rounded-lg" />
                )}
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h3 className="text-xl font-bold text-white mb-1">{caseStudy.title}</h3>
                      <p className="text-sm text-gray-400">{caseStudy.client} • {caseStudy.industry}</p>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEdit(caseStudy)}
                        className="bg-zinc-700 border-zinc-600"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDelete(caseStudy.id)}
                        className="bg-red-900/20 border-red-800 hover:bg-red-900/40"
                      >
                        <Trash2 className="h-4 w-4 text-red-400" />
                      </Button>
                    </div>
                  </div>
                  <p className="text-gray-300 mb-3">{caseStudy.description}</p>
                  <div className="flex items-center gap-4 text-sm">
                    <span className={`px-2 py-1 rounded ${caseStudy.isPublished ? 'bg-green-900/30 text-green-400' : 'bg-gray-700 text-gray-400'}`}>
                      {caseStudy.isPublished ? '✓ Опубліковано' : '○ Чернетка'}
                    </span>
                    <span className="text-gray-500">Сторінки: {getVisiblePages(caseStudy.pageVisibility)}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
          {!caseStudies || caseStudies.length === 0 && (
            <div className="text-center py-12 text-gray-500">
              <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>Немає кейсів. Додайте перший кейс!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
