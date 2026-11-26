import { ArrowRight, BookOpen, HelpCircle } from 'lucide-react';
import { ComicImage } from './ComicImage';
import { ActiveTab } from './TopBar';
import { STORY_PAGES } from '../data/storyData';

interface CoverHubProps {
  onNavigate: (tab: ActiveTab) => void;
  pagesReadCount: number;
  unlockedVocabCount: number;
  totalVocabCount: number;
  bestQuizScore: number | null;
}

export function CoverHub({
  onNavigate,
  pagesReadCount,
  unlockedVocabCount,
  totalVocabCount,
  bestQuizScore,
}: CoverHubProps) {
  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-12">
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-stretch">
        <div className="lg:col-span-7 flex flex-col justify-between neon-inner-frame rounded-2xl p-6 sm:p-10">
          <div className="space-y-6">
            <div className="flex flex-wrap items-center gap-2 text-xs font-bold text-zinc-800">
              <span>Primary 6 English</span>
              <span aria-hidden="true">·</span>
              <span>Interactive Comic Reader</span>
              <span aria-hidden="true">·</span>
              <span className="tabular-nums">{STORY_PAGES.length} Illustrated Pages</span>
            </div>

            <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-zinc-950 leading-[1.08] text-balance">
              Meet Mr. Longnose and his five wild jobs.
            </h1>

            <p className="text-base sm:text-lg text-zinc-900 leading-relaxed max-w-2xl font-medium">
              Follow a talkative TV reporter whose impossibly long nose lands him in trouble—from
              a courthouse sidewalk and an animal clinic to a fashion catwalk, a red carpet, and a
              space station full of aliens.
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => onNavigate('story')}
                className="inline-flex items-center gap-2 px-6 py-3 text-base font-bold text-white bg-zinc-900 rounded-xl hover:bg-zinc-800 transition-colors cursor-pointer whitespace-nowrap shrink-0"
              >
                <BookOpen className="w-5 h-5" />
                <span>Open Storybook</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={() => onNavigate('quiz')}
                className="inline-flex items-center gap-2 px-5 py-3 text-base font-bold text-zinc-900 bg-white border-2 border-zinc-900 rounded-xl hover:bg-amber-50 transition-colors cursor-pointer whitespace-nowrap shrink-0"
              >
                <HelpCircle className="w-5 h-5" />
                <span>Take Quiz</span>
              </button>
            </div>
          </div>

          <div className="mt-8 pt-6 border-t-2 border-zinc-900/20 grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <div className="text-xs font-bold text-zinc-800">Pages Read</div>
              <div className="mt-1 font-mono text-2xl font-bold text-zinc-950 tabular-nums">
                {pagesReadCount}/{STORY_PAGES.length}
              </div>
            </div>
            <div>
              <div className="text-xs font-bold text-zinc-800">Words Explored</div>
              <div className="mt-1 font-mono text-2xl font-bold text-purple-900 tabular-nums">
                {unlockedVocabCount}/{totalVocabCount}
              </div>
            </div>
            <div>
              <div className="text-xs font-bold text-zinc-800">Quiz Auto-Score</div>
              <div className="mt-1 font-mono text-2xl font-bold text-zinc-950 tabular-nums">
                {bestQuizScore !== null ? `${bestQuizScore}/8` : '—'}
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-5 flex flex-col">
          <div className="flex-1 neon-inner-frame rounded-2xl p-3 flex flex-col justify-center">
            <ComicImage
              src="./images/cover-hero.png"
              alt="1980s comic-book cover illustration of Mr. Longnose holding a retro silver microphone in a blue suit and red polka-dot tie"
              aspectClass="aspect-[3/4]"
              className="rounded-xl w-full h-full object-cover"
              fallbackLabel="Mr. Longnose Comic Cover"
            />
          </div>
        </div>
      </section>

      <section aria-labelledby="learning-modules-heading" className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 border-b-2 border-yellow-300/60 pb-4">
          <div>
            <h2 id="learning-modules-heading" className="font-display text-2xl sm:text-3xl font-extrabold text-white drop-shadow-sm">
              Read the story &amp; take the quiz
            </h2>
            <p className="text-sm text-yellow-100 mt-1 font-medium">
              Explore all 31 illustrated pages with tap-to-define vocabulary, then complete the 10-mark quiz.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <button
            type="button"
            onClick={() => onNavigate('story')}
            className="group text-left neon-inner-frame rounded-xl p-6 hover:-translate-y-0.5 transition-transform cursor-pointer flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-lg bg-zinc-900 text-yellow-300 flex items-center justify-center">
                <BookOpen className="w-5 h-5" />
              </div>
              <div className="text-xs font-bold text-zinc-800">Storybook · 31 Pages</div>
              <h3 className="font-display text-xl font-extrabold text-zinc-950 group-hover:text-orange-900 transition-colors">
                Storybook Reader
              </h3>
              <p className="text-sm text-zinc-900 leading-relaxed font-medium">
                Read every comic slide with tap-to-define purple vocabulary words and read-aloud narration.
              </p>
            </div>
            <div className="mt-6 flex items-center gap-1.5 text-sm font-bold text-zinc-950">
              <span>Read now</span>
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
            </div>
          </button>

          <button
            type="button"
            onClick={() => onNavigate('quiz')}
            className="group text-left neon-inner-frame rounded-xl p-6 hover:-translate-y-0.5 transition-transform cursor-pointer flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-lg bg-zinc-900 text-orange-300 flex items-center justify-center">
                <HelpCircle className="w-5 h-5" />
              </div>
              <div className="text-xs font-bold text-zinc-800">Assessment · 10 Marks</div>
              <h3 className="font-display text-xl font-extrabold text-zinc-950 group-hover:text-orange-900 transition-colors">
                10-Mark Interactive Quiz
              </h3>
              <p className="text-sm text-zinc-900 leading-relaxed font-medium">
                Drag guests to Mr. Longnose, swipe his feelings, describe Part 3 scenes, add your head &amp; face in Part D, and submit to Google Drive.
              </p>
            </div>
            <div className="mt-6 flex items-center gap-1.5 text-sm font-bold text-zinc-950">
              <span>Take quiz</span>
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
            </div>
          </button>
        </div>
      </section>
    </main>
  );
}
