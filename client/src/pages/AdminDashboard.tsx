import { useState } from "react";
import { useTranslation } from "react-i18next";
import { trpc } from "@/lib/trpc";
import { 
  Users, 
  BarChart3, 
  Settings, 
  TrendingUp, 
  UserPlus,
  Database,
  MessageSquare,
  Calendar,
  FileText,
  Package,
  ScrollText,
  Loader2,
  DollarSign,
  Activity
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/_core/hooks/useAuth";
import { Link } from "wouter";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import { ServerStatusWidget } from "@/components/ServerStatusWidget";

export default function AdminDashboard() {
  const { t } = useTranslation();
  const { user, loading: authLoading } = useAuth();
  const { data: stats } = trpc.admin.getDashboardStats.useQuery();

  if (authLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  if (!user) {
    window.location.href = "/login";
    return null;
  }

  if (user.role !== "admin") {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <h1 className="text-2xl font-bold mb-4">Access Denied</h1>
        <p className="text-muted-foreground mb-4">You need admin privileges to access this page.</p>
        <Link href="/">
          <Button>Return Home</Button>
        </Link>
      </div>
    );
  }

  const adminSections = [
    {
      title: "CRM Система",
      description: "Управління лідами, статусами та взаємодією з клієнтами",
      icon: Database,
      href: "/crm",
      color: "text-blue-500",
      bgColor: "bg-blue-500/10"
    },
    {
      title: "Панель Аналітики",
      description: "Перегляд UTM статистики та ефективності кампаній",
      icon: BarChart3,
      href: "/admin/analytics",
      color: "text-purple-500",
      bgColor: "bg-purple-500/10"
    },
    {
      title: "Правила Призначення",
      description: "Налаштування автоматичного призначення лідів менеджерам",
      icon: Settings,
      href: "/admin/assignment-rules",
      color: "text-green-500",
      bgColor: "bg-green-500/10"
    },
    {
      title: "Ефективність Менеджерів",
      description: "Відстеження метрик менеджерів та конверсії",
      icon: TrendingUp,
      href: "/admin/performance",
      color: "text-orange-500",
      bgColor: "bg-orange-500/10"
    },
    {
      title: "Запрошення Менеджерів",
      description: "Запросіть нових менеджерів приєднатися до команди",
      icon: UserPlus,
      href: "/admin/managers",
      color: "text-pink-500",
      bgColor: "bg-pink-500/10"
    },
    {
      title: "Управління Квізами",
      description: "Редагування контенту квізів, питань та пропозицій",
      icon: FileText,
      href: "/admin/quizzes",
      color: "text-yellow-500",
      bgColor: "bg-yellow-500/10"
    },
    {
      title: "A/B Тестування",
      description: "Створення та управління варіантами квізів для тестування",
      icon: TrendingUp,
      href: "/admin/ab-testing",
      color: "text-cyan-500",
      bgColor: "bg-cyan-500/10"
    },
    {
      title: "Інтеграція Календаря",
      description: "Управління налаштуваннями Calendly та Google Calendar",
      icon: Calendar,
      href: "/admin/calendar",
      color: "text-indigo-500",
      bgColor: "bg-indigo-500/10"
    },
    {
      title: "Центр Повідомлень",
      description: "Надсилання повідомлень через Telegram, Instagram, WhatsApp",
      icon: MessageSquare,
      href: "/admin/inbox",
      color: "text-red-500",
      bgColor: "bg-red-500/10"
    },
    {
      title: "Управління Послугами",
      description: "Управління послугами, цінами та додатковими пропозиціями",
      icon: Package,
      href: "/admin/services",
      color: "text-emerald-500",
      bgColor: "bg-emerald-500/10"
    },
    {
      title: "Статистика Продажів",
      description: "Відстеження доходів, транзакцій та ефективності продажів",
      icon: DollarSign,
      href: "/admin/sales",
      color: "text-amber-500",
      bgColor: "bg-amber-500/10"
    },
    {
      title: "Скрипти Продажів",
      description: "Управління скриптами дзвінків для відділу продажів",
      icon: ScrollText,
      href: "/admin/scripts",
      color: "text-violet-500",
      bgColor: "bg-violet-500/10"
    },
    {
      title: "Моніторинг Сервера",
      description: "Метрики сервера в реальному часі, CPU, пам'ять та помилки",
      icon: Activity,
      href: "/admin/monitoring",
      color: "text-cyan-500",
      bgColor: "bg-cyan-500/10"
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto py-8 px-4">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h1 className="text-4xl font-bold text-foreground mb-2">Адмін Панель</h1>
              <p className="text-muted-foreground">
                Централізована панель керування PIKALEADS Lead Engine
              </p>
            </div>
            <div className="flex gap-2">
              <Link href="/">
                <Button variant="outline">← Головна</Button>
              </Link>
              <LanguageSwitcher />
            </div>
          </div>
        </div>

        {/* Server Status Widget */}
        <div className="grid grid-cols-1 gap-6 mb-8">
          <ServerStatusWidget />
        </div>

        {/* Quick Stats */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Всього Лідів
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-foreground">{stats.totalLeads}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Активні Менеджери
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-foreground">{stats.totalManagers}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Активні A/B Тести
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-foreground">{stats.activeTests}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Ліди Сьогодні
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-foreground">{stats.leadsToday}</div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Navigation Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {adminSections.map((section) => {
            const Icon = section.icon;
            return (
              <Link key={section.href} href={section.href}>
                <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full">
                  <CardHeader>
                    <div className={`w-12 h-12 rounded-lg ${section.bgColor} flex items-center justify-center mb-4`}>
                      <Icon className={`w-6 h-6 ${section.color}`} />
                    </div>
                    <CardTitle className="text-xl">{section.title}</CardTitle>
                    <CardDescription>{section.description}</CardDescription>
                  </CardHeader>
                </Card>
              </Link>
            );
          })}
        </div>

        {/* Quick Links */}
        <div className="mt-8">
          <Card>
            <CardHeader>
              <CardTitle>Quick Links</CardTitle>
              <CardDescription>Frequently accessed pages</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-4">
                <Link href="/crm" className="text-primary hover:underline">
                  View All Leads
                </Link>
                <Link href="/admin/analytics" className="text-primary hover:underline">
                  Campaign Analytics
                </Link>
                <Link href="/admin/managers" className="text-primary hover:underline">
                  Invite Manager
                </Link>
                <Link href="/admin/quizzes" className="text-primary hover:underline">
                  Edit Quizzes
                </Link>
                <Link href="/" className="text-primary hover:underline">
                  Back to Home
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
