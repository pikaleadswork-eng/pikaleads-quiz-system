import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { trpc } from "@/lib/trpc";
import { Phone, CheckCircle, XCircle, ExternalLink } from "lucide-react";
import { toast } from "sonner";

export function SettingsIPTelephony() {
  const { t } = useTranslation();
  const [apiKey, setApiKey] = useState("");
  const [apiSecret, setApiSecret] = useState("");
  const [sipNumber, setSipNumber] = useState("");

  const { data: settings } = trpc.settings.getIPTelephonySettings.useQuery();
  
  const saveSettingsMutation = trpc.settings.saveIPTelephonySettings.useMutation({
    onSuccess: () => {
      toast.success(t("common.success"));
    },
    onError: (error: any) => {
      toast.error(error.message);
    },
  });

  const testConnectionMutation = trpc.settings.testZadarmaConnection.useMutation({
    onSuccess: (data: any) => {
      if (data.success) {
        toast.success(t("ipTelephony.connectionSuccess"));
      } else {
        toast.error(t("ipTelephony.connectionFailed"));
      }
    },
    onError: (error: any) => {
      toast.error(error.message);
    },
  });

  useEffect(() => {
    if (settings) {
      setApiKey(settings.apiKey);
      setApiSecret(settings.apiSecret);
      setSipNumber(settings.sipNumber);
    }
  }, [settings]);

  const handleSave = () => {
    saveSettingsMutation.mutate({
      apiKey,
      apiSecret,
      sipNumber,
    });
  };

  const handleTestConnection = () => {
    testConnectionMutation.mutate();
  };

  return (
    <div className="container mx-auto py-8 space-y-8">
      <div>
        <h1 className="text-3xl font-bold">{t("ipTelephony.title")}</h1>
        <p className="text-muted-foreground mt-2">{t("ipTelephony.description")}</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Phone className="h-5 w-5" />
            {t("ipTelephony.zadarma")}
          </CardTitle>
          <CardDescription>
            {t("ipTelephony.howToSetup")}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="apiKey">{t("ipTelephony.apiKey")}</Label>
            <Input
              id="apiKey"
              type="password"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="Your Zadarma API Key"
            />
          </div>
          <div>
            <Label htmlFor="apiSecret">{t("ipTelephony.apiSecret")}</Label>
            <Input
              id="apiSecret"
              type="password"
              value={apiSecret}
              onChange={(e) => setApiSecret(e.target.value)}
              placeholder="Your Zadarma API Secret"
            />
          </div>
          <div>
            <Label htmlFor="sipNumber">{t("ipTelephony.sipNumber")}</Label>
            <Input
              id="sipNumber"
              value={sipNumber}
              onChange={(e) => setSipNumber(e.target.value)}
              placeholder="+1234567890"
            />
          </div>
          <div className="flex gap-2">
            <Button onClick={handleSave} disabled={saveSettingsMutation.isPending}>
              {t("common.save")}
            </Button>
            <Button 
              variant="outline" 
              onClick={handleTestConnection}
              disabled={testConnectionMutation.isPending || !apiKey || !apiSecret}
            >
              {testConnectionMutation.isPending ? (
                "Testing..."
              ) : (
                <>
                  {testConnectionMutation.data ? (
                    <CheckCircle className="mr-2 h-4 w-4 text-green-600" />
                  ) : testConnectionMutation.isError ? (
                    <XCircle className="mr-2 h-4 w-4 text-red-600" />
                  ) : null}
                  {t("ipTelephony.testConnection")}
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Integration Guide */}
      <Card>
        <CardHeader>
          <CardTitle>{t("guides.zadarma.title")}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h3 className="font-semibold">{t("guides.zadarma.step1")}</h3>
            <p className="text-sm text-muted-foreground">{t("guides.zadarma.step1Desc")}</p>
          </div>
          <div>
            <h3 className="font-semibold">{t("guides.zadarma.step2")}</h3>
            <p className="text-sm text-muted-foreground">{t("guides.zadarma.step2Desc")}</p>
          </div>
          <div>
            <h3 className="font-semibold">{t("guides.zadarma.step3")}</h3>
            <p className="text-sm text-muted-foreground">{t("guides.zadarma.step3Desc")}</p>
          </div>
          <div>
            <h3 className="font-semibold">{t("guides.zadarma.step4")}</h3>
            <p className="text-sm text-muted-foreground">{t("guides.zadarma.step4Desc")}</p>
          </div>
          <Button variant="link" asChild>
            <a href="https://zadarma.com" target="_blank" rel="noopener noreferrer">
              <ExternalLink className="mr-2 h-4 w-4" />
              {t("ipTelephony.viewGuide")}
            </a>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
