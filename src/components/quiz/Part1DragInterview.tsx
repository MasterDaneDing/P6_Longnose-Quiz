import { useEffect, useRef, useState } from 'react';
import { ArrowRight, CheckCircle2, Hand } from 'lucide-react';
import {
  JobRoleId,
  PART1_CHARACTERS,
  Part1Prompt,
} from '../../data/quizSpecData';
import { DraggableJobCharacterSvg, MrLongnoseInterviewerSvg } from './ComicSprites';

interface Part1DragInterviewProps {
  questions: Part1Prompt[];
  answers: Record<string, JobRoleId>;
  onSelectAnswer: (questionId: string, role: JobRoleId) => void;
  onCompletePart: () => void;
}

const QUESTION_LETTERS = ['A', 'B', 'C'];

export function Part1DragInterview({
  questions,
  answers,
  onSelectAnswer,
  onCompletePart,
}: Part1DragInterviewProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [draggingRole, setDraggingRole] = useState<JobRoleId | null>(null);
  const [dragPos, setDragPos] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isOverDropZone, setIsOverDropZone] = useState(false);

  const dropZoneRef = useRef<HTMLDivElement | null>(null);
  const activeQuestion = questions[activeIndex];
  const selectedRole = answers[activeQuestion.id];

  const checkDropZoneHit = (clientX: number, clientY: number): boolean => {
    const el = dropZoneRef.current;
    if (!el) return false;
    const rect = el.getBoundingClientRect();
    // Generous hit area around Mr. Longnose & drop box
    const pad = 24;
    return (
      clientX >= rect.left - pad &&
      clientX <= rect.right + pad &&
      clientY >= rect.top - pad &&
      clientY <= rect.bottom + pad
    );
  };

  useEffect(() => {
    if (!draggingRole) return;

    const handlePointerMove = (e: PointerEvent) => {
      setDragPos({ x: e.clientX, y: e.clientY });
      setIsOverDropZone(checkDropZoneHit(e.clientX, e.clientY));
    };

    const handlePointerUp = (e: PointerEvent) => {
      const hit = checkDropZoneHit(e.clientX, e.clientY);
      if (hit) {
        onSelectAnswer(activeQuestion.id, draggingRole);
      }
      setDraggingRole(null);
      setIsOverDropZone(false);
    };

    window.addEventListener('pointermove', handlePointerMove);
    window.addEventListener('pointerup', handlePointerUp);
    window.addEventListener('pointercancel', handlePointerUp);
    return () => {
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerup', handlePointerUp);
      window.removeEventListener('pointercancel', handlePointerUp);
    };
  }, [draggingRole, activeQuestion.id, onSelectAnswer]);

  const startDrag = (role: JobRoleId, e: React.PointerEvent) => {
    e.preventDefault();
    setDraggingRole(role);
    setDragPos({ x: e.clientX, y: e.clientY });
    setIsOverDropZone(checkDropZoneHit(e.clientX, e.clientY));
  };

  const allAnswered = questions.every((q) => Boolean(answers[q.id]));

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4 border-b-2 border-yellow-300/60 pb-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-xs font-bold text-yellow-200">
            <span>Part 1 of 4</span>
            <span aria-hidden="true">·</span>
            <span className="font-mono tabular-nums">3 Marks (1 mark each)</span>
          </div>
          <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-white drop-shadow-sm">
            Help Mr. Longnose interview the right people!
          </h2>
          <p className="text-sm text-yellow-100 font-medium">
            Grab one of the 7 people below and drag them over to Mr. Longnose’s microphone.
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
                <span>Question {QUESTION_LETTERS[idx]}</span>
                {answered && !isCurrent && <CheckCircle2 className="w-3.5 h-3.5" />}
              </button>
            );
          })}
        </div>
      </div>

      {/* Interview Stage */}
      <div
        ref={dropZoneRef}
        className={`relative neon-inner-frame rounded-2xl p-5 sm:p-8 transition-colors ${
          isOverDropZone
            ? 'ring-4 ring-white'
            : ''
        }`}
      >
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
          {/* Mr Longnose + Speech Bubble */}
          <div className="md:col-span-7 flex flex-col sm:flex-row items-center gap-4">
            <MrLongnoseInterviewerSvg className="w-36 h-44 sm:w-44 sm:h-52 shrink-0" />
            <div className="relative bg-[#fef9c3] border-2 border-zinc-900 rounded-2xl p-5 shadow-sm flex-1">
              <div className="text-xs font-bold uppercase tracking-wide text-zinc-500 mb-1">
                Question {QUESTION_LETTERS[activeIndex]} · Mr. Longnose says:
              </div>
              <p className="font-display text-xl sm:text-2xl font-extrabold text-zinc-900 leading-snug">
                “{activeQuestion.quote}”
              </p>
            </div>
          </div>

          {/* Drop Zone */}
          <div className="md:col-span-5 flex flex-col items-center justify-center">
            <div
              className={`w-full min-h-[180px] rounded-2xl border-2 border-dashed p-4 flex flex-col items-center justify-center text-center transition-all ${
                isOverDropZone
                  ? 'border-blue-700 bg-blue-100/70 scale-[1.02]'
                  : selectedRole
                  ? 'border-emerald-600 bg-emerald-50/60'
                  : 'border-zinc-400 bg-[#faf9f5]'
              }`}
            >
              {selectedRole ? (
                <div className="flex flex-col items-center gap-1">
                  <DraggableJobCharacterSvg role={selectedRole} shocked={false} className="w-24 h-28" />
                  <span className="font-display text-base font-bold text-zinc-900">
                    {PART1_CHARACTERS.find((c) => c.id === selectedRole)?.label}
                  </span>
                  <span className="text-xs text-emerald-700 font-semibold">
                    Ready for interview (drag another person to change)
                  </span>
                </div>
              ) : (
                <div className="space-y-2 text-zinc-500">
                  <Hand className="w-8 h-8 mx-auto text-blue-700" />
                  <p className="font-display text-base font-bold text-zinc-800">
                    Drop the guest here!
                  </p>
                  <p className="text-xs">
                    Click and drag one of the 7 people standing below
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* 7 Animated People Standing Around */}
      <div className="neon-inner-frame rounded-2xl p-5 sm:p-6 space-y-3">
        <div className="flex items-center justify-between text-xs font-bold text-zinc-900">
          <span>Drag a person to Mr. Longnose (they flail when picked up!)</span>
          <span className="hidden sm:inline">7 Characters Available</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
          {PART1_CHARACTERS.map((char) => {
            const isBeingDragged = draggingRole === char.id;
            const isSelectedForCurrent = selectedRole === char.id;
            return (
              <div
                key={char.id}
                onPointerDown={(e) => startDrag(char.id, e)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    onSelectAnswer(activeQuestion.id, char.id);
                  }
                }}
                aria-label={`Drag ${char.label} to Mr. Longnose`}
                className={`touch-none select-none bg-white border-2 rounded-xl p-3 flex flex-col items-center justify-between cursor-grab active:cursor-grabbing transition-all ${
                  isBeingDragged
                    ? 'opacity-30 border-dashed border-zinc-400 scale-95'
                    : isSelectedForCurrent
                    ? 'border-blue-700 ring-2 ring-blue-200'
                    : 'border-zinc-900 hover:-translate-y-0.5 hover:shadow-[3px_3px_0px_0px_rgba(24,24,27,1)]'
                }`}
              >
                <DraggableJobCharacterSvg
                  role={char.id}
                  shocked={isBeingDragged}
                  className="w-20 h-24 pointer-events-none"
                />
                <span className="mt-1 font-display text-xs sm:text-sm font-bold text-zinc-900 text-center pointer-events-none">
                  {char.label}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Floating Comic Flailing Ghost while dragging */}
      {draggingRole && (
        <div
          className="fixed z-50 pointer-events-none select-none"
          style={{
            left: dragPos.x,
            top: dragPos.y,
            transform: 'translate(-50%, -55%) scale(1.18)',
          }}
        >
          <div className="bg-white/95 border-2 border-red-600 rounded-2xl p-2 shadow-xl flex flex-col items-center">
            <DraggableJobCharacterSvg role={draggingRole} shocked={true} className="w-24 h-28" />
            <span className="font-display text-xs font-extrabold text-red-700">
              WHOA!!
            </span>
          </div>
        </div>
      )}

      {/* Navigation between A, B, C and Next Part */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
        <div className="text-xs text-zinc-500">
          Answered {Object.keys(answers).filter((k) => questions.some((q) => q.id === k)).length} of {questions.length} in Part 1
        </div>

        <div className="flex items-center gap-3">
          {activeIndex < questions.length - 1 ? (
            <button
              type="button"
              onClick={() => setActiveIndex((prev) => prev + 1)}
              disabled={!selectedRole}
              className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-white bg-blue-700 rounded-xl hover:bg-blue-800 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
            >
              <span>Next Question ({QUESTION_LETTERS[activeIndex + 1]})</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              type="button"
              onClick={onCompletePart}
              disabled={!allAnswered}
              className="inline-flex items-center gap-2 px-6 py-3 text-sm font-semibold text-white bg-blue-700 rounded-xl hover:bg-blue-800 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
            >
              <span>Continue to Part 2</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
