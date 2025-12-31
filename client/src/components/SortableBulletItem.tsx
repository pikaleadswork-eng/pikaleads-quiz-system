import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { GripVertical, Trash2 } from "lucide-react";

interface Bullet {
  id: string;
  text: string;
  icon: string;
}

const BULLET_ICONS = [
  { icon: "✓", label: "Галочка" },
  { icon: "⭐", label: "Зірка" },
  { icon: "🎯", label: "Ціль" },
  { icon: "💡", label: "Ідея" },
  { icon: "🚀", label: "Ракета" },
  { icon: "💰", label: "Гроші" },
  { icon: "📈", label: "Графік" },
  { icon: "🔥", label: "Вогонь" },
  { icon: "✨", label: "Блиск" },
  { icon: "👍", label: "Лайк" },
  { icon: "❤️", label: "Серце" },
  { icon: "🎁", label: "Подарунок" },
];

interface SortableBulletItemProps {
  bullet: Bullet;
  showIcons: boolean;
  onToggleIcons: () => void;
  onUpdateBullet: (id: string, field: keyof Bullet, value: string) => void;
  onRemoveBullet: (id: string) => void;
  onSelectIcon: (icon: string) => void;
}

export function SortableBulletItem({
  bullet,
  showIcons,
  onToggleIcons,
  onUpdateBullet,
  onRemoveBullet,
  onSelectIcon,
}: SortableBulletItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: bullet.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    zIndex: isDragging ? 100 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`flex items-center gap-2 bg-zinc-800 p-2 rounded ${isDragging ? "shadow-lg ring-2 ring-purple-500" : ""}`}
    >
      {/* Drag Handle */}
      <button
        type="button"
        className="cursor-grab active:cursor-grabbing text-zinc-500 hover:text-zinc-300 touch-none"
        {...attributes}
        {...listeners}
      >
        <GripVertical className="w-4 h-4" />
      </button>

      {/* Icon Selector */}
      <div className="relative">
        <button
          type="button"
          className="w-8 h-8 flex items-center justify-center bg-zinc-700 rounded text-lg hover:bg-zinc-600"
          onClick={onToggleIcons}
        >
          {bullet.icon}
        </button>
        {showIcons && (
          <div className="absolute top-full left-0 mt-1 bg-zinc-700 rounded p-2 grid grid-cols-4 gap-1 z-50 shadow-xl">
            {BULLET_ICONS.map(({ icon }) => (
              <button
                key={icon}
                type="button"
                className="w-7 h-7 flex items-center justify-center hover:bg-zinc-600 rounded"
                onClick={() => onSelectIcon(icon)}
              >
                {icon}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Text Input */}
      <Input
        value={bullet.text}
        onChange={(e) => onUpdateBullet(bullet.id, "text", e.target.value)}
        placeholder="Текст переваги"
        className="flex-1 bg-zinc-700 border-zinc-600 text-white h-8"
      />

      {/* Delete Button */}
      <Button
        variant="ghost"
        size="icon"
        onClick={() => onRemoveBullet(bullet.id)}
        className="h-8 w-8 text-red-400 hover:text-red-300"
      >
        <Trash2 className="w-4 h-4" />
      </Button>
    </div>
  );
}
