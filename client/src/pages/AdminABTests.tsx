import { useState, useEffect } from "react";
import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { ArrowLeft, Plus, TrendingUp, TrendingDown, Play, Pause, Trash2, Copy, Edit, FlaskConical } from "lucide-react";
import { Link } from "wouter";
import { trpc } from "@/lib/trpc";
import { calculateStatisticalSignificance } from "@/lib/abTesting";
import { ConversionChart } from "@/components/ConversionChart";
import { VariantPreviewModal } from "@/components/VariantPreviewModal";

export default function AdminABTests() {
  const { user, loading } = useAuth();
  const [selectedQuizId, setSelectedQuizId] = useState<number | null>(null);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [variantName, setVariantName] = useState("");
  const [trafficPercentage, setTrafficPercentage] = useState(50);
  const [variantTitle, setVariantTitle] = useState("");
  const [variantSubtitle, setVariantSubtitle] = useState("");
  const [variantBonus, setVariantBonus] = useState("");
  const [dateRange, setDateRange] = useState<number>(30);
  const [previewVariant, setPreviewVariant] = useState<any>(null);

  // Fetch quizzes from database
  const { data: dbQuizzes, isLoading: quizzesLoading } = trpc.quizzes.list.useQuery();

  // Set first quiz as selected when loaded
  useEffect(() => {
    if (dbQuizzes && dbQuizzes.length > 0 && !selectedQuizId) {
      setSelectedQuizId(dbQuizzes[0].id);
    }
  }, [dbQuizzes, selectedQuizId]);

  const selectedQuiz = dbQuizzes?.find(q => q.id === selectedQuizId);

  const { data: testResults, refetch } = trpc.abTest.getTestResults.useQuery(
    { quizId: selectedQuiz?.slug || "" },
    { enabled: !!selectedQuiz?.slug }
  );

  const { data: variants, refetch: refetchVariants } = trpc.abTest.getVariants.useQuery(
    { quizId: selectedQuiz?.slug || "" },
    { enabled: !!selectedQuiz?.slug }
  );

  const { data: conversionTrends } = trpc.abTest.getConversionTrends.useQuery(
    { quizId: selectedQuiz?.slug || "", days: dateRange },
    { enabled: !!selectedQuiz?.slug }
  );

  const createVariantMutation = trpc.abTest.createVariant.useMutation({
    onSuccess: () => {
      toast.success("Варіант створено успішно!");
      setIsCreateDialogOpen(false);
      resetForm();
      refetch();
      refetchVariants();
    },
    onError: (error) => {
      toast.error(error.message || "Помилка створення варіанту");
    },
  });

  const toggleVariantMutation = trpc.abTest.toggleVariant.useMutation({
    onSuccess: () => {
      toast.success("Статус варіанту оновлено");
      refetchVariants();
    },
    onError: (error) => {
      toast.error(error.message || "Помилка оновлення");
    },
  });

  const deleteVariantMutation = trpc.abTest.deleteVariant.useMutation({
    onSuccess: () => {
      toast.success("Варіант видалено");
      refetch();
      refetchVariants();
    },
    onError: (error) => {
      toast.error(error.message || "Помилка видалення");
    },
  });

  const resetForm = () => {
    setVariantName("");
    setTrafficPercentage(50);
    setVariantTitle("");
    setVariantSubtitle("");
    setVariantBonus("");
  };

  if (loading || quizzesLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <p className="text-zinc-400">Завантаження...</p>
      </div>
    );
  }

  if (!user || user.role !== "admin") {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <Card className="p-8 max-w-md bg-zinc-900 border-zinc-800">
          <h1 className="text-2xl font-bold text-red-500 mb-4">Доступ заборонено</h1>
          <p className="text-zinc-400 mb-6">
            Вам потрібні права адміністратора для доступу до цієї сторінки.
          </p>
          <Link href="/">
            <Button>Повернутися на головну</Button>
          </Link>
        </Card>
      </div>
    );
  }

  const handleCreateVariant = () => {
    if (!variantName.trim()) {
      toast.error("Введіть назву варіанту");
      return;
    }

    if (!selectedQuiz) {
      toast.error("Оберіть квіз");
      return;
    }

    createVariantMutation.mutate({
      quizId: selectedQuiz.slug,
      variantName: variantName.trim(),
      trafficPercentage,
      title: variantTitle || undefined,
      subtitle: variantSubtitle || undefined,
    });
  };

  // Calculate statistical significance if we have control and variant
  let significance: ReturnType<typeof calculateStatisticalSignificance> | null = null;
  if (testResults && testResults.length >= 2) {
    const control = testResults[0];
    const variant = testResults[1];
    if (control && variant) {
      significance = calculateStatisticalSignificance(
        control.conversions,
        control.total,
        variant.conversions,
        variant.total
      );
    }
  }

  return (
    <div className="min-h-screen bg-black">
      {/* Header */}
      <header className="border-b border-zinc-800 bg-zinc-900">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/admin">
              <Button variant="ghost" size="sm" className="text-zinc-400 hover:text-white">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Назад
              </Button>
            </Link>
            <div className="flex items-center gap-2">
              <FlaskConical className="w-6 h-6 text-purple-500" />
              <h1 className="text-2xl font-bold text-white">A/B Тестування</h1>
            </div>
          </div>
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-purple-600 hover:bg-purple-700">
                <Plus className="w-4 h-4 mr-2" />
                Створити варіант
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-zinc-900 border-zinc-800">
              <DialogHeader>
                <DialogTitle className="text-white">Створити A/B варіант</DialogTitle>
                <DialogDescription className="text-zinc-400">
                  Створіть новий варіант для тестування проти контрольної версії
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div>
                  <Label htmlFor="variant-name" className="text-zinc-300 mb-2 block">Назва варіанту</Label>
                  <Input
                    id="variant-name"
                    value={variantName}
                    onChange={(e) => setVariantName(e.target.value)}
                    placeholder="напр., Новий заголовок, Синя кнопка"
                    className="bg-zinc-800 border-zinc-700 text-white"
                  />
                </div>
                <div>
                  <Label htmlFor="traffic" className="text-zinc-300 mb-2 block">Відсоток трафіку</Label>
                  <Input
                    id="traffic"
                    type="number"
                    min="0"
                    max="100"
                    value={trafficPercentage}
                    onChange={(e) => setTrafficPercentage(Number(e.target.value))}
                    className="bg-zinc-800 border-zinc-700 text-white"
                  />
                  <p className="text-sm text-zinc-500 mt-1">
                    Відсоток трафіку для цього варіанту
                  </p>
                </div>
                
                <div className="border-t border-zinc-700 pt-4">
                  <p className="text-sm text-zinc-400 mb-3">Контент варіанту (необов'язково)</p>
                  
                  <div className="space-y-3">
                    <div>
                      <Label htmlFor="variant-title" className="text-zinc-300 mb-2 block">Заголовок</Label>
                      <Input
                        id="variant-title"
                        value={variantTitle}
                        onChange={(e) => setVariantTitle(e.target.value)}
                        placeholder="Альтернативний заголовок квізу"
                        className="bg-zinc-800 border-zinc-700 text-white"
                      />
                    </div>
                    <div>
                      <Label htmlFor="variant-subtitle" className="text-zinc-300 mb-2 block">Підзаголовок</Label>
                      <Textarea
                        id="variant-subtitle"
                        value={variantSubtitle}
                        onChange={(e) => setVariantSubtitle(e.target.value)}
                        placeholder="Альтернативний підзаголовок"
                        className="bg-zinc-800 border-zinc-700 text-white"
                        rows={2}
                      />
                    </div>
                    <div>
                      <Label htmlFor="variant-bonus" className="text-zinc-300 mb-2 block">Бонус</Label>
                      <Input
                        id="variant-bonus"
                        value={variantBonus}
                        onChange={(e) => setVariantBonus(e.target.value)}
                        placeholder="Альтернативний бонус"
                        className="bg-zinc-800 border-zinc-700 text-white"
                      />
                    </div>
                  </div>
                </div>
              </div>
              <Button 
                onClick={handleCreateVariant} 
                disabled={createVariantMutation.isPending}
                className="w-full bg-purple-600 hover:bg-purple-700"
              >
                {createVariantMutation.isPending ? "Створення..." : "Створити варіант"}
              </Button>
            </DialogContent>
          </Dialog>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Quiz Selector */}
          <div className="lg:col-span-1">
            <Card className="p-4 bg-zinc-900 border-zinc-800">
              <h3 className="font-semibold text-white mb-4">Оберіть квіз</h3>
              <div className="space-y-2 max-h-[500px] overflow-y-auto">
                {dbQuizzes && dbQuizzes.length > 0 ? (
                  dbQuizzes.map((q) => (
                    <Button
                      key={q.id}
                      variant={selectedQuizId === q.id ? "default" : "ghost"}
                      className={`w-full justify-start text-sm text-left ${
                        selectedQuizId === q.id 
                          ? "bg-purple-600 hover:bg-purple-700 text-white" 
                          : "text-zinc-400 hover:text-white hover:bg-zinc-800"
                      }`}
                      onClick={() => setSelectedQuizId(q.id)}
                    >
                      <div className="truncate">
                        <span className="block truncate">{q.name}</span>
                        <span className="text-xs opacity-60">{q.platform}</span>
                      </div>
                    </Button>
                  ))
                ) : (
                  <p className="text-zinc-500 text-sm">Немає квізів</p>
                )}
              </div>
            </Card>
          </div>

          {/* Results */}
          <div className="lg:col-span-3 space-y-6">
            {/* Selected Quiz Info */}
            {selectedQuiz && (
              <Card className="bg-zinc-900 border-zinc-800">
                <CardHeader className="pb-2">
                  <CardTitle className="text-white flex items-center gap-2">
                    <FlaskConical className="w-5 h-5 text-purple-500" />
                    {selectedQuiz.name}
                  </CardTitle>
                  <CardDescription className="text-zinc-400">
                    Slug: {selectedQuiz.slug} • Платформа: {selectedQuiz.platform}
                  </CardDescription>
                </CardHeader>
              </Card>
            )}

            {/* Conversion Trends Chart */}
            {conversionTrends && conversionTrends.length > 0 && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-white">Динаміка конверсій</h3>
                  <Select value={dateRange.toString()} onValueChange={(v) => setDateRange(Number(v))}>
                    <SelectTrigger className="w-[180px] bg-zinc-800 border-zinc-700 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="7">Останні 7 днів</SelectItem>
                      <SelectItem value="14">Останні 14 днів</SelectItem>
                      <SelectItem value="30">Останні 30 днів</SelectItem>
                      <SelectItem value="60">Останні 60 днів</SelectItem>
                      <SelectItem value="90">Останні 90 днів</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <ConversionChart trends={conversionTrends} />
              </div>
            )}

            {/* Statistical Significance Card */}
            {significance && (
              <Card className="bg-zinc-900 border-zinc-800">
                <CardHeader>
                  <CardTitle className="text-white">Статистична значущість</CardTitle>
                  <CardDescription className="text-zinc-400">
                    Аналіз результатів тесту
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="text-center p-4 bg-zinc-800 rounded-lg">
                      <p className="text-sm text-zinc-400 mb-1">Приріст</p>
                      <p className="text-2xl font-bold flex items-center justify-center gap-2 text-white">
                        {significance.uplift > 0 ? (
                          <TrendingUp className="w-5 h-5 text-green-500" />
                        ) : (
                          <TrendingDown className="w-5 h-5 text-red-500" />
                        )}
                        {significance.uplift.toFixed(2)}%
                      </p>
                    </div>
                    <div className="text-center p-4 bg-zinc-800 rounded-lg">
                      <p className="text-sm text-zinc-400 mb-1">Рівень довіри</p>
                      <p className="text-2xl font-bold text-white">
                        {significance.confidenceLevel.toFixed(1)}%
                      </p>
                    </div>
                    <div className="text-center p-4 bg-zinc-800 rounded-lg">
                      <p className="text-sm text-zinc-400 mb-1">Статус</p>
                      <p className={`text-lg font-bold ${significance.isSignificant ? 'text-green-500' : 'text-yellow-500'}`}>
                        {significance.isSignificant ? "Значущий" : "Не значущий"}
                      </p>
                    </div>
                  </div>
                  {significance.isSignificant && (
                    <p className="text-sm text-zinc-400 mt-4 text-center">
                      ✅ Результати статистично значущі (p &lt; 0.05). Можна впевнено визначити переможця.
                    </p>
                  )}
                  {!significance.isSignificant && (
                    <p className="text-sm text-zinc-400 mt-4 text-center">
                      ⏳ Недостатньо даних. Продовжуйте тест для досягнення статистичної значущості.
                    </p>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Variants Management */}
            {variants && variants.length > 0 && (
              <Card className="bg-zinc-900 border-zinc-800">
                <CardHeader>
                  <CardTitle className="text-white">Варіанти тесту</CardTitle>
                  <CardDescription className="text-zinc-400">
                    Керування варіантами A/B тесту
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {variants.map((variant) => (
                      <div 
                        key={variant.id} 
                        className={`p-4 rounded-lg border ${
                          variant.isControl 
                            ? "bg-blue-900/20 border-blue-700" 
                            : "bg-zinc-800 border-zinc-700"
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-medium text-white">{variant.variantName}</span>
                              {variant.isControl ? (
                                <span className="text-xs px-2 py-0.5 bg-blue-600 text-white rounded">Контроль</span>
                              ) : null}
                              {variant.isWinner ? (
                                <span className="text-xs px-2 py-0.5 bg-green-600 text-white rounded">Переможець</span>
                              ) : null}
                              {!variant.isActive ? (
                                <span className="text-xs px-2 py-0.5 bg-zinc-600 text-zinc-300 rounded">Вимкнено</span>
                              ) : null}
                            </div>
                            <p className="text-sm text-zinc-400 mt-1">
                              Трафік: {variant.trafficPercentage}%
                              {variant.title && ` • Заголовок: ${variant.title.substring(0, 30)}...`}
                            </p>
                          </div>
                          <div className="flex items-center gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => setPreviewVariant(variant)}
                              className="text-purple-400 border-purple-600 hover:bg-purple-600 hover:text-white"
                            >
                              <Edit className="w-4 h-4 mr-1" />
                              Preview
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => toggleVariantMutation.mutate({ 
                                variantId: variant.id, 
                                isActive: variant.isActive ? 0 : 1 
                              })}
                              className="text-zinc-400 hover:text-white"
                            >
                              {variant.isActive ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                            </Button>
                            {!variant.isControl && (
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => {
                                  if (confirm("Видалити цей варіант?")) {
                                    deleteVariantMutation.mutate({ variantId: variant.id });
                                  }
                                }}
                                className="text-red-400 hover:text-red-300"
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Results Table */}
            <Card className="bg-zinc-900 border-zinc-800">
              <CardHeader>
                <CardTitle className="text-white">Результати варіантів</CardTitle>
                <CardDescription className="text-zinc-400">
                  {testResults?.length || 0} активних варіантів
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="rounded-md border border-zinc-800">
                  <Table>
                    <TableHeader>
                      <TableRow className="border-zinc-800">
                        <TableHead className="text-zinc-400">Варіант</TableHead>
                        <TableHead className="text-zinc-400">Перегляди</TableHead>
                        <TableHead className="text-zinc-400">Конверсії</TableHead>
                        <TableHead className="text-zinc-400">Конверсія %</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {testResults && testResults.length > 0 ? (
                        testResults.map((result) => (
                          <TableRow key={result.variantId} className="border-zinc-800">
                            <TableCell className="font-medium text-white">
                              {result.variantName}
                            </TableCell>
                            <TableCell className="text-zinc-300">{result.total}</TableCell>
                            <TableCell className="text-zinc-300">{result.conversions}</TableCell>
                            <TableCell className="font-bold text-purple-400">
                              {result.conversionRate.toFixed(2)}%
                            </TableCell>
                          </TableRow>
                        ))
                      ) : (
                        <TableRow className="border-zinc-800">
                          <TableCell colSpan={4} className="text-center text-zinc-500 py-8">
                            Немає даних тесту. Створіть варіант для початку тестування.
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>

            {/* Help Section */}
            <Card className="bg-zinc-900 border-zinc-800">
              <CardHeader>
                <CardTitle className="text-white">Як працює A/B тестування</CardTitle>
              </CardHeader>
              <CardContent className="text-zinc-400 space-y-3">
                <p>
                  <strong className="text-white">1. Створіть варіант:</strong> Кожен варіант може мати різний заголовок, підзаголовок або бонус.
                </p>
                <p>
                  <strong className="text-white">2. Розподіл трафіку:</strong> Вкажіть відсоток відвідувачів, які побачать кожен варіант.
                </p>
                <p>
                  <strong className="text-white">3. Збір даних:</strong> Система автоматично відстежує перегляди та конверсії.
                </p>
                <p>
                  <strong className="text-white">4. Статистична значущість:</strong> Коли p-value &lt; 0.05, результати вважаються статистично значущими.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Variant Preview Modal */}
      {previewVariant && selectedQuiz && (
        <VariantPreviewModal
          open={!!previewVariant}
          onClose={() => setPreviewVariant(null)}
          variant={previewVariant}
          quizName={selectedQuiz.name}
          quizDescription={selectedQuiz.description}
        />
      )}
    </div>
  );
}
