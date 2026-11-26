import { useEffect, useState } from 'react';
import { ChevronLeft, ChevronRight, Volume2, Square, BookMarked, ArrowUpRight } from 'lucide-react';
import { STORY_PAGES, VOCAB_DICTIONARY, VocabEntry } from '../data/storyData';
import { ComicImage } from './ComicImage';
import { speakText, stopSpeaking } from '../utils/speech';

interface StoryReaderProps {
  currentPage: number;
  onChangePage: (pageNumber: number) => void;
  onUnlockVocab: (vocabId: string) => void;
  unlockedVocabIds: string[];
}

export function StoryReader({
  currentPage,
  onChangePage,
  onUnlockVocab,
  unlockedVocabIds,
}: StoryReaderProps) {
  const page = STORY_PAGES[currentPage - 1] || STORY_PAGES[0];
  const [selectedVocab, setSelectedVocab] = useState<VocabEntry | null>(null);
  const [isSpeakingPage, setIsSpeakingPage] = useState(false);

  // Gather vocabulary words appearing on this page
  const pageVocabIds = Array.from(
    new Set(
      page.paragraphs
        .flat()
        .map((seg) => seg.vocabId)
        .filter((id): id is string => Boolean(id && VOCAB_DICTIONARY[id]))
    )
  );

  // Auto-select first vocab word on the page if none selected or when changing pages
  useEffect(() => {
    stopSpeaking();
    setIsSpeakingPage(false);
    if (pageVocabIds.length > 0) {
      const firstVocab = VOCAB_DICTIONARY[pageVocabIds[0]];
      setSelectedVocab(firstVocab);
    } else {
      setSelectedVocab(null);
    }
  }, [currentPage]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
      if (e.key === 'ArrowRight' && currentPage < STORY_PAGES.length) {
        onChangePage(currentPage + 1);
      } else if (e.key === 'ArrowLeft' && currentPage > 1) {
        onChangePage(currentPage - 1);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentPage, onChangePage]);

  useEffect(() => {
    return () => stopSpeaking();
  }, []);

  const handleVocabClick = (vocabId: string) => {
    const entry = VOCAB_DICTIONARY[vocabId];
    if (!entry) return;
    setSelectedVocab(entry);
    onUnlockVocab(vocabId);
    setIsSpeakingPage(false);
    speakText(entry.term);
  };

  const handleToggleReadPage = () => {
    if (isSpeakingPage) {
      stopSpeaking();
      setIsSpeakingPage(false);
      return;
    }
    const plainText = page.paragraphs
      .map((para) => para.map((seg) => seg.text).join(''))
      .join(' ');
    setIsSpeakingPage(true);
    speakText(plainText, {
      rate: 0.92,
      onEnd: () => setIsSpeakingPage(false),
      onError: () => setIsSpeakingPage(false),
    });
  };

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4 border-b-2 border-yellow-300/60 pb-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-xs font-bold text-yellow-200">
            <span>{page.chapter}</span>
            <span aria-hidden="true">·</span>
            <span className="font-mono tabular-nums">
              Page {page.pageNumber} of {STORY_PAGES.length}
            </span>
          </div>
          <h1 className="font-display text-2xl sm:text-3xl font-extrabold text-white drop-shadow-sm">
            Mr. Longnose Storybook
          </h1>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleToggleReadPage}
            className={`inline-flex items-center gap-2 px-4 py-2 text-sm font-bold rounded-lg border-2 border-zinc-900 transition-colors cursor-pointer whitespace-nowrap shrink-0 ${
              isSpeakingPage
                ? 'bg-red-100 text-red-800 hover:bg-red-200'
                : 'bg-[#fef08a] text-zinc-900 hover:bg-[#fde047]'
            }`}
          >
            {isSpeakingPage ? (
              <>
                <Square className="w-4 h-4 fill-current" />
                <span>Stop Audio</span>
              </>
            ) : (
              <>
                <Volume2 className="w-4 h-4 text-zinc-900" />
                <span>Read Page Aloud</span>
              </>
            )}
          </button>

          <button
            type="button"
            onClick={() => onChangePage(Math.max(1, currentPage - 1))}
            disabled={currentPage === 1}
            aria-label="Previous page"
            className="inline-flex items-center gap-1 px-3 py-2 text-sm font-bold text-zinc-900 bg-[#fef08a] border-2 border-zinc-900 rounded-lg hover:bg-[#fde047] disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer whitespace-nowrap shrink-0"
          >
            <ChevronLeft className="w-4 h-4" />
            <span className="hidden sm:inline">Previous</span>
          </button>

          <button
            type="button"
            onClick={() => onChangePage(Math.min(STORY_PAGES.length, currentPage + 1))}
            disabled={currentPage === STORY_PAGES.length}
            aria-label="Next page"
            className="inline-flex items-center gap-1 px-4 py-2 text-sm font-bold text-white bg-zinc-900 border-2 border-zinc-900 rounded-lg hover:bg-zinc-800 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer whitespace-nowrap shrink-0"
          >
            <span>Next</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-stretch">
        <div className="lg:col-span-7 flex flex-col">
          <div className="relative neon-inner-frame rounded-2xl p-3 sm:p-4 flex-1 flex flex-col justify-center">
            {page.sfx && (
              <div className="mb-3 flex items-center justify-between">
                <span className="font-display text-lg font-extrabold tracking-wide text-red-700">
                  {page.sfx}
                </span>
                <span className="text-xs font-mono text-zinc-800 font-bold tabular-nums">
                  Panel {page.pageNumber}
                </span>
              </div>
            )}
            <ComicImage
              key={page.pageNumber}
              src={page.image}
              alt={`Mr. Longnose comic book illustration for page ${page.pageNumber}: ${page.chapter}`}
              aspectClass="aspect-[4/3]"
              className="rounded-xl w-full"
              fallbackLabel={`Mr. Longnose — Page ${page.pageNumber}`}
            />
          </div>
        </div>

        <div className="lg:col-span-5 flex flex-col justify-between gap-6">
          <div className="neon-inner-frame rounded-2xl p-6 sm:p-8 space-y-5">
            <div className="flex items-center justify-between text-xs font-bold text-zinc-800 border-b-2 border-zinc-900/15 pb-3">
              <span>Story Text</span>
              <span>Click purple words to learn</span>
            </div>

            <div className="space-y-4">
              {page.paragraphs.map((paragraph, pIdx) => (
                <p
                  key={pIdx}
                  className={`leading-relaxed ${
                    page.pageNumber === 1 && pIdx === 0
                      ? 'font-display text-3xl sm:text-4xl font-extrabold text-blue-700'
                      : 'text-lg sm:text-xl text-zinc-900 font-medium'
                  }`}
                >
                  {paragraph.map((seg, sIdx) => {
                    if (seg.vocabId && VOCAB_DICTIONARY[seg.vocabId]) {
                      const isSelected = selectedVocab?.id === seg.vocabId;
                      return (
                        <button
                          key={sIdx}
                          type="button"
                          onClick={() => handleVocabClick(seg.vocabId!)}
                          className={`inline font-bold underline decoration-2 underline-offset-4 cursor-pointer rounded px-0.5 transition-colors ${
                            isSelected
                              ? 'text-violet-900 bg-violet-100 decoration-violet-700'
                              : 'text-violet-700 hover:bg-violet-50 decoration-violet-400'
                          }`}
                        >
                          {seg.text}
                        </button>
                      );
                    }
                    if (seg.emphasis === 'sfx') {
                      return (
                        <span
                          key={sIdx}
                          className="font-display text-2xl font-extrabold text-red-600 tracking-wide"
                        >
                          {seg.text}
                        </span>
                      );
                    }
                    if (seg.emphasis === 'red') {
                      return (
                        <span
                          key={sIdx}
                          className={page.pageNumber === 1 ? '' : 'font-semibold text-red-600'}
                        >
                          {seg.text}
                        </span>
                      );
                    }
                    return <span key={sIdx}>{seg.text}</span>;
                  })}
                </p>
              ))}
            </div>

            {pageVocabIds.length > 0 && (
              <div className="pt-3 border-t border-zinc-100 flex flex-wrap items-center gap-2">
                <span className="text-xs font-medium text-zinc-500 mr-1">
                  Page words:
                </span>
                {pageVocabIds.map((id) => {
                  const entry = VOCAB_DICTIONARY[id];
                  const active = selectedVocab?.id === id;
                  const unlocked = unlockedVocabIds.includes(id);
                  return (
                    <button
                      key={id}
                      type="button"
                      onClick={() => handleVocabClick(id)}
                      className={`px-3 py-1 text-xs font-semibold rounded-md border transition-colors cursor-pointer whitespace-nowrap shrink-0 ${
                        active
                          ? 'bg-violet-700 text-white border-violet-700'
                          : unlocked
                          ? 'bg-violet-50 text-violet-800 border-violet-200 hover:bg-violet-100'
                          : 'bg-zinc-50 text-zinc-800 border-zinc-200 hover:border-violet-400'
                      }`}
                    >
                      {entry.term}
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          <div className="neon-sub-frame rounded-2xl p-6 space-y-3 shadow-[4px_4px_0px_0px_rgba(24,24,27,1)]">
            {selectedVocab ? (
              <>
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2 text-xs font-medium text-zinc-500">
                      <span>Vocabulary Spotlight</span>
                      <span aria-hidden="true">·</span>
                      <span>{selectedVocab.partOfSpeech}</span>
                    </div>
                    <h2 className="font-display text-2xl font-bold text-violet-800 mt-0.5">
                      {selectedVocab.term}
                    </h2>
                  </div>
                  <button
                    type="button"
                    onClick={() => speakText(selectedVocab.term)}
                    aria-label={`Pronounce ${selectedVocab.term}`}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-zinc-800 bg-white border border-zinc-300 rounded-lg hover:bg-zinc-50 cursor-pointer whitespace-nowrap shrink-0"
                  >
                    <Volume2 className="w-3.5 h-3.5 text-blue-700" />
                    <span>Hear Word</span>
                  </button>
                </div>

                <p className="text-sm text-zinc-800 leading-relaxed">
                  {selectedVocab.definition}
                </p>

                <div className="pt-2 border-t border-zinc-300/70 space-y-1">
                  <p className="text-xs font-medium text-zinc-500">Example sentence</p>
                  <p className="text-sm text-zinc-700 italic">
                    “{selectedVocab.exampleSentence}”
                  </p>
                  {selectedVocab.antonym && (
                    <p className="text-xs text-zinc-600 pt-1">
                      Opposite: <span className="font-semibold text-zinc-900">{selectedVocab.antonym}</span>
                    </p>
                  )}
                </div>
              </>
            ) : (
              <div className="flex items-start gap-3 text-zinc-600">
                <BookMarked className="w-5 h-5 text-blue-700 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <h2 className="font-display text-base font-bold text-zinc-900">
                    Reading Tip
                  </h2>
                  <p className="text-sm leading-relaxed">
                    Look closely at the comic panel and read the dialogue aloud. Use the page bar
                    below or your keyboard Left/Right arrows to flip through all 31 pages.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <section aria-label="Page navigator" className="neon-inner-frame rounded-xl p-4">
        <div className="flex items-center justify-between gap-4 mb-3">
          <span className="text-xs font-bold text-zinc-900">Jump to Story Page</span>
          <span className="text-xs font-mono font-bold text-zinc-900 tabular-nums">
            {currentPage} / {STORY_PAGES.length}
          </span>
        </div>
        <div className="grid grid-cols-5 sm:grid-cols-8 md:grid-cols-11 gap-2">
          {STORY_PAGES.map((p) => {
            const isCurrent = p.pageNumber === currentPage;
            return (
              <button
                key={p.pageNumber}
                type="button"
                onClick={() => onChangePage(p.pageNumber)}
                className={`min-h-12 py-1 rounded-md font-mono text-xs font-semibold tabular-nums transition-colors cursor-pointer ${
                  isCurrent
                    ? 'bg-blue-700 text-white'
                    : 'bg-zinc-100 text-zinc-700 hover:bg-zinc-200'
                }`}
                aria-label={`Go to page ${p.pageNumber}`}
                aria-current={isCurrent ? 'page' : undefined}
              >
                {p.pageNumber}
              </button>
            );
          })}
        </div>
        {page.pageNumber === 31 && (
          <div className="mt-4 pt-3 border-t border-zinc-200 flex items-center justify-between text-sm">
            <span className="text-zinc-700 font-medium">
              You reached the end of the story! Ready to practice jobs and adjectives?
            </span>
            <button
              type="button"
              onClick={() => onChangePage(1)}
              className="inline-flex items-center gap-1 font-semibold text-blue-700 hover:underline cursor-pointer whitespace-nowrap shrink-0"
            >
              <span>Back to Page 1</span>
              <ArrowUpRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </section>
    </main>
  );
}
