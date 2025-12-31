import { useState } from "react";
import { useTranslation } from "react-i18next";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  User,
  Phone,
  Mail,
  MessageCircle,
  Calendar,
  Target,
  TrendingUp,
  ExternalLink,
  Clock,
} from "lucide-react";
import { format } from "date-fns";

interface LeadDetailModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  lead: any;
  comments?: any[];
  messages?: any[];
}

export function LeadDetailModal({
  open,
  onOpenChange,
  lead,
  comments = [],
  messages = [],
}: LeadDetailModalProps) {
  const { t } = useTranslation();

  if (!lead) return null;

  // Calculate lead score breakdown (mock data - replace with real calculation)
  const scoreBreakdown = {
    engagement: 25,
    demographics: 20,
    behavior: 18,
    source: 13,
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-zinc-900 border-zinc-800">
        <DialogHeader>
          <DialogTitle className="text-2xl flex items-center gap-2">
            <User className="w-6 h-6" />
            {lead.name}
          </DialogTitle>
          <DialogDescription>
            {t("leadDetail.subtitle") || "Complete lead information and activity history"}
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-4 bg-zinc-800">
            <TabsTrigger value="overview">{t("leadDetail.overview") || "Overview"}</TabsTrigger>
            <TabsTrigger value="conversations">{t("leadDetail.conversations") || "Conversations"}</TabsTrigger>
            <TabsTrigger value="utm">{t("leadDetail.utm") || "UTM Data"}</TabsTrigger>
            <TabsTrigger value="timeline">{t("leadDetail.timeline") || "Timeline"}</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-4">
            {/* Contact Information */}
            <Card className="bg-zinc-800 border-zinc-700">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <User className="w-5 h-5" />
                  {t("leadDetail.contactInfo") || "Contact Information"}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-gray-400" />
                  <span className="text-sm">{lead.phone || "-"}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-gray-400" />
                  <span className="text-sm">{lead.email || "-"}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MessageCircle className="w-4 h-4 text-gray-400" />
                  <span className="text-sm">{lead.telegram || "-"}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-gray-400" />
                  <span className="text-sm">
                    {t("leadDetail.created") || "Created"}: {format(new Date(lead.createdAt), "PPpp")}
                  </span>
                </div>
              </CardContent>
            </Card>

            {/* Lead Score Breakdown */}
            <Card className="bg-zinc-800 border-zinc-700">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Target className="w-5 h-5" />
                  {t("leadDetail.scoreBreakdown") || "Lead Score Breakdown"}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center">
                  <div className="text-4xl font-bold text-blue-400">{lead.leadScore || 0}</div>
                  <div className="text-sm text-gray-400">{t("leadDetail.totalScore") || "Total Score"}</div>
                </div>

                <div className="space-y-3">
                  {Object.entries(scoreBreakdown).map(([key, value]) => (
                    <div key={key}>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="capitalize">{t(`leadDetail.score.${key}`) || key}</span>
                        <span className="text-blue-400">{value}</span>
                      </div>
                      <div className="w-full bg-zinc-700 rounded-full h-2">
                        <div
                          className="bg-blue-500 h-2 rounded-full transition-all"
                          style={{ width: `${value}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Source & Quiz Info */}
            <Card className="bg-zinc-800 border-zinc-700">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <TrendingUp className="w-5 h-5" />
                  {t("leadDetail.sourceInfo") || "Source Information"}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-400">{t("common.source") || "Source"}:</span>
                  <Badge variant="secondary">{lead.source || "Unknown"}</Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-400">{t("common.quiz") || "Quiz"}:</span>
                  <span className="text-sm">{lead.quizName || "-"}</span>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Conversations Tab */}
          <TabsContent value="conversations" className="space-y-4">
            <Card className="bg-zinc-800 border-zinc-700">
              <CardHeader>
                <CardTitle className="text-lg">
                  {t("leadDetail.allConversations") || "All Conversations"}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 max-h-96 overflow-y-auto">
                {messages.length === 0 && comments.length === 0 ? (
                  <p className="text-center text-gray-400 py-8">
                    {t("leadDetail.noConversations") || "No conversations yet"}
                  </p>
                ) : (
                  <>
                    {messages.map((msg: any) => (
                      <div key={msg.id} className="bg-zinc-700 p-3 rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <Badge variant="outline">{msg.platform}</Badge>
                          <span className="text-xs text-gray-400">
                            {format(new Date(msg.createdAt), "PPpp")}
                          </span>
                        </div>
                        <p className="text-sm">{msg.content}</p>
                      </div>
                    ))}
                    {comments.map((comment: any) => (
                      <div key={comment.id} className="bg-zinc-700 p-3 rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <Badge variant="outline">Comment</Badge>
                          <span className="text-xs text-gray-400">
                            {format(new Date(comment.createdAt), "PPpp")}
                          </span>
                        </div>
                        <p className="text-sm">{comment.content}</p>
                      </div>
                    ))}
                  </>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* UTM Data Tab */}
          <TabsContent value="utm" className="space-y-4">
            <Card className="bg-zinc-800 border-zinc-700">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <ExternalLink className="w-5 h-5" />
                  {t("leadDetail.utmParameters") || "UTM Parameters"}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <span className="text-sm text-gray-400">{t("crm.campaign") || "Campaign"}:</span>
                    <p className="text-sm font-medium">{lead.utmCampaign || "-"}</p>
                  </div>
                  <div>
                    <span className="text-sm text-gray-400">{t("common.utm_source") || "Source"}:</span>
                    <p className="text-sm font-medium">{lead.utmSource || "-"}</p>
                  </div>
                  <div>
                    <span className="text-sm text-gray-400">{t("common.utm_medium") || "Medium"}:</span>
                    <p className="text-sm font-medium">{lead.utmMedium || "-"}</p>
                  </div>
                  <div>
                    <span className="text-sm text-gray-400">{t("crm.adGroup") || "Ad Group"}:</span>
                    <p className="text-sm font-medium">{lead.utmAdGroup || "-"}</p>
                  </div>
                  <div>
                    <span className="text-sm text-gray-400">{t("crm.ad") || "Ad"}:</span>
                    <p className="text-sm font-medium">{lead.utmAd || "-"}</p>
                  </div>
                  <div>
                    <span className="text-sm text-gray-400">{t("crm.placement") || "Placement"}:</span>
                    <p className="text-sm font-medium">{lead.utmPlacement || "-"}</p>
                  </div>
                  <div>
                    <span className="text-sm text-gray-400">{t("crm.keyword") || "Keyword"}:</span>
                    <p className="text-sm font-medium">{lead.utmKeyword || "-"}</p>
                  </div>
                  <div>
                    <span className="text-sm text-gray-400">{t("crm.site") || "Site"}:</span>
                    <p className="text-sm font-medium">{lead.utmSite || "-"}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Timeline Tab */}
          <TabsContent value="timeline" className="space-y-4">
            <Card className="bg-zinc-800 border-zinc-700">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Clock className="w-5 h-5" />
                  {t("leadDetail.activityTimeline") || "Activity Timeline"}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 max-h-96 overflow-y-auto">
                {/* Lead Created Event */}
                <div className="flex gap-4">
                  <div className="flex flex-col items-center">
                    <div className="w-3 h-3 bg-blue-500 rounded-full" />
                    <div className="w-0.5 h-full bg-zinc-700" />
                  </div>
                  <div className="flex-1 pb-4">
                    <p className="text-sm font-medium">{t("leadDetail.leadCreated") || "Lead Created"}</p>
                    <p className="text-xs text-gray-400">{format(new Date(lead.createdAt), "PPpp")}</p>
                  </div>
                </div>

                {/* Messages and Comments Timeline */}
                {[...messages, ...comments]
                  .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
                  .map((item: any, index: number) => (
                    <div key={`${item.id}-${index}`} className="flex gap-4">
                      <div className="flex flex-col items-center">
                        <div className="w-3 h-3 bg-green-500 rounded-full" />
                        {index < messages.length + comments.length - 1 && (
                          <div className="w-0.5 h-full bg-zinc-700" />
                        )}
                      </div>
                      <div className="flex-1 pb-4">
                        <p className="text-sm font-medium">
                          {"platform" in item
                            ? t("leadDetail.messageSent") || "Message Sent"
                            : t("leadDetail.commentAdded") || "Comment Added"}
                        </p>
                        <p className="text-xs text-gray-400">{format(new Date(item.createdAt), "PPpp")}</p>
                        <p className="text-sm text-gray-300 mt-1">{item.content}</p>
                      </div>
                    </div>
                  ))}

                {messages.length === 0 && comments.length === 0 && (
                  <p className="text-center text-gray-400 py-8">
                    {t("leadDetail.noActivity") || "No activity yet"}
                  </p>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
