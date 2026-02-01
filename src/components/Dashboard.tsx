import { useMemo } from 'react'
import type { Participant, TemplateInfo } from '../types'

interface DashboardProps {
  participants: Participant[]
  templates: TemplateInfo[]
  generatedCount: number
  projectsCount: number
  onQuickAction: (action: string) => void
  selectedTemplate?: TemplateInfo | null
}

interface QuickActionProps {
  title: string
  description: string
  icon: React.ReactNode
  onClick: () => void
  badge?: string
  status?: 'ready' | 'warning' | 'info' | 'disabled'
  disabled?: boolean
  disabledReasons?: string[]
}

const QuickAction = ({
  title,
  description,
  icon,
  onClick,
  badge,
  status,
  disabled = false,
  disabledReasons,
}: QuickActionProps) => {
  return (
    <div className='relative group h-full'>
      <button
        onClick={disabled ? undefined : onClick}
        disabled={disabled}
        className={`w-full h-full bg-dark-card rounded-2xl p-6 transition-all border text-left relative overflow-hidden flex flex-col ${disabled
          ? 'border-dark-surface opacity-50 cursor-not-allowed'
          : 'border-dark-surface hover:border-accent-green hover:shadow-[0_0_20px_-5px_rgba(163,230,53,0.3)] cursor-pointer'
          }`}
      >
        {/* Hover Gradient Effect */}
        {!disabled && (
          <div className="absolute inset-0 bg-gradient-to-br from-accent-green/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
        )}

        {/* Badge */}
        {badge && (
          <div
            className={`absolute top-4 right-4 px-3 py-1 rounded-full text-xs font-bold border z-10 ${status === 'ready'
              ? 'bg-accent-green/10 text-accent-green border-accent-green/20'
              : 'bg-dark-surface text-text-muted border-white/5'
              }`}
          >
            {badge}
          </div>
        )}

        <div className='flex items-start gap-4 z-10'>
          <div
            className={`p-3 rounded-xl bg-dark-surface text-accent-green group-hover:bg-accent-green group-hover:text-black transition-colors duration-300`}
          >
            {icon}
          </div>
          <div className='flex-1 min-w-0'>
            <h3 className='text-lg font-bold text-text-main mb-2 leading-tight group-hover:text-accent-green transition-colors'>
              {title}
            </h3>
            <p className='text-sm text-text-muted leading-relaxed'>
              {description}
            </p>
          </div>
        </div>

        {/* Disabled Reasons */}
        {disabled && disabledReasons && disabledReasons.length > 0 && (
          <div className='mt-4 pt-4 border-t border-white/5 space-y-2 z-10'>
            {disabledReasons.map((reason, idx) => (
              <div
                key={idx}
                className='flex items-center gap-2 text-xs text-red-400'
              >
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  viewBox='0 0 24 24'
                  fill='currentColor'
                  className='w-4 h-4 flex-shrink-0'
                >
                  <path d='M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z' />
                </svg>
                <span>{reason}</span>
              </div>
            ))}
          </div>
        )}
      </button>
    </div>
  )
}

export const Dashboard = ({
  participants,
  templates,
  generatedCount,
  onQuickAction,
  selectedTemplate,
}: DashboardProps) => {
  const recentActivity = useMemo(() => {
    const activities: Array<{
      text: string
      time: string
      icon: React.ReactNode
      color: string
    }> = []

    if (participants.length > 0) {
      activities.push({
        text: `Zaimportowano ${participants.length} uczestników`,
        time: 'Dzisiaj',
        icon: (
          <svg
            xmlns='http://www.w3.org/2000/svg'
            viewBox='0 0 24 24'
            fill='currentColor'
            className='w-5 h-5'
          >
            <path d='M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z' />
          </svg>
        ),
        color: 'text-blue-600',
      })
    }

    if (generatedCount > 0) {
      activities.push({
        text: `Wygenerowano ${generatedCount} certyfikatów`,
        time: 'Dzisiaj',
        icon: (
          <svg
            xmlns='http://www.w3.org/2000/svg'
            viewBox='0 0 24 24'
            fill='currentColor'
            className='w-5 h-5'
          >
            <path d='M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z' />
          </svg>
        ),
        color: 'text-green-600',
      })
    }

    if (templates.length > 0) {
      activities.push({
        text: `Dostępnych ${templates.length} szablonów`,
        time: 'Aktualnie',
        icon: (
          <svg
            xmlns='http://www.w3.org/2000/svg'
            viewBox='0 0 24 24'
            fill='currentColor'
            className='w-5 h-5'
          >
            <path d='M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z' />
          </svg>
        ),
        color: 'text-purple-600',
      })
    }

    return activities
  }, [participants, generatedCount, templates])

  return (
    <div className='min-h-screen bg-dark-bg p-6 flex flex-col gap-6 items-center justify-center p-8'>
      <div className="w-full max-w-5xl space-y-6">
        {/* Header */}
        <header className='bg-dark-card rounded-2xl p-8 border border-dark-surface shadow-sm'>
          <div>
            <h1 className='text-3xl font-bold text-white mb-2'>
              Generator Certyfikatów
            </h1>
            <p className='text-text-muted'>
              Witaj! Zarządzaj swoimi certyfikatami w jednym miejscu
            </p>
          </div>
        </header>

        {/* Action Cards */}
        <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
          <QuickAction
            title={
              participants.length > 0
                ? participants.length <= 3
                  ? participants.map((p) => p.name).join(', ')
                  : `${participants
                    .slice(-3)
                    .map((p) => p.name)
                    .join(', ')}...`
                : 'Zarządzanie Uczestnikami'
            }
            description={
              participants.length > 0
                ? 'Zarządzaj listą, edytuj dane lub dodaj nowych.'
                : 'Zaimportuj listę z CSV/Excel.'
            }
            badge={
              participants.length > 0
                ? `${participants.length} osób`
                : undefined
            }
            status={participants.length > 0 ? 'ready' : 'info'}
            icon={
              <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='currentColor' className='w-6 h-6'>
                <path d='M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z' />
              </svg>
            }
            onClick={() =>
              participants.length > 0
                ? onQuickAction('manage-participants')
                : onQuickAction('import-csv')
            }
          />

          <QuickAction
            title={
              selectedTemplate
                ? selectedTemplate.name
                : 'Wybierz Szablon'
            }
            description={
              selectedTemplate
                ? 'Szablon wybrany. Kliknij aby zmienić.'
                : 'Przeglądaj galerię i wybierz wzór.'
            }
            icon={
              <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='currentColor' className='w-6 h-6'>
                <path d='M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z' />
              </svg>
            }
            onClick={() => onQuickAction('templates')}
          />

          <QuickAction
            title='Generuj Certyfikaty'
            description='Edytor wizualny i pobieranie PDF.'
            // Color prop removed
            color=""
            icon={
              <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='currentColor' className='w-6 h-6'>
                <path d='M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z' />
              </svg>
            }
            onClick={() => onQuickAction('generate')}
            disabled={!(participants.length > 0 && selectedTemplate)}
            disabledReasons={[
              ...(participants.length === 0 ? ['Brak uczestników'] : []),
              ...(!selectedTemplate ? ['Brak szablonu'] : []),
            ].filter(Boolean)}
          />

          <QuickAction
            title='Eksportuj ZIP'
            description='Pobierz wszystkie jako ZIP.'
            // Color prop removed
            color=""
            icon={
              <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='currentColor' className='w-6 h-6'>
                <path d='M14 2H6c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V8l-6-6zm4 18H6V4h7v5h5v11z' />
              </svg>
            }
            onClick={() => onQuickAction('export-zip')}
            disabled={!(participants.length > 0 && selectedTemplate)}
            disabledReasons={[
              ...(participants.length === 0 ? ['Brak uczestników'] : []),
              ...(!selectedTemplate ? ['Brak szablonu'] : []),
            ].filter(Boolean)}
          />
        </div>

        {/* Info Section */}
        <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
          {/* Recent Activity */}
          <div className='bg-dark-card rounded-2xl p-6 border border-dark-surface h-full'>
            <h3 className='text-lg font-bold text-white mb-4 flex items-center gap-2'>
              <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='currentColor' className='w-5 h-5 text-accent-green'>
                <path d='M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67z' />
              </svg>
              Ostatnia Aktywność
            </h3>
            {recentActivity.length > 0 ? (
              <div className='space-y-3'>
                {recentActivity.map((activity, idx) => (
                  <div key={idx} className='flex items-start gap-3 p-3 rounded-xl bg-dark-bg/50 border border-white/5'>
                    <div className='text-accent-green mt-0.5'>{activity.icon}</div>
                    <div>
                      <p className='text-sm font-medium text-white'>{activity.text}</p>
                      <p className='text-xs text-text-muted'>{activity.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className='text-center py-8 text-text-muted'>
                <p className='text-sm'>Brak aktywności</p>
              </div>
            )}
          </div>

          {/* Tips */}
          <div className='bg-gradient-to-br from-dark-surface to-dark-card rounded-2xl p-6 border border-dark-surface h-full'>
            <h3 className='text-lg font-bold text-white mb-4 flex items-center gap-2'>
              <span className="text-xl">💡</span> Wskazówki
            </h3>
            <div className='space-y-3'>
              <div className='p-3 rounded-xl bg-accent-green/10 border border-accent-green/20'>
                <p className='font-bold text-sm text-accent-green mb-1'>Skróty</p>
                <p className='text-xs text-text-muted'>Użyj Ctrl+D aby pobrać wszystkie.</p>
              </div>
              <div className='p-3 rounded-xl bg-white/5 border border-white/10'>
                <p className='font-bold text-sm text-white mb-1'>Szablony</p>
                <p className='text-xs text-text-muted'>Możesz wgrać własny plik SVG/PNG.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
}
