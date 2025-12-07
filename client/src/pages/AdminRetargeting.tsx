import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Loader2, Upload, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import { Link } from "wouter";

export default function AdminRetargeting() {
  const { data: lowQualityLeads, isLoading } = trpc.admin.getLowQualityLeads.useQuery();
  const exportMutation = trpc.admin.exportToFacebook.useMutation();
  
  const [selectedLeads, setSelectedLeads] = useState<number[]>([]);
  const [audienceName, setAudienceName] = useState(`Low Quality Leads - ${new Date().toISOString().split('T')[0]}`);
  
  const handleSelectAll = (checked: boolean) => {
    if (checked && lowQualityLeads) {
      setSelectedLeads(lowQualityLeads.map(lead => lead.id));
    } else {
      setSelectedLeads([]);
    }
  };
  
  const handleSelectLead = (leadId: number, checked: boolean) => {
    if (checked) {
      setSelectedLeads([...selectedLeads, leadId]);
    } else {
      setSelectedLeads(selectedLeads.filter(id => id !== leadId));
    }
  };
  
  const handleExport = async () => {
    if (selectedLeads.length === 0) {
      toast.error("Please select at least one lead");
      return;
    }
    
    if (!audienceName.trim()) {
      toast.error("Please enter an audience name");
      return;
    }
    
    try {
      const result = await exportMutation.mutateAsync({
        leadIds: selectedLeads,
        audienceName: audienceName.trim(),
      });
      
      if (result.success) {
        toast.success(`Successfully exported ${selectedLeads.length} leads to Facebook Custom Audience`);
        setSelectedLeads([]);
      } else {
        toast.error(result.error || "Failed to export leads");
      }
    } catch (error) {
      toast.error("Failed to export leads to Facebook");
      console.error(error);
    }
  };
  
  if (isLoading) {
    return (
      <div className="min-h-screen bg-background p-8">
        <div className="flex items-center justify-center h-64">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Lead Retargeting</h1>
            <p className="text-muted-foreground mt-1">Export low-quality leads to Facebook Custom Audiences</p>
          </div>
          <Link href="/admin">
            <Button variant="outline">← Back to Admin</Button>
          </Link>
        </div>
        
        <Card className="border-amber-500/50 bg-amber-500/5">
          <CardHeader>
            <div className="flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-amber-500" />
              <CardTitle className="text-amber-500">About Lead Retargeting</CardTitle>
            </div>
            <CardDescription>
              Leads with quality score below 40 are considered low-quality and can be exported to Facebook Custom Audiences for retargeting campaigns.
              This helps re-engage potential customers who didn't convert initially.
            </CardDescription>
          </CardHeader>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Export to Facebook</CardTitle>
            <CardDescription>
              {lowQualityLeads?.length || 0} low-quality leads available for retargeting
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-4">
              <Input
                placeholder="Audience Name"
                value={audienceName}
                onChange={(e) => setAudienceName(e.target.value)}
                className="flex-1"
              />
              <Button
                onClick={handleExport}
                disabled={selectedLeads.length === 0 || exportMutation.isPending}
                className="min-w-[150px]"
              >
                {exportMutation.isPending ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Exporting...
                  </>
                ) : (
                  <>
                    <Upload className="w-4 h-4 mr-2" />
                    Export ({selectedLeads.length})
                  </>
                )}
              </Button>
            </div>
            
            <div className="rounded-md border overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-12">
                      <Checkbox
                        checked={selectedLeads.length === lowQualityLeads?.length && lowQualityLeads.length > 0}
                        onCheckedChange={handleSelectAll}
                      />
                    </TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Phone</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Quiz</TableHead>
                    <TableHead>Score</TableHead>
                    <TableHead>Date</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {lowQualityLeads && lowQualityLeads.length > 0 ? (
                    lowQualityLeads.map((lead) => (
                      <TableRow key={lead.id}>
                        <TableCell>
                          <Checkbox
                            checked={selectedLeads.includes(lead.id)}
                            onCheckedChange={(checked) => handleSelectLead(lead.id, checked as boolean)}
                          />
                        </TableCell>
                        <TableCell className="font-medium">{lead.name}</TableCell>
                        <TableCell className="font-mono text-xs">{lead.phone}</TableCell>
                        <TableCell className="text-xs">{lead.email || "-"}</TableCell>
                        <TableCell>{lead.quizName}</TableCell>
                        <TableCell>
                          <Badge variant="destructive">{lead.leadScore || 0}</Badge>
                        </TableCell>
                        <TableCell className="text-xs">
                          {new Date(lead.createdAt).toLocaleDateString()}
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center text-muted-foreground py-8">
                        No low-quality leads found
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
