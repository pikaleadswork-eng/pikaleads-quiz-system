import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { AlignLeft, AlignCenter, AlignRight, Layout, Image as ImageIcon } from "lucide-react";

interface DesignLayoutSelectorProps {
  layoutType: "center" | "split" | "background";
  alignment: "left" | "center" | "right";
  onLayoutChange: (layout: "center" | "split" | "background") => void;
  onAlignmentChange: (alignment: "left" | "center" | "right") => void;
}

export function DesignLayoutSelector({
  layoutType,
  alignment,
  onLayoutChange,
  onAlignmentChange,
}: DesignLayoutSelectorProps) {
  const alignmentIcons = {
    left: AlignLeft,
    center: AlignCenter,
    right: AlignRight,
  };

  return (
    <Card className="p-6 bg-zinc-900 border-zinc-800 space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-white mb-4">Дизайн</h3>
        
        <div className="space-y-2">
          <Label className="text-zinc-300">Тип макету</Label>
          <Select value={layoutType} onValueChange={(value) => onLayoutChange(value as "center" | "split" | "background")}>
            <SelectTrigger className="bg-zinc-800 border-zinc-700">
              <div className="flex items-center gap-2">
                {layoutType === "background" ? (
                  <ImageIcon className="w-4 h-4" />
                ) : (
                  <Layout className="w-4 h-4" />
                )}
                <SelectValue />
              </div>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="center">
                <div className="flex items-center gap-2">
                  <Layout className="w-4 h-4" />
                  Стандартна
                </div>
              </SelectItem>
              <SelectItem value="background">
                <div className="flex items-center gap-2">
                  <ImageIcon className="w-4 h-4" />
                  Фонова картинка
                </div>
              </SelectItem>
            </SelectContent>
          </Select>
          <p className="text-xs text-zinc-500">
            {layoutType === "center" 
              ? "Контент по центру екрану" 
              : "Контент на фоні зображення/відео"}
          </p>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold text-white mb-4">Вирівнювання</h3>
        
        <div className="flex gap-2">
          {(["left", "center", "right"] as const).map((align) => {
            const Icon = alignmentIcons[align];
            const isActive = alignment === align;
            
            return (
              <button
                key={align}
                onClick={() => onAlignmentChange(align)}
                className={`
                  flex-1 p-4 rounded-lg border-2 transition-all
                  ${isActive 
                    ? "border-yellow-500 bg-yellow-500/10" 
                    : "border-zinc-700 bg-zinc-800 hover:border-zinc-600"
                  }
                `}
              >
                <Icon 
                  className={`w-6 h-6 mx-auto ${isActive ? "text-yellow-500" : "text-zinc-400"}`} 
                />
              </button>
            );
          })}
        </div>
        
        <div className="grid grid-cols-3 gap-2 mt-2 text-xs text-zinc-500 text-center">
          <span>Ліворуч</span>
          <span>По центру</span>
          <span>Праворуч</span>
        </div>
      </div>
    </Card>
  );
}
