import { useCallback, useEffect, useRef, useState } from 'react';

// MediaRecorder wrapper. Press-and-hold style — start() / stop()
// are called explicitly by the UI.
export function useVoiceRecorder() {
  const recorderRef = useRef(null);
  const chunksRef = useRef([]);
  const startTimeRef = useRef(0);
  const streamRef = useRef(null);

  const [recording, setRecording] = useState(false);
  const [supported, setSupported] = useState(true);
  const [error, setError] = useState(null);
  const [elapsed, setElapsed] = useState(0);
  const [lastBlob, setLastBlob] = useState(null);
  const [lastDuration, setLastDuration] = useState(0);
  const tickRef = useRef(null);

  useEffect(() => {
    if (typeof navigator === 'undefined' || !navigator.mediaDevices?.getUserMedia) {
      setSupported(false);
    }
    return () => {
      if (tickRef.current) clearInterval(tickRef.current);
      streamRef.current?.getTracks().forEach((t) => t.stop());
    };
  }, []);

  const start = useCallback(async () => {
    setError(null);
    setLastBlob(null);
    setElapsed(0);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      const mime = MediaRecorder.isTypeSupported('audio/webm;codecs=opus')
        ? 'audio/webm;codecs=opus'
        : MediaRecorder.isTypeSupported('audio/webm')
        ? 'audio/webm'
        : 'audio/mp4';

      const rec = new MediaRecorder(stream, { mimeType: mime });
      chunksRef.current = [];
      rec.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data);
      };
      rec.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: mime });
        setLastBlob(blob);
        setLastDuration((Date.now() - startTimeRef.current) / 1000);
        streamRef.current?.getTracks().forEach((t) => t.stop());
        streamRef.current = null;
      };
      recorderRef.current = rec;
      startTimeRef.current = Date.now();
      rec.start();
      setRecording(true);

      tickRef.current = setInterval(() => {
        setElapsed((Date.now() - startTimeRef.current) / 1000);
      }, 100);
    } catch (e) {
      setError(e.message || 'Microphone access denied');
      setRecording(false);
    }
  }, []);

  const stop = useCallback(() => {
    if (recorderRef.current && recorderRef.current.state !== 'inactive') {
      recorderRef.current.stop();
    }
    setRecording(false);
    if (tickRef.current) {
      clearInterval(tickRef.current);
      tickRef.current = null;
    }
  }, []);

  const reset = useCallback(() => {
    setLastBlob(null);
    setLastDuration(0);
    setElapsed(0);
  }, []);

  return { start, stop, reset, recording, supported, error, elapsed, lastBlob, lastDuration };
}
