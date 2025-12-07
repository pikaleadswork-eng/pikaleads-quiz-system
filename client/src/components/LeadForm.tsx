import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface LeadFormProps {
  onSubmit: (data: { name: string; phone: string; telegram: string }) => void;
  isLoading?: boolean;
}

export default function LeadForm({ onSubmit, isLoading }: LeadFormProps) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [telegram, setTelegram] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name && phone) {
      onSubmit({ name, phone, telegram });
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="bg-card border-2 border-border rounded-xl p-8 shadow-2xl">
        <h2 className="text-3xl font-bold text-center mb-2 text-foreground">
          Get Your Free Analysis
        </h2>
        <p className="text-center text-muted-foreground mb-8">
          Our specialist will contact you within 10-15 minutes
        </p>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <Label htmlFor="name" className="text-foreground font-semibold mb-2 block">
              Your Name *
            </Label>
            <Input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              placeholder="John Doe"
              className="h-14 text-lg bg-input border-2 border-border focus:border-primary text-foreground"
            />
          </div>
          <div>
            <Label htmlFor="phone" className="text-foreground font-semibold mb-2 block">
              Phone Number *
            </Label>
            <Input
              id="phone"
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
              placeholder="+1 (555) 123-4567"
              className="h-14 text-lg bg-input border-2 border-border focus:border-primary text-foreground"
            />
          </div>
          <div>
            <Label htmlFor="telegram" className="text-foreground font-semibold mb-2 block">
              Telegram Username (Optional)
            </Label>
            <Input
              id="telegram"
              type="text"
              value={telegram}
              onChange={(e) => setTelegram(e.target.value)}
              placeholder="@username"
              className="h-14 text-lg bg-input border-2 border-border focus:border-primary text-foreground"
            />
          </div>
          <Button
            type="submit"
            disabled={isLoading || !name || !phone}
            className="w-full h-16 text-xl font-bold bg-primary hover:bg-primary/90 text-primary-foreground shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105"
          >
            {isLoading ? "Submitting..." : "Get My Free Analysis →"}
          </Button>
        </form>
      </div>
    </div>
  );
}
