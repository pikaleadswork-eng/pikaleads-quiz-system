import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface FAQItem {
  question: string;
  answer: string;
  color: string;
}

interface CollapsibleFAQProps {
  items: FAQItem[];
}

export default function CollapsibleFAQ({ items }: CollapsibleFAQProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-4">
      {items.map((item, index) => (
        <Card 
          key={index}
          className="bg-zinc-800/50 border-zinc-700 overflow-hidden transition-all duration-300 hover:border-zinc-600"
        >
          <CardContent className="p-0">
            <button
              onClick={() => toggleFAQ(index)}
              className="w-full text-left p-6 sm:p-8 flex items-center justify-between gap-4 hover:bg-zinc-800/30 transition-colors"
            >
              <h3 
                className="text-lg sm:text-xl md:text-2xl font-bold"
                style={{ 
                  fontFamily: "'Eurostile Bold Extended', sans-serif",
                  color: item.color
                }}
              >
                {item.question}
              </h3>
              <ChevronDown 
                className={`w-6 h-6 flex-shrink-0 transition-transform duration-300 ${
                  openIndex === index ? 'rotate-180' : ''
                }`}
                style={{ color: item.color }}
              />
            </button>
            
            <div 
              className={`overflow-hidden transition-all duration-300 ease-in-out ${
                openIndex === index ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
              }`}
            >
              <div className="px-6 sm:px-8 pb-6 sm:pb-8 pt-0">
                <p 
                  className="text-base sm:text-lg text-zinc-300 leading-relaxed"
                  style={{ fontFamily: "'Eurostile Bold Extended', sans-serif" }}
                >
                  {item.answer}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
