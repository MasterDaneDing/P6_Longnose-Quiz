import { useEffect, useMemo, useState } from 'react';
import {
  CheckCircle2,
  AlertCircle,
  RotateCcw,
  UploadCloud,
  ExternalLink,
  Download,
  Clock,
} from 'lucide-react';
import {
  FeelingId,
  JobRoleId,
  PART1_CHARACTERS,
  PART1_POOL,
  PART2_POOL,
  PART3_POOL,
  PARTD_POOL,
  Part1Prompt,
  Part2Prompt,
  Part3Question,
  PartDScenario,
  pickRandomItems,
} from '../data/quizSpecData';
import { Part1DragInterview } from './quiz/Part1DragInterview';
import { Part2SwipeFeelings } from './quiz/Part2SwipeFeelings';
import { Part3AdjectivesQuiz } from './quiz/Part3AdjectivesQuiz';
import { PartDSelfieDraw, StudentGender } from './quiz/PartDSelfieDraw';
import {
  getDriveAccessToken,
  initDriveAuth,
  signInToGoogleDrive,
  signOutDrive,
  uploadQuizReportToDrive,
} from '../services/googleDrive';
import { User } from 'firebase/auth';
import { isAppsScriptConfigured, uploadReportToAppsScript } from '../services/appsScriptDrive';

interface ComprehensionQuizProps {
  onCompleteQuiz: (score: number) => void;
  onJumpToPage?: (pageNumber: number) => void;
  bestScore: number | null;
}

type QuizStage = 'part1' | 'part2' | 'part3' | 'partd' | 'summary';

interface QuizSession {
  part1Questions: Part1Prompt[];
  part2Questions: Part2Prompt[];
  part3Questions: Part3Question[];
  partDScenario: PartDScenario;
}

function createRandomSession(): QuizSession {
  return {
    part1Questions: pickRandomItems(PART1_POOL, 3),
    part2Questions: pickRandomItems(PART2_POOL, 3),
    part3Questions: pickRandomItems(PART3_POOL, 2),
    partDScenario: pickRandomItems(PARTD_POOL, 1)[0],
  };
}

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

export function ComprehensionQuiz({
  onCompleteQuiz,
  bestScore,
}: ComprehensionQuizProps) {
  const [session, setSession] = useState<QuizSession>(() => createRandomSession());
  const [stage, setStage] = useState<QuizStage>('part1');

  const [part1Answers, setPart1Answers] = useState<Record<string, JobRoleId>>({});
  const [part2Answers, setPart2Answers] = useState<Record<string, FeelingId>>({});
  const [part3Answers, setPart3Answers] = useState<Record<string, string>>({});
  const [partDGender, setPartDGender] = useState<StudentGender>('boy');
  const [partDFeeling, setPartDFeeling] = useState('');
  const [partDImageUrl, setPartDImageUrl] = useState('');

  // Student info & Google Drive submission state
  const [studentName, setStudentName] = useState('');
  const [studentClass, setStudentClass] = useState('P6');
  const [driveUser, setDriveUser] = useState<User | null>(null);
  const [needsDriveAuth, setNeedsDriveAuth] = useState(true);
  const [isSigningIn, setIsSigningIn] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [uploadedFile, setUploadedFile] = useState<{
    name: string;
    webViewLink?: string;
  } | null>(null);

  useEffect(() => {
    const unsub = initDriveAuth(
      (user) => {
        setDriveUser(user);
        setNeedsDriveAuth(false);
      },
      () => {
        setNeedsDriveAuth(true);
      }
    );
    return () => unsub();
  }, []);

  const scores = useMemo(() => {
    const p1 = session.part1Questions.reduce(
      (sum, q) => sum + (part1Answers[q.id] === q.targetRole ? 1 : 0),
      0
    );
    const p2 = session.part2Questions.reduce(
      (sum, q) => sum + (part2Answers[q.id] === q.targetFeeling ? 1 : 0),
      0
    );
    const p3 = session.part3Questions.reduce(
      (sum, q) => sum + (part3Answers[q.id] === q.targetAdjective ? 1 : 0),
      0
    );
    return { p1, p2, p3, autoTotal: p1 + p2 + p3 };
  }, [session, part1Answers, part2Answers, part3Answers]);

  const handleFinishPartD = () => {
    onCompleteQuiz(scores.autoTotal);
    setStage('summary');
  };

  const handleRestartQuiz = () => {
    setSession(createRandomSession());
    setStage('part1');
    setPart1Answers({});
    setPart2Answers({});
    setPart3Answers({});
    setPartDFeeling('');
    setPartDImageUrl('');
    setUploadedFile(null);
    setUploadError(null);
  };

  const buildReportHtml = (): string => {
    const safeName = escapeHtml(studentName.trim() || 'Student');
    const safeClass = escapeHtml(studentClass.trim() || 'P6');
    const submittedAt = new Date().toLocaleString();

    const p1Rows = session.part1Questions
      .map((q, i) => {
        const picked = part1Answers[q.id];
        const pickedLabel =
          PART1_CHARACTERS.find((c) => c.id === picked)?.label || 'None';
        const targetLabel =
          PART1_CHARACTERS.find((c) => c.id === q.targetRole)?.label || q.targetRole;
        const ok = picked === q.targetRole;
        return `<tr>
          <td>Part 1-${['A', 'B', 'C'][i]}</td>
          <td>${escapeHtml(q.quote)}</td>
          <td>${escapeHtml(pickedLabel)}</td>
          <td>${escapeHtml(targetLabel)}</td>
          <td><strong>${ok ? '1 / 1' : '0 / 1'}</strong></td>
        </tr>`;
      })
      .join('');

    const p2Rows = session.part2Questions
      .map((q, i) => {
        const picked = part2Answers[q.id] || 'None';
        const ok = picked === q.targetFeeling;
        return `<tr>
          <td>Part 2-${i + 1}</td>
          <td>${escapeHtml(q.quote)}</td>
          <td>${escapeHtml(picked)}</td>
          <td>${escapeHtml(q.targetFeeling)}</td>
          <td><strong>${ok ? '1 / 1' : '0 / 1'}</strong></td>
        </tr>`;
      })
      .join('');

    const p3Rows = session.part3Questions
      .map((q, i) => {
        const picked = part3Answers[q.id] || 'None';
        const ok = picked === q.targetAdjective;
        return `<tr>
          <td>Part 3-${i + 1}</td>
          <td>${escapeHtml(q.sentenceBefore)}___${escapeHtml(q.sentenceAfter)}</td>
          <td>${escapeHtml(picked)}</td>
          <td>${escapeHtml(q.targetAdjective)}</td>
          <td><strong>${ok ? '1 / 1' : '0 / 1'}</strong></td>
        </tr>`;
      })
      .join('');

    return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8" />
<title>Mr. Longnose Quiz — ${safeName}</title>
<style>
  body { font-family: system-ui, -apple-system, sans-serif; color: #18181b; max-width: 820px; margin: 32px auto; padding: 0 20px; line-height: 1.5; }
  h1 { margin-bottom: 4px; }
  .meta { color: #52525b; font-size: 14px; margin-bottom: 24px; }
  .scorebox { background: #f4f1e8; border: 2px solid #18181b; border-radius: 12px; padding: 16px 20px; margin-bottom: 24px; }
  table { width: 100%; border-collapse: collapse; margin-bottom: 24px; font-size: 14px; }
  th, td { border: 1px solid #d4d4d8; padding: 10px; text-align: left; }
  th { background: #faf9f5; }
  .partd { border: 2px solid #18181b; border-radius: 12px; padding: 20px; background: #fff; }
  img { max-width: 100%; border: 1px solid #d4d4d8; border-radius: 8px; margin-top: 12px; }
</style>
</head>
<body>
  <h1>Mr. Longnose — 10-Mark Quiz Submission</h1>
  <div class="meta">Student: <strong>${safeName}</strong> · Class: <strong>${safeClass}</strong> · Submitted: ${escapeHtml(submittedAt)}</div>
  <div class="scorebox">
    <div><strong>Auto-Marked Score (Parts 1–3):</strong> ${scores.autoTotal} / 8</div>
    <div><strong>Part D (Picture + Feeling &amp; Spelling):</strong> Pending Personal Teacher Check (? / 2)</div>
    <div><strong>Total Possible Marks:</strong> 10</div>
  </div>
  <table>
    <thead>
      <tr><th>Item</th><th>Prompt</th><th>Student Answer</th><th>Expected</th><th>Mark</th></tr>
    </thead>
    <tbody>
      ${p1Rows}
      ${p2Rows}
      ${p3Rows}
    </tbody>
  </table>
  <div class="partd">
    <h2>Part D — Teacher Review Required (2 Marks)</h2>
    <p><strong>Scenario (${escapeHtml(session.partDScenario.speakerLabel)}):</strong> "${escapeHtml(session.partDScenario.speechText)}"</p>
    <p><strong>Student Answer:</strong> I feel <strong>${escapeHtml(partDFeeling.trim() || '(blank)')}</strong>.</p>
    <p><strong>Marking Rubric:</strong> 1 mark for picture matching the sentence · 1 mark for correct feeling &amp; spelling (Suggested: ${escapeHtml(session.partDScenario.expectedFeelings.join(' / '))})</p>
    ${partDImageUrl ? `<img src="${partDImageUrl}" alt="Student Part D Comic Drawing" />` : '<p>No image captured.</p>'}
  </div>
</body>
</html>`;
  };

  const handleGoogleSignIn = async () => {
    setIsSigningIn(true);
    setUploadError(null);
    try {
      const res = await signInToGoogleDrive();
      setDriveUser(res.user);
      setNeedsDriveAuth(false);
    } catch (err) {
      setUploadError(
        err instanceof Error ? err.message : 'Google sign-in failed. Please try again.'
      );
    } finally {
      setIsSigningIn(false);
    }
  };

  const handleSendToDrive = async () => {
    setUploadError(null);
    if (!studentName.trim()) {
      setUploadError('Please enter your name before sending to Google Drive.');
      return;
    }

    const useScript = isAppsScriptConfigured();
    let token = useScript ? null : getDriveAccessToken();
    if (!useScript && !token) {
      try {
        const res = await signInToGoogleDrive();
        setDriveUser(res.user);
        setNeedsDriveAuth(false);
        token = res.accessToken;
      } catch (err) {
        setUploadError(
          err instanceof Error ? err.message : 'Please sign in with Google to upload.'
        );
        return;
      }
    }

    setIsUploading(true);
    try {
      const safeSlug = studentName
        .trim()
        .replace(/[^a-zA-Z0-9_-]+/g, '_')
        .slice(0, 40);
      const dateStr = new Date().toISOString().slice(0, 10);
      const fileName = `MrLongnose_Quiz_${safeSlug || 'Student'}_${dateStr}.html`;
      const htmlContent = buildReportHtml();
      if (useScript) {
        const uploaded = await uploadReportToAppsScript({ fileName, htmlContent });
        setUploadedFile({ name: uploaded.fileName });
      } else {
        const uploaded = await uploadQuizReportToDrive({
          fileName,
          htmlContent,
          accessToken: token as string,
        });
        setUploadedFile({ name: uploaded.name, webViewLink: uploaded.webViewLink });
      }
    } catch (err) {
      setUploadError(
        err instanceof Error ? err.message : 'Could not upload quiz to Google Drive.'
      );
    } finally {
      setIsUploading(false);
    }
  };

  const handleDownloadBackup = () => {
    const html = buildReportHtml();
    const blob = new Blob([html], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `MrLongnose_Quiz_${(studentName.trim() || 'Student').replace(/[^a-zA-Z0-9_-]+/g, '_')}.html`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const steps: { id: QuizStage; label: string; marks: string }[] = [
    { id: 'part1', label: 'Part 1: Interview', marks: '3 marks' },
    { id: 'part2', label: 'Part 2: Feelings', marks: '3 marks' },
    { id: 'part3', label: 'Part 3: Describe', marks: '2 marks' },
    { id: 'partd', label: 'Part D: Selfie/Draw', marks: '2 marks' },
  ];

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Quiz Header & 10-Mark Progress */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 neon-inner-frame rounded-2xl p-4 sm:p-5">
        <div className="flex flex-wrap items-center gap-2">
          {steps.map((s, idx) => {
            const active = stage === s.id;
            return (
              <button
                key={s.id}
                type="button"
                onClick={() => {
                  if (stage !== 'summary') setStage(s.id);
                }}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer whitespace-nowrap shrink-0 border-2 border-zinc-900 ${
                  active
                    ? 'bg-zinc-900 text-yellow-300'
                    : 'bg-white text-zinc-900 hover:bg-amber-50'
                }`}
              >
                {idx + 1}. {s.label} ({s.marks})
              </button>
            );
          })}
        </div>

        <div className="flex items-center gap-4">
          {bestScore !== null && (
            <span className="text-xs font-mono font-bold text-zinc-950 tabular-nums">
              Best Auto-Score: {bestScore}/8
            </span>
          )}
          <button
            type="button"
            onClick={handleRestartQuiz}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-zinc-900 bg-white border-2 border-zinc-900 rounded-lg hover:bg-amber-50 cursor-pointer whitespace-nowrap shrink-0"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>New Random Quiz</span>
          </button>
        </div>
      </div>

      {stage === 'part1' && (
        <Part1DragInterview
          questions={session.part1Questions}
          answers={part1Answers}
          onSelectAnswer={(qid, role) =>
            setPart1Answers((prev) => ({ ...prev, [qid]: role }))
          }
          onCompletePart={() => setStage('part2')}
        />
      )}

      {stage === 'part2' && (
        <Part2SwipeFeelings
          questions={session.part2Questions}
          answers={part2Answers}
          onSelectAnswer={(qid, feeling) =>
            setPart2Answers((prev) => ({ ...prev, [qid]: feeling }))
          }
          onCompletePart={() => setStage('part3')}
        />
      )}

      {stage === 'part3' && (
        <Part3AdjectivesQuiz
          questions={session.part3Questions}
          answers={part3Answers}
          onSelectAnswer={(qid, adj) =>
            setPart3Answers((prev) => ({ ...prev, [qid]: adj }))
          }
          onCompletePart={() => setStage('partd')}
        />
      )}

      {stage === 'partd' && (
        <PartDSelfieDraw
          scenario={session.partDScenario}
          gender={partDGender}
          onChangeGender={setPartDGender}
          feelingAnswer={partDFeeling}
          onChangeFeelingAnswer={setPartDFeeling}
          compositeImageDataUrl={partDImageUrl}
          onChangeCompositeImage={setPartDImageUrl}
          onCompleteQuiz={handleFinishPartD}
        />
      )}

      {stage === 'summary' && (
        <section className="max-w-4xl mx-auto space-y-6">
          <div className="neon-inner-frame rounded-2xl p-6 sm:p-8 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b-2 border-zinc-900/20 pb-5">
              <div>
                <span className="text-xs font-semibold text-blue-700">
                  10-Mark Quiz Complete
                </span>
                <h1 className="font-display text-3xl sm:text-4xl font-extrabold text-zinc-900 mt-1 tabular-nums">
                  Parts 1–3 Score: {scores.autoTotal} / 8
                </h1>
                <p className="text-sm text-zinc-600 mt-1 flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-amber-600 shrink-0" />
                  <span>
                    Part D (2 marks: picture match + feeling &amp; spelling) will be marked personally by your teacher.
                  </span>
                </p>
              </div>
            </div>

            {/* Score Breakdown */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="bg-[#faf9f5] border border-zinc-200 rounded-xl p-4">
                <div className="text-xs text-zinc-500">Part 1 (Interview)</div>
                <div className="font-mono text-2xl font-bold text-zinc-900 tabular-nums mt-1">
                  {scores.p1} / 3
                </div>
              </div>
              <div className="bg-[#faf9f5] border border-zinc-200 rounded-xl p-4">
                <div className="text-xs text-zinc-500">Part 2 (Feelings)</div>
                <div className="font-mono text-2xl font-bold text-zinc-900 tabular-nums mt-1">
                  {scores.p2} / 3
                </div>
              </div>
              <div className="bg-[#faf9f5] border border-zinc-200 rounded-xl p-4">
                <div className="text-xs text-zinc-500">Part 3 (Adjectives)</div>
                <div className="font-mono text-2xl font-bold text-zinc-900 tabular-nums mt-1">
                  {scores.p3} / 2
                </div>
              </div>
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
                <div className="text-xs text-amber-800 font-medium">Part D (Teacher Check)</div>
                <div className="font-mono text-2xl font-bold text-amber-900 tabular-nums mt-1">
                  ? / 2
                </div>
              </div>
            </div>

            {/* Detailed Answer Check for Parts 1-3 */}
            <div className="space-y-3 border-t border-zinc-200 pt-5">
              <h2 className="font-display text-lg font-bold text-zinc-900">
                Marked Answers (Parts 1–3)
              </h2>

              <div className="divide-y divide-zinc-200 border border-zinc-200 rounded-xl overflow-hidden">
                {session.part1Questions.map((q, idx) => {
                  const picked = part1Answers[q.id];
                  const ok = picked === q.targetRole;
                  const pickedLabel =
                    PART1_CHARACTERS.find((c) => c.id === picked)?.label || 'None';
                  const targetLabel =
                    PART1_CHARACTERS.find((c) => c.id === q.targetRole)?.label || q.targetRole;
                  return (
                    <div key={q.id} className="p-3.5 bg-white flex items-center justify-between gap-3 text-sm">
                      <div className="flex items-start gap-2.5">
                        {ok ? (
                          <CheckCircle2 className="w-4 h-4 text-emerald-700 mt-0.5 shrink-0" />
                        ) : (
                          <AlertCircle className="w-4 h-4 text-red-600 mt-0.5 shrink-0" />
                        )}
                        <div>
                          <span className="font-semibold">Part 1-{['A', 'B', 'C'][idx]}:</span> “{q.quote}”
                          <div className="text-xs text-zinc-500">
                            Your choice: {pickedLabel} · Correct: {targetLabel}
                          </div>
                        </div>
                      </div>
                      <span className="font-mono font-bold tabular-nums shrink-0">
                        {ok ? '1/1' : '0/1'}
                      </span>
                    </div>
                  );
                })}

                {session.part2Questions.map((q, idx) => {
                  const picked = part2Answers[q.id] || 'None';
                  const ok = picked === q.targetFeeling;
                  return (
                    <div key={q.id} className="p-3.5 bg-white flex items-center justify-between gap-3 text-sm">
                      <div className="flex items-start gap-2.5">
                        {ok ? (
                          <CheckCircle2 className="w-4 h-4 text-emerald-700 mt-0.5 shrink-0" />
                        ) : (
                          <AlertCircle className="w-4 h-4 text-red-600 mt-0.5 shrink-0" />
                        )}
                        <div>
                          <span className="font-semibold">Part 2-{idx + 1}:</span> “{q.quote}”
                          <div className="text-xs text-zinc-500">
                            Your face: {picked} · Correct: {q.targetFeeling}
                          </div>
                        </div>
                      </div>
                      <span className="font-mono font-bold tabular-nums shrink-0">
                        {ok ? '1/1' : '0/1'}
                      </span>
                    </div>
                  );
                })}

                {session.part3Questions.map((q, idx) => {
                  const picked = part3Answers[q.id] || 'None';
                  const ok = picked === q.targetAdjective;
                  return (
                    <div key={q.id} className="p-3.5 bg-white flex items-center justify-between gap-3 text-sm">
                      <div className="flex items-start gap-2.5">
                        {ok ? (
                          <CheckCircle2 className="w-4 h-4 text-emerald-700 mt-0.5 shrink-0" />
                        ) : (
                          <AlertCircle className="w-4 h-4 text-red-600 mt-0.5 shrink-0" />
                        )}
                        <div>
                          <span className="font-semibold">Part 3-{idx + 1}:</span> “{q.sentenceBefore}___
                          {q.sentenceAfter}”
                          <div className="text-xs text-zinc-500">
                            Your answer: {picked} · Correct: {q.targetAdjective}
                          </div>
                        </div>
                      </div>
                      <span className="font-mono font-bold tabular-nums shrink-0">
                        {ok ? '1/1' : '0/1'}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Part D Preview for Teacher */}
            <div className="bg-[#faf9f5] border border-zinc-200 rounded-xl p-5 space-y-3">
              <div className="flex items-center justify-between gap-2">
                <h2 className="font-display text-lg font-bold text-zinc-900">
                  Part D Submission (Checked Personally by Teacher)
                </h2>
                <button
                  type="button"
                  onClick={() => setStage('partd')}
                  className="text-xs font-semibold text-blue-700 hover:underline cursor-pointer"
                >
                  Edit Part D
                </button>
              </div>
              <p className="text-sm text-zinc-700">
                <span className="font-semibold">{session.partDScenario.speakerLabel}:</span> “
                {session.partDScenario.speechText}”
              </p>
              <p className="text-base font-display font-bold text-zinc-900">
                Student wrote: “I feel <span className="text-blue-700 underline">{partDFeeling}</span>.”
              </p>
              {partDImageUrl && (
                <img
                  src={partDImageUrl}
                  alt="Student Part D Comic Scene"
                  className="w-full max-w-md rounded-xl border border-zinc-300"
                />
              )}
            </div>

            {/* Send to Google Drive */}
            <div className="border-t border-zinc-200 pt-6 space-y-4">
              <h2 className="font-display text-xl font-bold text-zinc-900">
                Send Quiz Results to Google Drive
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="student-name" className="block text-xs font-semibold text-zinc-700 mb-1">
                    Student Name
                  </label>
                  <input
                    id="student-name"
                    type="text"
                    value={studentName}
                    onChange={(e) => setStudentName(e.target.value)}
                    placeholder="e.g. Kitty Fung"
                    className="w-full px-3.5 py-2.5 text-sm bg-[#faf9f5] border border-zinc-300 rounded-lg"
                  />
                </div>
                <div>
                  <label htmlFor="student-class" className="block text-xs font-semibold text-zinc-700 mb-1">
                    Class
                  </label>
                  <input
                    id="student-class"
                    type="text"
                    value={studentClass}
                    onChange={(e) => setStudentClass(e.target.value)}
                    placeholder="e.g. P6A"
                    className="w-full px-3.5 py-2.5 text-sm bg-[#faf9f5] border border-zinc-300 rounded-lg"
                  />
                </div>
              </div>

              {uploadError && (
                <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-sm text-red-800 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{uploadError}</span>
                </div>
              )}

              {uploadedFile && (
                <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-300 text-emerald-950 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-2 text-sm font-semibold">
                    <CheckCircle2 className="w-5 h-5 text-emerald-700 shrink-0" />
                    <span>Saved to Google Drive: {uploadedFile.name}</span>
                  </div>
                  {uploadedFile.webViewLink && (
                    <a
                      href={uploadedFile.webViewLink}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-800 hover:underline whitespace-nowrap shrink-0"
                    >
                      <span>Open in Google Drive</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  )}
                </div>
              )}

              <div className="flex flex-wrap items-center gap-3">
                {needsDriveAuth && !isAppsScriptConfigured() ? (
                  <button
                    type="button"
                    onClick={handleGoogleSignIn}
                    disabled={isSigningIn}
                    className="gsi-material-button"
                  >
                    <div className="gsi-material-button-content-wrapper">
                      <div className="gsi-material-button-icon">
                        <svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" style={{ display: 'block' }}>
                          <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z" />
                          <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z" />
                          <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z" />
                          <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z" />
                        </svg>
                      </div>
                      <span className="gsi-material-button-contents">
                        {isSigningIn ? 'Signing in...' : 'Sign in with Google'}
                      </span>
                    </div>
                  </button>
                ) : (
                  <>
                    <button
                      type="button"
                      onClick={handleSendToDrive}
                      disabled={isUploading}
                      className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-white bg-blue-700 rounded-xl hover:bg-blue-800 disabled:opacity-50 cursor-pointer"
                    >
                      <UploadCloud className="w-4 h-4" />
                      <span>
                        {isUploading ? 'Uploading to Drive...' : 'Send Quiz to Google Drive'}
                      </span>
                    </button>

                    {driveUser && (
                      <button
                        type="button"
                        onClick={() => signOutDrive()}
                        className="text-xs text-zinc-500 hover:text-zinc-800 underline cursor-pointer"
                      >
                        Signed in as {driveUser.email || 'Google user'} (Sign out)
                      </button>
                    )}
                  </>
                )}

                <button
                  type="button"
                  onClick={handleDownloadBackup}
                  className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-semibold text-zinc-800 bg-white border border-zinc-300 rounded-xl hover:bg-zinc-50 cursor-pointer"
                >
                  <Download className="w-4 h-4" />
                  <span>Download Report Copy</span>
                </button>
              </div>
            </div>
          </div>
        </section>
      )}
    </main>
  );
}
