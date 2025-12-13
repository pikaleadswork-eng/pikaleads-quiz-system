import { useState, useEffect } from "react";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2, Instagram, MessageCircle, Mail, Calendar, Save, CheckCircle2 } from "lucide-react";
import { useAuth } from "@/_core/hooks/useAuth";
import CRMLayout from "@/components/CRMLayout";
import { Link } from "wouter";
import { toast } from "sonner";
import { useTranslation } from 'react-i18next';

export default function AdminSettings() {
  const { t } = useTranslation();


  const { user, loading: authLoading } = useAuth();
  const utils = trpc.useUtils();

  // Instagram state
  const [instagramAppId, setInstagramAppId] = useState("");
  const [instagramAppSecret, setInstagramAppSecret] = useState("");
  const [instagramAccessToken, setInstagramAccessToken] = useState("");

  // WhatsApp state
  const [whatsappPhoneNumberId, setWhatsappPhoneNumberId] = useState("");
  const [whatsappAccessToken, setWhatsappAccessToken] = useState("");

  // Email SMTP state
  const [smtpHost, setSmtpHost] = useState("");
  const [smtpPort, setSmtpPort] = useState("587");
  const [smtpUsername, setSmtpUsername] = useState("");
  const [smtpPassword, setSmtpPassword] = useState("");
  const [smtpFromEmail, setSmtpFromEmail] = useState("");

  // Google Calendar state
  const [googleClientId, setGoogleClientId] = useState("");
  const [googleClientSecret, setGoogleClientSecret] = useState("");
  const [googleRedirectUri, setGoogleRedirectUri] = useState("");

  // Analytics Tracking state
  const [ga4MeasurementId, setGa4MeasurementId] = useState("");
  const [metaPixelId, setMetaPixelId] = useState("");
  const [clarityProjectId, setClarityProjectId] = useState("");

  // Load analytics settings
  useEffect(() => {
    if (analyticsSettings) {
      const ga4 = analyticsSettings.find(s => s.provider === 'ga4');
      const meta = analyticsSettings.find(s => s.provider === 'meta_pixel');
      const clarity = analyticsSettings.find(s => s.provider === 'microsoft_clarity');
      
      if (ga4) setGa4MeasurementId(ga4.trackingId);
      if (meta) setMetaPixelId(meta.trackingId);
      if (clarity) setClarityProjectId(clarity.trackingId);
    }
  }, [analyticsSettings]);

  const { data: settings, isLoading: settingsLoading } = trpc.integrations.getAll.useQuery();
  const { data: analyticsSettings, isLoading: analyticsLoading } = trpc.analyticsSettings.getAll.useQuery();

  const saveInstagramMutation = trpc.integrations.save.useMutation({
    onSuccess: () => {
      toast.success("Instagram settings saved successfully!");
      utils.integrations.getAll.invalidate();
    },
    onError: (error: any) => {
      toast.error(`Failed to save Instagram settings: ${error.message}`);
    },
  });

  const saveWhatsAppMutation = trpc.integrations.save.useMutation({
    onSuccess: () => {
      toast.success("WhatsApp settings saved successfully!");
      utils.integrations.getAll.invalidate();
    },
    onError: (error: any) => {
      toast.error(`Failed to save WhatsApp settings: ${error.message}`);
    },
  });

  const saveAnalyticsMutation = trpc.analyticsSettings.save.useMutation({
    onSuccess: () => {
      utils.analyticsSettings.getAll.invalidate();
    },
    onError: (error: any) => {
      toast.error(`Failed to save analytics settings: ${error.message}`);
    },
  });

  const saveGoogleCalendarMutation = trpc.integrations.save.useMutation({
    onSuccess: () => {
      toast.success("Google Calendar settings saved successfully!");
      utils.integrations.getAll.invalidate();
    },
    onError: (error: any) => {
      toast.error(`Failed to save Google Calendar settings: ${error.message}`);
    },
  });

  const saveSMTPMutation = trpc.integrations.save.useMutation({
    onSuccess: () => {
      toast.success("SMTP settings saved successfully!");
      utils.integrations.getAll.invalidate();
    },
    onError: (error: any) => {
      toast.error(`Failed to save SMTP settings: ${error.message}`);
    },
  });

  const handleSaveInstagram = () => {
    if (!instagramAppId || !instagramAppSecret || !instagramAccessToken) {
      toast.error("Please fill in all Instagram fields");
      return;
    }

    saveInstagramMutation.mutate({
      provider: "instagram",
      credentials: JSON.stringify({
        appId: instagramAppId,
        appSecret: instagramAppSecret,
        accessToken: instagramAccessToken,
      }),
      isActive: true,
    });
  };

  const handleSaveSMTP = () => {
    if (!smtpHost || !smtpPort || !smtpUsername || !smtpPassword || !smtpFromEmail) {
      toast.error("Please fill in all SMTP fields");
      return;
    }

    saveSMTPMutation.mutate({
      provider: "smtp",
      credentials: JSON.stringify({
        host: smtpHost,
        port: parseInt(smtpPort),
        username: smtpUsername,
        password: smtpPassword,
        fromEmail: smtpFromEmail,
      }),
      isActive: true,
    });
  };

  const handleSaveWhatsApp = () => {
    if (!whatsappPhoneNumberId || !whatsappAccessToken) {
      toast.error("Please fill in all WhatsApp fields");
      return;
    }

    saveWhatsAppMutation.mutate({
      provider: "whatsapp",
      credentials: JSON.stringify({
        phoneNumberId: whatsappPhoneNumberId,
        accessToken: whatsappAccessToken,
      }),
      isActive: true,
    });
  };

  const handleSaveGoogleCalendar = () => {
    if (!googleClientId || !googleClientSecret || !googleRedirectUri) {
      toast.error("Please fill in all Google Calendar fields");
      return;
    };

    saveGoogleCalendarMutation.mutate({
      provider: "google_calendar",
      credentials: JSON.stringify({
        clientId: googleClientId,
        clientSecret: googleClientSecret,
        redirectUri: googleRedirectUri,
      }),
      isActive: true,
    });
  };

  if (authLoading || settingsLoading) {
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

  // Load existing settings
  const instagramSettings = settings?.find((s: any) => s.provider === "instagram");
  const whatsappSettings = settings?.find((s: any) => s.provider === "whatsapp");
  const smtpSettings = settings?.find((s: any) => s.provider === "smtp");
  const googleCalendarSettings = settings?.find((s: any) => s.provider === "google_calendar");

  return (
    <CRMLayout>
        <div className="mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent">
            {t('common.settings')}
          </h1>
          <p className="text-gray-400 mt-2">
            {t('common.manage_integrations_roles_statuses_and_telephony')}
          </p>
        </div>

        {/* Quick Links to Settings Pages */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Link href="/admin/settings/roles">
            <Card className="bg-zinc-900 border-zinc-800 hover:border-purple-500 transition-all cursor-pointer">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <svg className="w-5 h-5 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                  {t('common.roles__permissions')}
                </CardTitle>
                <CardDescription>
                  {t('common.manage_user_roles_and_crm_access_permissions')}
                </CardDescription>
              </CardHeader>
            </Card>
          </Link>

          <Link href="/admin/settings/lead-statuses">
            <Card className="bg-zinc-900 border-zinc-800 hover:border-blue-500 transition-all cursor-pointer">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                  </svg>
                  {t('common.lead_statuses')}
                </CardTitle>
                <CardDescription>
                  {t('common.configure_statuses_to_track_lead_workflow_stages')}
                </CardDescription>
              </CardHeader>
            </Card>
          </Link>

          <Link href="/admin/settings/ip-telephony">
            <Card className="bg-zinc-900 border-zinc-800 hover:border-yellow-500 transition-all cursor-pointer">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <svg className="w-5 h-5 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  {t('common.ip_telephony')}
                </CardTitle>
                <CardDescription>
                  {t('common.connect_zadarma_for_in_crm_calling')}
                </CardDescription>
              </CardHeader>
            </Card>
          </Link>

          <Link href="/admin/settings/lead-assignment">
            <Card className="bg-zinc-900 border-zinc-800 hover:border-green-500 transition-all cursor-pointer">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <svg className="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {t('assignmentRules.title')}
                </CardTitle>
                <CardDescription>
                  {t('assignmentRules.description')}
                </CardDescription>
              </CardHeader>
            </Card>
          </Link>
        </div>

        <div className="mb-6">
          <h2 className="text-2xl font-bold text-white mb-2">
            {t('common.messaging_integrations')}
          </h2>
          <p className="text-gray-400">
            {t('common.configure_api_credentials_for_instagram_whatsapp_email_and_google_calendar_integration')}
          </p>
        </div>

        <Tabs defaultValue="instagram" className="w-full">
          <TabsList className="grid w-full grid-cols-5 bg-zinc-900">
            <TabsTrigger value="instagram" className="data-[state=active]:bg-zinc-800">
              <Instagram className="w-4 h-4 mr-2" />
              Instagram
            </TabsTrigger>
            <TabsTrigger value="whatsapp" className="data-[state=active]:bg-zinc-800">
              <MessageCircle className="w-4 h-4 mr-2" />
              WhatsApp
            </TabsTrigger>
            <TabsTrigger value="email" className="data-[state=active]:bg-zinc-800">
              <Mail className="w-4 h-4 mr-2" />
              Email
            </TabsTrigger>
            <TabsTrigger value="calendar" className="data-[state=active]:bg-zinc-800">
              <Calendar className="w-4 h-4 mr-2" />
              Google Calendar
            </TabsTrigger>
            <TabsTrigger value="analytics" className="data-[state=active]:bg-zinc-800">
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
              {t('settings.analytics')}
            </TabsTrigger>
          </TabsList>

          {/* Instagram Tab */}
          <TabsContent value="instagram">
            <Card className="bg-zinc-900 border-zinc-800">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Instagram className="w-5 h-5 text-pink-500" />
                  Instagram Graph API
                  {instagramSettings?.isActive && (
                    <CheckCircle2 className="w-5 h-5 text-green-500 ml-auto" />
                  )}
                </CardTitle>
                <CardDescription>
                  Configure Instagram Direct Messages integration
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label className="mb-2"htmlFor="instagram-app-id">App ID</Label>
                  <Input
                    id="instagram-app-id"
                    placeholder="Enter your Instagram App ID"
                    value={instagramAppId}
                    onChange={(e) => setInstagramAppId(e.target.value)}
                    className="bg-zinc-800 border-zinc-700"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="mb-2"htmlFor="instagram-app-secret">App Secret</Label>
                  <Input
                    id="instagram-app-secret"
                    type="password"
                    placeholder="Enter your Instagram App Secret"
                    value={instagramAppSecret}
                    onChange={(e) => setInstagramAppSecret(e.target.value)}
                    className="bg-zinc-800 border-zinc-700"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="mb-2"htmlFor="instagram-access-token">Access Token (Long-lived)</Label>
                  <Input
                    id="instagram-access-token"
                    type="password"
                    placeholder="Enter your Instagram Access Token"
                    value={instagramAccessToken}
                    onChange={(e) => setInstagramAccessToken(e.target.value)}
                    className="bg-zinc-800 border-zinc-700"
                  />
                </div>

                <div className="bg-zinc-800 p-4 rounded-lg text-sm text-gray-400">
                  <p className="font-semibold mb-2">How to get credentials:</p>
                  <ol className="list-decimal list-inside space-y-1">
                    <li>Go to <a href="https://developers.facebook.com/apps" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">Facebook Developers</a></li>
                    <li>Create a new app or select existing app</li>
                    <li>Add Instagram Graph API product</li>
                    <li>Get App ID and App Secret from Settings → Basic</li>
                    <li>Generate long-lived access token from Graph API Explorer</li>
                  </ol>
                </div>

                <Button
                  onClick={handleSaveInstagram}
                  disabled={saveInstagramMutation.isPending}
                  className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
                >
                  {saveInstagramMutation.isPending ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4 mr-2" />
                      Save Instagram Settings
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* WhatsApp Tab */}
          <TabsContent value="whatsapp">
            <Card className="bg-zinc-900 border-zinc-800">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageCircle className="w-5 h-5 text-green-500" />
                  WhatsApp Business API
                  {whatsappSettings?.isActive && (
                    <CheckCircle2 className="w-5 h-5 text-green-500 ml-auto" />
                  )}
                </CardTitle>
                <CardDescription>
                  Configure WhatsApp Business messaging integration
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label className="mb-2"htmlFor="whatsapp-phone-number-id">Phone Number ID</Label>
                  <Input
                    id="whatsapp-phone-number-id"
                    placeholder="Enter your WhatsApp Phone Number ID"
                    value={whatsappPhoneNumberId}
                    onChange={(e) => setWhatsappPhoneNumberId(e.target.value)}
                    className="bg-zinc-800 border-zinc-700"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="mb-2"htmlFor="whatsapp-access-token">Access Token</Label>
                  <Input
                    id="whatsapp-access-token"
                    type="password"
                    placeholder="Enter your WhatsApp Access Token"
                    value={whatsappAccessToken}
                    onChange={(e) => setWhatsappAccessToken(e.target.value)}
                    className="bg-zinc-800 border-zinc-700"
                  />
                </div>

                <div className="bg-zinc-800 p-4 rounded-lg text-sm text-gray-400">
                  <p className="font-semibold mb-2">How to get credentials:</p>
                  <ol className="list-decimal list-inside space-y-1">
                    <li>Go to <a href="https://developers.facebook.com/apps" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">Facebook Developers</a></li>
                    <li>Add WhatsApp product to your app</li>
                    <li>Go to WhatsApp → Getting Started</li>
                    <li>Copy Phone Number ID and Access Token</li>
                  </ol>
                </div>

                <Button
                  onClick={handleSaveWhatsApp}
                  disabled={saveWhatsAppMutation.isPending}
                  className="w-full bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600"
                >
                  {saveWhatsAppMutation.isPending ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4 mr-2" />
                      Save WhatsApp Settings
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Email Tab */}
          <TabsContent value="email">
            <Card className="bg-zinc-900 border-zinc-800">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Mail className="w-5 h-5 text-blue-500" />
                  Email (SMTP)
                  {smtpSettings?.isActive && (
                    <CheckCircle2 className="w-5 h-5 text-green-500 ml-auto" />
                  )}
                </CardTitle>
                <CardDescription>
                  Configure SMTP server for sending emails
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label className="mb-2"htmlFor="smtp-host">SMTP Host</Label>
                  <Input
                    id="smtp-host"
                    placeholder="smtp.gmail.com"
                    value={smtpHost}
                    onChange={(e) => setSmtpHost(e.target.value)}
                    className="bg-zinc-800 border-zinc-700"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="mb-2"htmlFor="smtp-port">SMTP Port</Label>
                  <Input
                    id="smtp-port"
                    placeholder="587"
                    value={smtpPort}
                    onChange={(e) => setSmtpPort(e.target.value)}
                    className="bg-zinc-800 border-zinc-700"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="mb-2"htmlFor="smtp-username">Username (Email)</Label>
                  <Input
                    id="smtp-username"
                    placeholder="your-email@gmail.com"
                    value={smtpUsername}
                    onChange={(e) => setSmtpUsername(e.target.value)}
                    className="bg-zinc-800 border-zinc-700"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="mb-2"htmlFor="smtp-password">Password (App Password)</Label>
                  <Input
                    id="smtp-password"
                    type="password"
                    placeholder="Enter your SMTP password"
                    value={smtpPassword}
                    onChange={(e) => setSmtpPassword(e.target.value)}
                    className="bg-zinc-800 border-zinc-700"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="mb-2"htmlFor="smtp-from-email">From Email</Label>
                  <Input
                    id="smtp-from-email"
                    placeholder="noreply@yourdomain.com"
                    value={smtpFromEmail}
                    onChange={(e) => setSmtpFromEmail(e.target.value)}
                    className="bg-zinc-800 border-zinc-700"
                  />
                </div>

                <div className="bg-zinc-800 p-4 rounded-lg text-sm text-gray-400">
                  <p className="font-semibold mb-2">Gmail Setup:</p>
                  <ol className="list-decimal list-inside space-y-1">
                    <li>Enable 2-Step Verification in Google Account</li>
                    <li>Go to <a href="https://myaccount.google.com/apppasswords" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">App Passwords</a></li>
                    <li>Generate new app password for "Mail"</li>
                    <li>Use generated password in "Password" field above</li>
                    <li>Host: smtp.gmail.com, Port: 587</li>
                  </ol>
                </div>

                <Button
                  onClick={handleSaveSMTP}
                  disabled={saveSMTPMutation.isPending}
                  className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600"
                >
                  {saveSMTPMutation.isPending ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4 mr-2" />
                      Save SMTP Settings
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Google Calendar Tab */}
          <TabsContent value="calendar">
            <Card className="bg-zinc-900 border-zinc-800">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-blue-500" />
                  Google Calendar API
                  {googleCalendarSettings?.isActive && (
                    <CheckCircle2 className="w-5 h-5 text-green-500 ml-auto" />
                  )}
                </CardTitle>
                <CardDescription>
                  Configure Google Calendar sync for appointments
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label className="mb-2"htmlFor="google-client-id">OAuth 2.0 Client ID</Label>
                  <Input
                    id="google-client-id"
                    placeholder="Enter your Google Client ID"
                    value={googleClientId}
                    onChange={(e) => setGoogleClientId(e.target.value)}
                    className="bg-zinc-800 border-zinc-700"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="mb-2"htmlFor="google-client-secret">OAuth 2.0 Client Secret</Label>
                  <Input
                    id="google-client-secret"
                    type="password"
                    placeholder="Enter your Google Client Secret"
                    value={googleClientSecret}
                    onChange={(e) => setGoogleClientSecret(e.target.value)}
                    className="bg-zinc-800 border-zinc-700"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="mb-2"htmlFor="google-redirect-uri">Redirect URI</Label>
                  <Input
                    id="google-redirect-uri"
                    placeholder="https://your-domain.manus.space/api/oauth/google/callback"
                    value={googleRedirectUri}
                    onChange={(e) => setGoogleRedirectUri(e.target.value)}
                    className="bg-zinc-800 border-zinc-700"
                  />
                </div>

                <div className="bg-zinc-800 p-4 rounded-lg text-sm text-gray-400">
                  <p className="font-semibold mb-2">How to get credentials:</p>
                  <ol className="list-decimal list-inside space-y-1">
                    <li>Go to <a href="https://console.cloud.google.com" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">Google Cloud Console</a></li>
                    <li>Create a new project or select existing</li>
                    <li>Enable Google Calendar API</li>
                    <li>Create OAuth 2.0 credentials (Web application)</li>
                    <li>Add authorized redirect URI</li>
                  </ol>
                </div>

                <Button
                  onClick={handleSaveGoogleCalendar}
                  disabled={saveGoogleCalendarMutation.isPending}
                  className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600"
                >
                  {saveGoogleCalendarMutation.isPending ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4 mr-2" />
                      Save Google Calendar Settings
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Analytics Tracking Tab */}
          <TabsContent value="analytics">
            <Card className="bg-zinc-900 border-zinc-800">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <svg className="w-5 h-5 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                  {t('settings.analyticsTracking')}
                </CardTitle>
                <CardDescription>
                  {t('settings.analyticsDescription')}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Google Analytics 4 */}
                <div className="space-y-4 p-4 bg-zinc-800 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <svg className="w-5 h-5 text-orange-500" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M22.84 2.998v17.999l-3.998 1.5v-17.999l3.998-1.5zm-5.998 2.25v17.999l-10.998 1.5v-17.999l10.998-1.5zm-12.998 1.5v17.999l-3.844 1.253v-17.999l3.844-1.253z"/>
                    </svg>
                    <h3 className="text-lg font-semibold text-white">Google Analytics 4</h3>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="ga4-measurement-id" className="mb-2 block">{t('settings.measurementId')}</Label>
                    <Input
                      id="ga4-measurement-id"
                      placeholder="G-XXXXXXXXXX"
                      value={ga4MeasurementId}
                      onChange={(e) => setGa4MeasurementId(e.target.value)}
                      className="bg-zinc-900 border-zinc-700"
                    />
                    <p className="text-xs text-gray-400">{t('settings.ga4Help')}</p>
                  </div>
                </div>

                {/* Meta Pixel */}
                <div className="space-y-4 p-4 bg-zinc-800 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <svg className="w-5 h-5 text-blue-500" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                    </svg>
                    <h3 className="text-lg font-semibold text-white">Meta Pixel (Facebook)</h3>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="meta-pixel-id" className="mb-2 block">{t('settings.pixelId')}</Label>
                    <Input
                      id="meta-pixel-id"
                      placeholder="1234567890123456"
                      value={metaPixelId}
                      onChange={(e) => setMetaPixelId(e.target.value)}
                      className="bg-zinc-900 border-zinc-700"
                    />
                    <p className="text-xs text-gray-400">{t('settings.metaPixelHelp')}</p>
                  </div>
                </div>

                {/* Microsoft Clarity */}
                <div className="space-y-4 p-4 bg-zinc-800 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <svg className="w-5 h-5 text-cyan-500" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M0 0v11.408h11.408V0H0zm12.594 0v11.408H24V0H12.594zM0 12.594V24h11.408V12.594H0zm12.594 0V24H24V12.594H12.594z"/>
                    </svg>
                    <h3 className="text-lg font-semibold text-white">Microsoft Clarity</h3>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="clarity-project-id" className="mb-2 block">{t('settings.projectId')}</Label>
                    <Input
                      id="clarity-project-id"
                      placeholder="abcdefghij"
                      value={clarityProjectId}
                      onChange={(e) => setClarityProjectId(e.target.value)}
                      className="bg-zinc-900 border-zinc-700"
                    />
                    <p className="text-xs text-gray-400">{t('settings.clarityHelp')}</p>
                  </div>
                </div>

                <div className="bg-blue-900/20 border border-blue-500/30 p-4 rounded-lg text-sm text-blue-200">
                  <p className="font-semibold mb-2">ℹ️ {t('settings.analyticsNote')}</p>
                  <p>{t('settings.analyticsNoteDescription')}</p>
                </div>

                <Button
                  onClick={async () => {
                    try {
                      // Save all analytics settings in parallel
                      const promises = [];
                      
                      if (ga4MeasurementId) {
                        promises.push(
                          saveAnalyticsMutation.mutateAsync({
                            provider: 'ga4',
                            trackingId: ga4MeasurementId,
                            isActive: true,
                          })
                        );
                      }
                      
                      if (metaPixelId) {
                        promises.push(
                          saveAnalyticsMutation.mutateAsync({
                            provider: 'meta_pixel',
                            trackingId: metaPixelId,
                            isActive: true,
                          })
                        );
                      }
                      
                      if (clarityProjectId) {
                        promises.push(
                          saveAnalyticsMutation.mutateAsync({
                            provider: 'microsoft_clarity',
                            trackingId: clarityProjectId,
                            isActive: true,
                          })
                        );
                      }
                      
                      await Promise.all(promises);
                      toast.success(t('settings.analyticsSaved'));
                    } catch (error) {
                      // Error already handled by mutation
                    }
                  }}
                  disabled={saveAnalyticsMutation.isPending}
                  className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
                >
                  {saveAnalyticsMutation.isPending ? (
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  ) : (
                    <Save className="w-4 h-4 mr-2" />
                  )}
                  {t('settings.saveAnalytics')}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
    </CRMLayout>
  );
}
