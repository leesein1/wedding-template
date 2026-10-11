/*
  HeaderSection: 최상단 음악 토글 버튼
*/
import { useCallback, useEffect, useRef, useState } from "react";
import { Pause, Play } from "lucide-react";

type HeaderSectionProps = { debugClass?: string };

export default function HeaderSection({ debugClass = "" }: HeaderSectionProps) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const buttonRef = useRef<HTMLButtonElement | null>(null);
  const wantsPlaybackRef = useRef(true);
  const requestRef = useRef(0);
  const [isPlaying, setIsPlaying] = useState(false);

  const playAudio = useCallback(() => {
    const audio = audioRef.current;
    if (!audio || !wantsPlaybackRef.current) return;
    const request = ++requestRef.current;
    if (audio.error) audio.load();
    // Call directly in the gesture handler to preserve mobile user activation.
    void audio.play().catch((error: unknown) => {
      if (request !== requestRef.current) return;
      setIsPlaying(false);
      if (error instanceof DOMException && error.name === "NotAllowedError") return;
      if (error instanceof DOMException && error.name === "AbortError") return;
      console.warn("Background music playback failed", error);
    });
  }, []);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    const requests = requestRef;

    const tryPlay = () => {
      if (wantsPlaybackRef.current && audio.paused) {
        playAudio();
      }
    };
    const onInteraction = (event: Event) => {
      if (event.target instanceof Node && buttonRef.current?.contains(event.target)) return;
      tryPlay();
    };

    const interactionEvents = [
      "mousedown",
      "pointerdown",
      "pointerup",
      "touchend",
      "click",
      "keydown",
    ];

    tryPlay();
    audio.addEventListener("canplay", tryPlay);
    const onVisible = () => {
      if (document.visibilityState === "visible") tryPlay();
    };
    document.addEventListener("visibilitychange", onVisible);
    window.addEventListener("pageshow", tryPlay);
    for (const eventName of interactionEvents) {
      document.addEventListener(eventName, onInteraction, {
        capture: true,
        passive: true,
      });
    }

    return () => {
      audio.removeEventListener("canplay", tryPlay);
      document.removeEventListener("visibilitychange", onVisible);
      window.removeEventListener("pageshow", tryPlay);
      for (const eventName of interactionEvents) {
        document.removeEventListener(eventName, onInteraction, true);
      }
      ++requests.current;
      audio.pause();
    };
  }, [playAudio]);

  const toggleAudio = () => {
    const a = audioRef.current;
    if (!a) return;

    if (!a.paused) {
      wantsPlaybackRef.current = false;
      ++requestRef.current;
      a.pause();
    } else {
      wantsPlaybackRef.current = true;
      playAudio();
    }
  };

  return (
    <div className={debugClass}>
      <audio
        ref={audioRef}
        src={`${import.meta.env.BASE_URL}music/wedding.mp3`}
        loop
        preload="auto"
        onPlaying={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
        onError={() => setIsPlaying(false)}
      />

      <button
        ref={buttonRef}
        type="button"
        onClick={toggleAudio}
        className="absolute right-4 top-4 z-50 flex h-10 w-10 items-center justify-center rounded-full bg-black/15 text-white transition-colors hover:bg-black/25 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
        aria-label={isPlaying ? "배경음악 일시정지" : "배경음악 재생"}
        aria-pressed={isPlaying}
        title={isPlaying ? "배경음악 일시정지" : "배경음악 재생"}
      >
        {isPlaying ? (
          <Pause size={20} aria-hidden="true" />
        ) : (
          <Play size={20} aria-hidden="true" />
        )}
      </button>
    </div>
  );
}
