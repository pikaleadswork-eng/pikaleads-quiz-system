import { useTranslation } from 'react-i18next';
import { trpc } from '../lib/trpc';
import { formatDistanceToNow } from 'date-fns';
import { uk, ru, enUS } from 'date-fns/locale';

interface LeadTimelineProps {
  leadId: number;
}

const localeMap = {
  uk,
  ru,
  en: enUS,
};

const fieldIcons: Record<string, string> = {
  statusId: '🔄',
  assignedTo: '👤',
  name: '✏️',
  phone: '📞',
  email: '📧',
  telegram: '💬',
  notes: '📝',
  source: '📍',
};

const fieldLabels: Record<string, string> = {
  statusId: 'Status',
  assignedTo: 'Assigned Manager',
  name: 'Name',
  phone: 'Phone',
  email: 'Email',
  telegram: 'Telegram',
  notes: 'Notes',
  source: 'Source',
};

export default function LeadTimeline({ leadId }: LeadTimelineProps) {
  const { t, i18n } = useTranslation();
  const { data: history, isLoading } = trpc.crm.getHistory.useQuery({ leadId });

  const locale = localeMap[i18n.language as keyof typeof localeMap] || enUS;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!history || history.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        {t('crm.noHistory', 'No change history yet')}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {history.map((entry, index) => {
        const icon = fieldIcons[entry.field] || '📋';
        const fieldLabel = fieldLabels[entry.field] || entry.field;
        
        return (
          <div key={entry.id} className="flex gap-4">
            {/* Timeline line */}
            <div className="flex flex-col items-center">
              <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-lg">
                {icon}
              </div>
              {index < history.length - 1 && (
                <div className="w-0.5 h-full min-h-[40px] bg-border mt-2"></div>
              )}
            </div>

            {/* Content */}
            <div className="flex-1 pb-6">
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1">
                  <p className="font-medium text-sm">
                    {fieldLabel} {t('crm.changed', 'changed')}
                  </p>
                  <div className="mt-1 text-sm text-muted-foreground">
                    {entry.oldValue && (
                      <span className="line-through opacity-60">{entry.oldValue}</span>
                    )}
                    {entry.oldValue && entry.newValue && ' → '}
                    {entry.newValue && (
                      <span className="font-medium text-foreground">{entry.newValue}</span>
                    )}
                  </div>
                  <div className="mt-2 text-xs text-muted-foreground">
                    {t('crm.by', 'by')} <span className="font-medium">{entry.userName || 'Unknown'}</span>
                    {' • '}
                    {formatDistanceToNow(new Date(entry.changedAt), { 
                      addSuffix: true,
                      locale 
                    })}
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
