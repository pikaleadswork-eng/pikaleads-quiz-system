import { useState } from "react";
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

export default function AdminSettings() {
  const { user, loading: authLoading } = useAuth();
  const utils = trpc.useUtils();

  // Instagram state
  const [instagramAppId, setInstagramAppId] = useState("");
  const [instagramAppSecret, setInstagramAppSecret] = useState("");
  const [instagramAccessToken, setInstagramAccessToken] = useState("");

  // WhatsApp state
  const [whatsappPhoneNumberId, setWhatsappPhoneNumberId] = useState("");
  const [whatsappAccessToken, setWhatsappAccessToken] = useState("");

  // Email state (SendGrid already configured via env)
  const [sendgridNote, setSendgridNote] = useState("SENDGRID_API_KEY is configured via environment variables");

  // Google Calendar state
  const [googleClientId, setGoogleClientId] = useState("");
  const [googleClientSecret, setGoogleClientSecret] = useState("");
  const [googleRedirectUri, setGoogleRedirectUri] = useState("");

  const { data: settings, isLoading: settingsLoading } = trpc.integrations.getAll.useQuery();

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

  const saveGoogleCalendarMutation = trpc.integrations.save.useMutation({
    onSuccess: () => {
      toast.success("Google Calendar settings saved successfully!");
      utils.integrations.getAll.invalidate();
    },
    onError: (error: any) => {
      toast.error(`Failed to save Google Calendar settings: ${error.message}`);
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
  const googleCalendarSettings = settings?.find((s: any) => s.provider === "google_calendar");

  return (
    <CRMLayout>
        <div className="mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent">
            Integration Settings
          </h1>
          <p className="text-gray-400 mt-2">
            Configure API credentials for messaging and calendar integrations
          </p>
        </div>

        <Tabs defaultValue="instagram" className="w-full">
          <TabsList className="grid w-full grid-cols-4 bg-zinc-900">
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
                  <Label htmlFor="instagram-app-id">App ID</Label>
                  <Input
                    id="instagram-app-id"
                    placeholder="Enter your Instagram App ID"
                    value={instagramAppId}
                    onChange={(e) => setInstagramAppId(e.target.value)}
                    className="bg-zinc-800 border-zinc-700"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="instagram-app-secret">App Secret</Label>
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
                  <Label htmlFor="instagram-access-token">Access Token (Long-lived)</Label>
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
                  <Label htmlFor="whatsapp-phone-number-id">Phone Number ID</Label>
                  <Input
                    id="whatsapp-phone-number-id"
                    placeholder="Enter your WhatsApp Phone Number ID"
                    value={whatsappPhoneNumberId}
                    onChange={(e) => setWhatsappPhoneNumberId(e.target.value)}
                    className="bg-zinc-800 border-zinc-700"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="whatsapp-access-token">Access Token</Label>
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
                  Email (SendGrid)
                  <CheckCircle2 className="w-5 h-5 text-green-500 ml-auto" />
                </CardTitle>
                <CardDescription>
                  Email integration via SendGrid
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="bg-zinc-800 p-4 rounded-lg text-sm text-gray-400">
                  <p className="font-semibold mb-2">✅ Email is already configured</p>
                  <p>SENDGRID_API_KEY is set via environment variables. No additional configuration needed.</p>
                  <p className="mt-2">To update SendGrid API key, contact system administrator.</p>
                </div>
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
                  <Label htmlFor="google-client-id">OAuth 2.0 Client ID</Label>
                  <Input
                    id="google-client-id"
                    placeholder="Enter your Google Client ID"
                    value={googleClientId}
                    onChange={(e) => setGoogleClientId(e.target.value)}
                    className="bg-zinc-800 border-zinc-700"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="google-client-secret">OAuth 2.0 Client Secret</Label>
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
                  <Label htmlFor="google-redirect-uri">Redirect URI</Label>
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
        </Tabs>
    </CRMLayout>
  );
}
