import { useEffect, useState } from 'react';
import { TopBar, ActiveTab } from './components/TopBar';
import { CoverHub } from './components/CoverHub';
import { StoryReader } from './components/StoryReader';
import { ComprehensionQuiz } from './components/ComprehensionQuiz';
import { VOCAB_DICTIONARY } from './data/storyData';

interface LearningProgress {
  currentPage: number;
  pagesRead: number[];
  unlockedVocabIds: string[];
  bestQuizScore: number | null;
}

const STORAGE_KEY = 'mr_longnose_p6_progress_v1';

const DEFAULT_PROGRESS: LearningProgress = {
  currentPage: 1,
  pagesRead: [1],
  unlockedVocabIds: [],
  bestQuizScore: null,
};

function loadProgress(): LearningProgress {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_PROGRESS;
    const parsed = JSON.parse(raw) as Partial<LearningProgress>;
    return {
      currentPage: typeof parsed.currentPage === 'number' ? parsed.currentPage : 1,
      pagesRead: Array.isArray(parsed.pagesRead) ? parsed.pagesRead : [1],
      unlockedVocabIds: Array.isArray(parsed.unlockedVocabIds) ? parsed.unlockedVocabIds : [],
      bestQuizScore: typeof parsed.bestQuizScore === 'number' ? parsed.bestQuizScore : null,
    };
  } catch {
    return DEFAULT_PROGRESS;
  }
}

export default function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('cover');
  const [progress, setProgress] = useState<LearningProgress>(loadProgress);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
    } catch {
      // Ignore storage errors in restricted iframes
    }
  }, [progress]);

  const handleChangePage = (pageNumber: number) => {
    setProgress((prev) => ({
      ...prev,
      currentPage: pageNumber,
      pagesRead: prev.pagesRead.includes(pageNumber)
        ? prev.pagesRead
        : [...prev.pagesRead, pageNumber],
    }));
  };

  const handleJumpToPage = (pageNumber: number) => {
    handleChangePage(pageNumber);
    setActiveTab('story');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleUnlockVocab = (vocabId: string) => {
    setProgress((prev) => ({
      ...prev,
      unlockedVocabIds: prev.unlockedVocabIds.includes(vocabId)
        ? prev.unlockedVocabIds
        : [...prev.unlockedVocabIds, vocabId],
    }));
  };

  const handleCompleteQuiz = (score: number) => {
    setProgress((prev) => ({
      ...prev,
      bestQuizScore: prev.bestQuizScore === null ? score : Math.max(prev.bestQuizScore, score),
    }));
  };

  const totalVocabCount = Object.keys(VOCAB_DICTIONARY).length;

  return (
    <div className="min-h-screen flex flex-col text-zinc-900 comic-paper-grid">
      <TopBar
        activeTab={activeTab}
        onSelectTab={(tab) => {
          setActiveTab(tab);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        currentPage={progress.currentPage}
      />

      <div className="flex-1">
        {activeTab === 'cover' && (
          <CoverHub
            onNavigate={(tab) => {
              setActiveTab(tab);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            pagesReadCount={progress.pagesRead.length}
            unlockedVocabCount={progress.unlockedVocabIds.length}
            totalVocabCount={totalVocabCount}
            bestQuizScore={progress.bestQuizScore}
          />
        )}

        {activeTab === 'story' && (
          <StoryReader
            currentPage={progress.currentPage}
            onChangePage={handleChangePage}
            onUnlockVocab={handleUnlockVocab}
            unlockedVocabIds={progress.unlockedVocabIds}
          />
        )}

        {activeTab === 'quiz' && (
          <ComprehensionQuiz
            onCompleteQuiz={handleCompleteQuiz}
            onJumpToPage={handleJumpToPage}
            bestScore={progress.bestQuizScore}
          />
        )}
      </div>

      <footer className="border-t-2 border-zinc-900 bg-gradient-to-r from-[#fff96b] via-[#fde047] to-[#ffb347] mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-zinc-800 font-medium">
          <span>Mr. Longnose · Primary 6 English Story &amp; Vocabulary Unit</span>
          <button
            type="button"
            onClick={() => {
              setProgress(DEFAULT_PROGRESS);
              setActiveTab('cover');
            }}
            className="text-zinc-900 hover:text-orange-800 underline underline-offset-2 cursor-pointer font-semibold"
          >
            Reset learning progress
          </button>
        </div>
      </footer>
    </div>
  );
}
