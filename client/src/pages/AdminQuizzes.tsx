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

interface QuizContent {
  title: string;
  subtitle: string;
  questions: Array<{
    question: string;
    options: string[];
  }>;
}

export default function AdminQuizzes() {
  const { t } = useTranslation();
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
          <h1 className="text-2xl font-bold text-destructive mb-4">Access Denied</h1>
          <p className="text-muted-foreground mb-6">
            You need administrator privileges to access this page.
          </p>
          <Link href="/">
            <Button>Return Home</Button>
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
                Back to Admin
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
              {previewMode ? "Edit Mode" : "Preview"}
            </Button>
            <Button onClick={handleSave} size="sm">
              <Save className="w-4 h-4 mr-2" />
              Save Changes
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
              <Tabs defaultValue="landing" className="space-y-6">
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="landing">Landing Page</TabsTrigger>
                  <TabsTrigger value="questions">Questions</TabsTrigger>
                  <TabsTrigger value="ab-test">A/B Testing</TabsTrigger>
                  <TabsTrigger value="preview">Preview</TabsTrigger>
                </TabsList>

                {/* Landing Page Tab */}
                <TabsContent value="landing" className="space-y-6">
                  <Card className="p-6">
                    <h3 className="text-xl font-bold text-foreground mb-4">
                      Landing Page Content
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
                  {editedContent.questions.map((q, qIndex) => (
                    <Card key={qIndex} className="p-6">
                      <h3 className="text-lg font-bold text-foreground mb-4">
                        Question {qIndex + 1}
                      </h3>
                      <div className="space-y-4">
                        <div>
                          <Label htmlFor={`question-${qIndex}`}>Question Text</Label>
                          <Textarea
                            id={`question-${qIndex}`}
                            value={q.question}
                            onChange={(e) => {
                              const newQuestions = [...editedContent.questions];
                              newQuestions[qIndex].question = e.target.value;
                              setEditedContent({
                                ...editedContent,
                                questions: newQuestions,
                              });
                            }}
                            rows={2}
                            className="mt-2"
                          />
                        </div>
                        <div>
                          <Label>Answer Options</Label>
                          {q.options.map((option, oIndex) => (
                            <Input
                              key={oIndex}
                              value={option}
                              onChange={(e) => {
                                const newQuestions = [...editedContent.questions];
                                newQuestions[qIndex].options[oIndex] = e.target.value;
                                setEditedContent({
                                  ...editedContent,
                                  questions: newQuestions,
                                });
                              }}
                              className="mt-2"
                              placeholder={`Option ${oIndex + 1}`}
                            />
                          ))}
                        </div>
                      </div>
                    </Card>
                  ))}
                </TabsContent>

                {/* A/B Testing Tab */}
                <TabsContent value="ab-test" className="space-y-6">
                  <Card className="p-6">
                    <h3 className="text-xl font-bold text-foreground mb-4">
                      A/B Test Variants
                    </h3>
                    <p className="text-muted-foreground mb-6">
                      Create variants to test different versions of your quiz content.
                      Traffic will be split automatically between variants.
                    </p>
                    <div className="space-y-4">
                      <Button onClick={handleCreateVariant} className="w-full">
                        <Copy className="w-4 h-4 mr-2" />
                        Create New Variant from Current Content
                      </Button>
                      <div className="border border-border rounded-lg p-4">
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-semibold">Control (Original)</span>
                          <span className="text-sm text-muted-foreground">50% traffic</span>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          Current active version
                        </p>
                      </div>
                    </div>
                  </Card>
                </TabsContent>

                {/* Preview Tab */}
                <TabsContent value="preview" className="space-y-6">
                  <Card className="p-6 bg-black text-white">
                    <div className="max-w-2xl mx-auto text-center space-y-6">
                      <h1 className="text-4xl md:text-5xl font-black">
                        {editedContent.title}
                      </h1>
                      <p className="text-xl text-gray-300">{editedContent.subtitle}</p>
                      <div className="bg-primary/20 border-2 border-primary rounded-lg p-4">
                        <p className="text-accent font-semibold">🎁 Free Bonus: Marketing Audit</p>
                      </div>
                      <Button size="lg" className="w-full md:w-auto">
                        Start Quiz →
                      </Button>
                    </div>
                  </Card>
                </TabsContent>
              </Tabs>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
