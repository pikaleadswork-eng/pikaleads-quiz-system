import { ReactNode, useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import { useTranslation } from "react-i18next";
import {
  MessageSquare,
  Users,
  Package,
  DollarSign,
  ScrollText,
  Settings,
  LogOut,
  Menu,
  X,
  Loader2
} from "lucide-react";
import { cn } from "@/lib/utils";

interface CRMLayoutProps {
  children: ReactNode;
}

export default function CRMLayout({ children }: CRMLayoutProps) {
  const { t } = useTranslation();


  const { user, loading: authLoading } = useAuth();
  const [location] = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const navItems = [
    {
      title: t("nav.messaging"),
      icon: MessageSquare,
      href: "/admin/inbox",
      description: t("nav.emailTelegramWhatsApp"),
    },
    {
      title: t("nav.leads"),
      icon: Users,
      href: "/crm",
      description: t("nav.manageAllLeads"),
    },
    {
      title: t("nav.services"),
      icon: Package,
      href: "/admin/services",
      description: t("nav.pricingOfferings"),
    },
    {
      title: t("nav.sales"),
      icon: DollarSign,
      href: "/admin/sales",
      description: t("nav.revenueTransactions"),
    },
    {
      title: t("nav.scripts"),
      icon: ScrollText,
      href: "/admin/scripts",
      description: t("nav.callScriptsLibrary"),
    },
    {
      title: t("nav.settings"),
      icon: Settings,
      href: "/admin/settings",
      description: t("nav.integrationsAPI"),
    },
  ];

  if (authLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-black">
        <Loader2 className="w-8 h-8 animate-spin text-purple-400" />
      </div>
    );
  }

  if (!user) {
    window.location.href = "/login";
    return null;
  }

  if (user.role !== "admin") {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-black text-white">
        <h1 className="text-2xl font-bold mb-4">Access Denied</h1>
        <p className="text-gray-400 mb-4">You need admin privileges to access the CRM.</p>
        <Link href="/">
          <Button>Return Home</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white flex">
      {/* Sidebar */}
      <aside
        className={cn(
          "fixed left-0 top-0 h-full bg-zinc-900 border-r border-zinc-800 transition-all duration-300 z-50",
          sidebarOpen ? "w-64" : "w-0 -translate-x-full"
        )}
      >
        <div className="flex flex-col h-full">
          {/* Logo & Toggle */}
          <div className="p-4 border-b border-zinc-800 flex items-center justify-between">
            <Link href="/admin">
              <div className="flex items-center gap-2 cursor-pointer">
                <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-yellow-500 rounded-lg flex items-center justify-center font-bold text-black">
                  P
                </div>
                <span className="font-bold text-lg">PIKALEADS</span>
              </div>
            </Link>
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden text-gray-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location === item.href;
              return (
                <Link key={item.href} href={item.href}>
                  <a
                    className={cn(
                      "flex items-start gap-3 p-3 rounded-lg transition-all cursor-pointer group",
                      isActive
                        ? "bg-purple-500/20 text-purple-400 border border-purple-500/30"
                        : "hover:bg-zinc-800 text-gray-400 hover:text-white"
                    )}
                  >
                    <Icon className={cn("w-5 h-5 mt-0.5", isActive ? "text-purple-400" : "text-gray-500 group-hover:text-purple-400")} />
                    <div className="flex-1 min-w-0">
                      <div className={cn("font-medium", isActive ? "text-purple-400" : "text-white")}>{item.title}</div>
                      <div className="text-xs text-gray-500 mt-0.5">{item.description}</div>
                    </div>
                  </a>
                </Link>
              );
            })}
          </nav>

          {/* User Profile */}
          <div className="p-4 border-t border-zinc-800">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center font-bold">
                {user.name?.[0]?.toUpperCase() || "A"}
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-medium truncate">{user.name}</div>
                <div className="text-xs text-gray-500 truncate">{user.email}</div>
              </div>
            </div>
            <Button
              variant="outline"
              size="sm"
              className="w-full gap-2 bg-transparent border-zinc-700 hover:bg-zinc-800 hover:border-red-500 hover:text-red-400"
              onClick={() => {
                window.location.href = "/logout";
              }}
            >
              <LogOut className="w-4 h-4" />
              {t("common.logout")}
            </Button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div
        className={cn(
          "flex-1 transition-all duration-300",
          sidebarOpen ? "lg:ml-64" : "ml-0"
        )}
      >
        {/* Top Header */}
        <header className="sticky top-0 z-40 bg-zinc-900/95 backdrop-blur border-b border-zinc-800">
          <div className="flex items-center justify-between p-4">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="text-gray-400 hover:text-white"
            >
              <Menu className="w-6 h-6" />
            </button>

            <div className="flex items-center gap-3">
              <Link href="/admin">
                <Button variant="ghost" size="sm">
                  ← Admin Dashboard
                </Button>
              </Link>
              <LanguageSwitcher />
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-6">
          {children}
        </main>
      </div>

      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
}
