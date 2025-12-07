import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Loader2, TrendingUp, Target, Zap, Globe, Key, BarChart3, Download } from "lucide-react";
import { Link } from "wouter";

export default function AdminAnalytics() {
  const { data: analytics, isLoading } = trpc.admin.getUTMAnalytics.useQuery();

  const exportToCSV = () => {
    if (!analytics) return;

    const campaigns = analytics.topCampaigns.map(c => [
      "Campaign",
      c.name || "N/A",
      c.count,
      `${c.conversionRate}%`
    ]);

    const adGroups = analytics.topAdGroups.map(a => [
      "Ad Group",
      a.name || "N/A",
      a.count,
      `${a.conversionRate}%`
    ]);

    const ads = analytics.topAds.map(a => [
      "Ad",
      a.name || "N/A",
      a.count,
      `${a.conversionRate}%`
    ]);

    const csvContent = [
      ["Type", "Name", "Leads", "Conversion Rate"],
      ...campaigns,
      ...adGroups,
      ...ads,
    ]
      .map(row => row.join(","))
      .join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    
    link.setAttribute("href", url);
    link.setAttribute("download", `utm_analytics_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = "hidden";
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-purple-500" />
      </div>
    );
  }

  if (!analytics) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <p className="text-white">No analytics data available</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-white mb-2">
              📊 UTM Analytics Dashboard
            </h1>
            <p className="text-zinc-400">
              Track campaign performance and optimize your ad spend
            </p>
          </div>
          <div className="flex gap-2">
            <Link href="/admin">
              <Button variant="outline" className="bg-transparent border-zinc-700 text-white hover:bg-zinc-800">
                ← Back to Admin
              </Button>
            </Link>
            <Button
              onClick={exportToCSV}
              className="bg-purple-600 hover:bg-purple-700 text-white"
            >
              <Download className="w-4 h-4 mr-2" />
              Export CSV
            </Button>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-zinc-900 border-zinc-800">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-zinc-400">Total Leads</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-white">{analytics.totalLeads}</div>
            </CardContent>
          </Card>

          <Card className="bg-zinc-900 border-zinc-800">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-zinc-400">Active Campaigns</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-purple-400">{analytics.topCampaigns.length}</div>
            </CardContent>
          </Card>

          <Card className="bg-zinc-900 border-zinc-800">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-zinc-400">Ad Groups</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-yellow-400">{analytics.topAdGroups.length}</div>
            </CardContent>
          </Card>

          <Card className="bg-zinc-900 border-zinc-800">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-zinc-400">Total Ads</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-400">{analytics.topAds.length}</div>
            </CardContent>
          </Card>
        </div>

        {/* Top Campaigns */}
        <Card className="bg-zinc-900 border-zinc-800 mb-6">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-purple-400" />
              Top Campaigns
            </CardTitle>
            <CardDescription className="text-zinc-400">
              Best performing campaigns by lead count
            </CardDescription>
          </CardHeader>
          <CardContent>
            {analytics.topCampaigns.length === 0 ? (
              <p className="text-zinc-500 text-center py-8">No campaign data yet</p>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow className="border-zinc-800 hover:bg-zinc-800/50">
                    <TableHead className="text-zinc-300">Campaign</TableHead>
                    <TableHead className="text-zinc-300">Leads</TableHead>
                    <TableHead className="text-zinc-300">Conversion Rate</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {analytics.topCampaigns.map((campaign, index) => (
                    <TableRow key={index} className="border-zinc-800 hover:bg-zinc-800/50">
                      <TableCell className="text-white font-medium">
                        {campaign.name || <span className="text-zinc-500">N/A</span>}
                      </TableCell>
                      <TableCell className="text-white">
                        <Badge className="bg-purple-600 text-white">{campaign.count}</Badge>
                      </TableCell>
                      <TableCell className="text-zinc-400">
                        {campaign.conversionRate}%
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>

        {/* Top Ad Groups */}
        <Card className="bg-zinc-900 border-zinc-800 mb-6">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Target className="w-5 h-5 text-yellow-400" />
              Top Ad Groups
            </CardTitle>
            <CardDescription className="text-zinc-400">
              Best performing ad groups by lead count
            </CardDescription>
          </CardHeader>
          <CardContent>
            {analytics.topAdGroups.length === 0 ? (
              <p className="text-zinc-500 text-center py-8">No ad group data yet</p>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow className="border-zinc-800 hover:bg-zinc-800/50">
                    <TableHead className="text-zinc-300">Ad Group</TableHead>
                    <TableHead className="text-zinc-300">Leads</TableHead>
                    <TableHead className="text-zinc-300">Conversion Rate</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {analytics.topAdGroups.map((adGroup, index) => (
                    <TableRow key={index} className="border-zinc-800 hover:bg-zinc-800/50">
                      <TableCell className="text-white font-medium">
                        {adGroup.name || <span className="text-zinc-500">N/A</span>}
                      </TableCell>
                      <TableCell className="text-white">
                        <Badge className="bg-yellow-600 text-white">{adGroup.count}</Badge>
                      </TableCell>
                      <TableCell className="text-zinc-400">
                        {adGroup.conversionRate}%
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>

        {/* Top Ads */}
        <Card className="bg-zinc-900 border-zinc-800 mb-6">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Zap className="w-5 h-5 text-green-400" />
              Top Ads
            </CardTitle>
            <CardDescription className="text-zinc-400">
              Best performing ad creatives by lead count
            </CardDescription>
          </CardHeader>
          <CardContent>
            {analytics.topAds.length === 0 ? (
              <p className="text-zinc-500 text-center py-8">No ad data yet</p>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow className="border-zinc-800 hover:bg-zinc-800/50">
                    <TableHead className="text-zinc-300">Ad</TableHead>
                    <TableHead className="text-zinc-300">Leads</TableHead>
                    <TableHead className="text-zinc-300">Conversion Rate</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {analytics.topAds.map((ad, index) => (
                    <TableRow key={index} className="border-zinc-800 hover:bg-zinc-800/50">
                      <TableCell className="text-white font-medium">
                        {ad.name || <span className="text-zinc-500">N/A</span>}
                      </TableCell>
                      <TableCell className="text-white">
                        <Badge className="bg-green-600 text-white">{ad.count}</Badge>
                      </TableCell>
                      <TableCell className="text-zinc-400">
                        {ad.conversionRate}%
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>

        {/* Additional Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Top Placements */}
          <Card className="bg-zinc-900 border-zinc-800">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2 text-lg">
                <Globe className="w-5 h-5 text-blue-400" />
                Top Placements
              </CardTitle>
            </CardHeader>
            <CardContent>
              {analytics.topPlacements.length === 0 ? (
                <p className="text-zinc-500 text-sm">No data</p>
              ) : (
                <div className="space-y-3">
                  {analytics.topPlacements.slice(0, 5).map((placement, index) => (
                    <div key={index} className="flex justify-between items-center">
                      <span className="text-white text-sm truncate">
                        {placement.name || "N/A"}
                      </span>
                      <Badge className="bg-blue-600 text-white">{placement.count}</Badge>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Top Keywords */}
          <Card className="bg-zinc-900 border-zinc-800">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2 text-lg">
                <Key className="w-5 h-5 text-orange-400" />
                Top Keywords
              </CardTitle>
            </CardHeader>
            <CardContent>
              {analytics.topKeywords.length === 0 ? (
                <p className="text-zinc-500 text-sm">No data</p>
              ) : (
                <div className="space-y-3">
                  {analytics.topKeywords.slice(0, 5).map((keyword, index) => (
                    <div key={index} className="flex justify-between items-center">
                      <span className="text-white text-sm truncate">
                        {keyword.name || "N/A"}
                      </span>
                      <Badge className="bg-orange-600 text-white">{keyword.count}</Badge>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Top Sites */}
          <Card className="bg-zinc-900 border-zinc-800">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2 text-lg">
                <BarChart3 className="w-5 h-5 text-pink-400" />
                Top Sites
              </CardTitle>
            </CardHeader>
            <CardContent>
              {analytics.topSites.length === 0 ? (
                <p className="text-zinc-500 text-sm">No data</p>
              ) : (
                <div className="space-y-3">
                  {analytics.topSites.slice(0, 5).map((site, index) => (
                    <div key={index} className="flex justify-between items-center">
                      <span className="text-white text-sm truncate">
                        {site.name || "N/A"}
                      </span>
                      <Badge className="bg-pink-600 text-white">{site.count}</Badge>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
