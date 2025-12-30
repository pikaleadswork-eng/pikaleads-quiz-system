import { useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";

import { useTranslation } from "react-i18next";
import { Plus, Webhook, Trash2, TestTube, CheckCircle, XCircle, Clock } from "lucide-react";

export default function AdminWebhooks() {
  const { t } = useTranslation();
  const toast = (opts: { title: string; description?: string; variant?: string }) => {
    alert(`${opts.title}${opts.description ? '\n' + opts.description : ''}`);
  };
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [selectedWebhook, setSelectedWebhook] = useState<number | null>(null);
  
  const { data: webhooks, refetch } = trpc.webhooks.getAll.useQuery();
  const createMutation = trpc.webhooks.create.useMutation();
  const updateMutation = trpc.webhooks.update.useMutation();
  const deleteMutation = trpc.webhooks.delete.useMutation();
  const testMutation = trpc.webhooks.test.useMutation();

  const [formData, setFormData] = useState({
    name: "",
    type: "custom" as "hubspot" | "salesforce" | "custom",
    url: "",
    headers: "",
    events: JSON.stringify(["lead.created"]),
    apiKey: "",
    config: "",
  });

  const handleCreate = async () => {
    try {
      await createMutation.mutateAsync(formData);
      toast({
        title: t("webhooks.created"),
        description: t("webhooks.createdDescription"),
      });
      setIsCreateOpen(false);
      refetch();
      // Reset form
      setFormData({
        name: "",
        type: "custom",
        url: "",
        headers: "",
        events: JSON.stringify(["lead.created"]),
        apiKey: "",
        config: "",
      });
    } catch (error: any) {
      toast({
        title: t("webhooks.error"),
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm(t("webhooks.confirmDelete"))) return;
    
    try {
      await deleteMutation.mutateAsync({ id });
      toast({
        title: t("webhooks.deleted"),
        description: t("webhooks.deletedDescription"),
      });
      refetch();
    } catch (error: any) {
      toast({
        title: t("webhooks.error"),
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleTest = async (id: number) => {
    try {
      const result = await testMutation.mutateAsync({ id });
      toast({
        title: result.success ? t("webhooks.testSuccess") : t("webhooks.testFailed"),
        description: `Status: ${result.statusCode}`,
        variant: result.success ? "default" : "destructive",
      });
    } catch (error: any) {
      toast({
        title: t("webhooks.testFailed"),
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleToggleActive = async (id: number, isActive: boolean) => {
    try {
      await updateMutation.mutateAsync({ id, isActive: !isActive });
      toast({
        title: t("webhooks.updated"),
        description: t("webhooks.updatedDescription"),
      });
      refetch();
    } catch (error: any) {
      toast({
        title: t("webhooks.error"),
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const presets = {
    hubspot: {
      name: "HubSpot Integration",
      url: "https://api.hubapi.com/crm/v3/objects/contacts",
      events: JSON.stringify(["lead.created"]),
      headers: JSON.stringify({
        "Content-Type": "application/json",
      }),
    },
    salesforce: {
      name: "Salesforce Integration",
      url: "https://your-instance.salesforce.com/services/data/v58.0/sobjects/Lead",
      events: JSON.stringify(["lead.created"]),
      headers: JSON.stringify({
        "Content-Type": "application/json",
      }),
    },
  };

  const applyPreset = (type: "hubspot" | "salesforce") => {
    const preset = presets[type];
    setFormData({
      ...formData,
      type,
      name: preset.name,
      url: preset.url,
      events: preset.events,
      headers: preset.headers,
    });
  };

  return (
    <DashboardLayout>
      <div className="container mx-auto py-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">{t("webhooks.title")}</h1>
            <p className="text-muted-foreground">{t("webhooks.description")}</p>
          </div>
          <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                {t("webhooks.create")}
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>{t("webhooks.createTitle")}</DialogTitle>
                <DialogDescription>{t("webhooks.createDescription")}</DialogDescription>
              </DialogHeader>
              
              <div className="space-y-4">
                {/* Preset buttons */}
                <div className="flex gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => applyPreset("hubspot")}
                  >
                    HubSpot
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => applyPreset("salesforce")}
                  >
                    Salesforce
                  </Button>
                </div>

                <div>
                  <Label htmlFor="name">{t("webhooks.name")}</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder={t("webhooks.namePlaceholder")}
                  />
                </div>

                <div>
                  <Label htmlFor="type">{t("webhooks.type")}</Label>
                  <Select
                    value={formData.type}
                    onValueChange={(value: any) => setFormData({ ...formData, type: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="custom">{t("webhooks.typeCustom")}</SelectItem>
                      <SelectItem value="hubspot">HubSpot</SelectItem>
                      <SelectItem value="salesforce">Salesforce</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="url">{t("webhooks.url")}</Label>
                  <Input
                    id="url"
                    type="url"
                    value={formData.url}
                    onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                    placeholder="https://api.example.com/webhook"
                  />
                </div>

                {(formData.type === "hubspot" || formData.type === "salesforce") && (
                  <div>
                    <Label htmlFor="apiKey">{t("webhooks.apiKey")}</Label>
                    <Input
                      id="apiKey"
                      type="password"
                      value={formData.apiKey}
                      onChange={(e) => setFormData({ ...formData, apiKey: e.target.value })}
                      placeholder={t("webhooks.apiKeyPlaceholder")}
                    />
                  </div>
                )}

                <div>
                  <Label htmlFor="events">{t("webhooks.events")}</Label>
                  <Textarea
                    id="events"
                    value={formData.events}
                    onChange={(e) => setFormData({ ...formData, events: e.target.value })}
                    placeholder='["lead.created", "lead.updated"]'
                    rows={2}
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    {t("webhooks.eventsHelp")}
                  </p>
                </div>

                <div>
                  <Label htmlFor="headers">{t("webhooks.headers")}</Label>
                  <Textarea
                    id="headers"
                    value={formData.headers}
                    onChange={(e) => setFormData({ ...formData, headers: e.target.value })}
                    placeholder='{"Authorization": "Bearer token", "X-Custom-Header": "value"}'
                    rows={3}
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    {t("webhooks.headersHelp")}
                  </p>
                </div>
              </div>

              <DialogFooter>
                <Button variant="outline" onClick={() => setIsCreateOpen(false)}>
                  {t("common.cancel")}
                </Button>
                <Button onClick={handleCreate} disabled={createMutation.isPending}>
                  {createMutation.isPending ? t("common.creating") : t("common.create")}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        {/* Webhooks list */}
        <div className="grid gap-4">
          {webhooks?.length === 0 && (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <Webhook className="h-12 w-12 text-muted-foreground mb-4" />
                <p className="text-muted-foreground">{t("webhooks.empty")}</p>
              </CardContent>
            </Card>
          )}

          {webhooks?.map((webhook) => (
            <Card key={webhook.id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <CardTitle className="flex items-center gap-2">
                      {webhook.name}
                      <Badge variant={webhook.type === "custom" ? "secondary" : "default"}>
                        {webhook.type}
                      </Badge>
                      {webhook.isActive ? (
                        <Badge variant="default" className="bg-green-500">
                          <CheckCircle className="mr-1 h-3 w-3" />
                          {t("webhooks.active")}
                        </Badge>
                      ) : (
                        <Badge variant="secondary">
                          <XCircle className="mr-1 h-3 w-3" />
                          {t("webhooks.inactive")}
                        </Badge>
                      )}
                    </CardTitle>
                    <CardDescription className="font-mono text-xs">
                      {webhook.url}
                    </CardDescription>
                    {webhook.lastTriggeredAt && (
                      <p className="text-xs text-muted-foreground flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {t("webhooks.lastTriggered")}: {new Date(webhook.lastTriggeredAt).toLocaleString()}
                      </p>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <Switch
                      checked={webhook.isActive}
                      onCheckedChange={() => handleToggleActive(webhook.id, webhook.isActive)}
                    />
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleTest(webhook.id)}
                      disabled={testMutation.isPending}
                    >
                      <TestTube className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDelete(webhook.id)}
                      disabled={deleteMutation.isPending}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm">
                  <div>
                    <span className="font-medium">{t("webhooks.events")}:</span>{" "}
                    <code className="text-xs bg-muted px-1 py-0.5 rounded">
                      {webhook.events}
                    </code>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}
