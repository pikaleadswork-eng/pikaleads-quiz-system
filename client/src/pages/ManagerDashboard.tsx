import { useState } from "react";
import { useLocation } from "wouter";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, Users } from "lucide-react";
import { useAuth } from "@/_core/hooks/useAuth";

export default function ManagerDashboard() {
  const [, setLocation] = useLocation();
  const { user } = useAuth();
  const { data: leads } = trpc.crm.getLeads.useQuery();

  const totalAssigned = leads?.length || 0;
  const pendingLeads = leads?.filter((lead) => lead.statusId === 1).length || 0;

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto py-8 px-4">
        <h1 className="text-3xl font-bold mb-4">Welcome, {user?.name || "Manager"}!</h1>
        <div className="grid grid-cols-2 gap-4 mb-8">
          <Card className="p-6">
            <Users className="w-8 h-8 mb-2" />
            <p className="text-sm text-muted-foreground">Total Assigned</p>
            <p className="text-2xl font-bold">{totalAssigned}</p>
          </Card>
          <Card className="p-6">
            <TrendingUp className="w-8 h-8 mb-2" />
            <p className="text-sm text-muted-foreground">Pending</p>
            <p className="text-2xl font-bold">{pendingLeads}</p>
          </Card>
        </div>
        <Button onClick={() => setLocation("/crm")}>Open CRM</Button>
      </div>
    </div>
  );
}
