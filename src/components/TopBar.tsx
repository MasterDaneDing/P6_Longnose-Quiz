export type ActiveTab = 'cover' | 'story' | 'quiz';

interface TopBarProps {
  activeTab: ActiveTab;
  onSelectTab: (tab: ActiveTab) => void;
  currentPage: number;
}

const NAV_ITEMS: { id: ActiveTab; label: string }[] = [
  { id: 'cover', label: 'Cover' },
  { id: 'story', label: 'Storybook' },
  { id: 'quiz', label: 'Quiz' },
];

export function TopBar({ activeTab, onSelectTab, currentPage }: TopBarProps) {
  return (
    <header className="sticky top-0 z-30 bg-gradient-to-r from-[#fff96b] via-[#fde047] to-[#ffb347] border-b-2 border-zinc-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 min-h-20 py-2.5 flex flex-wrap items-center justify-between gap-4 sm:gap-8">
        <button
          type="button"
          onClick={() => onSelectTab('cover')}
          className="font-display text-xl font-extrabold tracking-tight text-zinc-900 whitespace-nowrap shrink-0 cursor-pointer hover:text-orange-700 transition-colors"
        >
          Mr. Longnose
        </button>

        <nav aria-label="Primary sections" className="flex items-center gap-4 sm:gap-6 overflow-x-auto no-scrollbar">
          {NAV_ITEMS.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => onSelectTab(item.id)}
                className={`relative py-2 text-sm font-bold whitespace-nowrap shrink-0 cursor-pointer transition-colors ${
                  isActive
                    ? 'text-zinc-950'
                    : 'text-zinc-800 hover:text-zinc-950'
                }`}
              >
                {item.label}
                {isActive && (
                  <span
                    className="absolute inset-x-0 bottom-0 h-1 bg-orange-600 rounded-full"
                    aria-hidden="true"
                  />
                )}
              </button>
            );
          })}
        </nav>

        <div className="hidden md:flex items-center shrink-0">
          <button
            type="button"
            onClick={() => onSelectTab('story')}
            className="px-4 py-2 text-sm font-bold text-white bg-zinc-900 rounded-lg hover:bg-zinc-800 active:translate-y-px transition-all whitespace-nowrap shrink-0 cursor-pointer tabular-nums"
          >
            {currentPage > 1 ? `Resume Page ${currentPage}` : 'Start Reading'}
          </button>
        </div>
      </div>
    </header>
  );
}
