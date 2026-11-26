import { initializeApp, getApps, getApp } from 'firebase/app';
import {
  getAuth,
  signInWithPopup,
  GoogleAuthProvider,
  onAuthStateChanged,
  User,
} from 'firebase/auth';
import firebaseConfig from '../../firebase-applet-config.json';

const app = getApps().length ? getApp() : initializeApp(firebaseConfig);
const auth = getAuth(app);

const provider = new GoogleAuthProvider();
provider.addScope('https://www.googleapis.com/auth/drive.file');

let isSigningIn = false;
let cachedAccessToken: string | null = null;

export const initDriveAuth = (
  onAuthSuccess?: (user: User, token: string) => void,
  onAuthFailure?: () => void
) => {
  return onAuthStateChanged(auth, (user: User | null) => {
    if (user && cachedAccessToken) {
      onAuthSuccess?.(user, cachedAccessToken);
    } else if (!isSigningIn) {
      if (!user) {
        cachedAccessToken = null;
      }
      onAuthFailure?.();
    }
  });
};

export const signInToGoogleDrive = async (): Promise<{
  user: User;
  accessToken: string;
}> => {
  try {
    isSigningIn = true;
    const result = await signInWithPopup(auth, provider);
    const credential = GoogleAuthProvider.credentialFromResult(result);
    if (!credential?.accessToken) {
      throw new Error('Could not obtain Google Drive access token.');
    }
    cachedAccessToken = credential.accessToken;
    return { user: result.user, accessToken: cachedAccessToken };
  } finally {
    isSigningIn = false;
  }
};

export const getDriveAccessToken = (): string | null => cachedAccessToken;

export const getCurrentDriveUser = (): User | null => auth.currentUser;

export const signOutDrive = async (): Promise<void> => {
  await auth.signOut();
  cachedAccessToken = null;
};

export interface DriveUploadResult {
  id: string;
  name: string;
  webViewLink?: string;
}

export async function uploadQuizReportToDrive(params: {
  fileName: string;
  pdfBase64: string;
  accessToken: string;
}): Promise<DriveUploadResult> {
  const { fileName, pdfBase64, accessToken } = params;

  const metadata = {
    name: fileName,
    mimeType: 'application/pdf',
  };

  const binary = Uint8Array.from(atob(pdfBase64), (c) => c.charCodeAt(0));
  const boundary = 'mr_longnose_quiz_boundary_2026';
  const encoder = new TextEncoder();
  const head = encoder.encode(
    `--${boundary}\r\n` +
      `Content-Type: application/json; charset=UTF-8\r\n\r\n` +
      `${JSON.stringify(metadata)}\r\n` +
      `--${boundary}\r\n` +
      `Content-Type: application/pdf\r\n\r\n`
  );
  const tail = encoder.encode(`\r\n--${boundary}--`);
  const body = new Uint8Array(head.length + binary.length + tail.length);
  body.set(head, 0);
  body.set(binary, head.length);
  body.set(tail, head.length + binary.length);

  const response = await fetch(
    'https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart&fields=id,name,webViewLink',
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': `multipart/related; boundary=${boundary}`,
      },
      body,
    }
  );

  if (!response.ok) {
    const errorText = await response.text().catch(() => '');
    throw new Error(
      `Google Drive upload failed (${response.status}). ${errorText || 'Please sign in again.'}`
    );
  }

  return (await response.json()) as DriveUploadResult;
}
