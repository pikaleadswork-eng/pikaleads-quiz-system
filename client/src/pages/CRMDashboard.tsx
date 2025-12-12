import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Loader2, MessageSquare, Users, TrendingUp, Package, FileText, BarChart3, DollarSign } from "lucide-react";
import { useAuth } from "@/_core/hooks/useAuth";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";

export default function CRMDashboard() {
  const { user, loading: authLoading } = useAuth();
  const [location] = useLocation();

  const navItems = [
    {
      title: "Messengers",
      icon: MessageSquare,
      href: "/admin/inbox",
      description: "Email, Telegram, WhatsApp",
      color: "text-blue-500",
    },
    {
      title: "Leads",
      icon: Users,
      href: "/crm",
      description: "Manage all leads",
      color: "text-green-500",
    },
    {
      title: "Lead Statistics",
      icon: BarChart3,
      href: "/admin/analytics",
      description: "Conversion & sources",
      color: "text-purple-500",
    },
    {
      title: "Manager Stats",
      icon: TrendingUp,
      href: "/admin/performance",
      description: "Performance tracking",
      color: "text-orange-500",
    },
    {
      title: "Sales Statistics",
      icon: DollarSign,
      href: "/admin/sales",
      description: "Revenue & transactions",
      color: "text-yellow-500",
    },
    {
      title: "Services",
      icon: Package,
      href: "/admin/services",
      description: "Manage pricing",
      color: "text-cyan-500",
    },
    {
      title: "Sales Scripts",
      icon: FileText,
      href: "/admin/scripts",
      description: "Call scripts library",
      color: "text-pink-500",
    },
  ];

  const { data: dashboardStats, isLoading: statsLoading } = trpc.admin.getDashboardStats.useQuery();
  const { data: salesStats, isLoading: salesLoading } = trpc.sales.getStats.useQuery();

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
        <Link href="/admin">
          <Button>Return Home</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="container mx-auto py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <Link href="/admin">
              <Button variant="ghost">
                ← Back to Admin
              </Button>
            </Link>
            <LanguageSwitcher />
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent">
            CRM Dashboard
          </h1>
          <p className="text-gray-400 mt-2">
            Manage leads, communications, and sales
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Card className="bg-zinc-900 border-zinc-800">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-400">Total Leads</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">
                {statsLoading ? <Loader2 className="w-6 h-6 animate-spin" /> : dashboardStats?.totalLeads || 0}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-zinc-900 border-zinc-800">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-400">Active Managers</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">
                {statsLoading ? <Loader2 className="w-6 h-6 animate-spin" /> : dashboardStats?.totalManagers || 0}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-zinc-900 border-zinc-800">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-400">Total Revenue</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-400">
                {salesLoading ? <Loader2 className="w-6 h-6 animate-spin" /> : `$${salesStats?.totalRevenue?.toLocaleString() || 0}`}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-zinc-900 border-zinc-800">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-400">Total Sales</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">
                {salesLoading ? <Loader2 className="w-6 h-6 animate-spin" /> : salesStats?.totalSales || 0}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Navigation Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location === item.href;

            return (
              <Link key={item.href} href={item.href}>
                <Card
                  className={cn(
                    "bg-zinc-900 border-zinc-800 hover:border-zinc-700 transition-all cursor-pointer group",
                    isActive && "border-purple-500/50 bg-zinc-800"
                  )}
                >
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className={cn("p-3 rounded-lg bg-zinc-800 group-hover:scale-110 transition-transform", item.color)}>
                          <Icon className="w-6 h-6" />
                        </div>
                        <div>
                          <CardTitle className="text-lg">{item.title}</CardTitle>
                          <CardDescription className="text-sm mt-1">
                            {item.description}
                          </CardDescription>
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                </Card>
              </Link>
            );
          })}
        </div>

        {/* Quick Actions */}
        <Card className="bg-zinc-900 border-zinc-800 mt-8">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Frequently used operations</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-3">
            <Link href="/crm">
              <Button variant="outline">
                <Users className="w-4 h-4 mr-2" />
                View All Leads
              </Button>
            </Link>
            <Link href="/admin/inbox">
              <Button variant="outline">
                <MessageSquare className="w-4 h-4 mr-2" />
                Message Inbox
              </Button>
            </Link>
            <Link href="/admin/services">
              <Button variant="outline">
                <Package className="w-4 h-4 mr-2" />
                Manage Services
              </Button>
            </Link>
            <Link href="/admin/scripts">
              <Button variant="outline">
                <FileText className="w-4 h-4 mr-2" />
                Sales Scripts
              </Button>
            </Link>
            <Link href="/admin/sales">
              <Button variant="outline">
                <DollarSign className="w-4 h-4 mr-2" />
                Sales Report
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
