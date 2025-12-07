import { useState } from "react";
import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { ArrowLeft, Plus, TrendingUp, TrendingDown } from "lucide-react";
import { Link } from "wouter";
import { trpc } from "@/lib/trpc";
import { quizzes } from "@/lib/quizData";
import { calculateStatisticalSignificance } from "@/lib/abTesting";

export default function AdminABTests() {
  const { user, loading } = useAuth();
  const [selectedQuiz, setSelectedQuiz] = useState<string>("meta-furniture");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [variantName, setVariantName] = useState("");
  const [trafficPercentage, setTrafficPercentage] = useState(50);

  const { data: testResults, refetch } = trpc.abTest.getTestResults.useQuery(
    { quizId: selectedQuiz },
    { enabled: !!selectedQuiz }
  );

  const createVariantMutation = trpc.abTest.createVariant.useMutation({
    onSuccess: () => {
      toast.success("Variant created successfully!");
      setIsCreateDialogOpen(false);
      setVariantName("");
      setTrafficPercentage(50);
      refetch();
    },
    onError: (error) => {
      toast.error(error.message || "Failed to create variant");
    },
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    );
  }

  if (!user || user.role !== "admin") {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="p-8 max-w-md">
          <h1 className="text-2xl font-bold text-destructive mb-4">Access Denied</h1>
          <p className="text-muted-foreground mb-6">
            You need administrator privileges to access this page.
          </p>
          <Link href="/">
            <Button>Return Home</Button>
          </Link>
        </Card>
      </div>
    );
  }

  const handleCreateVariant = () => {
    if (!variantName.trim()) {
      toast.error("Please enter a variant name");
      return;
    }

    createVariantMutation.mutate({
      quizId: selectedQuiz,
      variantName: variantName.trim(),
      trafficPercentage,
    });
  };

  // Calculate statistical significance if we have control and variant
  let significance: ReturnType<typeof calculateStatisticalSignificance> | null = null;
  if (testResults && testResults.length >= 2) {
    const control = testResults[0];
    const variant = testResults[1];
    if (control && variant) {
      significance = calculateStatisticalSignificance(
        control.conversions,
        control.total,
        variant.conversions,
        variant.total
      );
    }
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/admin">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Admin
              </Button>
            </Link>
            <h1 className="text-2xl font-bold text-foreground">A/B Test Results</h1>
          </div>
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Create Variant
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create A/B Test Variant</DialogTitle>
                <DialogDescription>
                  Create a new variant to test against the control version
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div>
                  <Label htmlFor="variant-name">Variant Name</Label>
                  <Input
                    id="variant-name"
                    value={variantName}
                    onChange={(e) => setVariantName(e.target.value)}
                    placeholder="e.g., Variant A, New Headline"
                    className="mt-2"
                  />
                </div>
                <div>
                  <Label htmlFor="traffic">Traffic Percentage</Label>
                  <Input
                    id="traffic"
                    type="number"
                    min="0"
                    max="100"
                    value={trafficPercentage}
                    onChange={(e) => setTrafficPercentage(Number(e.target.value))}
                    className="mt-2"
                  />
                  <p className="text-sm text-muted-foreground mt-1">
                    Percentage of traffic to send to this variant
                  </p>
                </div>
              </div>
              <Button onClick={handleCreateVariant} disabled={createVariantMutation.isPending}>
                {createVariantMutation.isPending ? "Creating..." : "Create Variant"}
              </Button>
            </DialogContent>
          </Dialog>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Quiz Selector */}
          <div className="lg:col-span-1">
            <Card className="p-4">
              <h3 className="font-semibold text-foreground mb-4">Select Quiz</h3>
              <div className="space-y-2">
                {quizzes.map((q) => (
                  <Button
                    key={q.id}
                    variant={selectedQuiz === q.id ? "default" : "ghost"}
                    className="w-full justify-start text-sm"
                    onClick={() => setSelectedQuiz(q.id)}
                  >
                    {q.title.substring(0, 30)}...
                  </Button>
                ))}
              </div>
            </Card>
          </div>

          {/* Results */}
          <div className="lg:col-span-3 space-y-6">
            {/* Statistical Significance Card */}
            {significance && (
              <Card>
                <CardHeader>
                  <CardTitle>Statistical Significance</CardTitle>
                  <CardDescription>
                    Analysis of test results
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="text-center p-4 bg-muted rounded-lg">
                      <p className="text-sm text-muted-foreground mb-1">Uplift</p>
                      <p className="text-2xl font-bold flex items-center justify-center gap-2">
                        {significance.uplift > 0 ? (
                          <TrendingUp className="w-5 h-5 text-green-500" />
                        ) : (
                          <TrendingDown className="w-5 h-5 text-red-500" />
                        )}
                        {significance.uplift.toFixed(2)}%
                      </p>
                    </div>
                    <div className="text-center p-4 bg-muted rounded-lg">
                      <p className="text-sm text-muted-foreground mb-1">Confidence Level</p>
                      <p className="text-2xl font-bold">
                        {significance.confidenceLevel.toFixed(1)}%
                      </p>
                    </div>
                    <div className="text-center p-4 bg-muted rounded-lg">
                      <p className="text-sm text-muted-foreground mb-1">Status</p>
                      <p className={`text-lg font-bold ${significance.isSignificant ? 'text-green-500' : 'text-yellow-500'}`}>
                        {significance.isSignificant ? "Significant" : "Not Significant"}
                      </p>
                    </div>
                  </div>
                  {significance.isSignificant && (
                    <p className="text-sm text-muted-foreground mt-4 text-center">
                      ✅ Results are statistically significant (p &lt; 0.05). You can confidently declare a winner.
                    </p>
                  )}
                  {!significance.isSignificant && (
                    <p className="text-sm text-muted-foreground mt-4 text-center">
                      ⏳ Not enough data yet. Continue running the test to reach statistical significance.
                    </p>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Results Table */}
            <Card>
              <CardHeader>
                <CardTitle>Variant Performance</CardTitle>
                <CardDescription>
                  {testResults?.length || 0} active variants
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Variant</TableHead>
                        <TableHead>Views</TableHead>
                        <TableHead>Conversions</TableHead>
                        <TableHead>Conversion Rate</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {testResults && testResults.length > 0 ? (
                        testResults.map((result) => (
                          <TableRow key={result.variantId}>
                            <TableCell className="font-medium">
                              {result.variantName}
                            </TableCell>
                            <TableCell>{result.total}</TableCell>
                            <TableCell>{result.conversions}</TableCell>
                            <TableCell className="font-bold">
                              {result.conversionRate.toFixed(2)}%
                            </TableCell>
                          </TableRow>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell colSpan={4} className="text-center text-muted-foreground py-8">
                            No test data yet. Create a variant to start testing.
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
      </div>
    </div>
  );
}
