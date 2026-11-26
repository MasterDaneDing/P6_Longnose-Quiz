import { FilesetResolver, ImageSegmenter } from '@mediapipe/tasks-vision';

let segmenterPromise: Promise<ImageSegmenter> | null = null;

async function getSegmenter(): Promise<ImageSegmenter> {
  if (segmenterPromise) return segmenterPromise;

  segmenterPromise = (async () => {
    const vision = await FilesetResolver.forVisionTasks('./wasm');
    try {
      return await ImageSegmenter.createFromOptions(vision, {
        baseOptions: {
          modelAssetPath: './models/selfie_multiclass_256x256.tflite',
          delegate: 'GPU',
        },
        runningMode: 'IMAGE',
        outputCategoryMask: false,
        outputConfidenceMasks: true,
      });
    } catch {
      return await ImageSegmenter.createFromOptions(vision, {
        baseOptions: {
          modelAssetPath: './models/selfie_multiclass_256x256.tflite',
          delegate: 'CPU',
        },
        runningMode: 'IMAGE',
        outputCategoryMask: false,
        outputConfidenceMasks: true,
      });
    }
  })();

  try {
    return await segmenterPromise;
  } catch (err) {
    segmenterPromise = null;
    throw err;
  }
}

function loadImageElement(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error('Could not load selfie image'));
    img.src = src;
  });
}

/**
 * Fallback edge-flood + oval feathering if WASM segmenter cannot load.
 */
function fallbackBorderClear(sourceCanvas: HTMLCanvasElement): string {
  const w = sourceCanvas.width;
  const h = sourceCanvas.height;
  const ctx = sourceCanvas.getContext('2d');
  if (!ctx) return sourceCanvas.toDataURL('image/png');

  const imgData = ctx.getImageData(0, 0, w, h);
  const data = imgData.data;

  // Estimate background color from top/side border pixels
  let rSum = 0;
  let gSum = 0;
  let bSum = 0;
  let count = 0;
  for (let x = 0; x < w; x += 4) {
    const idx = x * 4;
    rSum += data[idx];
    gSum += data[idx + 1];
    bSum += data[idx + 2];
    count++;
  }
  const bgR = rSum / Math.max(1, count);
  const bgG = gSum / Math.max(1, count);
  const bgB = bSum / Math.max(1, count);

  const visited = new Uint8Array(w * h);
  const queue = new Int32Array(w * h);
  let head = 0;
  let tail = 0;

  const isBgLike = (p: number) => {
    const i = p * 4;
    const dr = data[i] - bgR;
    const dg = data[i + 1] - bgG;
    const db = data[i + 2] - bgB;
    return Math.sqrt(dr * dr + dg * dg + db * db) < 48;
  };

  for (let x = 0; x < w; x++) {
    queue[tail++] = x;
    visited[x] = 1;
  }
  for (let y = 1; y < h; y++) {
    const left = y * w;
    const right = y * w + (w - 1);
    queue[tail++] = left;
    visited[left] = 1;
    queue[tail++] = right;
    visited[right] = 1;
  }

  while (head < tail) {
    const p = queue[head++];
    if (!isBgLike(p)) continue;
    data[p * 4 + 3] = 0;

    const x = p % w;
    const y = (p - x) / w;
    if (x > 0 && !visited[p - 1]) {
      visited[p - 1] = 1;
      queue[tail++] = p - 1;
    }
    if (x < w - 1 && !visited[p + 1]) {
      visited[p + 1] = 1;
      queue[tail++] = p + 1;
    }
    if (y > 0 && !visited[p - w]) {
      visited[p - w] = 1;
      queue[tail++] = p - w;
    }
    if (y < h - 1 && !visited[p + w]) {
      visited[p + w] = 1;
      queue[tail++] = p + w;
    }
  }

  ctx.putImageData(imgData, 0, 0);
  return sourceCanvas.toDataURL('image/png');
}

/**
 * Uses MediaPipe Multiclass Selfie Segmenter (0=bg, 1=hair, 2=body-skin, 3=face-skin, 4=clothes, 5=others)
 * to cleanly remove the background and clothes, preserving only the student's head, face, hair, and glasses/hat.
 */
export async function smartClearSelfieBackground(dataUrl: string): Promise<string> {
  const img = await loadImageElement(dataUrl);

  // Normalize size for fast, crisp segmentation
  const maxDim = 512;
  const scale = Math.min(1, maxDim / Math.max(img.width, img.height));
  const w = Math.max(64, Math.round(img.width * scale));
  const h = Math.max(64, Math.round(img.height * scale));

  const workCanvas = document.createElement('canvas');
  workCanvas.width = w;
  workCanvas.height = h;
  const workCtx = workCanvas.getContext('2d');
  if (!workCtx) return dataUrl;
  workCtx.drawImage(img, 0, 0, w, h);

  let segmenter: ImageSegmenter;
  try {
    segmenter = await getSegmenter();
  } catch {
    return fallbackBorderClear(workCanvas);
  }

  let result;
  try {
    result = segmenter.segment(workCanvas);
  } catch {
    return fallbackBorderClear(workCanvas);
  }

  try {
    const masks = result.confidenceMasks;
    if (!masks || masks.length < 4) {
      return fallbackBorderClear(workCanvas);
    }

    // Class indices in selfie_multiclass_256x256:
    // 0: background, 1: hair, 2: body-skin (neck/arms), 3: face-skin, 4: clothes, 5: others
    const hairMask = masks[1].getAsFloat32Array();
    const bodySkinMask = masks[2]?.getAsFloat32Array();
    const faceMask = masks[3].getAsFloat32Array();
    const othersMask = masks[5]?.getAsFloat32Array();

    // Find lowest y coordinate where face-skin is confident so we only keep a short upper-neck transition
    let maxFaceY = 0;
    for (let y = 0; y < h; y++) {
      for (let x = 0; x < w; x++) {
        const idx = y * w + x;
        if (faceMask[idx] > 0.45 && y > maxFaceY) {
          maxFaceY = y;
        }
      }
    }
    const neckCutoffY = maxFaceY > 0 ? maxFaceY + Math.round(h * 0.05) : h;

    const imgData = workCtx.getImageData(0, 0, w, h);
    const pixels = imgData.data;

    let minX = w;
    let minY = h;
    let maxX = 0;
    let maxY = 0;

    for (let y = 0; y < h; y++) {
      for (let x = 0; x < w; x++) {
        const idx = y * w + x;
        const hairProb = hairMask[idx] || 0;
        const faceProb = faceMask[idx] || 0;
        const otherProb = othersMask ? othersMask[idx] || 0 : 0;
        const neckProb =
          bodySkinMask && y <= neckCutoffY ? (bodySkinMask[idx] || 0) * 0.9 : 0;

        // Combined probability of belonging to head + hair + glasses/hat
        const rawKeep = Math.min(1, hairProb + faceProb + otherProb + neckProb);

        // Smooth step threshold for crisp edges without halo
        let alpha = 0;
        if (rawKeep > 0.28) {
          alpha = Math.min(1, (rawKeep - 0.28) / 0.34);
        }

        const p = idx * 4;
        pixels[p + 3] = Math.round(alpha * 255);

        if (alpha > 0.15) {
          if (x < minX) minX = x;
          if (x > maxX) maxX = x;
          if (y < minY) minY = y;
          if (y > maxY) maxY = y;
        }
      }
    }

    workCtx.putImageData(imgData, 0, 0);

    // If segmentation detected nothing substantial, fall back cleanly
    if (maxX <= minX || maxY <= minY) {
      return dataUrl;
    }

    // Tight crop around the segmented head & hair with gentle padding
    const padX = Math.round((maxX - minX) * 0.08);
    const padY = Math.round((maxY - minY) * 0.08);
    const sx = Math.max(0, minX - padX);
    const sy = Math.max(0, minY - padY);
    const sw = Math.min(w - sx, maxX - minX + padX * 2);
    const sh = Math.min(h - sy, maxY - minY + padY * 2);

    const outCanvas = document.createElement('canvas');
    outCanvas.width = sw;
    outCanvas.height = sh;
    const outCtx = outCanvas.getContext('2d');
    if (!outCtx) return workCanvas.toDataURL('image/png');
    outCtx.drawImage(workCanvas, sx, sy, sw, sh, 0, 0, sw, sh);

    return outCanvas.toDataURL('image/png');
  } finally {
    result.close();
  }
}
