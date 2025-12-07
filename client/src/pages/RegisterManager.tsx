import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2 } from "lucide-react";

export default function RegisterManager() {
  const [, setLocation] = useLocation();
  
  // Get token from URL query params
  const urlParams = new URLSearchParams(window.location.search);
  const token = urlParams.get("token");
  
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  
  // Verify invitation token
  const { data: invitation, isLoading: verifying, error: verifyError } = trpc.managers.verifyInvitation.useQuery(
    { token: token || "" },
    { enabled: !!token }
  );
  
  const acceptInvitation = trpc.managers.acceptInvitation.useMutation({
    onSuccess: () => {
      // Redirect to login or home
      setLocation("/");
    },
    onError: (err) => {
      setError(err.message);
      setLoading(false);
    },
  });
  
  useEffect(() => {
    if (invitation?.email) {
      setEmail(invitation.email);
    }
  }, [invitation]);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!token) {
      setError("Invalid invitation token");
      return;
    }
    
    if (!name || !email) {
      setError("Please fill in all fields");
      return;
    }
    
    setLoading(true);
    setError("");
    
    // Generate a temporary openId (in production, this would come from OAuth)
    const openId = `manager_${Date.now()}_${Math.random().toString(36).substring(7)}`;
    
    acceptInvitation.mutate({
      token,
      openId,
      name,
      email,
    });
  };
  
  if (!token) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center p-4">
        <Card className="w-full max-w-md bg-zinc-900 border-zinc-800">
          <CardHeader>
            <CardTitle className="text-red-500">Invalid Invitation</CardTitle>
            <CardDescription className="text-zinc-400">
              No invitation token found in URL
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }
  
  if (verifying) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-purple-500" />
      </div>
    );
  }
  
  if (verifyError) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center p-4">
        <Card className="w-full max-w-md bg-zinc-900 border-zinc-800">
          <CardHeader>
            <CardTitle className="text-red-500">Invalid Invitation</CardTitle>
            <CardDescription className="text-zinc-400">
              {verifyError.message}
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-zinc-900 border-zinc-800">
        <CardHeader>
          <CardTitle className="text-2xl text-white">Manager Registration</CardTitle>
          <CardDescription className="text-zinc-400">
            Complete your registration to join PIKALEADS as a manager
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-zinc-300">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled
                className="bg-zinc-800 border-zinc-700 text-white"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="name" className="text-zinc-300">Full Name</Label>
              <Input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your full name"
                required
                className="bg-zinc-800 border-zinc-700 text-white placeholder:text-zinc-500"
              />
            </div>
            
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            
            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-purple-600 hover:bg-purple-700 text-white"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating Account...
                </>
              ) : (
                "Complete Registration"
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
