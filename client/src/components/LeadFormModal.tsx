import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import { getCurrentUTMParams, type UTMParams } from "@/lib/utm";
import { trackLeadSubmission, trackFormStart } from "@/lib/analytics";

interface LeadFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  formType: "consultation" | "strategy";
}

export default function LeadFormModal({ isOpen, onClose, formType }: LeadFormModalProps) {
  const [, setLocation] = useLocation();
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    comment: ""
  });

  const [utmParams, setUtmParams] = useState<UTMParams>({});

  // Capture UTM parameters on mount
  useEffect(() => {
    const params = getCurrentUTMParams();
    setUtmParams(params);
  }, []);

  const createLead = trpc.leads.create.useMutation({
    onSuccess: () => {
      // Track conversion in Google Analytics
      trackLeadSubmission({
        lead_type: formType === "consultation" ? "Консультація" : "Стратегія",
        lead_value: formType === "consultation" ? 500 : 1000, // Estimated lead value
        currency: "UAH",
        utm_source: utmParams.utm_source,
        utm_medium: utmParams.utm_medium,
        utm_campaign: utmParams.utm_campaign,
      });

      setFormData({ name: "", phone: "", email: "", comment: "" });
      onClose();
      // Redirect to thank-you page
      setLocation("/thank-you");
    },
    onError: (error) => {
      toast.error("Помилка відправки заявки", {
        description: error.message
      });
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Track form start
    trackFormStart(formType);
    
    if (!formData.name || !formData.phone) {
      toast.error("Заповніть обов'язкові поля", {
        description: "Ім'я та телефон є обов'язковими"
      });
      return;
    }

    createLead.mutate({
      ...formData,
      source: formType === "consultation" ? "Консультація" : "Стратегія",
      status: "new",
      utmSource: utmParams.utm_source,
      utmMedium: utmParams.utm_medium,
      utmCampaign: utmParams.utm_campaign,
      utmTerm: utmParams.utm_term,
      utmContent: utmParams.utm_content,
    });
  };

  const title = formType === "consultation" 
    ? "Отримати консультацію" 
    : "Отримати стратегію";

  const description = formType === "consultation"
    ? "Залиште свої контакти, і ми зв'яжемося з вами протягом 15 хвилин"
    : "Отримайте персональну стратегію для вашого бізнесу";

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px] bg-zinc-900 border-[#FFD93D]/20">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-white" style={{ fontFamily: "'Eurostile Bold Extended', sans-serif" }}>
            {title}
          </DialogTitle>
          <p className="text-gray-400 text-sm mt-2">{description}</p>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          {/* Name Field */}
          <div>
            <label className="text-sm font-medium text-gray-300 mb-2 block">
              Ім'я <span className="text-red-500">*</span>
            </label>
            <Input
              type="text"
              placeholder="Ваше ім'я"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="bg-zinc-800 border-zinc-700 text-white placeholder:text-gray-500 focus:border-[#FFD93D]"
              required
            />
          </div>

          {/* Phone Field */}
          <div>
            <label className="text-sm font-medium text-gray-300 mb-2 block">
              Телефон <span className="text-red-500">*</span>
            </label>
            <Input
              type="tel"
              placeholder="+380 XX XXX XX XX"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              className="bg-zinc-800 border-zinc-700 text-white placeholder:text-gray-500 focus:border-[#FFD93D]"
              required
            />
          </div>

          {/* Email Field */}
          <div>
            <label className="text-sm font-medium text-gray-300 mb-2 block">
              Email (опціонально)
            </label>
            <Input
              type="email"
              placeholder="example@email.com"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="bg-zinc-800 border-zinc-700 text-white placeholder:text-gray-500 focus:border-[#FFD93D]"
            />
          </div>

          {/* Comment Field */}
          <div>
            <label className="text-sm font-medium text-gray-300 mb-2 block">
              Коментар (опціонально)
            </label>
            <Textarea
              placeholder="Розкажіть про ваш проєкт або питання..."
              value={formData.comment}
              onChange={(e) => setFormData({ ...formData, comment: e.target.value })}
              className="bg-zinc-800 border-zinc-700 text-white placeholder:text-gray-500 focus:border-[#FFD93D] min-h-[100px]"
            />
          </div>

          {/* Submit Button */}
          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="flex-1 border-zinc-700 text-gray-300 hover:bg-zinc-800"
            >
              Скасувати
            </Button>
            <Button
              type="submit"
              disabled={createLead.isPending}
              className="flex-1 bg-[#FFD93D] hover:bg-[#FFD93D]/90 text-black font-bold"
            >
              {createLead.isPending ? "Відправка..." : "Відправити заявку"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
