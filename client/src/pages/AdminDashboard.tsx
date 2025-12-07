import { Link } from "wouter";
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
  FileText
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function AdminDashboard() {
  const { data: stats } = trpc.admin.getDashboardStats.useQuery();

  const adminSections = [
    {
      title: "CRM System",
      description: "Manage leads, statuses, and customer interactions",
      icon: Database,
      href: "/crm",
      color: "text-blue-500",
      bgColor: "bg-blue-500/10"
    },
    {
      title: "Analytics Dashboard",
      description: "View UTM statistics and campaign performance",
      icon: BarChart3,
      href: "/admin/analytics",
      color: "text-purple-500",
      bgColor: "bg-purple-500/10"
    },
    {
      title: "Assignment Rules",
      description: "Configure automatic lead assignment to managers",
      icon: Settings,
      href: "/admin/assignment-rules",
      color: "text-green-500",
      bgColor: "bg-green-500/10"
    },
    {
      title: "Manager Performance",
      description: "Track manager metrics and conversion rates",
      icon: TrendingUp,
      href: "/admin/performance",
      color: "text-orange-500",
      bgColor: "bg-orange-500/10"
    },
    {
      title: "Manager Invitation",
      description: "Invite new managers to join the team",
      icon: UserPlus,
      href: "/admin/managers",
      color: "text-pink-500",
      bgColor: "bg-pink-500/10"
    },
    {
      title: "Quiz Management",
      description: "Edit quiz content, questions, and offers",
      icon: FileText,
      href: "/admin/quizzes",
      color: "text-yellow-500",
      bgColor: "bg-yellow-500/10"
    },
    {
      title: "A/B Testing",
      description: "Create and manage quiz variants for testing",
      icon: TrendingUp,
      href: "/admin/ab-testing",
      color: "text-cyan-500",
      bgColor: "bg-cyan-500/10"
    },
    {
      title: "Calendar Integration",
      description: "Manage Calendly and Google Calendar settings",
      icon: Calendar,
      href: "/admin/calendar",
      color: "text-indigo-500",
      bgColor: "bg-indigo-500/10"
    },
    {
      title: "Messaging Center",
      description: "Send messages via Telegram, Instagram, WhatsApp",
      icon: MessageSquare,
      href: "/crm",
      color: "text-red-500",
      bgColor: "bg-red-500/10"
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto py-8 px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-2">Admin Dashboard</h1>
          <p className="text-muted-foreground">
            Centralized control panel for PIKALEADS Lead Engine
          </p>
        </div>

        {/* Quick Stats */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Total Leads
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-foreground">{stats.totalLeads}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Active Managers
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-foreground">{stats.totalManagers}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Active A/B Tests
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-foreground">{stats.activeTests}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Leads Today
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
                <Link href="/crm">
                  <a className="text-primary hover:underline">View All Leads</a>
                </Link>
                <Link href="/admin/analytics">
                  <a className="text-primary hover:underline">Campaign Analytics</a>
                </Link>
                <Link href="/admin/managers">
                  <a className="text-primary hover:underline">Invite Manager</a>
                </Link>
                <Link href="/admin/quizzes">
                  <a className="text-primary hover:underline">Edit Quizzes</a>
                </Link>
                <Link href="/">
                  <a className="text-primary hover:underline">Back to Home</a>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
