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
import { Loader2, Send, MessageCircle, Mail } from "lucide-react";
import { useTranslation } from "react-i18next";
import { LeadComments } from "@/components/LeadComments";
import LeadTimeline from "@/components/LeadTimeline";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface EditLeadFormProps {
  lead: any;
  onClose: () => void;
  onSuccess: () => void;
}

export function EditLeadForm({ lead, onClose, onSuccess }: EditLeadFormProps) {
  const { t } = useTranslation();

  const [formData, setFormData] = useState({
    name: lead.name || "",
    phone: lead.phone || "",
    email: lead.email || "",
    telegram: lead.telegram || "",
    serviceId: null as number | null,
    additionalServiceIds: [] as number[],
    totalAmount: 0,
    manualAmount: null as number | null,
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
    // If manual amount is set, use it instead of calculated
    if (formData.manualAmount !== null && formData.manualAmount > 0) {
      setFormData((prev) => ({ ...prev, totalAmount: formData.manualAmount || 0 }));
      return;
    }

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
  }, [formData.serviceId, formData.additionalServiceIds, formData.manualAmount, services, additionalServices]);

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
      {/* Contact & Messaging */}
      <div>
        <h3 className="text-lg font-semibold mb-4">{t('editLead.contactInfo')}</h3>
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <Label htmlFor="name" className="mb-2 block">{t('editLead.name') + ' *'}</Label>
            <Input className="bg-zinc-800 border-zinc-700" id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
          </div>
          <div>
            <Label htmlFor="phone" className="mb-2 block">{t('editLead.phone') + ' *'}</Label>
            <Input className="bg-zinc-800 border-zinc-700" id="phone"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            />
          </div>
          <div>
            <Label htmlFor="email" className="mb-2 block">Email</Label>
            <Input className="bg-zinc-800 border-zinc-700" id="email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />
          </div>
          <div>
            <Label htmlFor="telegram" className="mb-2 block">Telegram</Label>
            <Input className="bg-zinc-800 border-zinc-700" id="telegram"
              value={formData.telegram}
              onChange={(e) => setFormData({ ...formData, telegram: e.target.value })}
            />
          </div>
        </div>

        {/* Quick Message Buttons */}
        <div className="mt-4 flex gap-2">
          {formData.telegram && (
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="flex-1"
              onClick={() => window.open(`https://t.me/${formData.telegram.replace('@', '')}`, '_blank')}
            >
              <Send className="w-4 h-4 mr-2" />
              Telegram
            </Button>
          )}
          {formData.phone && (
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="flex-1"
              onClick={() => window.open(`https://wa.me/${formData.phone.replace(/[^0-9]/g, '')}`, '_blank')}
            >
              <MessageCircle className="w-4 h-4 mr-2" />
              WhatsApp
            </Button>
          )}
          {formData.email && (
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="flex-1"
              onClick={() => window.open(`mailto:${formData.email}`, '_blank')}
            >
              <Mail className="w-4 h-4 mr-2" />
              Email
            </Button>
          )}
        </div>
      </div>

      {/* Service Assignment */}
      <div>
        <h3 className="text-lg font-semibold mb-4">{t('editLead.serviceAssignment')}</h3>
        <div className="space-y-4">
          <div>
            <Label htmlFor="service" className="mb-2 block">{t('editLead.mainService')}</Label>
            <Select
              value={formData.serviceId?.toString() || ""}
              onValueChange={(value) => setFormData({ ...formData, serviceId: parseInt(value) })}
            >
              <SelectTrigger className="bg-zinc-800 border-zinc-700">
                <SelectValue placeholder={t('editLead.selectService')} />
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
              <Label className="mb-2 block mb-2">{t('editLead.additionalServices')}</Label>
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
          <div className="space-y-2 mb-4">
            <Label htmlFor="manual-amount" className="mb-2 block">{t('editLead.totalAmount') + ' (' + t('editLead.manualOverride') + ')'}</Label>
            <div className="flex gap-2 items-center">
              <Input className="bg-zinc-800 border-zinc-700" id="manual-amount"
                type="number"
                placeholder={t('editLead.autoCalculated')}
                value={formData.manualAmount || ""}
                onChange={(e) => setFormData({ ...formData, manualAmount: e.target.value ? parseFloat(e.target.value) : null })}
              />
              {formData.manualAmount !== null && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => setFormData({ ...formData, manualAmount: null })}
                >
                  Reset
                </Button>
              )}
            </div>
            <div className="bg-muted p-4 rounded-md">
              <div className="flex justify-between items-center">
                <span className="text-lg font-semibold">{t('editLead.totalAmount') + ':'}</span>
                <span className="text-2xl font-bold text-primary">
                  ${formData.totalAmount}
                </span>
              </div>
              {formData.manualAmount !== null && (
                <p className="text-xs text-muted-foreground mt-1">{t('editLead.manualOverrideActive')}</p>
              )}
            </div>
          </div>

          {/* Sale Notes */}
          <div>
            <Label htmlFor="notes" className="mb-2 block">{t('editLead.salesNotes')}</Label>
            <Textarea className="bg-zinc-800 border-zinc-700" id="notes"
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              placeholder={t('editLead.addNotes')}
              rows={3}
            />
          </div>
        </div>
      </div>

      {/* Comments and History Tabs */}
      <Tabs defaultValue="comments" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="comments">{t('editLead.comments')}</TabsTrigger>
          <TabsTrigger value="history">{t('editLead.history')}</TabsTrigger>
        </TabsList>
        <TabsContent value="comments" className="mt-4">
          <LeadComments leadId={lead.id} />
        </TabsContent>
        <TabsContent value="history" className="mt-4">
          <LeadTimeline leadId={lead.id} />
        </TabsContent>
      </Tabs>

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
