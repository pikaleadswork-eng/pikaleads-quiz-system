import { useState } from "react";
import { useTranslation } from "react-i18next";
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { UserPlus, Mail, CheckCircle, XCircle, Clock, Copy } from "lucide-react";

export default function AdminManagers() {
  const { t } = useTranslation();
  const [inviteEmail, setInviteEmail] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [invitationUrl, setInvitationUrl] = useState("");

  const { data: invitations, refetch } = trpc.managers.getInvitations.useQuery();
  const { data: activeManagers } = trpc.managers.getActiveManagers.useQuery();

  const inviteManager = trpc.managers.inviteManager.useMutation({
    onSuccess: (data) => {
      if (data.emailSent) {
        toast.success(`Invitation sent to ${inviteEmail}!`);
      } else {
        toast.warning(`Invitation created but email failed: ${data.emailError}`);
        setInvitationUrl(data.invitationUrl);
      }
      setInviteEmail("");
      setIsDialogOpen(false);
      refetch();
    },
    onError: (error) => {
      toast.error(error.message || "Failed to send invitation");
    },
  });

  const handleInvite = () => {
    if (!inviteEmail || !inviteEmail.includes("@")) {
      toast.error("Please enter a valid email address");
      return;
    }

    inviteManager.mutate({ email: inviteEmail });
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("Copied to clipboard!");
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "accepted":
        return (
          <Badge className="bg-green-600 text-white">
            <CheckCircle className="w-3 h-3 mr-1" />
            Accepted
          </Badge>
        );
      case "expired":
        return (
          <Badge className="bg-red-600 text-white">
            <XCircle className="w-3 h-3 mr-1" />
            Expired
          </Badge>
        );
      default:
        return (
          <Badge className="bg-yellow-600 text-white">
            <Clock className="w-3 h-3 mr-1" />
            Pending
          </Badge>
        );
    }
  };

  return (
    <div className="min-h-screen bg-black p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-white mb-2">
              👥 Manager Management
            </h1>
            <p className="text-zinc-400">
              Invite and manage team members with CRM access
            </p>
          </div>

          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-purple-600 hover:bg-purple-700 text-white">
                <UserPlus className="w-4 h-4 mr-2" />
                Invite Manager
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-zinc-900 border-zinc-800 text-white">
              <DialogHeader>
                <DialogTitle className="text-2xl text-purple-400">
                  Invite New Manager
                </DialogTitle>
                <DialogDescription className="text-zinc-400">
                  Send an invitation email to add a new manager to your team
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-4 py-4">
                <div>
                  <Label htmlFor="email" className="text-zinc-300">
                    Email Address
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    value={inviteEmail}
                    onChange={(e) => setInviteEmail(e.target.value)}
                    placeholder="manager@example.com"
                    className="bg-zinc-800 border-zinc-700 text-white mt-2"
                  />
                </div>

                {invitationUrl && (
                  <div className="bg-zinc-800 border border-zinc-700 rounded-lg p-4">
                    <Label className="text-zinc-300 text-sm mb-2 block">
                      <Mail className="w-4 h-4 inline mr-1" />
                      Email failed - Share this link manually:
                    </Label>
                    <div className="flex gap-2">
                      <Input
                        value={invitationUrl}
                        readOnly
                        className="bg-zinc-900 border-zinc-600 text-white text-sm"
                      />
                      <Button
                        size="sm"
                        onClick={() => copyToClipboard(invitationUrl)}
                        className="bg-purple-600 hover:bg-purple-700"
                      >
                        <Copy className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                )}
              </div>

              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => {
                    setIsDialogOpen(false);
                    setInviteEmail("");
                    setInvitationUrl("");
                  }}
                  className="bg-transparent border-zinc-700 text-white hover:bg-zinc-800"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleInvite}
                  disabled={inviteManager.isPending}
                  className="bg-purple-600 hover:bg-purple-700 text-white"
                >
                  {inviteManager.isPending ? "Sending..." : "Send Invitation"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        {/* Active Managers Section */}
        <Card className="bg-zinc-900 border-zinc-800 mb-6">
          <CardHeader>
            <CardTitle className="text-white">Active Managers</CardTitle>
            <CardDescription className="text-zinc-400">
              Currently active team members with manager access
            </CardDescription>
          </CardHeader>
          <CardContent>
            {activeManagers && activeManagers.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow className="border-zinc-800">
                    <TableHead className="text-zinc-300">Name</TableHead>
                    <TableHead className="text-zinc-300">Email</TableHead>
                    <TableHead className="text-zinc-300">Role</TableHead>
                    <TableHead className="text-zinc-300">Joined</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {activeManagers.map((manager) => (
                    <TableRow key={manager.id} className="border-zinc-800">
                      <TableCell className="text-white font-medium">
                        {manager.name}
                      </TableCell>
                      <TableCell className="text-zinc-400">
                        {manager.email}
                      </TableCell>
                      <TableCell>
                        <Badge className="bg-green-600 text-white">
                          {manager.role}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-zinc-400">
                        {new Date(manager.createdAt).toLocaleDateString()}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <div className="text-center py-12 text-zinc-500">
                <UserPlus className="w-16 h-16 mx-auto mb-4 opacity-50" />
                <p>No active managers yet</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Invitations Section */}
        <Card className="bg-zinc-900 border-zinc-800">
          <CardHeader>
            <CardTitle className="text-white">Manager Invitations</CardTitle>
            <CardDescription className="text-zinc-400">
              Track all sent invitations and their status
            </CardDescription>
          </CardHeader>
          <CardContent>
            {!invitations || invitations.length === 0 ? (
              <div className="text-center py-12">
                <UserPlus className="w-16 h-16 mx-auto text-zinc-600 mb-4" />
                <p className="text-zinc-400 text-lg">No invitations sent yet</p>
                <p className="text-zinc-500 text-sm mt-2">
                  Click "Invite Manager" to send your first invitation
                </p>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow className="border-zinc-800 hover:bg-zinc-800/50">
                    <TableHead className="text-zinc-300">Email</TableHead>
                    <TableHead className="text-zinc-300">Status</TableHead>
                    <TableHead className="text-zinc-300">Invited By</TableHead>
                    <TableHead className="text-zinc-300">Created At</TableHead>
                    <TableHead className="text-zinc-300">Expires At</TableHead>
                    <TableHead className="text-zinc-300">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {invitations.map((invitation) => (
                    <TableRow
                      key={invitation.id}
                      className="border-zinc-800 hover:bg-zinc-800/50"
                    >
                      <TableCell className="text-white font-medium">
                        {invitation.email}
                      </TableCell>
                      <TableCell>{getStatusBadge(invitation.status)}</TableCell>
                      <TableCell className="text-zinc-400">
                        User #{invitation.invitedBy}
                      </TableCell>
                      <TableCell className="text-zinc-400">
                        {new Date(invitation.createdAt).toLocaleDateString()}
                      </TableCell>
                      <TableCell className="text-zinc-400">
                        {new Date(invitation.expiresAt).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        {invitation.status === "pending" && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              const url = `${window.location.origin}/register-manager?token=${invitation.token}`;
                              copyToClipboard(url);
                            }}
                            className="bg-transparent border-zinc-700 text-white hover:bg-zinc-800"
                          >
                            <Copy className="w-3 h-3 mr-1" />
                            Copy Link
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
