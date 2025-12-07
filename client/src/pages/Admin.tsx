import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Download, Loader2, Settings, TrendingUp, Users } from "lucide-react";
import { Link } from "wouter";
import { format } from "date-fns";

export default function Admin() {
  const { data: leads, isLoading } = trpc.admin.getLeads.useQuery();
  const [exportingCSV, setExportingCSV] = useState(false);

  const exportToCSV = () => {
    if (!leads || leads.length === 0) return;

    setExportingCSV(true);
    
    // CSV headers
    const headers = ["ID", "Quiz", "Name", "Phone", "Telegram", "Language", "Answers", "Date"];
    
    // CSV rows
    const rows = leads.map((lead) => [
      lead.id,
      lead.quizName,
      lead.name,
      lead.phone,
      lead.telegram || "",
      lead.language || "",
      `"${lead.answers.replace(/"/g, '""')}"`, // Escape quotes in JSON
      format(new Date(lead.createdAt), "yyyy-MM-dd HH:mm:ss"),
    ]);

    // Combine headers and rows
    const csvContent = [headers, ...rows]
      .map((row) => row.join(","))
      .join("\n");

    // Create download link
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    
    link.setAttribute("href", url);
    link.setAttribute("download", `pikaleads_export_${format(new Date(), "yyyy-MM-dd")}.csv`);
    link.style.visibility = "hidden";
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    setTimeout(() => setExportingCSV(false), 500);
  };

  const stats = leads
    ? {
        total: leads.length,
        byQuiz: leads.reduce((acc, lead) => {
          acc[lead.quizName] = (acc[lead.quizName] || 0) + 1;
          return acc;
        }, {} as Record<string, number>),
        byLanguage: leads.reduce((acc, lead) => {
          const lang = lead.language || "unknown";
          acc[lang] = (acc[lang] || 0) + 1;
          return acc;
        }, {} as Record<string, number>),
      }
    : null;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-black text-foreground mb-2">PIKALEADS Admin</h1>
            <p className="text-muted-foreground">Manage leads and view statistics</p>
          </div>
          <div className="flex gap-2">
            <Link href="/admin/quizzes">
              <Button variant="outline" className="gap-2">
                <Settings className="w-4 h-4" />
                Manage Quizzes
              </Button>
            </Link>
            <Link href="/admin/ab-tests">
              <Button variant="outline" className="gap-2">
                <TrendingUp className="w-4 h-4" />
                A/B Tests
              </Button>
            </Link>
            <Link href="/admin/managers">
              <Button variant="outline" className="gap-2">
                <Users className="w-4 h-4" />
                Managers
              </Button>
            </Link>
            <Link href="/crm">
              <Button variant="outline" className="gap-2">
                <Users className="w-4 h-4" />
                CRM
              </Button>
            </Link>
            <Button
              onClick={exportToCSV}
              disabled={!leads || leads.length === 0 || exportingCSV}
              className="gap-2"
            >
              {exportingCSV ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Download className="w-4 h-4" />
              )}
              Export to CSV
            </Button>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle>Total Leads</CardTitle>
              <CardDescription>All time</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-4xl font-black text-primary">{stats?.total || 0}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>By Quiz</CardTitle>
              <CardDescription>Top performing</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {stats &&
                  Object.entries(stats.byQuiz)
                    .sort(([, a], [, b]) => b - a)
                    .slice(0, 3)
                    .map(([quiz, count]) => (
                      <div key={quiz} className="flex justify-between text-sm">
                        <span className="text-muted-foreground">{quiz}</span>
                        <span className="font-bold text-foreground">{count}</span>
                      </div>
                    ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>By Language</CardTitle>
              <CardDescription>Distribution</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {stats &&
                  Object.entries(stats.byLanguage)
                    .sort(([, a], [, b]) => b - a)
                    .map(([lang, count]) => (
                      <div key={lang} className="flex justify-between text-sm">
                        <span className="text-muted-foreground uppercase">{lang}</span>
                        <span className="font-bold text-foreground">{count}</span>
                      </div>
                    ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Leads Table */}
        <Card>
          <CardHeader>
            <CardTitle>All Leads</CardTitle>
            <CardDescription>
              {leads?.length || 0} total submissions
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Quiz</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Phone</TableHead>
                    <TableHead>Telegram</TableHead>
                    <TableHead>Lang</TableHead>
                    <TableHead>Answers</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {leads && leads.length > 0 ? (
                    leads.map((lead) => (
                      <TableRow key={lead.id}>
                        <TableCell className="font-mono text-xs">{lead.id}</TableCell>
                        <TableCell className="text-xs">
                          {format(new Date(lead.createdAt), "MMM dd, HH:mm")}
                        </TableCell>
                        <TableCell className="font-medium">{lead.quizName}</TableCell>
                        <TableCell>{lead.name}</TableCell>
                        <TableCell className="font-mono text-xs">{lead.phone}</TableCell>
                        <TableCell className="text-xs">{lead.telegram || "-"}</TableCell>
                        <TableCell className="uppercase text-xs">{lead.language || "-"}</TableCell>
                        <TableCell className="max-w-xs truncate text-xs text-muted-foreground">
                          {lead.answers}
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={8} className="text-center text-muted-foreground py-8">
                        No leads yet
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
