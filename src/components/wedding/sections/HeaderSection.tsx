import { useCallback, useEffect, useRef, useState } from "react";
import { Play } from "lucide-react";

type HeaderSectionProps = { debugClass?: string };

export default function HeaderSection({ debugClass = "" }: HeaderSectionProps) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const buttonRef = useRef<HTMLButtonElement | null>(null);
  const wantsPlaybackRef = useRef(true);
  const requestRef = useRef(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isStarting, setIsStarting] = useState(false);

  const playAudio = useCallback(() => {
    const audio = audioRef.current;
    if (!audio || !wantsPlaybackRef.current) return;

    audio.volume = 0.6;
    const request = ++requestRef.current;

    if (audio.error) audio.load();
    setIsStarting(true);

    void audio
      .play()
      .then(() => {
        if (request === requestRef.current) setIsStarting(false);
      })
      .catch((error: unknown) => {
        if (request !== requestRef.current) return;

        setIsPlaying(false);
        setIsStarting(false);

        if (error instanceof DOMException && error.name === "NotAllowedError") return;
        if (error instanceof DOMException && error.name === "AbortError") return;

        console.warn("Background music playback failed", error);
      });
  }, []);

  useEffect(() => {
    const audio = document.getElementById("wedding-audio");
    if (!(audio instanceof HTMLAudioElement)) return;
    audioRef.current = audio;

    const requests = requestRef;

    const onPlaying = () => {
      setIsPlaying(true);
      setIsStarting(false);
    };
    const onStopped = () => {
      setIsPlaying(false);
      setIsStarting(false);
    };
    audio.addEventListener("playing", onPlaying);
    audio.addEventListener("pause", onStopped);
    audio.addEventListener("error", onStopped);
    if (!audio.paused && audio.readyState >= HTMLMediaElement.HAVE_FUTURE_DATA) {
      onPlaying();
    }

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
      audio.removeEventListener("playing", onPlaying);
      audio.removeEventListener("pause", onStopped);
      audio.removeEventListener("error", onStopped);
      audio.removeEventListener("canplay", tryPlay);
      document.removeEventListener("visibilitychange", onVisible);
      window.removeEventListener("pageshow", tryPlay);

      for (const eventName of interactionEvents) {
        document.removeEventListener(eventName, onInteraction, true);
      }

      ++requests.current;
      audio.pause();
      audioRef.current = null;
    };
  }, [playAudio]);

  const toggleAudio = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (!audio.paused) {
      wantsPlaybackRef.current = false;
      ++requestRef.current;
      audio.pause();
      audio.currentTime = 0;
      setIsStarting(false);
    } else {
      wantsPlaybackRef.current = true;
      playAudio();
    }
  };

  const isActive = isPlaying || isStarting;

  return (
    <div className={debugClass}>
      <button
        ref={buttonRef}
        type="button"
        onClick={toggleAudio}
        className="fixed right-4 top-4 z-50 flex h-6 w-8 items-center justify-center rounded-full bg-neutral-500/45 text-white backdrop-blur-sm transition-colors hover:bg-neutral-500/60 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neutral-500 min-[431px]:right-[max(1rem,calc((100vw-430px)/2+1rem))]"
        aria-label={isActive ? "배경음악 정지" : "배경음악 재생"}
        aria-pressed={isActive}
        aria-busy={isStarting}
        title={isActive ? "배경음악 정지" : "배경음악 재생"}
      >
        {isPlaying ? (
          <img
            src={`${import.meta.env.BASE_URL}music/equalizer.svg`}
            width={16}
            height={16}
            className="pointer-events-none h-4 w-4 invert"
            alt=""
            aria-hidden="true"
          />
        ) : (
          <Play size={11} fill="currentColor" aria-hidden="true" />
        )}
      </button>
    </div>
  );
}
