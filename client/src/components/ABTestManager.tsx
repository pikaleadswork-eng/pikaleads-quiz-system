import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Plus,
  TrendingUp,
  TrendingDown,
  Trophy,
  Users,
  Target,
  BarChart3,
  Play,
  Pause,
  Copy,
  Trash2,
} from "lucide-react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";

interface ABTestVariant {
  id: number;
  quizId: string;
  variantName: string;
  isControl: number;
  trafficPercentage: number;
  isActive: number;
  title: string | null;
  subtitle: string | null;
  bonus: string | null;
  questions: string | null;
  createdAt: Date;
  updatedAt: Date;
}

interface VariantStats {
  variantId: number;
  variantName: string;
  impressions: number;
  conversions: number;
  conversionRate: number;
  isWinner: boolean;
  confidenceLevel: number;
}

interface ABTestManagerProps {
  quizId: string;
}

export default function ABTestManager({ quizId }: ABTestManagerProps) {
  const { t } = useTranslation();
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [formData, setFormData] = useState({
    variantName: "",
    title: "",
    subtitle: "",
    trafficPercentage: 50,
  });

  const { data: variants, refetch: refetchVariants } =
    trpc.abTest.getVariants.useQuery({ quizId });

  const { data: stats } = trpc.abTest.getStats.useQuery(
    { quizId },
    {
      refetchInterval: 5000, // Refresh every 5 seconds for real-time updates
    }
  );

  const createVariantMutation = trpc.abTest.createVariant.useMutation({
    onSuccess: () => {
      toast.success(t("abTest.variantCreated"));
      setIsCreateOpen(false);
      resetForm();
      refetchVariants();
    },
    onError: (error) => {
      toast.error(error.message || t("abTest.createError"));
    },
  });

  const toggleVariantMutation = trpc.abTest.toggleVariant.useMutation({
    onSuccess: () => {
      toast.success(t("abTest.statusUpdated"));
      refetchVariants();
    },
    onError: (error) => {
      toast.error(error.message || t("abTest.toggleError"));
    },
  });

  const deleteVariantMutation = trpc.abTest.deleteVariant.useMutation({
    onSuccess: () => {
      toast.success(t("abTest.variantDeleted"));
      refetchVariants();
    },
    onError: (error) => {
      toast.error(error.message || t("abTest.deleteError"));
    },
  });

  const resetForm = () => {
    setFormData({
      variantName: "",
      title: "",
      subtitle: "",
      trafficPercentage: 50,
    });
  };

  const handleCreate = () => {
    if (!formData.variantName || !formData.title) {
      toast.error(t("abTest.fillRequired"));
      return;
    }

    createVariantMutation.mutate({
      quizId,
      variantName: formData.variantName,
      title: formData.title,
      subtitle: formData.subtitle,
      trafficPercentage: formData.trafficPercentage,
    });
  };

  const handleToggle = (variantId: number, currentStatus: number) => {
    toggleVariantMutation.mutate({
      variantId,
      isActive: currentStatus === 1 ? 0 : 1,
    });
  };

  const handleDelete = (variantId: number) => {
    if (confirm(t("abTest.deleteConfirm"))) {
      deleteVariantMutation.mutate({ variantId });
    }
  };

  const getWinner = (): VariantStats | null => {
    if (!stats || stats.length < 2) return null;

    // Find variant with highest conversion rate and sufficient confidence
    const sortedStats = [...stats].sort(
      (a, b) => b.conversionRate - a.conversionRate
    );
    const topVariant = sortedStats[0];

    // Winner criteria: conversion rate > 5% and confidence > 95%
    if (
      topVariant.conversionRate > 5 &&
      topVariant.confidenceLevel > 95 &&
      topVariant.impressions > 100
    ) {
      return topVariant;
    }

    return null;
  };

  const winner = getWinner();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">
            {t("abTest.title")}
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            {t("abTest.subtitle")}
          </p>
        </div>
        <Button onClick={() => setIsCreateOpen(true)}>
          <Plus className="w-4 h-4 mr-2" />
          {t("abTest.createVariant")}
        </Button>
      </div>

      {/* Winner Banner */}
      {winner && (
        <Card className="bg-gradient-to-r from-yellow-500/10 to-orange-500/10 border-yellow-500/30">
          <CardContent className="py-4">
            <div className="flex items-center gap-3">
              <Trophy className="w-8 h-8 text-yellow-400" />
              <div className="flex-1">
                <h3 className="text-lg font-bold text-yellow-400">
                  {t("abTest.winnerDetected")}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {t("abTest.winnerMessage", {
                    name: winner.variantName,
                    rate: winner.conversionRate.toFixed(2),
                    confidence: winner.confidenceLevel.toFixed(1),
                  })}
                </p>
              </div>
              <Badge variant="outline" className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30">
                {winner.conversionRate.toFixed(2)}% {t("abTest.conversion")}
              </Badge>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Statistics Overview */}
      {stats && stats.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="bg-zinc-900 border-zinc-800">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <Users className="w-4 h-4 text-blue-400" />
                {t("abTest.totalImpressions")}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-foreground">
                {stats.reduce((sum: number, s: VariantStats) => sum + s.impressions, 0).toLocaleString()}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-zinc-900 border-zinc-800">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <Target className="w-4 h-4 text-green-400" />
                {t("abTest.totalConversions")}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-foreground">
                {stats.reduce((sum: number, s: VariantStats) => sum + s.conversions, 0).toLocaleString()}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-zinc-900 border-zinc-800">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-purple-400" />
                {t("abTest.avgConversionRate")}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-foreground">
                {(
                  stats.reduce((sum: number, s: VariantStats) => sum + s.conversionRate, 0) / stats.length
                ).toFixed(2)}
                %
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Variants List */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-foreground">
          {t("abTest.variants")} ({variants?.length || 0})
        </h3>

        {!variants || variants.length === 0 ? (
          <Card className="bg-zinc-900 border-zinc-800 p-12 text-center">
            <p className="text-muted-foreground mb-4">{t("abTest.noVariants")}</p>
            <Button onClick={() => setIsCreateOpen(true)}>
              <Plus className="w-4 h-4 mr-2" />
              {t("abTest.createFirstVariant")}
            </Button>
          </Card>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {variants.map((variant) => {
              const variantStats = stats?.find((s) => s.variantId === variant.id);
              const isWinner = variantStats?.variantId === winner?.variantId;

              return (
                <Card
                  key={variant.id}
                  className={`bg-zinc-900 border-zinc-800 ${
                    isWinner ? "ring-2 ring-yellow-500/50" : ""
                  }`}
                >
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <CardTitle className="text-lg">
                            {variant.variantName}
                          </CardTitle>
                          {variant.isControl === 1 && (
                            <Badge variant="outline" className="bg-blue-500/10 text-blue-400 border-blue-500/30">
                              {t("abTest.control")}
                            </Badge>
                          )}
                          {isWinner && (
                            <Trophy className="w-5 h-5 text-yellow-400" />
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground line-clamp-2">
                          {variant.title}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleToggle(variant.id, variant.isActive)}
                        >
                          {variant.isActive === 1 ? (
                            <Pause className="w-4 h-4 text-orange-400" />
                          ) : (
                            <Play className="w-4 h-4 text-green-400" />
                          )}
                        </Button>
                        {variant.isControl === 0 && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDelete(variant.id)}
                          >
                            <Trash2 className="w-4 h-4 text-red-400" />
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardHeader>

                  <CardContent className="space-y-4">
                    {/* Traffic Allocation */}
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-muted-foreground">
                          {t("abTest.trafficAllocation")}
                        </span>
                        <span className="text-sm font-medium">
                          {variant.trafficPercentage}%
                        </span>
                      </div>
                      <Progress value={variant.trafficPercentage} className="h-2" />
                    </div>

                    {/* Statistics */}
                    {variantStats && (
                      <div className="grid grid-cols-3 gap-4 pt-4 border-t border-zinc-800">
                        <div>
                          <p className="text-xs text-muted-foreground mb-1">
                            {t("abTest.impressions")}
                          </p>
                          <p className="text-lg font-bold text-foreground">
                            {variantStats.impressions.toLocaleString()}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground mb-1">
                            {t("abTest.conversions")}
                          </p>
                          <p className="text-lg font-bold text-foreground">
                            {variantStats.conversions.toLocaleString()}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground mb-1">
                            {t("abTest.conversionRate")}
                          </p>
                          <div className="flex items-center gap-1">
                            <p className="text-lg font-bold text-foreground">
                              {variantStats.conversionRate.toFixed(2)}%
                            </p>
                            {variantStats.conversionRate > 10 ? (
                              <TrendingUp className="w-4 h-4 text-green-400" />
                            ) : variantStats.conversionRate < 5 ? (
                              <TrendingDown className="w-4 h-4 text-red-400" />
                            ) : null}
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Confidence Level */}
                    {variantStats && variantStats.confidenceLevel > 0 && (
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-xs text-muted-foreground">
                            {t("abTest.confidenceLevel")}
                          </span>
                          <span className="text-xs font-medium">
                            {variantStats.confidenceLevel.toFixed(1)}%
                          </span>
                        </div>
                        <Progress
                          value={variantStats.confidenceLevel}
                          className="h-1"
                        />
                      </div>
                    )}

                    {/* Status Badge */}
                    <div className="pt-2">
                      <Badge
                        variant={variant.isActive === 1 ? "default" : "secondary"}
                        className={
                          variant.isActive === 1
                            ? "bg-green-500/20 text-green-400 border-green-500/30"
                            : "bg-gray-500/20 text-gray-400 border-gray-500/30"
                        }
                      >
                        {variant.isActive === 1
                          ? t("abTest.active")
                          : t("abTest.paused")}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>

      {/* Create Variant Dialog */}
      <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{t("abTest.createVariant")}</DialogTitle>
            <DialogDescription>{t("abTest.createDescription")}</DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <Label>{t("abTest.variantName")}</Label>
              <Input
                value={formData.variantName}
                onChange={(e) =>
                  setFormData({ ...formData, variantName: e.target.value })
                }
                placeholder={t("abTest.variantNamePlaceholder")}
                className="bg-zinc-800 border-zinc-700 mt-2"
              />
            </div>

            <div>
              <Label>{t("abTest.title")}</Label>
              <Input
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder={t("abTest.titlePlaceholder")}
                className="bg-zinc-800 border-zinc-700 mt-2"
              />
            </div>

            <div>
              <Label>{t("abTest.subtitle")}</Label>
              <Textarea
                value={formData.subtitle}
                onChange={(e) =>
                  setFormData({ ...formData, subtitle: e.target.value })
                }
                placeholder={t("abTest.subtitlePlaceholder")}
                className="bg-zinc-800 border-zinc-700 mt-2"
              />
            </div>

            <div>
              <Label>{t("abTest.trafficPercentage")}</Label>
              <div className="flex items-center gap-4 mt-2">
                <Input
                  type="number"
                  min={0}
                  max={100}
                  value={formData.trafficPercentage}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      trafficPercentage: parseInt(e.target.value) || 0,
                    })
                  }
                  className="bg-zinc-800 border-zinc-700 w-24"
                />
                <Progress value={formData.trafficPercentage} className="flex-1" />
                <span className="text-sm text-muted-foreground">
                  {formData.trafficPercentage}%
                </span>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-4">
              <Button variant="outline" onClick={() => setIsCreateOpen(false)}>
                {t("common.cancel")}
              </Button>
              <Button onClick={handleCreate} disabled={createVariantMutation.isPending}>
                {createVariantMutation.isPending
                  ? t("common.saving")
                  : t("common.create")}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
