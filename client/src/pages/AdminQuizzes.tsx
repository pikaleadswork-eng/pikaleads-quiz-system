import { useState } from "react";
import { useAuth } from "@/_core/hooks/useAuth";
import { useTranslation } from "react-i18next";
import DashboardLayout from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { ArrowLeft, Save, Eye, Copy } from "lucide-react";
import { Link } from "wouter";
import { quizzes } from "@/lib/quizData";
import QuizEditor from "@/components/QuizEditor";
import ABTestManager from "@/components/ABTestManager";
import { TemplateLibrary } from "@/components/TemplateLibrary";
import { QuizTypeSelector, type QuizType } from "@/components/QuizTypeSelector";
import { ImprovedQuizEditor } from "@/components/ImprovedQuizEditor";
import { type QuizQuestion } from "@/components/DraggableQuestionEditor";
import { ButtonCustomizer, type ButtonStyle } from "@/components/ButtonCustomizer";
import { QuizProgressBar } from "@/components/QuizProgressBar";
import { ScoreDisplay } from "@/components/ScoreDisplay";
import { ConfettiEffect } from "@/components/ConfettiEffect";
import { QuizPreview } from "@/components/QuizPreview";
import ImprovedQuizDesignEditor from "@/components/ImprovedQuizDesignEditor";
import QuizTemplateLibrary from "@/components/QuizTemplateLibrary";
import DraggableQuestionEditor from "@/components/DraggableQuestionEditor";
import QuestionTemplateLibrary from "@/components/QuestionTemplateLibrary";
import CreateQuizModal from "@/components/CreateQuizModal";
import type { QuizTemplate } from "../../../shared/quizTemplates";

interface QuizContent {
  title: string;
  subtitle: string;
  questions: Array<{
    question: string;
    options: string[];
  }>;
}

export default function AdminQuizzes() {
  const { t, i18n } = useTranslation();
  const { user, loading } = useAuth();
  const [selectedQuiz, setSelectedQuiz] = useState<string>("meta-furniture");
  const [editedContent, setEditedContent] = useState<QuizContent | null>(null);
  const [previewMode, setPreviewMode] = useState(false);
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [quizType, setQuizType] = useState<QuizType>("lead_generation");
  const [quizQuestions, setQuizQuestions] = useState<QuizQuestion[]>([]);
  const [buttonStyle, setButtonStyle] = useState<ButtonStyle>({
    text: "Продовжити",
    color: "#FFD93D",
    icon: "arrow",
    animation: "none",
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    );
  }

  if (!user || user.role !== "admin") {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="p-8 max-w-md">
          <h1 className="text-2xl font-bold text-destructive mb-4">{t("quizzes.accessDenied")}</h1>
          <p className="text-muted-foreground mb-6">
            {t("quizzes.needAdminPrivileges")}
          </p>
          <Link href="/">
            <Button>{t("quizzes.returnHome")}</Button>
          </Link>
        </Card>
      </div>
    );
  }

  const quiz = quizzes.find((q) => q.id === selectedQuiz);

  const loadQuizContent = () => {
    if (!quiz) return;
    setEditedContent({
      title: quiz.title,
      subtitle: quiz.subtitle,
      questions: quiz.questions.map((q) => ({
        question: q.question,
        options: q.options,
      })),
    });
  };

  if (!editedContent && quiz) {
    loadQuizContent();
  }

  const handleSave = () => {
    // In real implementation, this would save to database via tRPC
    toast.success("Quiz content saved successfully!");
    console.log("Saved content:", editedContent);
  };

  const handleCreateVariant = () => {
    toast.success("A/B test variant created!");
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-4">
            <Link href="/admin">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="w-4 h-4 mr-2" />
                {t("quizzes.backToAdmin")}
              </Button>
            </Link>
            <h1 className="text-xl sm:text-2xl font-bold text-foreground">{t("quizzes.quizManagement")}</h1>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="default"
              size="sm"
              onClick={() => setCreateModalOpen(true)}
              className="bg-purple-600 hover:bg-purple-700"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2"><path d="M5 12h14"/><path d="M12 5v14"/></svg>
              {i18n.language === "uk" ? "Створити квіз" : "Create Quiz"}
            </Button>
            <Link href={`/admin/quizzes/${selectedQuiz}/analytics`}>
              <Button variant="outline" size="sm">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2"><path d="M3 3v18h18"/><path d="m19 9-5 5-4-4-3 3"/></svg>
                {t("quizzes.analytics")}
              </Button>
            </Link>
            <Link href={`/admin/quizzes/${selectedQuiz}/design`}>
              <Button variant="outline" size="sm" className="bg-purple-600 hover:bg-purple-700 text-white">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2"><rect width="7" height="7" x="3" y="3" rx="1"/><rect width="7" height="7" x="14" y="3" rx="1"/><rect width="7" height="7" x="14" y="14" rx="1"/><rect width="7" height="7" x="3" y="14" rx="1"/></svg>
                {i18n.language === "uk" ? "Редактор дизайну" : "Design Editor"}
              </Button>
            </Link>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPreviewMode(!previewMode)}
            >
              <Eye className="w-4 h-4 mr-2" />
              {previewMode ? t("quizzes.editMode") : t("quizzes.preview")}
            </Button>
            <Button onClick={handleSave} size="sm">
              <Save className="w-4 h-4 mr-2" />
              {t("quizzes.saveChanges")}
            </Button>
          </div>
        </div>

        {/* Main Content */}
        {previewMode ? (
          <div className="max-w-4xl mx-auto">
            {/* QuizPreview temporarily disabled due to type mismatch */}
            <Card className="p-8">
              <p className="text-center text-zinc-400">Preview mode - Coming soon</p>
              <Button onClick={() => setPreviewMode(false)} className="mt-4">Close Preview</Button>
            </Card>
          </div>
        ) : (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Quiz Selector Sidebar */}
          <div className="lg:col-span-1">
            <Card className="p-4">
              <h3 className="font-semibold text-foreground mb-4">{t("quizzes.selectQuizTitle")}</h3>
              <div className="space-y-2">
                {quizzes.map((q) => (
                  <Button
                    key={q.id}
                    variant={selectedQuiz === q.id ? "default" : "ghost"}
                    className="w-full justify-start"
                    onClick={() => {
                      setSelectedQuiz(q.id);
                      setEditedContent(null);
                    }}
                  >
                    {q.title}
                  </Button>
                ))}
              </div>
            </Card>
          </div>

          {/* Main Content Editor */}
          <div className="lg:col-span-3">
            {editedContent && (
              <Tabs defaultValue="templates" className="space-y-6">
                <TabsList className="grid w-full grid-cols-2 sm:grid-cols-3 lg:grid-cols-8 gap-1">
                  <TabsTrigger value="type">{t("quizzes.quizType")}</TabsTrigger>
                  <TabsTrigger value="templates">{t("quizzes.templates")}</TabsTrigger>
                  <TabsTrigger value="library">{i18n.language === "uk" ? "Бібліотека" : "Library"}</TabsTrigger>
                  <TabsTrigger value="landing">{t("quizzes.landingPage")}</TabsTrigger>
                  <TabsTrigger value="questions">{t("quizzes.questions")}</TabsTrigger>
                  <TabsTrigger value="question-templates">{i18n.language === "uk" ? "Шаблони питань" : "Question Templates"}</TabsTrigger>
                  <TabsTrigger value="buttons">{i18n.language === "uk" ? "Кнопки" : "Buttons"}</TabsTrigger>
                  <TabsTrigger value="ab-test">{t("quizzes.abTesting")}</TabsTrigger>
                </TabsList>

                {/* Quiz Type Tab */}
                <TabsContent value="type" className="space-y-6">
                  <QuizTypeSelector
                    selectedType={quizType}
                    onSelect={(type) => {
                      setQuizType(type);
                      toast.success(t("quizzes.quizTypeSelected"));
                    }}
                  />
                </TabsContent>

                {/* Templates Tab */}
                <TabsContent value="templates" className="space-y-6">
                  <TemplateLibrary
                    onSelectTemplate={(template: QuizTemplate) => {
                      // Convert template to quiz content
                      const currentLang = (i18n.language as 'ua' | 'ru' | 'en') || 'ua';
                      setEditedContent({
                        title: template.title[currentLang],
                        subtitle: template.subtitle[currentLang],
                        questions: template.questions.map((q) => ({
                          question: q.text[currentLang],
                          options: q.options?.map(opt => opt[currentLang]) || [],
                        })),
                      });
                      toast.success(t("quizzes.templateApplied"));
                    }}
                  />
                </TabsContent>



                {/* Library Tab */}
                <TabsContent value="library" className="space-y-6">
                  <QuizTemplateLibrary
                    onSelectTemplate={(template) => {
                      // Apply template to current quiz
                      try {
                        const quizData = JSON.parse(template.quizData);
                        const designPreset = JSON.parse(template.designPreset);
                        
                        // Update quiz content
                        setEditedContent({
                          title: designPreset.titleText || template.name,
                          subtitle: designPreset.subtitleText || template.description,
                          questions: quizData.questions.map((q: any) => ({
                            question: q.text,
                            options: q.options,
                          })),
                        });
                        
                        toast.success(
                          i18n.language === "uk" 
                            ? `Шаблон "${template.name}" застосовано!` 
                            : `Template "${template.name}" applied!`
                        );
                      } catch (error) {
                        toast.error(
                          i18n.language === "uk" 
                            ? "Помилка застосування шаблону" 
                            : "Error applying template"
                        );
                      }
                    }}
                  />
                </TabsContent>

                {/* Landing Page Tab */}
                <TabsContent value="landing" className="space-y-6">
                  <Card className="p-6">
                    <h3 className="text-xl font-bold text-foreground mb-4">
                      {t("quizzes.landingPageContent")}
                    </h3>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="title">{t("quizzes.title")}</Label>
                        <Input
                          id="title"
                          className="bg-zinc-800 border-zinc-700 mt-2"
                          value={editedContent.title}
                          onChange={(e) =>
                            setEditedContent({
                              ...editedContent,
                              title: e.target.value,
                            })
                          }
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="subtitle">{t("quizzes.subtitle")}</Label>
                        <Textarea
                          id="subtitle"
                          className="bg-zinc-800 border-zinc-700"
                          value={editedContent.subtitle}
                          onChange={(e) =>
                            setEditedContent({
                              ...editedContent,
                              subtitle: e.target.value,
                            })
                          }
                          rows={3}
                        />
                      </div>

                    </div>
                  </Card>
                </TabsContent>

                {/* Questions Tab */}
                <TabsContent value="questions" className="space-y-6">
                  <DraggableQuestionEditor
                    quizId={selectedQuiz || "new"}
                    initialQuestions={quizQuestions}
                    onSave={(questions: QuizQuestion[]) => {
                      setQuizQuestions(questions);
                      toast.success(t("quizEditor.questionsSaved"));
                    }}
                  />
                </TabsContent>

                {/* Question Templates Tab */}
                <TabsContent value="question-templates" className="space-y-6">
                  <QuestionTemplateLibrary
                    onUseTemplate={(template) => {
                      const newQuestion: QuizQuestion = {
                        id: Date.now().toString(),
                        question: template.questionText,
                        type: template.questionType,
                        options: template.options,
                        required: template.isRequired === 1,
                      };
                      setQuizQuestions([...quizQuestions, newQuestion]);
                      toast.success(
                        i18n.language === "uk"
                          ? "Питання додано з шаблону"
                          : "Question added from template"
                      );
                    }}
                  />
                </TabsContent>

                {/* Buttons Tab */}
                <TabsContent value="buttons" className="space-y-6">
                  <ButtonCustomizer
                    buttonStyle={buttonStyle}
                    onChange={(style) => {
                      setButtonStyle(style);
                      toast.success(t("quizzes.buttonStyleUpdated"));
                    }}
                  />
                  
                  {/* Preview section */}
                  <Card className="p-6">
                    <h3 className="text-xl font-bold text-foreground mb-4">
                      {t("quizzes.previewComponents")}
                    </h3>
                    <div className="space-y-6">
                      {/* Progress bar preview */}
                      <div>
                        <Label className="mb-2 block">{t("quizzes.progressBar")}</Label>
                        <QuizProgressBar current={3} total={5} color={buttonStyle.color} />
                      </div>
                      
                      {/* Score display preview */}
                      <div>
                        <Label className="mb-2 block">{t("quizzes.scoreDisplay")}</Label>
                        <ScoreDisplay score={85} maxScore={100} />
                      </div>
                    </div>
                  </Card>
                </TabsContent>

                {/* A/B Testing Tab */}
                <TabsContent value="ab-test" className="space-y-6">
                  <ABTestManager quizId={selectedQuiz || "default"} />
                </TabsContent>
              </Tabs>
            )}
          </div>
        </div>
        )}
      </div>

      <CreateQuizModal
        open={createModalOpen}
        onOpenChange={setCreateModalOpen}
        onQuizCreated={(quizId) => {
          console.log("Quiz created with ID:", quizId);
          // TODO: Refresh quiz list and select new quiz
        }}
      />
    </DashboardLayout>
  );
}
