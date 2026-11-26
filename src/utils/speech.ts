export function speakText(
  text: string,
  options?: {
    rate?: number;
    onEnd?: () => void;
    onError?: () => void;
  }
): boolean {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
    options?.onError?.();
    return false;
  }

  try {
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'en-GB';
    utterance.rate = options?.rate ?? 0.94;
    utterance.pitch = 1.02;

    const voices = window.speechSynthesis.getVoices();
    const preferredVoice =
      voices.find((v) => v.lang.startsWith('en-GB')) ||
      voices.find((v) => v.lang.startsWith('en-'));
    if (preferredVoice) {
      utterance.voice = preferredVoice;
    }

    utterance.onend = () => options?.onEnd?.();
    utterance.onerror = () => options?.onError?.();
    window.speechSynthesis.speak(utterance);
    return true;
  } catch {
    options?.onError?.();
    return false;
  }
}

export function stopSpeaking(): void {
  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    window.speechSynthesis.cancel();
  }
}
