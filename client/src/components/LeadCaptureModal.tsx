import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { X } from "lucide-react";
import { toast } from "sonner";
import { trpc } from "@/lib/trpc";

interface LeadCaptureModalProps {
  isOpen: boolean;
  onClose: () => void;
  source: string;
  title?: string;
  description?: string;
}

export default function LeadCaptureModal({ 
  isOpen, 
  onClose, 
  source,
  title = "Залишити заявку",
  description = "Заповніть форму і ми зв'яжемось з вами найближчим часом"
}: LeadCaptureModalProps) {
  const [formData, setFormData] = useState({
    name: "",
    contact: "",
    website: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const submitLeadMutation = trpc.leads.submitLead.useMutation({
    onSuccess: () => {
      toast.success("Заявку відправлено! Ми зв'яжемось з вами найближчим часом.");
      setFormData({ name: "", contact: "", website: "" });
      setIsSubmitting(false);
      onClose();
    },
    onError: () => {
      toast.error("Помилка відправки. Спробуйте ще раз.");
      setIsSubmitting(false);
    }
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.contact) {
      toast.error("Будь ласка, заповніть всі обов'язкові поля");
      return;
    }

    setIsSubmitting(true);
    submitLeadMutation.mutate({
      name: formData.name,
      phone: formData.contact,
      email: "",
      telegram: "",
      source: source,
      notes: formData.website ? `Сайт/ніша: ${formData.website}` : ""
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-zinc-900 border-[#FFD93D]/50 text-white max-w-md">
        <DialogHeader>
          <DialogTitle className="text-2xl font-black text-[#FFD93D]">{title}</DialogTitle>
          <p className="text-zinc-400">{description}</p>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div>
            <label className="block text-white font-semibold mb-2">Ім'я *</label>
            <Input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Ваше ім'я"
              className="bg-zinc-800 border-zinc-700 text-white"
              required
            />
          </div>

          <div>
            <label className="block text-white font-semibold mb-2">Телефон / месенджер *</label>
            <Input
              type="text"
              value={formData.contact}
              onChange={(e) => setFormData({ ...formData, contact: e.target.value })}
              placeholder="+380..."
              className="bg-zinc-800 border-zinc-700 text-white"
              required
            />
          </div>

          <div>
            <label className="block text-white font-semibold mb-2">Сайт або ніша</label>
            <Textarea
              value={formData.website}
              onChange={(e) => setFormData({ ...formData, website: e.target.value })}
              placeholder="Розкажіть про ваш бізнес..."
              className="bg-zinc-800 border-zinc-700 text-white min-h-[100px]"
            />
          </div>

          <Button 
            type="submit" 
            size="lg" 
            className="w-full bg-[#00F0FF] text-black hover:bg-[#00F0FF]/90 font-bold text-lg"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Відправка..." : "Відправити заявку"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
