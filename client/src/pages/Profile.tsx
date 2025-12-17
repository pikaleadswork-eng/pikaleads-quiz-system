import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { Loader2, Info } from "lucide-react";

export default function Profile() {
  const { t } = useTranslation();
  const { data: profile, isLoading } = trpc.profile.getProfile.useQuery();
  const updateProfileMutation = trpc.profile.updateProfile.useMutation({
    onSuccess: () => {
      toast.success(t("profile.updateSuccess", "Profile updated successfully"));
    },
    onError: (error) => {
      toast.error(error.message || t("profile.updateError", "Failed to update profile"));
    },
  });

  const [formData, setFormData] = useState({
    name: "",
    telegramChatId: "",
  });

  useEffect(() => {
    if (profile) {
      setFormData({
        name: profile.name || "",
        telegramChatId: profile.telegramChatId || "",
      });
    }
  }, [profile]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfileMutation.mutate(formData);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="container max-w-4xl py-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">{t("profile.title", "Profile Settings")}</h1>
        <p className="text-muted-foreground mt-2">
          {t("profile.description", "Manage your account settings and preferences")}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Information */}
        <Card>
          <CardHeader>
            <CardTitle>{t("profile.basicInfo", "Basic Information")}</CardTitle>
            <CardDescription>
              {t("profile.basicInfoDesc", "Your personal information")}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">{t("common.name", "Name")}</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder={t("profile.namePlaceholder", "Enter your name")}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">{t("common.email", "Email")}</Label>
              <Input
                id="email"
                type="email"
                value={profile?.email || ""}
                disabled
                className="bg-muted"
              />
              <p className="text-sm text-muted-foreground">
                {t("profile.emailReadonly", "Email cannot be changed")}
              </p>
            </div>

            <div className="space-y-2">
              <Label>{t("profile.role", "Role")}</Label>
              <Input
                value={profile?.role || ""}
                disabled
                className="bg-muted capitalize"
              />
            </div>
          </CardContent>
        </Card>

        {/* Telegram Notifications */}
        <Card>
          <CardHeader>
            <CardTitle>{t("profile.telegramNotifications", "Telegram Notifications")}</CardTitle>
            <CardDescription>
              {t("profile.telegramDesc", "Receive personal notifications about scheduled calls and meetings")}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="telegramChatId">
                {t("profile.telegramChatId", "Telegram Chat ID")}
              </Label>
              <Input
                id="telegramChatId"
                value={formData.telegramChatId}
                onChange={(e) => setFormData({ ...formData, telegramChatId: e.target.value })}
                placeholder="123456789"
              />
            </div>

            <div className="rounded-lg bg-muted p-4 space-y-3">
              <div className="flex items-start gap-2">
                <Info className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                <div className="space-y-2 text-sm">
                  <p className="font-medium">{t("profile.howToGetChatId", "How to get your Telegram Chat ID:")}</p>
                  <ol className="list-decimal list-inside space-y-1 text-muted-foreground">
                    <li>{t("profile.step1", "Open Telegram and search for @userinfobot")}</li>
                    <li>{t("profile.step2", "Start a conversation with the bot")}</li>
                    <li>{t("profile.step3", "The bot will send you your Chat ID")}</li>
                    <li>{t("profile.step4", "Copy the number and paste it here")}</li>
                  </ol>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Save Button */}
        <div className="flex justify-end">
          <Button
            type="submit"
            disabled={updateProfileMutation.isPending}
            className="min-w-[120px]"
          >
            {updateProfileMutation.isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {t("common.saving", "Saving...")}
              </>
            ) : (
              t("common.save", "Save Changes")
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
