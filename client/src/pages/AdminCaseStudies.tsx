import { useState } from "react";
import { trpc } from "@/lib/trpc";
import DashboardLayout from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus, Edit, Trash2, Eye, EyeOff, Save, X } from "lucide-react";
import { toast } from "sonner";
import { useLanguage } from "@/contexts/LanguageContext";

export default function AdminCaseStudies() {
  const { language } = useLanguage();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    client: "",
    industry: "",
    description: "",
    content: "",
    coverImage: "",
    results: JSON.stringify({ roi: "", leads: "", roas: "", cpl: "" }, null, 2),
    tags: JSON.stringify(["Meta Ads"], null, 2),
    isPublished: false,
    orderIndex: 0,
  });

  const { data: caseStudies, refetch } = trpc.caseStudies.getAll.useQuery({
    includeUnpublished: true,
  });

  const createMutation = trpc.caseStudies.create.useMutation({
    onSuccess: () => {
      toast.success(t.created);
      setIsDialogOpen(false);
      resetForm();
      refetch();
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const updateMutation = trpc.caseStudies.update.useMutation({
    onSuccess: () => {
      toast.success(t.updated);
      setIsDialogOpen(false);
      resetForm();
      refetch();
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const deleteMutation = trpc.caseStudies.delete.useMutation({
    onSuccess: () => {
      toast.success(t.deleted);
      refetch();
    },
  });

  const resetForm = () => {
    setFormData({
      title: "",
      slug: "",
      client: "",
      industry: "",
      description: "",
      content: "",
      coverImage: "",
      results: JSON.stringify({ roi: "", leads: "", roas: "", cpl: "" }, null, 2),
      tags: JSON.stringify(["Meta Ads"], null, 2),
      isPublished: false,
      orderIndex: 0,
    });
    setEditingId(null);
  };

  const handleEdit = (caseStudy: any) => {
    setEditingId(caseStudy.id);
    setFormData({
      title: caseStudy.title,
      slug: caseStudy.slug,
      client: caseStudy.client,
      industry: caseStudy.industry || "",
      description: caseStudy.description,
      content: caseStudy.content,
      coverImage: caseStudy.coverImage || "",
      results: caseStudy.results || JSON.stringify({ roi: "", leads: "", roas: "", cpl: "" }, null, 2),
      tags: caseStudy.tags || JSON.stringify(["Meta Ads"], null, 2),
      isPublished: caseStudy.isPublished,
      orderIndex: caseStudy.orderIndex,
    });
    setIsDialogOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Generate slug from title if empty
    const slug = formData.slug || formData.title.toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');

    const data = {
      ...formData,
      slug,
    };

    if (editingId) {
      updateMutation.mutate({ id: editingId, ...data });
    } else {
      createMutation.mutate(data);
    }
  };

  const handleDelete = (id: number) => {
    if (confirm(t.confirmDelete)) {
      deleteMutation.mutate({ id });
    }
  };

  const togglePublish = (caseStudy: any) => {
    updateMutation.mutate({
      id: caseStudy.id,
      isPublished: !caseStudy.isPublished,
    });
  };

  const content = {
    uk: {
      title: "Управління кейсами",
      addNew: "Додати кейс",
      edit: "Редагувати",
      delete: "Видалити",
      publish: "Опублікувати",
      unpublish: "Зняти з публікації",
      created: "Кейс створено",
      updated: "Кейс оновлено",
      deleted: "Кейс видалено",
      confirmDelete: "Ви впевнені, що хочете видалити цей кейс?",
      formTitle: "Назва кейсу",
      formSlug: "URL (slug)",
      formClient: "Клієнт",
      formIndustry: "Індустрія/Ніша",
      formDescription: "Короткий опис",
      formContent: "Повний опис кейсу (HTML/Markdown)",
      formCoverImage: "URL обкладинки",
      formResults: "Результати (JSON)",
      formTags: "Теги (JSON array)",
      formPublished: "Опубліковано",
      formOrder: "Порядок відображення",
      save: "Зберегти",
      cancel: "Скасувати",
      published: "Опубліковано",
      draft: "Чернетка",
      views: "переглядів",
      noData: "Немає кейсів. Створіть перший!",
      resultsHelp: "Приклад: {\"roi\": \"300%\", \"leads\": \"500+\", \"roas\": \"5.2x\", \"cpl\": \"$2.5\"}",
      tagsHelp: "Приклад: [\"Meta Ads\", \"E-commerce\", \"ROAS 5x\"]",
    },
    en: {
      title: "Case Studies Management",
      addNew: "Add Case Study",
      edit: "Edit",
      delete: "Delete",
      publish: "Publish",
      unpublish: "Unpublish",
      created: "Case study created",
      updated: "Case study updated",
      deleted: "Case study deleted",
      confirmDelete: "Are you sure you want to delete this case study?",
      formTitle: "Case Study Title",
      formSlug: "URL (slug)",
      formClient: "Client",
      formIndustry: "Industry/Niche",
      formDescription: "Short Description",
      formContent: "Full Case Study Content (HTML/Markdown)",
      formCoverImage: "Cover Image URL",
      formResults: "Results (JSON)",
      formTags: "Tags (JSON array)",
      formPublished: "Published",
      formOrder: "Display Order",
      save: "Save",
      cancel: "Cancel",
      published: "Published",
      draft: "Draft",
      views: "views",
      noData: "No case studies. Create the first one!",
      resultsHelp: "Example: {\"roi\": \"300%\", \"leads\": \"500+\", \"roas\": \"5.2x\", \"cpl\": \"$2.5\"}",
      tagsHelp: "Example: [\"Meta Ads\", \"E-commerce\", \"ROAS 5x\"]",
    },
    ru: {
      title: "Управление кейсами",
      addNew: "Добавить кейс",
      edit: "Редактировать",
      delete: "Удалить",
      publish: "Опубликовать",
      unpublish: "Снять с публикации",
      created: "Кейс создан",
      updated: "Кейс обновлен",
      deleted: "Кейс удален",
      confirmDelete: "Вы уверены, что хотите удалить этот кейс?",
      formTitle: "Название кейса",
      formSlug: "URL (slug)",
      formClient: "Клиент",
      formIndustry: "Индустрия/Ниша",
      formDescription: "Краткое описание",
      formContent: "Полное описание кейса (HTML/Markdown)",
      formCoverImage: "URL обложки",
      formResults: "Результаты (JSON)",
      formTags: "Теги (JSON array)",
      formPublished: "Опубликовано",
      formOrder: "Порядок отображения",
      save: "Сохранить",
      cancel: "Отменить",
      published: "Опубликовано",
      draft: "Черновик",
      views: "просмотров",
      noData: "Нет кейсов. Создайте первый!",
      resultsHelp: "Пример: {\"roi\": \"300%\", \"leads\": \"500+\", \"roas\": \"5.2x\", \"cpl\": \"$2.5\"}",
      tagsHelp: "Пример: [\"Meta Ads\", \"E-commerce\", \"ROAS 5x\"]",
    },
  };

  const t = content[language as keyof typeof content] || content.uk;

  return (
    <DashboardLayout>
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-yellow-400">{t.title}</h1>
          <Dialog open={isDialogOpen} onOpenChange={(open) => {
            setIsDialogOpen(open);
            if (!open) resetForm();
          }}>
            <DialogTrigger asChild>
              <Button className="bg-yellow-400 hover:bg-yellow-500 text-black">
                <Plus className="w-4 h-4 mr-2" />
                {t.addNew}
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-zinc-900 text-white border-yellow-500/20">
              <DialogHeader>
                <DialogTitle className="text-yellow-400">
                  {editingId ? t.edit : t.addNew}
                </DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">{t.formTitle} *</label>
                    <Input
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      required
                      className="bg-zinc-800 border-zinc-700"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">{t.formSlug}</label>
                    <Input
                      value={formData.slug}
                      onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                      placeholder="auto-generated"
                      className="bg-zinc-800 border-zinc-700"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">{t.formClient} *</label>
                    <Input
                      value={formData.client}
                      onChange={(e) => setFormData({ ...formData, client: e.target.value })}
                      required
                      className="bg-zinc-800 border-zinc-700"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">{t.formIndustry}</label>
                    <Input
                      value={formData.industry}
                      onChange={(e) => setFormData({ ...formData, industry: e.target.value })}
                      className="bg-zinc-800 border-zinc-700"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">{t.formDescription} *</label>
                  <Textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    required
                    rows={3}
                    className="bg-zinc-800 border-zinc-700"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">{t.formContent} *</label>
                  <Textarea
                    value={formData.content}
                    onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                    required
                    rows={10}
                    className="bg-zinc-800 border-zinc-700 font-mono text-sm"
                    placeholder="<h2>Про клієнта</h2><p>...</p>"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">{t.formCoverImage}</label>
                  <Input
                    value={formData.coverImage}
                    onChange={(e) => setFormData({ ...formData, coverImage: e.target.value })}
                    placeholder="https://example.com/image.jpg"
                    className="bg-zinc-800 border-zinc-700"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">{t.formResults}</label>
                  <Textarea
                    value={formData.results}
                    onChange={(e) => setFormData({ ...formData, results: e.target.value })}
                    rows={4}
                    className="bg-zinc-800 border-zinc-700 font-mono text-sm"
                  />
                  <p className="text-xs text-zinc-500 mt-1">{t.resultsHelp}</p>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">{t.formTags}</label>
                  <Textarea
                    value={formData.tags}
                    onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                    rows={2}
                    className="bg-zinc-800 border-zinc-700 font-mono text-sm"
                  />
                  <p className="text-xs text-zinc-500 mt-1">{t.tagsHelp}</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={formData.isPublished}
                        onChange={(e) => setFormData({ ...formData, isPublished: e.target.checked })}
                        className="rounded"
                      />
                      <span className="text-sm">{t.formPublished}</span>
                    </label>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">{t.formOrder}</label>
                    <Input
                      type="number"
                      value={formData.orderIndex}
                      onChange={(e) => setFormData({ ...formData, orderIndex: parseInt(e.target.value) })}
                      className="bg-zinc-800 border-zinc-700"
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setIsDialogOpen(false);
                      resetForm();
                    }}
                  >
                    <X className="w-4 h-4 mr-2" />
                    {t.cancel}
                  </Button>
                  <Button
                    type="submit"
                    className="bg-yellow-400 hover:bg-yellow-500 text-black"
                    disabled={createMutation.isPending || updateMutation.isPending}
                  >
                    <Save className="w-4 h-4 mr-2" />
                    {t.save}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {!caseStudies || caseStudies.length === 0 ? (
          <div className="text-center py-12 text-zinc-500">
            {t.noData}
          </div>
        ) : (
          <div className="grid gap-4">
            {caseStudies.map((caseStudy) => (
              <div
                key={caseStudy.id}
                className="bg-zinc-900 border border-zinc-800 rounded-lg p-6 hover:border-yellow-500/30 transition-colors"
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-xl font-bold text-white">{caseStudy.title}</h3>
                      <span className={`px-2 py-1 text-xs rounded ${
                        caseStudy.isPublished
                          ? 'bg-green-500/20 text-green-400'
                          : 'bg-zinc-700 text-zinc-400'
                      }`}>
                        {caseStudy.isPublished ? t.published : t.draft}
                      </span>
                    </div>
                    <p className="text-zinc-400 mb-2">{caseStudy.client} • {caseStudy.industry}</p>
                    <p className="text-zinc-500 text-sm mb-3">{caseStudy.description}</p>
                    <div className="flex items-center gap-4 text-sm text-zinc-500">
                      <span>{caseStudy.viewCount} {t.views}</span>
                      <span>Order: {caseStudy.orderIndex}</span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => togglePublish(caseStudy)}
                      disabled={updateMutation.isPending}
                    >
                      {caseStudy.isPublished ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleEdit(caseStudy)}
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleDelete(caseStudy.id)}
                      disabled={deleteMutation.isPending}
                      className="text-red-400 hover:text-red-300"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
