import { Button } from "@/components/ui/button";
import QuizLayout from "@/components/QuizLayout";
import { CheckCircle2 } from "lucide-react";

export default function ThankYou() {
  const handleTelegramRedirect = () => {
    // Replace with your actual Telegram link
    window.open("https://t.me/pikaleads", "_blank");
  };

  return (
    <QuizLayout>
      <div className="max-w-3xl mx-auto text-center py-12">
        <div className="mb-8 flex justify-center">
          <div className="w-24 h-24 bg-accent rounded-full flex items-center justify-center animate-bounce-in">
            <CheckCircle2 className="w-16 h-16 text-accent-foreground" />
          </div>
        </div>

        <h1 className="text-4xl md:text-5xl font-black text-foreground mb-6">
          Thank You! Application Received!
        </h1>

        <div className="bg-card border-2 border-border rounded-xl p-8 mb-8 shadow-2xl">
          <p className="text-xl text-card-foreground mb-6 leading-relaxed">
            Our specialist will contact you within <span className="text-accent font-bold">10-15 minutes</span> and provide a personalized launch plan.
          </p>
          <p className="text-lg text-muted-foreground">
            We are already analyzing your niche and preparing a results forecast.
          </p>
        </div>

        <Button
          onClick={handleTelegramRedirect}
          size="lg"
          className="h-16 px-12 text-xl font-bold bg-primary hover:bg-primary/90 text-primary-foreground shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105"
        >
          Go to Telegram →
        </Button>

        <div className="mt-12 pt-8 border-t border-border">
          <p className="text-sm text-muted-foreground">
            Want to explore more? <a href="/" className="text-accent hover:underline font-semibold">Return to quiz selection</a>
          </p>
        </div>
      </div>
    </QuizLayout>
  );
}
