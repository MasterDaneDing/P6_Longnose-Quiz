import { useState } from 'react';
import { ArrowRight, CheckCircle2 } from 'lucide-react';
import { Part3Question } from '../../data/quizSpecData';
import { ComicImage } from '../ComicImage';

interface Part3AdjectivesQuizProps {
  questions: Part3Question[];
  answers: Record<string, string>;
  onSelectAnswer: (questionId: string, adjective: string) => void;
  onCompletePart: () => void;
}

export function Part3AdjectivesQuiz({
  questions,
  answers,
  onSelectAnswer,
  onCompletePart,
}: Part3AdjectivesQuizProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const activeQuestion = questions[activeIndex];
  const selectedWord = answers[activeQuestion.id] || '';
  const allAnswered = questions.every((q) => Boolean(answers[q.id]));

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4 border-b-2 border-yellow-300/60 pb-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-xs font-bold text-yellow-200">
            <span>Part 3 of 4</span>
            <span aria-hidden="true">·</span>
            <span className="font-mono tabular-nums">2 Marks (1 mark each)</span>
          </div>
          <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-white drop-shadow-sm">
            Look at the people. How would you describe them?
          </h2>
          <p className="text-sm text-yellow-100 font-medium">
            Select the best adjective on the right to complete the sentence under the comic panel.
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
                <span>Question {idx + 1}</span>
                {answered && !isCurrent && <CheckCircle2 className="w-3.5 h-3.5" />}
              </button>
            );
          })}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
        {/* Left: Picture + Fill-in-the-blank Sentence */}
        <div className="lg:col-span-7 neon-inner-frame rounded-2xl p-4 sm:p-5 flex flex-col justify-between space-y-4">
          <ComicImage
            key={activeQuestion.id}
            src={activeQuestion.image}
            alt={activeQuestion.altText}
            aspectClass="aspect-[4/3]"
            className="rounded-xl w-full"
            fallbackLabel={activeQuestion.altText}
          />

          <div className="bg-white border-2 border-zinc-900 rounded-xl p-4 sm:p-5 text-center">
            <p className="font-display text-xl sm:text-2xl font-bold text-zinc-900">
              “{activeQuestion.sentenceBefore}
              <span className="inline-block min-w-[130px] border-b-2 border-orange-600 px-2 text-orange-700 font-extrabold">
                {selectedWord || '________'}
              </span>
              {activeQuestion.sentenceAfter}”
            </p>
          </div>
        </div>

        {/* Right: Selectable Answers */}
        <div className="lg:col-span-5 neon-inner-frame rounded-2xl p-6 sm:p-8 flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            <div className="text-xs font-bold text-zinc-800">
              Choose an adjective ({activeIndex + 1} of {questions.length})
            </div>

            <div className="space-y-2">
              <input
                type="text"
                value={selectedWord}
                onChange={(e) =>
                  onSelectAnswer(activeQuestion.id, e.target.value.toLowerCase().trim())
                }
                placeholder="Type the missing adjective…"
                autoComplete="off"
                autoCapitalize="off"
                spellCheck={false}
                className="w-full px-4 py-3.5 rounded-xl border-2 border-zinc-300 bg-[#faf9f5] font-display text-lg font-bold text-zinc-900 outline-none focus:border-blue-600 focus:bg-white"
              />
              <p className="text-xs text-zinc-500">
                Type the adjective you remember — no options shown.
              </p>
            </div>
          </div>

          <div className="flex justify-end pt-2 border-t border-zinc-200">
            {activeIndex < questions.length - 1 ? (
              <button
                type="button"
                onClick={() => setActiveIndex((prev) => prev + 1)}
                disabled={!selectedWord}
                className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-white bg-blue-700 rounded-xl hover:bg-blue-800 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
              >
                <span>Next Picture</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                type="button"
                onClick={onCompletePart}
                disabled={!allAnswered}
                className="inline-flex items-center gap-2 px-6 py-3 text-sm font-semibold text-white bg-blue-700 rounded-xl hover:bg-blue-800 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
              >
                <span>Continue to Part D</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
