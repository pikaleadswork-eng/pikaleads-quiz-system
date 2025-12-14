import { useState } from "react";
import { useAuth } from "@/_core/hooks/useAuth";
import { useTranslation } from "react-i18next";
import DashboardLayout from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowLeft, Plus, BarChart3, Pencil, Eye, Trash2 } from "lucide-react";
import { Link } from "wouter";
import CreateQuizModal from "@/components/CreateQuizModal";
import { trpc } from "@/lib/trpc";

export default function AdminQuizzes() {
  const { t, i18n } = useTranslation();
  const { user, loading } = useAuth();
  const [createModalOpen, setCreateModalOpen] = useState(false);

  // Load quizzes from database
  const { data: quizzes = [], isLoading: quizzesLoading, refetch } = trpc.quizzes.list.useQuery();

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

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-4">
            <Link href="/admin">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="w-4 h-4 mr-2" />
                {t("quizzes.backToAdmin")}
              </Button>
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-foreground">
                {i18n.language === "uk" ? "Управління квізами" : "Quiz Management"}
              </h1>
              <p className="text-sm text-muted-foreground">
                {i18n.language === "uk" 
                  ? "Оберіть квіз для редагування дизайну, питань та налаштувань"
                  : "Select a quiz to edit design, questions and settings"}
              </p>
            </div>
          </div>
          <Button
            variant="default"
            onClick={() => setCreateModalOpen(true)}
            className="bg-purple-600 hover:bg-purple-700"
          >
            <Plus className="w-4 h-4 mr-2" />
            {i18n.language === "uk" ? "Створити квіз" : "Create Quiz"}
          </Button>
        </div>

        {/* Quiz Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {quizzes.map((quiz) => (
            <Card key={quiz.id} className="p-6 hover:shadow-lg transition-shadow flex flex-col h-full">
              {/* Quiz Preview */}
              <div className="aspect-video bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg mb-4 flex items-center justify-center flex-shrink-0">
                <span className="text-4xl">📊</span>
              </div>

              {/* Quiz Info - flex-grow to push actions to bottom */}
              <div className="flex-grow mb-4">
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  {quiz.name}
                </h3>
                <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                  {quiz.description || (i18n.language === "uk" ? "Опис квізу" : "Quiz description")}
                </p>

                {/* Stats */}
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <span>{quiz.platform === "meta_ads" ? "Meta Ads" : "Google Ads"}</span>
                  <span>•</span>
                  <span>{i18n.language === "uk" ? "Активний" : "Active"}</span>
                </div>
              </div>

              {/* Actions - always at bottom */}
              <div className="flex flex-col gap-2 flex-shrink-0">
                <Link href={`/admin/quizzes/${quiz.id}/design`}>
                  <Button className="w-full bg-purple-600 hover:bg-purple-700">
                    <Pencil className="w-4 h-4 mr-2" />
                    {i18n.language === "uk" ? "Редагувати" : "Edit"}
                  </Button>
                </Link>
                <div className="grid grid-cols-2 gap-2">
                  <Link href={`/admin/quizzes/${quiz.id}/analytics`} className="w-full">
                    <Button variant="outline" className="w-full h-full">
                      <BarChart3 className="w-4 h-4 mr-2" />
                      {i18n.language === "uk" ? "Аналітика" : "Analytics"}
                    </Button>
                  </Link>
                  <Link href={`/quiz/${quiz.slug}`} target="_blank" className="w-full">
                    <Button variant="outline" className="w-full h-full">
                      <Eye className="w-4 h-4 mr-2" />
                      {i18n.language === "uk" ? "Переглянути" : "Preview"}
                    </Button>
                  </Link>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Empty State */}
        {quizzes.length === 0 && (
          <Card className="p-12 text-center">
            <p className="text-muted-foreground mb-4">
              {i18n.language === "uk" 
                ? "Ще немає квізів. Створіть перший квіз!"
                : "No quizzes yet. Create your first quiz!"}
            </p>
            <Button onClick={() => setCreateModalOpen(true)}>
              <Plus className="w-4 h-4 mr-2" />
              {i18n.language === "uk" ? "Створити квіз" : "Create Quiz"}
            </Button>
          </Card>
        )}
      </div>

      {/* Create Quiz Modal */}
      <CreateQuizModal
        open={createModalOpen}
        onOpenChange={setCreateModalOpen}
        onQuizCreated={() => {
          setCreateModalOpen(false);
          refetch(); // Refresh quiz list from database
        }}
      />
    </DashboardLayout>
  );
}
