import { useState, useEffect } from "react";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

interface EditLeadFormProps {
  lead: any;
  onClose: () => void;
  onSuccess: () => void;
}

export function EditLeadForm({ lead, onClose, onSuccess }: EditLeadFormProps) {
  const [formData, setFormData] = useState({
    name: lead.name || "",
    phone: lead.phone || "",
    email: lead.email || "",
    telegram: lead.telegram || "",
    serviceId: null as number | null,
    additionalServiceIds: [] as number[],
    totalAmount: 0,
    notes: "",
  });

  const { data: services, isLoading: servicesLoading } = trpc.services.getAll.useQuery();
  const { data: additionalServices, isLoading: additionalServicesLoading } = trpc.services.getAllAdditional.useQuery();

  const updateLeadMutation = trpc.crm.updateLead.useMutation({
    onSuccess: () => {
      toast.success("Lead updated successfully");
      onSuccess();
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to update lead");
    },
  });

  const createSaleMutation = trpc.sales.create.useMutation({
    onSuccess: () => {
      toast.success("Sale created successfully");
      onSuccess();
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to create sale");
    },
  });

  // Calculate total amount when service or additional services change
  useEffect(() => {
    let total = 0;
    
    if (formData.serviceId && services) {
      const selectedService = services.find((s) => s.id === formData.serviceId);
      if (selectedService) {
        total += selectedService.price;
      }
    }
    
    if (formData.additionalServiceIds.length > 0 && additionalServices) {
      formData.additionalServiceIds.forEach((id) => {
        const addService = additionalServices.find((s) => s.id === id);
        if (addService) {
          total += addService.price;
        }
      });
    }
    
    setFormData((prev) => ({ ...prev, totalAmount: total }));
  }, [formData.serviceId, formData.additionalServiceIds, services, additionalServices]);

  const handleSubmit = () => {
    // Update lead basic info
    updateLeadMutation.mutate({
      leadId: lead.id,
      name: formData.name,
      phone: formData.phone,
      email: formData.email,
      telegram: formData.telegram,
    });
  };

  const handleCreateSale = () => {
    if (!formData.serviceId) {
      toast.error("Please select a service");
      return;
    }

    createSaleMutation.mutate({
      leadId: lead.id,
      serviceId: formData.serviceId,
      additionalServices: formData.additionalServiceIds,
      totalAmount: formData.totalAmount,
      notes: formData.notes,
    });
  };

  const toggleAdditionalService = (serviceId: number) => {
    setFormData((prev) => ({
      ...prev,
      additionalServiceIds: prev.additionalServiceIds.includes(serviceId)
        ? prev.additionalServiceIds.filter((id) => id !== serviceId)
        : [...prev.additionalServiceIds, serviceId],
    }));
  };

  if (servicesLoading || additionalServicesLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="w-6 h-6 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Basic Information */}
      <div>
        <h3 className="text-lg font-semibold mb-4">Basic Information</h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="name">Name *</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
          </div>
          <div>
            <Label htmlFor="phone">Phone *</Label>
            <Input
              id="phone"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            />
          </div>
          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />
          </div>
          <div>
            <Label htmlFor="telegram">Telegram</Label>
            <Input
              id="telegram"
              value={formData.telegram}
              onChange={(e) => setFormData({ ...formData, telegram: e.target.value })}
            />
          </div>
        </div>
      </div>

      {/* Service Assignment */}
      <div>
        <h3 className="text-lg font-semibold mb-4">Service Assignment</h3>
        <div className="space-y-4">
          <div>
            <Label htmlFor="service">Main Service</Label>
            <Select
              value={formData.serviceId?.toString() || ""}
              onValueChange={(value) => setFormData({ ...formData, serviceId: parseInt(value) })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a service" />
              </SelectTrigger>
              <SelectContent>
                {services?.map((service) => (
                  <SelectItem key={service.id} value={service.id.toString()}>
                    {service.name} - ${service.price}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Additional Services */}
          {additionalServices && additionalServices.length > 0 && (
            <div>
              <Label>Additional Services</Label>
              <div className="mt-2 space-y-2 border rounded-md p-4">
                {additionalServices.map((service) => (
                  <div key={service.id} className="flex items-center space-x-2">
                    <Checkbox
                      id={`additional-${service.id}`}
                      checked={formData.additionalServiceIds.includes(service.id)}
                      onCheckedChange={() => toggleAdditionalService(service.id)}
                    />
                    <label
                      htmlFor={`additional-${service.id}`}
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                    >
                      {service.name} - ${service.price}
                    </label>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Total Amount */}
          <div className="bg-muted p-4 rounded-md">
            <div className="flex justify-between items-center">
              <span className="text-lg font-semibold">Total Amount:</span>
              <span className="text-2xl font-bold text-primary">
                ${formData.totalAmount}
              </span>
            </div>
          </div>

          {/* Sale Notes */}
          <div>
            <Label htmlFor="notes">Sale Notes</Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              placeholder="Add notes about this sale..."
              rows={3}
            />
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex justify-between">
        <Button variant="outline" onClick={onClose}>
          Cancel
        </Button>
        <div className="flex gap-2">
          <Button
            onClick={handleSubmit}
            disabled={updateLeadMutation.isPending || !formData.name || !formData.phone}
          >
            {updateLeadMutation.isPending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
            Update Lead
          </Button>
          <Button
            onClick={handleCreateSale}
            disabled={createSaleMutation.isPending || !formData.serviceId}
            variant="default"
          >
            {createSaleMutation.isPending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
            Convert to Sale
          </Button>
        </div>
      </div>
    </div>
  );
}
