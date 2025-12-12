import { useState, useEffect } from "react";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
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
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Loader2, Plus, Edit, Trash2, Package } from "lucide-react";
import { useAuth } from "@/_core/hooks/useAuth";
import CRMLayout from "@/components/CRMLayout";
import { Link } from "wouter";
import { toast } from "sonner";
import { useTranslation } from 'react-i18next';

export default function ServicesManagement() {
  const { t } = useTranslation();


  const { user, loading: authLoading } = useAuth();
  const [isCreateServiceOpen, setIsCreateServiceOpen] = useState(false);
  const [isCreateAdditionalOpen, setIsCreateAdditionalOpen] = useState(false);
  const [editingService, setEditingService] = useState<any | null>(null);
  const [editingAdditional, setEditingAdditional] = useState<any | null>(null);

  const [serviceFormData, setServiceFormData] = useState({
    name: "",
    type: "",
    price: 0,
    description: "",
  });

  const [additionalFormData, setAdditionalFormData] = useState({
    name: "",
    price: 0,
    description: "",
  });

  const { data: services, isLoading: servicesLoading, refetch: refetchServices } = trpc.services.getAll.useQuery();
  const { data: additionalServices, isLoading: additionalLoading, refetch: refetchAdditional } = trpc.services.getAllAdditional.useQuery();

  const createServiceMutation = trpc.services.create.useMutation({
    onSuccess: () => {
      toast.success("Service created successfully");
      setIsCreateServiceOpen(false);
      resetServiceForm();
      refetchServices();
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to create service");
    },
  });

  const updateServiceMutation = trpc.services.update.useMutation({
    onSuccess: () => {
      toast.success("Service updated successfully");
      setEditingService(null);
      resetServiceForm();
      refetchServices();
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to update service");
    },
  });

  const deleteServiceMutation = trpc.services.delete.useMutation({
    onSuccess: () => {
      toast.success("Service deleted successfully");
      refetchServices();
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to delete service");
    },
  });

  const createAdditionalMutation = trpc.services.createAdditional.useMutation({
    onSuccess: () => {
      toast.success("Additional service created successfully");
      setIsCreateAdditionalOpen(false);
      resetAdditionalForm();
      refetchAdditional();
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to create additional service");
    },
  });

  const updateAdditionalMutation = trpc.services.updateAdditional.useMutation({
    onSuccess: () => {
      toast.success("Additional service updated successfully");
      setEditingAdditional(null);
      resetAdditionalForm();
      refetchAdditional();
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to update additional service");
    },
  });

  const deleteAdditionalMutation = trpc.services.deleteAdditional.useMutation({
    onSuccess: () => {
      toast.success("Additional service deleted successfully");
      refetchAdditional();
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to delete additional service");
    },
  });

  const resetServiceForm = () => {
    setServiceFormData({
      name: "",
      type: "",
      price: 0,
      description: "",
    });
  };

  const resetAdditionalForm = () => {
    setAdditionalFormData({
      name: "",
      price: 0,
      description: "",
    });
  };

  const handleCreateService = () => {
    if (!serviceFormData.name || !serviceFormData.type || serviceFormData.price <= 0) {
      toast.error("Please fill in all required fields");
      return;
    }

    createServiceMutation.mutate(serviceFormData);
  };

  const handleUpdateService = () => {
    if (!editingService) return;

    updateServiceMutation.mutate({
      id: editingService.id,
      ...serviceFormData,
    });
  };

  const handleEditService = (service: any) => {
    setEditingService(service);
    setServiceFormData({
      name: service.name,
      type: service.type,
      price: service.price,
      description: service.description || "",
    });
  };

  const handleDeleteService = (id: number) => {
    if (confirm("Are you sure you want to delete this service?")) {
      deleteServiceMutation.mutate({ id });
    }
  };

  const handleCreateAdditional = () => {
    if (!additionalFormData.name || additionalFormData.price <= 0) {
      toast.error("Please fill in all required fields");
      return;
    }

    createAdditionalMutation.mutate(additionalFormData);
  };

  const handleUpdateAdditional = () => {
    if (!editingAdditional) return;

    updateAdditionalMutation.mutate({
      id: editingAdditional.id,
      ...additionalFormData,
    });
  };

  const handleEditAdditional = (service: any) => {
    setEditingAdditional(service);
    setAdditionalFormData({
      name: service.name,
      price: service.price,
      description: service.description || "",
    });
  };

  const handleDeleteAdditional = (id: number) => {
    if (confirm("Are you sure you want to delete this additional service?")) {
      deleteAdditionalMutation.mutate({ id });
    }
  };

  if (authLoading) {
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

  return (
    <CRMLayout>
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <Link href="/admin">
              <Button variant="ghost" className="mb-4">
                ← Back to Admin
              </Button>
            </Link>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
              Services Management
            </h1>
            <p className="text-gray-400 mt-2">
              Manage your services and pricing
            </p>
          </div>
        </div>

        {/* Main Services */}
        <Card className="bg-zinc-900 border-zinc-800 mb-8">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Package className="w-5 h-5" />
                  Main Services
                </CardTitle>
                <CardDescription>Core services offered to clients</CardDescription>
              </div>
              <Button onClick={() => setIsCreateServiceOpen(true)}>
                <Plus className="w-4 h-4 mr-2" />
                Add Service
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {servicesLoading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="w-6 h-6 animate-spin" />
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {services && services.length > 0 ? (
                    services.map((service) => (
                      <TableRow key={service.id}>
                        <TableCell className="font-medium">{service.name}</TableCell>
                        <TableCell>
                          <Badge variant="outline">{service.type}</Badge>
                        </TableCell>
                        <TableCell className="text-green-400 font-semibold">
                          ${service.price}
                        </TableCell>
                        <TableCell className="max-w-xs truncate text-sm text-gray-400">
                          {service.description || "-"}
                        </TableCell>
                        <TableCell>
                          <Badge variant={service.isActive ? "default" : "secondary"}>
                            {service.isActive ? "Active" : "Inactive"}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => handleEditService(service)}
                            >
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => handleDeleteService(service.id)}
                            >
                              <Trash2 className="w-4 h-4 text-red-500" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center text-muted-foreground py-8">
                        No services yet. Create your first service.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>

        {/* Additional Services */}
        <Card className="bg-zinc-900 border-zinc-800">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Package className="w-5 h-5" />
                  Additional Services
                </CardTitle>
                <CardDescription>Optional add-ons and extras</CardDescription>
              </div>
              <Button onClick={() => setIsCreateAdditionalOpen(true)}>
                <Plus className="w-4 h-4 mr-2" />
                Add Additional Service
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {additionalLoading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="w-6 h-6 animate-spin" />
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {additionalServices && additionalServices.length > 0 ? (
                    additionalServices.map((service) => (
                      <TableRow key={service.id}>
                        <TableCell className="font-medium">{service.name}</TableCell>
                        <TableCell className="text-green-400 font-semibold">
                          ${service.price}
                        </TableCell>
                        <TableCell className="max-w-xs truncate text-sm text-gray-400">
                          {service.description || "-"}
                        </TableCell>
                        <TableCell>
                          <Badge variant={service.isActive ? "default" : "secondary"}>
                            {service.isActive ? "Active" : "Inactive"}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => handleEditAdditional(service)}
                            >
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => handleDeleteAdditional(service.id)}
                            >
                              <Trash2 className="w-4 h-4 text-red-500" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center text-muted-foreground py-8">
                        No additional services yet.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>

        {/* Create/Edit Service Dialog */}
        <Dialog
          open={isCreateServiceOpen || editingService !== null}
          onOpenChange={(open) => {
            if (!open) {
              setIsCreateServiceOpen(false);
              setEditingService(null);
              resetServiceForm();
            }
          }}
        >
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {editingService ? "Edit Service" : "Create New Service"}
              </DialogTitle>
              <DialogDescription>
                {editingService
                  ? "Update service details"
                  : "Add a new service to your catalog"}
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4">
              <div>
                <Label htmlFor="service-name" className="mb-2 block">Service Name *</Label>
                <Input
                  id="service-name"
                  value={serviceFormData.name}
                  onChange={(e) => setServiceFormData({ ...serviceFormData, name: e.target.value })}
                  placeholder="e.g., Meta Ads Campaign Setup"
                />
              </div>

              <div>
                <Label htmlFor="service-type" className="mb-2 block">Service Type *</Label>
                <Input
                  id="service-type"
                  value={serviceFormData.type}
                  onChange={(e) => setServiceFormData({ ...serviceFormData, type: e.target.value })}
                  placeholder="e.g., Advertising, Consulting"
                />
              </div>

              <div>
                <Label htmlFor="service-price" className="mb-2 block">Price ($) *</Label>
                <Input
                  id="service-price"
                  type="number"
                  value={serviceFormData.price}
                  onChange={(e) => setServiceFormData({ ...serviceFormData, price: parseFloat(e.target.value) })}
                  placeholder="0.00"
                />
              </div>

              <div>
                <Label htmlFor="service-description" className="mb-2 block">Description</Label>
                <Textarea
                  id="service-description"
                  value={serviceFormData.description}
                  onChange={(e) => setServiceFormData({ ...serviceFormData, description: e.target.value })}
                  placeholder="Describe the service..."
                  rows={3}
                />
              </div>

              <div className="flex justify-end gap-2">
                <Button
                  variant="outline"
                  onClick={() => {
                    setIsCreateServiceOpen(false);
                    setEditingService(null);
                    resetServiceForm();
                  }}
                >
                  Cancel
                </Button>
                <Button
                  onClick={editingService ? handleUpdateService : handleCreateService}
                  disabled={createServiceMutation.isPending || updateServiceMutation.isPending}
                >
                  {(createServiceMutation.isPending || updateServiceMutation.isPending) && (
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  )}
                  {editingService ? "Update Service" : "Create Service"}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Create/Edit Additional Service Dialog */}
        <Dialog
          open={isCreateAdditionalOpen || editingAdditional !== null}
          onOpenChange={(open) => {
            if (!open) {
              setIsCreateAdditionalOpen(false);
              setEditingAdditional(null);
              resetAdditionalForm();
            }
          }}
        >
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {editingAdditional ? "Edit Additional Service" : "Create Additional Service"}
              </DialogTitle>
              <DialogDescription>
                {editingAdditional
                  ? "Update additional service details"
                  : "Add a new optional add-on"}
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4">
              <div>
                <Label htmlFor="additional-name" className="mb-2 block">Service Name *</Label>
                <Input
                  id="additional-name"
                  value={additionalFormData.name}
                  onChange={(e) => setAdditionalFormData({ ...additionalFormData, name: e.target.value })}
                  placeholder="e.g., Banner Design"
                />
              </div>

              <div>
                <Label htmlFor="additional-price" className="mb-2 block">Price ($) *</Label>
                <Input
                  id="additional-price"
                  type="number"
                  value={additionalFormData.price}
                  onChange={(e) => setAdditionalFormData({ ...additionalFormData, price: parseFloat(e.target.value) })}
                  placeholder="0.00"
                />
              </div>

              <div>
                <Label htmlFor="additional-description" className="mb-2 block">Description</Label>
                <Textarea
                  id="additional-description"
                  value={additionalFormData.description}
                  onChange={(e) => setAdditionalFormData({ ...additionalFormData, description: e.target.value })}
                  placeholder="Describe the additional service..."
                  rows={3}
                />
              </div>

              <div className="flex justify-end gap-2">
                <Button
                  variant="outline"
                  onClick={() => {
                    setIsCreateAdditionalOpen(false);
                    setEditingAdditional(null);
                    resetAdditionalForm();
                  }}
                >
                  Cancel
                </Button>
                <Button
                  onClick={editingAdditional ? handleUpdateAdditional : handleCreateAdditional}
                  disabled={createAdditionalMutation.isPending || updateAdditionalMutation.isPending}
                >
                  {(createAdditionalMutation.isPending || updateAdditionalMutation.isPending) && (
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  )}
                  {editingAdditional ? "Update Service" : "Create Service"}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
    </CRMLayout>
  );
}
