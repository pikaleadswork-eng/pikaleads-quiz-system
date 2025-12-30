import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  quizTemplates,
  type QuizTemplate,
  getAllNiches,
} from '../../../shared/quizTemplates';
import { FileText, Eye, Check, Zap } from 'lucide-react';

interface TemplateLibraryProps {
  onSelectTemplate: (template: QuizTemplate) => void;
}

export function TemplateLibrary({ onSelectTemplate }: TemplateLibraryProps) {
  const { t, i18n } = useTranslation();
  const [selectedPlatform, setSelectedPlatform] = useState<'all' | 'meta' | 'google'>('all');
  const [selectedNiche, setSelectedNiche] = useState<string>('all');
  const [previewTemplate, setPreviewTemplate] = useState<QuizTemplate | null>(null);

  const niches = getAllNiches();

  const filteredTemplates = quizTemplates.filter((template) => {
    const platformMatch = selectedPlatform === 'all' || template.platform === selectedPlatform;
    const nicheMatch = selectedNiche === 'all' || template.niche === selectedNiche;
    return platformMatch && nicheMatch;
  });

  const currentLang = i18n.language as 'ua' | 'ru' | 'en';

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-foreground mb-2">
          {t('templateLibrary.title')}
        </h2>
        <p className="text-muted-foreground">
          {t('templateLibrary.subtitle')}
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-4">
        <div>
          <label className="text-sm font-medium text-foreground mb-2 block">
            {t('templateLibrary.platform')}
          </label>
          <Tabs value={selectedPlatform} onValueChange={(v) => setSelectedPlatform(v as any)}>
            <TabsList>
              <TabsTrigger value="all">{t('templateLibrary.allPlatforms')}</TabsTrigger>
              <TabsTrigger value="meta">Meta Ads</TabsTrigger>
              <TabsTrigger value="google">Google Ads</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        <div>
          <label className="text-sm font-medium text-foreground mb-2 block">
            {t('templateLibrary.niche')}
          </label>
          <select
            value={selectedNiche}
            onChange={(e) => setSelectedNiche(e.target.value)}
            className="px-4 py-2 bg-zinc-800 border border-border rounded-md text-foreground"
          >
            <option value="all">{t('templateLibrary.allNiches')}</option>
            {niches.map((niche) => (
              <option key={niche} value={niche}>
                {t(`templateLibrary.niches.${niche}`)}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Templates Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTemplates.map((template) => (
          <Card key={template.id} className="p-6 hover:border-primary transition-colors">
            <div className="space-y-4">
              {/* Header */}
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <Badge variant="outline" className="text-xs">
                      {template.platform === 'meta' ? 'Meta Ads' : 'Google Ads'}
                    </Badge>
                    <Badge variant="secondary" className="text-xs">
                      {t(`templateLibrary.niches.${template.niche}`)}
                    </Badge>
                  </div>
                  <h3 className="text-lg font-bold text-foreground line-clamp-2">
                    {template.title[currentLang]}
                  </h3>
                </div>
                <Zap className="w-5 h-5 text-yellow-500 flex-shrink-0" />
              </div>

              {/* Subtitle */}
              <p className="text-sm text-muted-foreground line-clamp-2">
                {template.subtitle[currentLang]}
              </p>

              {/* Stats */}
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <FileText className="w-4 h-4" />
                  <span>{template.questions.length} {t('templateLibrary.questions')}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Check className="w-4 h-4" />
                  <span>{template.scoring.ranges.length} {t('templateLibrary.outcomes')}</span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-2 pt-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPreviewTemplate(template)}
                  className="flex-1"
                >
                  <Eye className="w-4 h-4 mr-2" />
                  {t('templateLibrary.preview')}
                </Button>
                <Button
                  size="sm"
                  onClick={() => onSelectTemplate(template)}
                  className="flex-1"
                >
                  {t('templateLibrary.useTemplate')}
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Empty State */}
      {filteredTemplates.length === 0 && (
        <div className="text-center py-12">
          <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-foreground mb-2">
            {t('templateLibrary.noTemplates')}
          </h3>
          <p className="text-muted-foreground">
            {t('templateLibrary.tryDifferentFilters')}
          </p>
        </div>
      )}

      {/* Preview Dialog */}
      <Dialog open={!!previewTemplate} onOpenChange={() => setPreviewTemplate(null)}>
        <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
          {previewTemplate && (
            <>
              <DialogHeader>
                <div className="flex items-center gap-2 mb-2">
                  <Badge variant="outline">
                    {previewTemplate.platform === 'meta' ? 'Meta Ads' : 'Google Ads'}
                  </Badge>
                  <Badge variant="secondary">
                    {t(`templateLibrary.niches.${previewTemplate.niche}`)}
                  </Badge>
                </div>
                <DialogTitle className="text-2xl">
                  {previewTemplate.title[currentLang]}
                </DialogTitle>
                <DialogDescription>
                  {previewTemplate.subtitle[currentLang]}
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-6 mt-4">
                {/* Questions */}
                <div>
                  <h3 className="text-lg font-semibold text-foreground mb-4">
                    {t('templateLibrary.previewQuestions')} ({previewTemplate.questions.length})
                  </h3>
                  <div className="space-y-4">
                    {previewTemplate.questions.map((question, index) => (
                      <Card key={index} className="p-4">
                        <div className="space-y-2">
                          <div className="flex items-start gap-2">
                            <Badge variant="outline" className="text-xs">
                              {index + 1}
                            </Badge>
                            <div className="flex-1">
                              <p className="font-medium text-foreground">
                                {question.text[currentLang]}
                                {question.required && <span className="text-red-500 ml-1">*</span>}
                              </p>
                              <p className="text-xs text-muted-foreground mt-1">
                                {t(`quizEditor.types.${question.type}`)}
                              </p>
                            </div>
                          </div>
                          {question.options && question.options.length > 0 && (
                            <div className="ml-8 space-y-1">
                              {question.options.map((option, optIndex) => (
                                <div
                                  key={optIndex}
                                  className="text-sm text-muted-foreground flex items-center gap-2"
                                >
                                  <span className="w-4 h-4 rounded-full border border-border flex items-center justify-center text-xs">
                                    {optIndex + 1}
                                  </span>
                                  {option[currentLang]}
                                  {option.score && (
                                    <Badge variant="secondary" className="text-xs ml-auto">
                                      {option.score} {t('templateLibrary.points')}
                                    </Badge>
                                  )}
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      </Card>
                    ))}
                  </div>
                </div>

                {/* Scoring */}
                <div>
                  <h3 className="text-lg font-semibold text-foreground mb-4">
                    {t('templateLibrary.scoringRanges')}
                  </h3>
                  <div className="space-y-3">
                    {previewTemplate.scoring.ranges.map((range, index) => (
                      <Card key={index} className="p-4">
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <h4 className="font-semibold text-foreground">
                              {range.label[currentLang]}
                            </h4>
                            <Badge variant="outline">
                              {range.min}-{range.max} {t('templateLibrary.points')}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            {range.recommendation[currentLang]}
                          </p>
                        </div>
                      </Card>
                    ))}
                  </div>
                </div>

                {/* Action */}
                <Button
                  onClick={() => {
                    onSelectTemplate(previewTemplate);
                    setPreviewTemplate(null);
                  }}
                  className="w-full"
                  size="lg"
                >
                  {t('templateLibrary.useThisTemplate')}
                </Button>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
