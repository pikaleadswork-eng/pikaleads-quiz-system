import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useState } from "react";

export interface ServiceDetail {
  id: string;
  title: string;
  description: string;
  color: string;
  icon: React.ReactNode;
  whatIncluded: string[];
  pricing: {
    basic: string;
    standard: string;
    premium: string;
  };
  timeline: string;
  examples: string[];
}

interface ServiceDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  service: ServiceDetail | null;
  onConsultation: () => void;
}

export default function ServiceDetailModal({ isOpen, onClose, service, onConsultation }: ServiceDetailModalProps) {
  if (!service) return null;

  const handleConsultation = () => {
    onClose();
    onConsultation();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto bg-zinc-900 border-2" style={{ borderColor: service.color }}>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-4 text-2xl md:text-3xl font-black text-white" style={{ fontFamily: "'Eurostile Bold Extended', sans-serif" }}>
            <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ backgroundColor: `${service.color}20` }}>
              {service.icon}
            </div>
            {service.title}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 mt-4">
          {/* Description */}
          <div>
            <p className="text-gray-300 text-lg leading-relaxed">
              {service.description}
            </p>
          </div>

          {/* What's Included */}
          <div>
            <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <span style={{ color: service.color }}>✓</span> Що входить в послугу
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {service.whatIncluded.map((item, index) => (
                <div key={index} className="flex items-start gap-2">
                  <span className="text-[#FFD93D] mt-1">▸</span>
                  <span className="text-gray-300">{item}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Pricing */}
          <div>
            <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <span style={{ color: service.color }}>💰</span> Вартість
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-zinc-800/50 border border-zinc-700 rounded-xl p-4">
                <div className="text-sm text-gray-400 mb-1">БАЗОВИЙ</div>
                <div className="text-2xl font-bold text-white">{service.pricing.basic}</div>
              </div>
              <div className="bg-zinc-800/50 border-2 rounded-xl p-4" style={{ borderColor: service.color }}>
                <div className="text-sm mb-1" style={{ color: service.color }}>СТАНДАРТ ⭐</div>
                <div className="text-2xl font-bold text-white">{service.pricing.standard}</div>
              </div>
              <div className="bg-zinc-800/50 border border-zinc-700 rounded-xl p-4">
                <div className="text-sm text-gray-400 mb-1">ПРЕМІУМ</div>
                <div className="text-2xl font-bold text-white">{service.pricing.premium}</div>
              </div>
            </div>
          </div>

          {/* Timeline */}
          <div>
            <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <span style={{ color: service.color }}>⏱</span> Терміни виконання
            </h3>
            <div className="bg-zinc-800/50 border border-zinc-700 rounded-xl p-4">
              <p className="text-gray-300 text-lg">{service.timeline}</p>
            </div>
          </div>

          {/* Examples */}
          {service.examples.length > 0 && (
            <div>
              <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <span style={{ color: service.color }}>📊</span> Приклади результатів
              </h3>
              <div className="space-y-2">
                {service.examples.map((example, index) => (
                  <div key={index} className="bg-zinc-800/50 border border-zinc-700 rounded-lg p-3">
                    <p className="text-gray-300">{example}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 pt-4 border-t border-zinc-800">
            <Button
              onClick={handleConsultation}
              className="flex-1 py-6 text-lg font-bold"
              style={{ backgroundColor: service.color }}
            >
              Отримати консультацію
            </Button>
            <Button
              onClick={onClose}
              variant="outline"
              className="flex-1 py-6 text-lg font-bold border-2"
              style={{ borderColor: service.color, color: service.color }}
            >
              Закрити
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
