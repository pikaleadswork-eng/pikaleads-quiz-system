import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ArrowRight,
  Check,
  ChevronRight,
  Send,
  Sparkles,
  Zap,
  Heart,
  Star,
  Trophy,
  Gift,
} from "lucide-react";

export interface ButtonStyle {
  text: string;
  color: string;
  icon?: string;
  animation?: "none" | "pulse" | "bounce" | "glow";
}

interface ButtonCustomizerProps {
  buttonStyle: ButtonStyle;
  onChange: (style: ButtonStyle) => void;
}

const iconOptions = [
  { value: "none", label: "Без іконки", icon: null },
  { value: "arrow", label: "Стрілка", icon: ArrowRight },
  { value: "check", label: "Галочка", icon: Check },
  { value: "chevron", label: "Шеврон", icon: ChevronRight },
  { value: "send", label: "Відправити", icon: Send },
  { value: "sparkles", label: "Зірки", icon: Sparkles },
  { value: "zap", label: "Блискавка", icon: Zap },
  { value: "heart", label: "Серце", icon: Heart },
  { value: "star", label: "Зірка", icon: Star },
  { value: "trophy", label: "Кубок", icon: Trophy },
  { value: "gift", label: "Подарунок", icon: Gift },
];

const colorPresets = [
  { name: "Жовтий (PIKALEADS)", value: "#FFD93D" },
  { name: "Фіолетовий", value: "#5B2E90" },
  { name: "Синій", value: "#3B82F6" },
  { name: "Зелений", value: "#10B981" },
  { name: "Червоний", value: "#EF4444" },
  { name: "Помаранчевий", value: "#F97316" },
  { name: "Рожевий", value: "#EC4899" },
  { name: "Індиго", value: "#6366F1" },
];

const animationOptions = [
  { value: "none", label: "Без анімації" },
  { value: "pulse", label: "Пульсація" },
  { value: "bounce", label: "Підстрибування" },
  { value: "glow", label: "Свічення" },
];

export function ButtonCustomizer({ buttonStyle, onChange }: ButtonCustomizerProps) {
  const { t } = useTranslation();
  const [customColor, setCustomColor] = useState(buttonStyle.color);

  const getIconComponent = (iconValue?: string) => {
    const option = iconOptions.find((opt) => opt.value === iconValue);
    return option?.icon || null;
  };

  const IconComponent = getIconComponent(buttonStyle.icon);

  const getAnimationClass = (animation?: string) => {
    switch (animation) {
      case "pulse":
        return "animate-pulse";
      case "bounce":
        return "animate-bounce";
      case "glow":
        return "shadow-lg shadow-primary/50";
      default:
        return "";
    }
  };

  return (
    <Card className="p-6 space-y-6">
      <div>
        <h3 className="text-xl font-bold text-foreground mb-2">
          {t("buttonCustomizer.title")}
        </h3>
        <p className="text-sm text-muted-foreground">
          {t("buttonCustomizer.subtitle")}
        </p>
      </div>

      {/* Button text */}
      <div>
        <Label>{t("buttonCustomizer.buttonText")}</Label>
        <Input
          value={buttonStyle.text}
          onChange={(e) => onChange({ ...buttonStyle, text: e.target.value })}
          placeholder={t("buttonCustomizer.buttonTextPlaceholder")}
          className="mt-1 bg-zinc-800"
        />
      </div>

      {/* Color presets */}
      <div>
        <Label>{t("buttonCustomizer.color")}</Label>
        <div className="grid grid-cols-4 gap-2 mt-2">
          {colorPresets.map((preset) => (
            <button
              key={preset.value}
              onClick={() => {
                setCustomColor(preset.value);
                onChange({ ...buttonStyle, color: preset.value });
              }}
              className={`
                h-12 rounded-lg border-2 transition-all
                ${buttonStyle.color === preset.value
                  ? "border-primary scale-105"
                  : "border-border hover:border-primary/50"
                }
              `}
              style={{ backgroundColor: preset.value }}
              title={preset.name}
            />
          ))}
        </div>
      </div>

      {/* Custom color */}
      <div>
        <Label>{t("buttonCustomizer.customColor")}</Label>
        <div className="flex gap-2 mt-1">
          <Input
            type="color"
            value={customColor}
            onChange={(e) => setCustomColor(e.target.value)}
            className="w-20 h-10 p-1 bg-zinc-800"
          />
          <Input
            type="text"
            value={customColor}
            onChange={(e) => setCustomColor(e.target.value)}
            placeholder="#FFD93D"
            className="flex-1 bg-zinc-800"
          />
          <Button
            variant="outline"
            onClick={() => onChange({ ...buttonStyle, color: customColor })}
          >
            {t("buttonCustomizer.apply")}
          </Button>
        </div>
      </div>

      {/* Icon selector */}
      <div>
        <Label>{t("buttonCustomizer.icon")}</Label>
        <Select
          value={buttonStyle.icon || "none"}
          onValueChange={(value) =>
            onChange({ ...buttonStyle, icon: value === "none" ? undefined : value })
          }
        >
          <SelectTrigger className="mt-1 bg-zinc-800">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {iconOptions.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                <div className="flex items-center gap-2">
                  {option.icon && <option.icon className="w-4 h-4" />}
                  {option.label}
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Animation selector */}
      <div>
        <Label>{t("buttonCustomizer.animation")}</Label>
        <Select
          value={buttonStyle.animation || "none"}
          onValueChange={(value) =>
            onChange({
              ...buttonStyle,
              animation: value as ButtonStyle["animation"],
            })
          }
        >
          <SelectTrigger className="mt-1 bg-zinc-800">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {animationOptions.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Preview */}
      <div>
        <Label>{t("buttonCustomizer.preview")}</Label>
        <div className="mt-2 p-6 bg-zinc-900 rounded-lg flex items-center justify-center">
          <button
            className={`
              px-6 py-3 rounded-lg font-semibold text-white
              transition-all duration-300 hover:scale-105
              ${getAnimationClass(buttonStyle.animation)}
            `}
            style={{ backgroundColor: buttonStyle.color }}
          >
            <div className="flex items-center gap-2">
              {buttonStyle.text || t("buttonCustomizer.defaultButtonText")}
              {IconComponent && <IconComponent className="w-5 h-5" />}
            </div>
          </button>
        </div>
      </div>
    </Card>
  );
}
