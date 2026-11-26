// Uploads quiz results to Google Drive via a Google Apps Script Web App.
// No student Google login required — the script runs as its owner.

export interface AppsScriptUploadResult {
  fileId: string;
  fileName: string;
}

// Set this to your deployed Apps Script Web App URL (ends in /exec).
// Leave blank to fall back to the signed-in Drive flow.
export const APPS_SCRIPT_URL =
  'https://script.google.com/macros/s/AKfycbzTsVE1p9cObYk16dtA-rRF88ZoufQ5a4IqP1QTYjsCOL7XG3psFJbx2CxEJm71Ihz0/exec';

export function isAppsScriptConfigured(): boolean {
  return Boolean(APPS_SCRIPT_URL);
}

export async function uploadReportToAppsScript(params: {
  fileName: string;
  htmlContent: string;
}): Promise<AppsScriptUploadResult> {
  if (!APPS_SCRIPT_URL) {
    throw new Error('Apps Script upload URL is not configured.');
  }

  // Apps Script web apps accept text/plain POSTs without a CORS preflight.
  const res = await fetch(APPS_SCRIPT_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'text/plain;charset=utf-8' },
    body: JSON.stringify({
      filename: params.fileName,
      // The script expects pdfBase64; send base64 of the HTML so it works
      // without changing the provided script.
      pdfBase64: btoa(unescape(encodeURIComponent(params.htmlContent))),
    }),
  });

  if (!res.ok) {
    throw new Error(`Upload failed (${res.status}).`);
  }

  const data = (await res.json().catch(() => null)) as
    | { status?: string; fileId?: string; message?: string }
    | null;

  if (!data || data.status !== 'success') {
    throw new Error(data?.message || 'Apps Script did not confirm the upload.');
  }

  return { fileId: data.fileId || '', fileName: params.fileName };
}
