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
            <h1 className="text-2xl font-bold text-foreground">Quiz Management</h1>
          </div>
          <div className="flex items-center gap-2">
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
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Quiz Selector Sidebar */}
          <div className="lg:col-span-1">
            <Card className="p-4">
              <h3 className="font-semibold text-foreground mb-4">Select Quiz</h3>
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
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="templates">{t("quizzes.templates")}</TabsTrigger>
                  <TabsTrigger value="landing">{t("quizzes.landingPage")}</TabsTrigger>
                  <TabsTrigger value="questions">{t("quizzes.questions")}</TabsTrigger>
                  <TabsTrigger value="ab-test">{t("quizzes.abTesting")}</TabsTrigger>
                </TabsList>

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

                {/* Landing Page Tab */}
                <TabsContent value="landing" className="space-y-6">
                  <Card className="p-6">
                    <h3 className="text-xl font-bold text-foreground mb-4">
                      {t("quizzes.landingPageContent")}
                    </h3>
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="title">Title</Label>
                        <Input
                          id="title"
                          value={editedContent.title}
                          onChange={(e) =>
                            setEditedContent({
                              ...editedContent,
                              title: e.target.value,
                            })
                          }
                          className="mt-2"
                        />
                      </div>
                      <div>
                        <Label htmlFor="subtitle">Subtitle</Label>
                        <Textarea
                          id="subtitle"
                          value={editedContent.subtitle}
                          onChange={(e) =>
                            setEditedContent({
                              ...editedContent,
                              subtitle: e.target.value,
                            })
                          }
                          rows={3}
                          className="mt-2"
                        />
                      </div>

                    </div>
                  </Card>
                </TabsContent>

                {/* Questions Tab */}
                <TabsContent value="questions" className="space-y-6">
                  <QuizEditor
                    quizId={selectedQuiz ? parseInt(selectedQuiz) : undefined}
                    initialQuestions={[]}
                    onSave={(questions) => {
                      console.log("Saving questions:", questions);
                      toast.success(t("quizEditor.saveQuiz"));
                    }}
                  />
                </TabsContent>

                {/* A/B Testing Tab */}
                <TabsContent value="ab-test" className="space-y-6">
                  <ABTestManager quizId={selectedQuiz || "default"} />
                </TabsContent>
              </Tabs>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
