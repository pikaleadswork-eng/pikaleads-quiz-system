import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Search, Sparkles, TrendingUp } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { useLanguage } from "@/contexts/LanguageContext";

interface QuizTemplate {
  id: number;
  name: string;
  niche: string;
  description: string | null;
  previewImage: string | null;
  usageCount: number;
  quizData: string;
  designPreset: string;
}

interface QuizTemplateLibraryProps {
  onSelectTemplate: (template: QuizTemplate) => void;
}

export default function QuizTemplateLibrary({ onSelectTemplate }: QuizTemplateLibraryProps) {
  const { language } = useLanguage();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedNiche, setSelectedNiche] = useState<string>("all");

  const { data: allTemplates, isLoading } = trpc.quizTemplates.getAll.useQuery();

  const niches = [
    { value: "all", label: language === "uk" ? "Всі" : "All", icon: Sparkles },
    { value: "furniture", label: language === "uk" ? "Меблі" : "Furniture", icon: TrendingUp },
    { value: "renovation", label: language === "uk" ? "Ремонт" : "Renovation", icon: TrendingUp },
    { value: "ecommerce", label: language === "uk" ? "E-commerce" : "E-commerce", icon: TrendingUp },
    { value: "services", label: language === "uk" ? "Послуги" : "Services", icon: TrendingUp },
    { value: "realestate", label: language === "uk" ? "Нерухомість" : "Real Estate", icon: TrendingUp },
  ];

  const filteredTemplates = allTemplates?.filter((template) => {
    const matchesSearch = template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         (template.description?.toLowerCase().includes(searchQuery.toLowerCase()) || false);
    const matchesNiche = selectedNiche === "all" || template.niche === selectedNiche;
    return matchesSearch && matchesNiche;
  }) || [];

  const getNicheLabel = (niche: string) => {
    const nicheObj = niches.find(n => n.value === niche);
    return nicheObj?.label || niche;
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">
            {language === "uk" ? "Завантаження шаблонів..." : "Loading templates..."}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold mb-2">
          {language === "uk" ? "Бібліотека шаблонів квізів" : "Quiz Template Library"}
        </h2>
        <p className="text-muted-foreground">
          {language === "uk" 
            ? "Виберіть готовий шаблон та налаштуйте під свій бізнес" 
            : "Choose a ready-made template and customize it for your business"}
        </p>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          placeholder={language === "uk" ? "Пошук шаблонів..." : "Search templates..."}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Niche Tabs */}
      <Tabs value={selectedNiche} onValueChange={setSelectedNiche}>
        <TabsList className="grid grid-cols-3 lg:grid-cols-6">
          {niches.map((niche) => (
            <TabsTrigger key={niche.value} value={niche.value} className="gap-2">
              <niche.icon className="w-4 h-4" />
              <span className="hidden sm:inline">{niche.label}</span>
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value={selectedNiche} className="mt-6">
          {filteredTemplates.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">
                {language === "uk" ? "Шаблони не знайдено" : "No templates found"}
              </p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredTemplates.map((template) => (
                <Card key={template.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                  <div className="aspect-video relative overflow-hidden bg-muted">
                    <img
                      src={template.previewImage || "/placeholder-quiz.png"}
                      alt={template.name}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-2 right-2">
                      <Badge variant="secondary">
                        {getNicheLabel(template.niche)}
                      </Badge>
                    </div>
                  </div>
                  <div className="p-4 space-y-3">
                    <div>
                      <h3 className="font-semibold mb-1">{template.name}</h3>
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {template.description}
                      </p>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <TrendingUp className="w-4 h-4" />
                        <span>{template.usageCount} {language === "uk" ? "використань" : "uses"}</span>
                      </div>
                      <Button
                        size="sm"
                        onClick={() => onSelectTemplate(template)}
                      >
                        {language === "uk" ? "Використати" : "Use Template"}
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
