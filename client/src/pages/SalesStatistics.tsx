import { useState, useEffect } from "react";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Loader2, DollarSign, TrendingUp, ShoppingCart, Users } from "lucide-react";
import { format } from "date-fns";
import { useAuth } from "@/_core/hooks/useAuth";
import CRMLayout from "@/components/CRMLayout";
import { Link } from "wouter";

export default function SalesStatistics() {

  // Detect language from localStorage
  const [language, setLanguage] = useState(() => {
    return localStorage.getItem('language') || 'uk';
  });

  useEffect(() => {
    const handleLanguageChange = () => {
      setLanguage(localStorage.getItem('language') || 'uk');
    };
    window.addEventListener('languageChanged', handleLanguageChange);
    return () => window.removeEventListener('languageChanged', handleLanguageChange);
  }, []);

  const t = (uk: string, ru: string, en: string) => {
    if (language === 'ru') return ru;
    if (language === 'en') return en;
    return uk;
  };


  const { user, loading: authLoading } = useAuth();

  const { data: salesStats, isLoading: statsLoading } = trpc.sales.getStats.useQuery();
  const { data: allSales, isLoading: salesLoading } = trpc.sales.getAll.useQuery();
  const { data: services } = trpc.services.getAll.useQuery();
  const { data: managers } = trpc.admin.getManagers.useQuery();

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

  // Calculate additional stats
  const averageSaleAmount = salesStats?.totalSales
    ? Math.round(salesStats.totalRevenue / salesStats.totalSales)
    : 0;

  // Get manager names
  const getManagerName = (managerId: number) => {
    const manager = managers?.find((m: any) => m.id === managerId);
    return manager ? manager.name : `Manager #${managerId}`;
  };

  // Get service name
  const getServiceName = (serviceId: number) => {
    const service = services?.find((s) => s.id === serviceId);
    return service ? service.name : `Service #${serviceId}`;
  };

  return (
    <CRMLayout>
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <Link href="/admin">
              <Button variant="ghost" className="mb-4">
                ← Back to Admin
              </Button>
            </Link>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-green-400 to-blue-400 bg-clip-text text-transparent">
              Sales Statistics
            </h1>
            <p className="text-gray-400 mt-2">
              Track revenue, sales performance, and manager statistics
            </p>
          </div>
        </div>

        {/* Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card className="bg-zinc-900 border-zinc-800">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-green-400 flex items-center gap-2">
                <DollarSign className="w-4 h-4" />
                Total Revenue
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">
                ${statsLoading ? "..." : salesStats?.totalRevenue.toLocaleString() || 0}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-zinc-900 border-zinc-800">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-blue-400 flex items-center gap-2">
                <ShoppingCart className="w-4 h-4" />
                Total Sales
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">
                {statsLoading ? "..." : salesStats?.totalSales || 0}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-zinc-900 border-zinc-800">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-purple-400 flex items-center gap-2">
                <TrendingUp className="w-4 h-4" />
                Average Sale
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">
                ${averageSaleAmount.toLocaleString()}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-zinc-900 border-zinc-800">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-yellow-400 flex items-center gap-2">
                <Users className="w-4 h-4" />
                Active Managers
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">
                {statsLoading ? "..." : Object.keys(salesStats?.byManager || {}).length}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sales by Manager */}
        <Card className="bg-zinc-900 border-zinc-800 mb-6">
          <CardHeader>
            <CardTitle>Sales by Manager</CardTitle>
            <CardDescription>Performance breakdown by team member</CardDescription>
          </CardHeader>
          <CardContent>
            {statsLoading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="w-6 h-6 animate-spin" />
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Manager</TableHead>
                    <TableHead>Sales Count</TableHead>
                    <TableHead>Total Revenue</TableHead>
                    <TableHead>Average Sale</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {salesStats && Object.entries(salesStats.byManager).map(([managerId, stats]) => (
                    <TableRow key={managerId}>
                      <TableCell className="font-medium">
                        {getManagerName(parseInt(managerId))}
                      </TableCell>
                      <TableCell>{stats.count}</TableCell>
                      <TableCell className="text-green-400">
                        ${stats.revenue.toLocaleString()}
                      </TableCell>
                      <TableCell>
                        ${Math.round(stats.revenue / stats.count).toLocaleString()}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>

        {/* Sales by Service */}
        <Card className="bg-zinc-900 border-zinc-800 mb-6">
          <CardHeader>
            <CardTitle>Sales by Service</CardTitle>
            <CardDescription>Revenue breakdown by product/service</CardDescription>
          </CardHeader>
          <CardContent>
            {statsLoading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="w-6 h-6 animate-spin" />
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Service</TableHead>
                    <TableHead>Sales Count</TableHead>
                    <TableHead>Total Revenue</TableHead>
                    <TableHead>Average Sale</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {salesStats && Object.entries(salesStats.byService).map(([serviceId, stats]) => (
                    <TableRow key={serviceId}>
                      <TableCell className="font-medium">
                        {getServiceName(parseInt(serviceId))}
                      </TableCell>
                      <TableCell>{stats.count}</TableCell>
                      <TableCell className="text-green-400">
                        ${stats.revenue.toLocaleString()}
                      </TableCell>
                      <TableCell>
                        ${Math.round(stats.revenue / stats.count).toLocaleString()}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>

        {/* Recent Sales */}
        <Card className="bg-zinc-900 border-zinc-800">
          <CardHeader>
            <CardTitle>Recent Sales</CardTitle>
            <CardDescription>Latest transactions</CardDescription>
          </CardHeader>
          <CardContent>
            {salesLoading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="w-6 h-6 animate-spin" />
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Lead ID</TableHead>
                    <TableHead>Service</TableHead>
                    <TableHead>Manager</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Notes</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {allSales && allSales.length > 0 ? (
                    allSales.slice(0, 20).map((sale) => (
                      <TableRow key={sale.id}>
                        <TableCell className="text-xs">
                          {format(new Date(sale.saleDate), "MMM dd, HH:mm")}
                        </TableCell>
                        <TableCell className="font-mono text-xs">
                          #{sale.leadId}
                        </TableCell>
                        <TableCell>
                          {getServiceName(sale.serviceId)}
                        </TableCell>
                        <TableCell>
                          {getManagerName(sale.managerId)}
                        </TableCell>
                        <TableCell className="text-green-400 font-semibold">
                          ${sale.totalAmount.toLocaleString()}
                        </TableCell>
                        <TableCell className="text-xs text-gray-400 max-w-xs truncate">
                          {sale.notes || "-"}
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell
                        colSpan={6}
                        className="text-center text-muted-foreground py-8"
                      >
                        No sales yet
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
    </CRMLayout>
  );
}
