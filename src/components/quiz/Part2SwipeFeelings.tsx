import { useRef, useState } from 'react';
import { ArrowRight, ChevronLeft, ChevronRight, CheckCircle2, MoveHorizontal } from 'lucide-react';
import { FeelingId, PART2_FEELINGS, Part2Prompt } from '../../data/quizSpecData';
import { MrLongnoseFeelingFaceSvg } from './ComicSprites';

interface Part2SwipeFeelingsProps {
  questions: Part2Prompt[];
  answers: Record<string, FeelingId>;
  onSelectAnswer: (questionId: string, feeling: FeelingId) => void;
  onCompletePart: () => void;
}

export function Part2SwipeFeelings({
  questions,
  answers,
  onSelectAnswer,
  onCompletePart,
}: Part2SwipeFeelingsProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [swipeDeltaX, setSwipeDeltaX] = useState(0);
  const startXRef = useRef<number | null>(null);

  const activeQuestion = questions[activeIndex];
  const currentFeeling: FeelingId = answers[activeQuestion.id] ?? 'happy';
  const currentFeelingIdx = PART2_FEELINGS.findIndex((f) => f.id === currentFeeling);

  // Initialize default feeling on interaction if unset
  const stepFeeling = (dir: -1 | 1) => {
    const nextIdx =
      (currentFeelingIdx + dir + PART2_FEELINGS.length) % PART2_FEELINGS.length;
    onSelectAnswer(activeQuestion.id, PART2_FEELINGS[nextIdx].id);
  };

  const handlePointerDown = (e: React.PointerEvent) => {
    startXRef.current = e.clientX;
    if (!answers[activeQuestion.id]) {
      onSelectAnswer(activeQuestion.id, currentFeeling);
    }
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (startXRef.current === null) return;
    const delta = e.clientX - startXRef.current;
    setSwipeDeltaX(Math.max(-90, Math.min(90, delta)));
  };

  const handlePointerUp = () => {
    if (startXRef.current === null) return;
    if (swipeDeltaX > 36) {
      stepFeeling(-1);
    } else if (swipeDeltaX < -36) {
      stepFeeling(1);
    }
    startXRef.current = null;
    setSwipeDeltaX(0);
  };

  const handleConfirmAndNext = () => {
    if (!answers[activeQuestion.id]) {
      onSelectAnswer(activeQuestion.id, currentFeeling);
    }
    if (activeIndex < questions.length - 1) {
      setActiveIndex((prev) => prev + 1);
    } else {
      onCompletePart();
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4 border-b-2 border-yellow-300/60 pb-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-xs font-bold text-yellow-200">
            <span>Part 2 of 4</span>
            <span aria-hidden="true">·</span>
            <span className="font-mono tabular-nums">3 Marks (1 mark each)</span>
          </div>
          <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-white drop-shadow-sm">
            Swipe Mr. Longnose’s face and choose the right feeling!
          </h2>
          <p className="text-sm text-yellow-100 font-medium">
            Swipe left or right across Mr. Longnose’s face to change his expression to match what he says.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {questions.map((q, idx) => {
            const isCurrent = idx === activeIndex;
            const answered = Boolean(answers[q.id]);
            return (
              <button
                key={q.id}
                type="button"
                onClick={() => setActiveIndex(idx)}
                className={`min-h-12 py-1.5 px-3.5 rounded-lg font-display text-sm font-bold border-2 border-zinc-900 transition-colors cursor-pointer flex items-center gap-1.5 ${
                  isCurrent
                    ? 'bg-zinc-900 text-yellow-300'
                    : answered
                    ? 'bg-emerald-200 text-zinc-950'
                    : 'bg-[#fef08a] text-zinc-900 hover:bg-[#fde047]'
                }`}
              >
                <span>Q{idx + 1}</span>
                {answered && !isCurrent && <CheckCircle2 className="w-3.5 h-3.5" />}
              </button>
            );
          })}
        </div>
      </div>

      <div className="neon-inner-frame rounded-2xl p-6 sm:p-10 space-y-6">
        <div className="max-w-xl mx-auto bg-white border-2 border-zinc-900 rounded-2xl p-5 text-center">
          <p className="text-xs font-bold text-zinc-500 mb-1">
            Question {activeIndex + 1} of {questions.length} · Mr. Longnose says:
          </p>
          <p className="font-display text-2xl sm:text-3xl font-extrabold text-zinc-900">
            “{activeQuestion.quote}”
          </p>
        </div>

        <div className="flex flex-col items-center space-y-4">
          <div className="flex items-center gap-3 sm:gap-6">
            <button
              type="button"
              onClick={() => stepFeeling(-1)}
              aria-label="Swipe left to previous feeling"
              className="w-11 h-11 rounded-full border-2 border-zinc-900 bg-white hover:bg-zinc-100 flex items-center justify-center cursor-pointer shrink-0"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>

            <div
              onPointerDown={handlePointerDown}
              onPointerMove={handlePointerMove}
              onPointerUp={handlePointerUp}
              onPointerCancel={handlePointerUp}
              style={{
                transform: `translateX(${swipeDeltaX}px) rotate(${swipeDeltaX * 0.08}deg)`,
              }}
              className="touch-pan-y select-none cursor-grab active:cursor-grabbing transition-transform duration-75"
            >
              <MrLongnoseFeelingFaceSvg feeling={currentFeeling} className="w-56 h-52 sm:w-64 sm:h-60" />
            </div>

            <button
              type="button"
              onClick={() => stepFeeling(1)}
              aria-label="Swipe right to next feeling"
              className="w-11 h-11 rounded-full border-2 border-zinc-900 bg-white hover:bg-zinc-100 flex items-center justify-center cursor-pointer shrink-0"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </div>

          <div className="flex items-center gap-2 text-xs font-medium text-zinc-500">
            <MoveHorizontal className="w-4 h-4 text-blue-700" />
            <span>Swipe his face left or right</span>
          </div>

          <div className="flex flex-wrap justify-center gap-2 pt-1">
            {PART2_FEELINGS.map((feeling) => {
              const active = feeling.id === currentFeeling;
              return (
                <button
                  key={feeling.id}
                  type="button"
                  onClick={() => onSelectAnswer(activeQuestion.id, feeling.id)}
                  className={`px-4 py-2 rounded-xl border-2 font-display text-sm sm:text-base font-bold transition-colors cursor-pointer capitalize ${
                    active
                      ? 'bg-blue-700 border-blue-700 text-white'
                      : 'bg-[#faf9f5] border-zinc-300 text-zinc-800 hover:border-blue-600'
                  }`}
                >
                  {feeling.label}
                </button>
              );
            })}
          </div>
        </div>

        <div className="flex justify-end pt-2 border-t border-zinc-200">
          <button
            type="button"
            onClick={handleConfirmAndNext}
            className="inline-flex items-center gap-2 px-6 py-3 text-sm font-semibold text-white bg-blue-700 rounded-xl hover:bg-blue-800 cursor-pointer"
          >
            <span>
              {activeIndex < questions.length - 1
                ? 'Confirm & Next Face'
                : 'Continue to Part 3'}
            </span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
