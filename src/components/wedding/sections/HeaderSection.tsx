import { useRef, useState } from "react";

type HeaderSectionProps = { debugClass?: string };

export default function HeaderSection({ debugClass = "" }: HeaderSectionProps) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(true);

  const toggleAudio = () => {
    const a = audioRef.current;
    if (!a) return;

    if (isPlaying) {
      a.pause();
      setIsPlaying(false);
    } else {
      a.play();
      setIsPlaying(true);
    }
  };

  return (
    <>
      <audio ref={audioRef} src="/music/wedding.mp3" loop />

      <div
        onClick={toggleAudio}
        className="absolute top-4 right-4 z-50 cursor-pointer select-none"
      >
        {isPlaying ? (
          <div className="flex items-end gap-[3px] h-6 w-6">
            <span className="bar w-[3px]" />
            <span className="bar delay-1 w-[3px]" />
            <span className="bar delay-2 w-[3px]" />
          </div>
        ) : (
          <svg
            viewBox="0 0 24 24"
            className="w-8 h-8"
            fill="white"
          >
            <path d="M8 5v14l11-7z" />
          </svg>
        )}
      </div>
    </>
  );
}
