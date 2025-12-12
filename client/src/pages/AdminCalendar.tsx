import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar, Clock, User, Link as LinkIcon } from "lucide-react";

export default function AdminCalendar() {
  const { t } = useTranslation();
  const { user, loading } = useAuth();
  const [selectedLead, setSelectedLead] = useState<number | null>(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [scheduledAt, setScheduledAt] = useState("");
  const [duration, setDuration] = useState("30");
  const [meetingLink, setMeetingLink] = useState("");

  const { data: allLeads } = trpc.crm.getLeads.useQuery();
  const leads = allLeads || [];
  const { data: appointments } = trpc.calendar.getAppointments.useQuery();
  const createAppointment = trpc.calendar.createAppointment.useMutation();

  const handleCreateAppointment = async () => {
    if (!selectedLead || !title || !scheduledAt) {
      alert("Please fill in all required fields");
      return;
    }

    try {
      await createAppointment.mutateAsync({
        leadId: selectedLead,
        title,
        description,
        scheduledAt: new Date(scheduledAt).toISOString(),
        duration: parseInt(duration),
        meetingLink,
      });

      // Reset form
      setSelectedLead(null);
      setTitle("");
      setDescription("");
      setScheduledAt("");
      setDuration("30");
      setMeetingLink("");

      alert("Appointment created successfully!");
    } catch (error) {
      console.error("Failed to create appointment:", error);
      alert("Failed to create appointment");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <p className="text-white text-lg">Loading...</p>
      </div>
    );
  }

  if (!user || user.role !== "admin") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <Card className="bg-slate-800/50 border-slate-700 p-8 max-w-md">
          <h1 className="text-2xl font-bold text-red-400 mb-4">Access Denied</h1>
          <p className="text-gray-300 mb-6">
            You need administrator privileges to access the Calendar.
          </p>
          <Link href="/">
            <Button className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700">Return Home</Button>
          </Link>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-6">
      <div className="container max-w-7xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Calendar & Appointments</h1>
        <p className="text-muted-foreground">Schedule meetings with leads and manage appointments</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Create Appointment Form */}
        <Card>
          <CardHeader>
            <CardTitle>Schedule New Appointment</CardTitle>
            <CardDescription>Create a meeting with a lead</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="lead">Select Lead *</Label>
              <Select value={selectedLead?.toString() || ""} onValueChange={(v) => setSelectedLead(parseInt(v))}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose a lead" />
                </SelectTrigger>
                <SelectContent>
                  {leads.map((lead: any) => (
                    <SelectItem key={lead.id} value={lead.id.toString()}>
                      {lead.name} - {lead.phone}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="title">Meeting Title *</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g., Initial Consultation"
              />
            </div>

            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Meeting agenda or notes"
                rows={3}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="scheduledAt">Date & Time *</Label>
                <Input
                  id="scheduledAt"
                  type="datetime-local"
                  value={scheduledAt}
                  onChange={(e) => setScheduledAt(e.target.value)}
                />
              </div>

              <div>
                <Label htmlFor="duration">Duration (minutes)</Label>
                <Select value={duration} onValueChange={setDuration}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="15">15 minutes</SelectItem>
                    <SelectItem value="30">30 minutes</SelectItem>
                    <SelectItem value="45">45 minutes</SelectItem>
                    <SelectItem value="60">1 hour</SelectItem>
                    <SelectItem value="90">1.5 hours</SelectItem>
                    <SelectItem value="120">2 hours</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label htmlFor="meetingLink">Meeting Link (optional)</Label>
              <Input
                id="meetingLink"
                value={meetingLink}
                onChange={(e) => setMeetingLink(e.target.value)}
                placeholder="Zoom, Google Meet, or Calendly link"
              />
            </div>

            <Button onClick={handleCreateAppointment} className="w-full" disabled={createAppointment.isPending}>
              {createAppointment.isPending ? "Creating..." : "Create Appointment"}
            </Button>
          </CardContent>
        </Card>

        {/* Upcoming Appointments List */}
        <Card>
          <CardHeader>
            <CardTitle>Upcoming Appointments</CardTitle>
            <CardDescription>Scheduled meetings with leads</CardDescription>
          </CardHeader>
          <CardContent>
            {!appointments || appointments.length === 0 ? (
              <p className="text-muted-foreground text-center py-8">No appointments scheduled</p>
            ) : (
              <div className="space-y-4">
                {appointments.map((apt: any) => (
                  <div key={apt.id} className="border rounded-lg p-4 space-y-2">
                    <div className="flex items-start justify-between">
                      <h3 className="font-semibold">{apt.title}</h3>
                      <span
                        className={`text-xs px-2 py-1 rounded ${
                          apt.status === "scheduled"
                            ? "bg-blue-100 text-blue-800"
                            : apt.status === "completed"
                            ? "bg-green-100 text-green-800"
                            : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {apt.status}
                      </span>
                    </div>

                    {apt.description && <p className="text-sm text-muted-foreground">{apt.description}</p>}

                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        {new Date(apt.scheduledAt).toLocaleDateString()}
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        {new Date(apt.scheduledAt).toLocaleTimeString()} ({apt.duration}min)
                      </div>
                    </div>

                    {apt.meetingLink && (
                      <div className="flex items-center gap-1 text-sm">
                        <LinkIcon className="w-4 h-4" />
                        <a href={apt.meetingLink} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                          Join Meeting
                        </a>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Calendly Integration Instructions */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Calendly Integration</CardTitle>
          <CardDescription>Connect your Calendly account for automatic scheduling</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm">
            To enable Calendly integration, add your Calendly API key to the environment variables:
          </p>
          <div className="bg-muted p-4 rounded-lg font-mono text-sm">
            CALENDLY_API_KEY=your_api_key_here
            <br />
            CALENDLY_WEBHOOK_URL=https://yourdomain.com/api/webhooks/calendly
          </div>
          <p className="text-sm text-muted-foreground">
            Once configured, appointments will automatically sync with your Calendly calendar, and clients will receive booking confirmations.
          </p>
        </CardContent>
      </Card>
      </div>
    </div>
  );
}
