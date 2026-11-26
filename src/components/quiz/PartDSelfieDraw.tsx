import { useCallback, useEffect, useRef, useState } from 'react';
import {
  Camera,
  Eraser,
  Paintbrush,
  PaintBucket,
  RotateCcw,
  Sparkles,
  Undo2,
  Upload,
  CheckCircle2,
  ArrowRight,
  UserRound,
} from 'lucide-react';
import {
  PARTD_STUDENT_SPRITES,
  PartDScenario,
} from '../../data/quizSpecData';
import { extractFeatheredHead, warmUpHeadSegmenter } from '../../utils/headSegmenter';

export type StudentGender = 'boy' | 'girl';

interface PartDSelfieDrawProps {
  scenario: PartDScenario;
  gender: StudentGender;
  onChangeGender: (g: StudentGender) => void;
  feelingAnswer: string;
  onChangeFeelingAnswer: (val: string) => void;
  compositeImageDataUrl: string;
  onChangeCompositeImage: (dataUrl: string) => void;
  onCompleteQuiz: () => void;
}

const PEN_COLORS = [
  { id: 'ink', hex: '#18181b', label: 'Black Ink' },
  { id: 'brown', hex: '#78350f', label: 'Brown Hair' },
  { id: 'peach', hex: '#fdba74', label: 'Peach Skin' },
  { id: 'red', hex: '#dc2626', label: 'Red' },
  { id: 'blue', hex: '#1d4ed8', label: 'Blue' },
  { id: 'yellow', hex: '#eab308', label: 'Yellow' },
];

type DrawTool = 'pen' | 'bucket' | 'eraser';

function hexToRgb(hex: string): [number, number, number] {
  const clean = hex.replace('#', '');
  const num = parseInt(clean, 16);
  return [(num >> 16) & 255, (num >> 8) & 255, num & 255];
}

function floodFillCanvas(
  canvas: HTMLCanvasElement,
  startX: number,
  startY: number,
  fillHex: string
): boolean {
  const ctx = canvas.getContext('2d');
  if (!ctx) return false;
  const w = canvas.width;
  const h = canvas.height;
  const sx = Math.max(0, Math.min(w - 1, Math.round(startX)));
  const sy = Math.max(0, Math.min(h - 1, Math.round(startY)));

  const imgData = ctx.getImageData(0, 0, w, h);
  const data = imgData.data;
  const startIdx = (sy * w + sx) * 4;
  const sr = data[startIdx];
  const sg = data[startIdx + 1];
  const sb = data[startIdx + 2];
  const sa = data[startIdx + 3];

  const [fr, fg, fb] = hexToRgb(fillHex);

  // Skip if clicking a pixel already filled with the same opaque color
  if (
    sa > 240 &&
    Math.abs(sr - fr) < 12 &&
    Math.abs(sg - fg) < 12 &&
    Math.abs(sb - fb) < 12
  ) {
    return false;
  }

  const startTransparent = sa < 25;
  const visited = new Uint8Array(w * h);
  const stack = new Int32Array(w * h);
  let top = 0;
  stack[top++] = sy * w + sx;
  visited[sy * w + sx] = 1;

  const matches = (p: number) => {
    const i = p * 4;
    const a = data[i + 3];
    if (startTransparent) {
      // Fill transparent & soft anti-aliased fringes without crossing solid ink strokes
      return a < 170;
    }
    const diff =
      Math.abs(data[i] - sr) +
      Math.abs(data[i + 1] - sg) +
      Math.abs(data[i + 2] - sb) +
      Math.abs(a - sa);
    return diff <= 95;
  };

  while (top > 0) {
    const p = stack[--top];
    const i = p * 4;
    data[i] = fr;
    data[i + 1] = fg;
    data[i + 2] = fb;
    data[i + 3] = 255;

    const x = p % w;
    const y = (p - x) / w;

    if (x > 0 && !visited[p - 1] && matches(p - 1)) {
      visited[p - 1] = 1;
      stack[top++] = p - 1;
    }
    if (x < w - 1 && !visited[p + 1] && matches(p + 1)) {
      visited[p + 1] = 1;
      stack[top++] = p + 1;
    }
    if (y > 0 && !visited[p - w] && matches(p - w)) {
      visited[p - w] = 1;
      stack[top++] = p - w;
    }
    if (y < h - 1 && !visited[p + w] && matches(p + w)) {
      visited[p + w] = 1;
      stack[top++] = p + w;
    }
  }

  ctx.putImageData(imgData, 0, 0);
  return true;
}

export function PartDSelfieDraw({
  scenario,
  gender,
  onChangeGender,
  feelingAnswer,
  onChangeFeelingAnswer,
  compositeImageDataUrl,
  onChangeCompositeImage,
  onCompleteQuiz,
}: PartDSelfieDrawProps) {
  const [faceMode, setFaceMode] = useState<'draw' | 'camera'>('draw');
  const [penColor, setPenColor] = useState('#18181b');
  const [drawTool, setDrawTool] = useState<DrawTool>('pen');
  const [hasDrawn, setHasDrawn] = useState(false);
  const [canUndo, setCanUndo] = useState(false);

  const [rawSelfieDataUrl, setRawSelfieDataUrl] = useState<string | null>(null);
  const [clearedSelfieDataUrl, setClearedSelfieDataUrl] = useState<string | null>(null);
  const [useSmartClear, setUseSmartClear] = useState(false);
  const [isSmartClearing, setIsSmartClearing] = useState(false);
  const [smartClearError, setSmartClearError] = useState<string | null>(null);

  const [headScale, setHeadScale] = useState(1);
  const [cameraActive, setCameraActive] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [bgImage, setBgImage] = useState<HTMLImageElement | null>(null);
  const [bgFailed, setBgFailed] = useState(false);

  const drawCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const drawHistoryRef = useRef<ImageData[]>([]);
  const compositeCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const isDrawingRef = useRef(false);
  const lastPointRef = useRef<{ x: number; y: number } | null>(null);

  const activeSelfieUrl =
    useSmartClear && clearedSelfieDataUrl ? clearedSelfieDataUrl : rawSelfieDataUrl;

  const activeSprite = PARTD_STUDENT_SPRITES[gender];
  const activeImageSrc = activeSprite.image;
  const activeHeadSlot = activeSprite.headSlot;

  // Load the boy or girl 1980s comic-book illustration for this scenario
  useEffect(() => {
    warmUpHeadSegmenter();
  }, []);

  useEffect(() => {
    let cancelled = false;
    setBgFailed(false);
    const img = new Image();
    img.onload = () => {
      if (!cancelled) setBgImage(img);
    };
    img.onerror = () => {
      if (!cancelled) {
        setBgImage(null);
        setBgFailed(true);
      }
    };
    img.src = activeImageSrc;
    return () => {
      cancelled = true;
    };
  }, [activeImageSrc]);

  const pushHistorySnapshot = useCallback(() => {
    const canvas = drawCanvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;
    const snap = ctx.getImageData(0, 0, canvas.width, canvas.height);
    drawHistoryRef.current = [...drawHistoryRef.current.slice(-14), snap];
    setCanUndo(true);
  }, []);

  const clearDrawCanvas = useCallback(() => {
    const canvas = drawCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawHistoryRef.current = [];
    setCanUndo(false);
    setHasDrawn(false);
  }, []);

  const handleUndoDraw = () => {
    const canvas = drawCanvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx || drawHistoryRef.current.length === 0) return;
    const prev = drawHistoryRef.current[drawHistoryRef.current.length - 1];
    drawHistoryRef.current = drawHistoryRef.current.slice(0, -1);
    ctx.putImageData(prev, 0, 0);
    setCanUndo(drawHistoryRef.current.length > 0);
    const hasPixels = prev.data.some((val, idx) => idx % 4 === 3 && val > 0);
    setHasDrawn(hasPixels);
    renderCompositeScene();
  };

  useEffect(() => {
    clearDrawCanvas();
  }, [clearDrawCanvas]);

  const stopCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    }
    setCameraActive(false);
  }, []);

  useEffect(() => {
    return () => stopCamera();
  }, [stopCamera]);

  const startCamera = async () => {
    setCameraError(null);
    if (!navigator.mediaDevices?.getUserMedia) {
      setCameraError('Camera preview is unavailable here. Use Upload Photo instead.');
      return;
    }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'user', width: { ideal: 640 }, height: { ideal: 640 } },
        audio: false,
      });
      streamRef.current = stream;
      setCameraActive(true);
      setTimeout(() => {
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      }, 50);
    } catch {
      setCameraError('Could not access camera. You can upload a selfie photo or draw your face.');
    }
  };

  const applyNewSelfie = (url: string) => {
    setRawSelfieDataUrl(url);
    setClearedSelfieDataUrl(null);
    setSmartClearError(null);
    setUseSmartClear(true);
    setIsSmartClearing(true);
    extractFeatheredHead(url)
      .then((res) => {
        setClearedSelfieDataUrl(res.dataUrl);
      })
      .catch(() => {
        setSmartClearError('Could not auto-clear this photo. Try a clearer front-facing photo.');
      })
      .finally(() => setIsSmartClearing(false));
  };

  const snapSelfie = () => {
    const video = videoRef.current;
    if (!video) return;
    const temp = document.createElement('canvas');
    // Generous portrait frame using full vertical video height so hair on top is never clipped
    temp.width = 400;
    temp.height = 440;
    const ctx = temp.getContext('2d');
    if (!ctx) return;

    const vw = video.videoWidth || 640;
    const vh = video.videoHeight || 480;
    const targetAspect = 400 / 440;
    const cropH = Math.min(vh, vw / targetAspect);
    const cropW = cropH * targetAspect;
    const sx = Math.max(0, (vw - cropW) / 2);
    const sy = Math.max(0, (vh - cropH) * 0.25);

    ctx.translate(400, 0);
    ctx.scale(-1, 1);
    ctx.drawImage(video, sx, sy, cropW, cropH, 0, 0, 400, 440);

    applyNewSelfie(temp.toDataURL('image/png'));
    stopCamera();
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        applyNewSelfie(reader.result);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleToggleSmartClear = async () => {
    if (!rawSelfieDataUrl) return;
    if (useSmartClear) {
      setUseSmartClear(false);
      return;
    }
    if (clearedSelfieDataUrl) {
      setUseSmartClear(true);
      return;
    }
    setIsSmartClearing(true);
    setSmartClearError(null);
    try {
      const cutout = (await extractFeatheredHead(rawSelfieDataUrl)).dataUrl;
      setClearedSelfieDataUrl(cutout);
      setUseSmartClear(true);
    } catch {
      setSmartClearError('Could not smart-clear this photo. Try a clearer front-facing photo.');
    } finally {
      setIsSmartClearing(false);
    }
  };

  const getCanvasPoint = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const canvas = drawCanvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    return {
      x: ((e.clientX - rect.left) / rect.width) * canvas.width,
      y: ((e.clientY - rect.top) / rect.height) * canvas.height,
    };
  };

  const handleDrawDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    const canvas = drawCanvasRef.current;
    if (!canvas) return;
    const pt = getCanvasPoint(e);

    if (drawTool === 'bucket') {
      pushHistorySnapshot();
      const filled = floodFillCanvas(canvas, pt.x, pt.y, penColor);
      if (filled) {
        setHasDrawn(true);
        renderCompositeScene();
      }
      return;
    }

    pushHistorySnapshot();
    e.currentTarget.setPointerCapture(e.pointerId);
    isDrawingRef.current = true;
    lastPointRef.current = pt;
    setHasDrawn(true);
  };

  const handleDrawMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!isDrawingRef.current || !lastPointRef.current || drawTool === 'bucket') return;
    const canvas = drawCanvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;
    const pt = getCanvasPoint(e);

    if (drawTool === 'eraser') {
      ctx.save();
      ctx.globalCompositeOperation = 'destination-out';
      ctx.lineWidth = 22;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.beginPath();
      ctx.moveTo(lastPointRef.current.x, lastPointRef.current.y);
      ctx.lineTo(pt.x, pt.y);
      ctx.stroke();
      ctx.restore();
    } else {
      ctx.strokeStyle = penColor;
      ctx.lineWidth = 7;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.beginPath();
      ctx.moveTo(lastPointRef.current.x, lastPointRef.current.y);
      ctx.lineTo(pt.x, pt.y);
      ctx.stroke();
    }

    lastPointRef.current = pt;
  };

  const handleDrawUp = () => {
    if (!isDrawingRef.current) return;
    isDrawingRef.current = false;
    lastPointRef.current = null;
    renderCompositeScene();
  };

  const renderCompositeScene = useCallback(() => {
    const canvas = compositeCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const W = canvas.width;
    const H = canvas.height;

    const drawOverlayAndBubble = (selfieImg: HTMLImageElement | null) => {
      ctx.clearRect(0, 0, W, H);

      // 1. Draw the plain headless Boy or Girl illustration (no background scene art)
      if (bgImage) {
        ctx.drawImage(bgImage, 0, 0, W, H);
      } else {
        ctx.fillStyle = '#faf9f5';
        ctx.fillRect(0, 0, W, H);
        if (bgFailed) {
          ctx.fillStyle = '#52525b';
          ctx.font = 'bold 18px sans-serif';
          ctx.textAlign = 'center';
          ctx.fillText(gender === 'boy' ? 'Boy Uniform' : 'Girl Uniform', W * 0.7, H * 0.5);
        }
      }

      // Subtle comic border around the panel
      ctx.save();
      ctx.strokeStyle = '#18181b';
      ctx.lineWidth = 4;
      ctx.strokeRect(2, 2, W - 4, H - 4);
      ctx.restore();

      // 2. Place the student's full head (face + hair!) cleanly above the shirt collar
      const cx = activeHeadSlot.cx * W;
      const cy = activeHeadSlot.cy * H;
      const baseRadius = activeHeadSlot.r * W * headScale;
      const rx = baseRadius * 1.05;
      const ry = baseRadius * 1.18; // Tall portrait oval so full hair on top stays inside

      if (faceMode === 'camera' && selfieImg) {
        const isCutout = useSmartClear && Boolean(clearedSelfieDataUrl);

        if (isCutout) {
          // Transparent head & hair outline cutout placed directly above collar with NO oval box
          const boxW = rx * 2.28;
          const boxH = ry * 2.32;
          const imgAspect = selfieImg.width / Math.max(1, selfieImg.height);
          let dw = boxW;
          let dh = dw / imgAspect;
          if (dh > boxH) {
            dh = boxH;
            dw = dh * imgAspect;
          }
          // Anchor bottom of cutout chin cleanly at the collar (cy + ry)
          const drawY = cy + ry - dh;
          ctx.drawImage(selfieImg, cx - dw / 2, drawY, dw, dh);
        } else {
          ctx.save();
          ctx.beginPath();
          ctx.ellipse(cx, cy, rx, ry, 0, 0, Math.PI * 2);
          ctx.closePath();
          ctx.clip();

          const boxW = rx * 2;
          const boxH = ry * 2;
          const imgAspect = selfieImg.width / Math.max(1, selfieImg.height);
          const boxAspect = boxW / boxH;
          let dw = boxW;
          let dh = boxH;
          if (imgAspect > boxAspect) {
            dw = boxH * imgAspect;
          } else {
            dh = boxW / imgAspect;
          }
          // Bias vertical alignment slightly toward the top so hair isn't cropped off
          const drawY = cy - ry - (dh - boxH) * 0.2;
          ctx.drawImage(selfieImg, cx - dw / 2, drawY, dw, dh);
          ctx.restore();

          // Crisp comic ink ring around the student's selfie portrait
          ctx.save();
          ctx.strokeStyle = '#18181b';
          ctx.lineWidth = 3;
          ctx.beginPath();
          ctx.ellipse(cx, cy, rx, ry, 0, 0, Math.PI * 2);
          ctx.stroke();
          ctx.restore();
        }
      } else if (faceMode === 'draw' && drawCanvasRef.current) {
        // Draw the transparent drawing pad (head + hair + expression) directly above the collar
        ctx.drawImage(
          drawCanvasRef.current,
          cx - rx * 1.25,
          cy - ry * 1.25,
          rx * 2.5,
          ry * 2.5
        );
      }

      // 3. Draw crisp comic speech bubble only (pointing to student if they speak, or off-panel left if another speaks)
      const bubbleX = 28;
      const bubbleY = 36;
      const bubbleW = 412;
      const isStudentSpeaking = scenario.speaker === 'student';
      const bubbleH = isStudentSpeaking ? 136 : 162;

      ctx.save();
      ctx.fillStyle = '#ffffff';
      ctx.strokeStyle = '#18181b';
      ctx.lineWidth = 3.5;

      // Subtle comic shadow under speech bubble
      ctx.save();
      ctx.fillStyle = 'rgba(24, 24, 27, 0.12)';
      ctx.beginPath();
      ctx.roundRect(bubbleX + 5, bubbleY + 5, bubbleW, bubbleH, 20);
      ctx.fill();
      ctx.restore();

      ctx.beginPath();
      ctx.roundRect(bubbleX, bubbleY, bubbleW, bubbleH, 20);
      ctx.fill();
      ctx.stroke();

      if (isStudentSpeaking) {
        // Tail pointing right from the speech bubble toward the student's head
        const tailTipX = Math.max(bubbleX + bubbleW + 24, cx - rx - 14);
        const tailTipY = cy + 6;
        const anchorTopY = Math.max(bubbleY + 26, Math.min(bubbleY + bubbleH - 42, tailTipY - 12));
        ctx.beginPath();
        ctx.moveTo(bubbleX + bubbleW - 2, anchorTopY);
        ctx.lineTo(tailTipX, tailTipY);
        ctx.lineTo(bubbleX + bubbleW - 2, anchorTopY + 24);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();

        ctx.fillStyle = '#ffffff';
        ctx.fillRect(bubbleX + bubbleW - 6, anchorTopY + 2, 8, 20);
      } else {
        // Off-panel speaker tail pointing down-left toward the edge of the comic panel
        const anchorX = bubbleX + 54;
        ctx.beginPath();
        ctx.moveTo(anchorX, bubbleY + bubbleH - 2);
        ctx.lineTo(bubbleX + 20, bubbleY + bubbleH + 34);
        ctx.lineTo(anchorX + 24, bubbleY + bubbleH - 2);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();

        ctx.fillStyle = '#ffffff';
        ctx.fillRect(anchorX + 2, bubbleY + bubbleH - 6, 20, 8);
      }

      // Speaker tag (for non-student lines) + bold comic speech text
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';

      let textStartY = bubbleY + bubbleH / 2;
      if (!isStudentSpeaking) {
        ctx.fillStyle = '#52525b';
        ctx.font = 'bold 22px "KG Primary Penmanship", "Plus Jakarta Sans", system-ui, sans-serif';
        ctx.fillText(scenario.speakerLabel.toUpperCase() + ':', bubbleX + bubbleW / 2, bubbleY + 32);
        textStartY = bubbleY + 98;
      }

      ctx.fillStyle = '#18181b';
      ctx.font = 'bold 34px "KG Primary Penmanship", "Plus Jakarta Sans", system-ui, sans-serif';
      const words = scenario.speechText.split(' ');
      const lines: string[] = [];
      let current = '';
      for (const w of words) {
        if ((current + ' ' + w).trim().length <= 24) {
          current = (current + ' ' + w).trim();
        } else {
          if (current) lines.push(current);
          current = w;
        }
      }
      if (current) lines.push(current);

      const lineHeight = 38;
      const firstLineY = textStartY - ((lines.length - 1) * lineHeight) / 2;
      lines.forEach((line, idx) => {
        ctx.fillText(line, bubbleX + bubbleW / 2, firstLineY + idx * lineHeight);
      });
      ctx.restore();

      onChangeCompositeImage(canvas.toDataURL('image/png'));
    };

    if (faceMode === 'camera' && activeSelfieUrl) {
      const img = new Image();
      img.onload = () => drawOverlayAndBubble(img);
      img.src = activeSelfieUrl;
    } else {
      drawOverlayAndBubble(null);
    }
  }, [
    activeHeadSlot.cx,
    activeHeadSlot.cy,
    activeHeadSlot.r,
    activeSelfieUrl,
    bgFailed,
    bgImage,
    clearedSelfieDataUrl,
    faceMode,
    gender,
    headScale,
    onChangeCompositeImage,
    scenario,
    useSmartClear,
  ]);

  useEffect(() => {
    renderCompositeScene();
  }, [renderCompositeScene]);

  const hasFaceContent =
    (faceMode === 'draw' && hasDrawn) ||
    (faceMode === 'camera' && Boolean(activeSelfieUrl));

  const canFinish = Boolean(feelingAnswer.trim()) && hasFaceContent;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4 border-b-2 border-yellow-300/60 pb-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-xs font-bold text-yellow-200">
            <span>Part D of 4</span>
            <span aria-hidden="true">·</span>
            <span className="font-mono tabular-nums">
              2 Marks (1 mark picture match + 1 mark feeling &amp; spelling · Teacher Checked)
            </span>
          </div>
          <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-white drop-shadow-sm">
            Read the sentence: How do you feel?
          </h2>
          <p className="text-sm text-yellow-100 font-medium">
            Choose Boy or Girl, draw your head &amp; face or take a selfie (with your hair!), and complete “I feel ________”.
          </p>
        </div>
      </div>

      {/* Big Boy / Girl Selector + Scenario Quote */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-stretch">
        <div className="lg:col-span-7 neon-inner-frame rounded-2xl p-5 flex flex-col justify-center">
          <span className="text-xs font-bold uppercase tracking-wide text-zinc-800">
            {scenario.speakerLabel}:
          </span>
          <p className="font-display text-xl sm:text-2xl font-extrabold text-zinc-950 mt-1">
            “{scenario.speechText}”
          </p>
        </div>

        <div className="lg:col-span-5 neon-inner-frame rounded-2xl p-3 flex items-center gap-3">
          <button
            type="button"
            onClick={() => onChangeGender('boy')}
            className={`flex-1 py-4 px-4 rounded-xl border-2 font-display text-lg font-extrabold flex items-center justify-center gap-2 transition-all cursor-pointer ${
              gender === 'boy'
                ? 'bg-blue-700 border-zinc-900 text-white shadow-sm'
                : 'bg-white border-zinc-900 text-zinc-900 hover:bg-blue-50'
            }`}
          >
            <UserRound className="w-5 h-5" />
            <span>I am a Boy</span>
          </button>

          <button
            type="button"
            onClick={() => onChangeGender('girl')}
            className={`flex-1 py-4 px-4 rounded-xl border-2 font-display text-lg font-extrabold flex items-center justify-center gap-2 transition-all cursor-pointer ${
              gender === 'girl'
                ? 'bg-rose-600 border-zinc-900 text-white shadow-sm'
                : 'bg-white border-zinc-900 text-zinc-900 hover:bg-rose-50'
            }`}
          >
            <UserRound className="w-5 h-5" />
            <span>I am a Girl</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left: Face Studio (Draw Head+Hair or Take Selfie) */}
        <div className="lg:col-span-5 neon-inner-frame rounded-2xl p-5 space-y-5">
          <div className="flex items-center gap-1 p-1 bg-zinc-900/15 border border-zinc-900/20 rounded-lg">
            <button
              type="button"
              onClick={() => {
                stopCamera();
                setFaceMode('draw');
              }}
              className={`flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 text-sm font-bold rounded-md cursor-pointer ${
                faceMode === 'draw'
                  ? 'bg-zinc-900 text-yellow-300 shadow-sm'
                  : 'text-zinc-900 hover:bg-white/50'
              }`}
            >
              <Paintbrush className="w-4 h-4" />
              <span>Draw Face &amp; Hair</span>
            </button>
            <button
              type="button"
              onClick={() => setFaceMode('camera')}
              className={`flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 text-sm font-bold rounded-md cursor-pointer ${
                faceMode === 'camera'
                  ? 'bg-zinc-900 text-yellow-300 shadow-sm'
                  : 'text-zinc-900 hover:bg-white/50'
              }`}
            >
              <Camera className="w-4 h-4" />
              <span>Take Selfie</span>
            </button>
          </div>

          {faceMode === 'draw' ? (
            <div className="space-y-3">
              <p className="text-xs font-semibold text-zinc-800 text-center">
                Draw your full head, hair, eyes, and expression!
              </p>
              <div className="relative w-full max-w-[280px] mx-auto aspect-square border-2 border-zinc-900 rounded-2xl bg-[#fffbeb] overflow-hidden">
                <svg
                  viewBox="0 0 280 280"
                  className="absolute inset-0 w-full h-full pointer-events-none"
                  aria-hidden="true"
                >
                  <circle
                    cx="140"
                    cy="145"
                    r="86"
                    fill="#ffffff"
                    stroke="#d4d4d8"
                    strokeWidth="2"
                    strokeDasharray="6 6"
                  />
                </svg>
                <canvas
                  ref={drawCanvasRef}
                  width={280}
                  height={280}
                  onPointerDown={handleDrawDown}
                  onPointerMove={handleDrawMove}
                  onPointerUp={handleDrawUp}
                  onPointerCancel={handleDrawUp}
                  className="relative z-10 w-full h-full touch-none cursor-crosshair"
                />
              </div>

              <div className="flex flex-wrap items-center justify-center gap-2">
                {PEN_COLORS.map((c) => (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => {
                      if (drawTool === 'eraser') setDrawTool('pen');
                      setPenColor(c.hex);
                    }}
                    aria-label={c.label}
                    className={`w-7 h-7 rounded-full border-2 cursor-pointer ${
                      drawTool !== 'eraser' && penColor === c.hex
                        ? 'border-blue-700 scale-110 ring-2 ring-white'
                        : 'border-zinc-900'
                    }`}
                    style={{ backgroundColor: c.hex }}
                  />
                ))}
              </div>

              <div className="flex flex-wrap items-center justify-center gap-1.5">
                <button
                  type="button"
                  onClick={() => setDrawTool('pen')}
                  className={`inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-bold rounded-lg border-2 border-zinc-900 cursor-pointer ${
                    drawTool === 'pen'
                      ? 'bg-zinc-900 text-yellow-300'
                      : 'bg-white text-zinc-900 hover:bg-amber-50'
                  }`}
                >
                  <Paintbrush className="w-3.5 h-3.5" />
                  <span>Pen</span>
                </button>

                <button
                  type="button"
                  onClick={() => setDrawTool('bucket')}
                  className={`inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-bold rounded-lg border-2 border-zinc-900 cursor-pointer ${
                    drawTool === 'bucket'
                      ? 'bg-zinc-900 text-yellow-300'
                      : 'bg-white text-zinc-900 hover:bg-amber-50'
                  }`}
                >
                  <PaintBucket className="w-3.5 h-3.5" />
                  <span>Bucket</span>
                </button>

                <button
                  type="button"
                  onClick={() => setDrawTool('eraser')}
                  className={`inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-bold rounded-lg border-2 border-zinc-900 cursor-pointer ${
                    drawTool === 'eraser'
                      ? 'bg-zinc-900 text-yellow-300'
                      : 'bg-white text-zinc-900 hover:bg-amber-50'
                  }`}
                >
                  <Eraser className="w-3.5 h-3.5" />
                  <span>Eraser</span>
                </button>

                <button
                  type="button"
                  onClick={handleUndoDraw}
                  disabled={!canUndo}
                  className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-bold rounded-lg border-2 border-zinc-900 bg-white text-zinc-900 hover:bg-amber-50 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                >
                  <Undo2 className="w-3.5 h-3.5" />
                  <span>Undo</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    clearDrawCanvas();
                    renderCompositeScene();
                  }}
                  className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-bold rounded-lg border-2 border-zinc-900 bg-white text-zinc-900 hover:bg-amber-50 cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Clear</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-3 text-center">
              {cameraActive ? (
                <div className="space-y-3">
                  <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    muted
                    className="w-full max-w-[260px] mx-auto aspect-square object-cover rounded-2xl border-2 border-zinc-900 scale-x-[-1]"
                  />
                  <button
                    type="button"
                    onClick={snapSelfie}
                    className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-bold text-white bg-zinc-900 rounded-xl hover:bg-zinc-800 cursor-pointer"
                  >
                    <Camera className="w-4 h-4" />
                    <span>Snap Photo</span>
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  {activeSelfieUrl ? (
                    <div
                      className={`w-56 h-60 mx-auto border-2 border-zinc-900 overflow-hidden flex items-center justify-center ${
                        useSmartClear && clearedSelfieDataUrl
                          ? 'rounded-2xl bg-[linear-gradient(45deg,#f4f4f5_25%,transparent_25%,transparent_75%,#f4f4f5_75%,#f4f4f5),linear-gradient(45deg,#f4f4f5_25%,white_25%,white_75%,#f4f4f5_75%,#f4f4f5)] bg-[length:16px_16px] bg-[position:0_0,8px_8px]'
                          : 'rounded-full bg-white'
                      }`}
                    >
                      <img
                        src={activeSelfieUrl}
                        alt="Captured student selfie including hair"
                        className={`w-full h-full ${
                          useSmartClear && clearedSelfieDataUrl
                            ? 'object-contain p-2'
                            : 'object-cover'
                        }`}
                      />
                    </div>
                  ) : (
                    <div className="w-56 h-60 mx-auto rounded-full bg-[#faf9f5] border-2 border-dashed border-zinc-700 flex flex-col items-center justify-center p-4 text-zinc-800 text-xs font-semibold">
                      <Camera className="w-8 h-8 mb-2 text-zinc-900" />
                      <span>Keep your whole head &amp; hair inside the frame!</span>
                    </div>
                  )}

                  {cameraError && (
                    <p className="text-xs text-red-900 font-bold">{cameraError}</p>
                  )}

                  {smartClearError && (
                    <p className="text-xs text-red-900 font-bold">{smartClearError}</p>
                  )}

                  <div className="flex flex-wrap items-center justify-center gap-2">
                    <button
                      type="button"
                      onClick={startCamera}
                      className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-zinc-900 rounded-lg hover:bg-zinc-800 cursor-pointer"
                    >
                      <Camera className="w-3.5 h-3.5" />
                      <span>{rawSelfieDataUrl ? 'Retake Selfie' : 'Open Camera'}</span>
                    </button>

                    <label className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-zinc-900 bg-white border-2 border-zinc-900 rounded-lg hover:bg-amber-50 cursor-pointer">
                      <Upload className="w-3.5 h-3.5" />
                      <span>Upload Photo</span>
                      <input
                        type="file"
                        accept="image/*"
                        capture="user"
                        onChange={handleFileUpload}
                        className="sr-only"
                      />
                    </label>
                  </div>

                  {rawSelfieDataUrl && (
                    <div className="flex items-center justify-center gap-2 text-xs font-bold">
                      <Sparkles className="w-3.5 h-3.5 text-fuchsia-600" />
                      <span className={isSmartClearing ? 'text-fuchsia-700' : 'text-emerald-700'}>
                        {isSmartClearing
                          ? 'Removing background…'
                          : clearedSelfieDataUrl
                          ? 'Background removed automatically'
                          : 'Background clearing…'}
                      </span>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Optional Head Size adjuster so student hair/face fits every photo */}
          <div className="pt-3 border-t-2 border-zinc-900/15 flex items-center justify-between gap-3">
            <label htmlFor="head-size-slider" className="text-xs font-bold text-zinc-900 whitespace-nowrap">
              Head Size: {Math.round(headScale * 100)}%
            </label>
            <input
              id="head-size-slider"
              type="range"
              min="0.8"
              max="1.35"
              step="0.05"
              value={headScale}
              onChange={(e) => setHeadScale(parseFloat(e.target.value))}
              className="w-full accent-blue-700 cursor-pointer"
            />
          </div>
        </div>

        {/* Right: Live Composite 1980s Comic Scene + Spelling Answer */}
        <div className="lg:col-span-7 space-y-5">
          <div className="neon-inner-frame rounded-2xl p-3 sm:p-4">
            <div className="text-xs font-bold text-zinc-900 mb-2 flex items-center justify-between">
              <span>Your Comic Picture Preview</span>
              <span>{gender === 'boy' ? 'Boy Uniform' : 'Girl Uniform'}</span>
            </div>
            <canvas
              ref={compositeCanvasRef}
              width={800}
              height={600}
              className="w-full h-auto rounded-xl border-2 border-zinc-900 bg-[#faf9f5]"
            />
            {compositeImageDataUrl && <span className="sr-only">Preview ready</span>}
          </div>

          <div className="neon-inner-frame rounded-2xl p-5 sm:p-6 space-y-4">
            <label htmlFor="part-d-feeling" className="block font-display text-xl font-bold text-zinc-900">
              Complete your answer:
            </label>

            <div className="flex flex-wrap items-center gap-3">
              <span className="font-display text-2xl font-bold text-zinc-900">I feel</span>
              <input
                id="part-d-feeling"
                type="text"
                value={feelingAnswer}
                onChange={(e) => onChangeFeelingAnswer(e.target.value)}
                placeholder="type feeling..."
                autoComplete="off"
                spellCheck={false}
                className="flex-1 min-w-[180px] px-4 py-2.5 text-xl font-display font-bold text-blue-700 bg-[#faf9f5] border-2 border-zinc-900 rounded-xl focus:border-blue-700"
              />
              <span className="font-display text-2xl font-bold text-zinc-900">.</span>
            </div>

            <p className="text-xs font-medium text-zinc-500">
              Type how you feel — no word bank, remember it yourself!
            </p>

            <div className="pt-3 border-t border-zinc-200 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2 text-xs text-zinc-500">
                {hasFaceContent ? (
                  <>
                    <CheckCircle2 className="w-4 h-4 text-emerald-700" />
                    <span className="text-emerald-800 font-medium">Head &amp; face added to comic</span>
                  </>
                ) : (
                  <span>Please draw your head &amp; face or take a selfie first</span>
                )}
              </div>

              <button
                type="button"
                onClick={onCompleteQuiz}
                disabled={!canFinish}
                className="inline-flex items-center gap-2 px-6 py-3 text-sm font-semibold text-white bg-blue-700 rounded-xl hover:bg-blue-800 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
              >
                <span>Finish &amp; Review Quiz</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
