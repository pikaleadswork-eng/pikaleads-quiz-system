import { useState } from "react";
import { useTranslation } from "react-i18next";
import DashboardLayout from "@/components/DashboardLayout";
import { useLocation } from "wouter";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ArrowLeft, Download, Trophy, TrendingUp, Clock } from "lucide-react";
import { format } from "date-fns";

export default function AdminPerformance() {
  const { t } = useTranslation();
  const [, setLocation] = useLocation();
  const { data: performance, isLoading } = trpc.admin.getManagerPerformance.useQuery();

  const exportToCSV = () => {
    if (!performance || performance.length === 0) return;

    const headers = [
      "Manager",
      "Email",
      "Total Assigned",
      "Total Processed",
      "Avg Response Time (hours)",
      "Conversion Rate (%)",
    ];

    const rows = performance.map((m: any) => [
      m.managerName,
      m.managerEmail,
      m.totalAssigned,
      m.totalProcessed,
      m.avgResponseTime?.toFixed(2) || "N/A",
      m.conversionRate,
    ]);

    const csvContent = [headers, ...rows].map((row) => row.join(",")).join("\\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);

    link.setAttribute("href", url);
    link.setAttribute(
      "download",
      `manager_performance_${format(new Date(), "yyyy-MM-dd")}.csv`
    );
    link.style.visibility = "hidden";

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  const topPerformer = performance?.[0];

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div className="flex items-center gap-4 mb-8">
          <Button variant="ghost" size="icon" onClick={() => setLocation("/admin")}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-foreground">{t("performance.title")}</h1>
            <p className="text-muted-foreground mt-1">
              {t("performance.description")}
            </p>
          </div>
          <Button onClick={exportToCSV} disabled={!performance || performance.length === 0}>
            <Download className="w-4 h-4 mr-2" />
            {t("performance.exportCSV")}
          </Button>
        </div>

        {/* Top Performer Card */}
        {topPerformer && (
          <Card className="p-6 mb-8 bg-gradient-to-r from-yellow-500/10 to-orange-500/10 border-yellow-500/20">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-yellow-500/20 flex items-center justify-center">
                <Trophy className="w-6 h-6 text-yellow-500" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-foreground">
                  🏆 {t("performance.topPerformer")}: {topPerformer.managerName}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {topPerformer.totalProcessed} {t("performance.leadsProcessed")} •{" "}
                  {topPerformer.conversionRate}% {t("performance.conversionRate")}
                </p>
              </div>
            </div>
          </Card>
        )}

        {/* Performance Table */}
        <Card className="p-6">
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{t("performance.rank")}</TableHead>
                  <TableHead>{t("performance.manager")}</TableHead>
                  <TableHead>{t("common.email")}</TableHead>
                  <TableHead className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <TrendingUp className="w-4 h-4" />
                      {t("performance.assigned")}
                    </div>
                  </TableHead>
                  <TableHead className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <TrendingUp className="w-4 h-4" />
                      {t("performance.processed")}
                    </div>
                  </TableHead>
                  <TableHead className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Clock className="w-4 h-4" />
                      {t("performance.avgResponse")}
                    </div>
                  </TableHead>
                  <TableHead className="text-right">{t("performance.conversionRate")}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {performance && performance.length > 0 ? (
                  performance.map((manager: any, index: number) => (
                    <TableRow key={manager.managerId}>
                      <TableCell className="font-medium">
                        {index === 0 && "🥇"}
                        {index === 1 && "🥈"}
                        {index === 2 && "🥉"}
                        {index > 2 && `#${index + 1}`}
                      </TableCell>
                      <TableCell className="font-medium">{manager.managerName}</TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {manager.managerEmail}
                      </TableCell>
                      <TableCell className="text-right font-mono">
                        {manager.totalAssigned}
                      </TableCell>
                      <TableCell className="text-right font-mono">
                        {manager.totalProcessed}
                      </TableCell>
                      <TableCell className="text-right font-mono">
                        {manager.avgResponseTime?.toFixed(2) || "N/A"}
                      </TableCell>
                      <TableCell className="text-right">
                        <span
                          className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                            manager.conversionRate >= 50
                              ? "bg-green-500/10 text-green-500"
                              : manager.conversionRate >= 25
                              ? "bg-yellow-500/10 text-yellow-500"
                              : "bg-red-500/10 text-red-500"
                          }`}
                        >
                          {manager.conversionRate}%
                        </span>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center text-muted-foreground py-8">
                      {t("performance.noData")}
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </Card>

        {/* Team Statistics */}
        {performance && performance.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-8">
            <Card className="p-6">
              <h3 className="text-sm font-medium text-muted-foreground mb-2">
                {t("performance.totalManagers")}
              </h3>
              <p className="text-3xl font-bold text-foreground">{performance.length}</p>
            </Card>
            <Card className="p-6">
              <h3 className="text-sm font-medium text-muted-foreground mb-2">
                {t("performance.totalAssigned")}
              </h3>
              <p className="text-3xl font-bold text-foreground">
                {performance.reduce((sum: number, m: any) => sum + m.totalAssigned, 0)}
              </p>
            </Card>
            <Card className="p-6">
              <h3 className="text-sm font-medium text-muted-foreground mb-2">
                {t("performance.totalProcessed")}
              </h3>
              <p className="text-3xl font-bold text-foreground">
                {performance.reduce((sum: number, m: any) => sum + m.totalProcessed, 0)}
              </p>
            </Card>
            <Card className="p-6">
              <h3 className="text-sm font-medium text-muted-foreground mb-2">
                {t("performance.teamAvgConversion")}
              </h3>
              <p className="text-3xl font-bold text-foreground">
                {Math.round(
                  performance.reduce((sum: number, m: any) => sum + m.conversionRate, 0) /
                    performance.length
                )}
                %
              </p>
            </Card>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
