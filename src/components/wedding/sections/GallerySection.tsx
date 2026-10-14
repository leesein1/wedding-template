import { useRef, useState } from "react";
import { ChevronLeft, ChevronRight, Pause, Play } from "lucide-react";
import type { Swiper as SwiperInstance } from "swiper";
import { A11y, Autoplay, Keyboard } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import {
  weddingPhotos as images,
  prioritizeWeddingPhoto,
  useDownloadedWeddingPhotos,
} from "@/components/wedding/photos";
const thumbnailsPerView = 5;

type GallerySectionProps = { debugClass?: string };

export default function GallerySection({ debugClass = "" }: GallerySectionProps) {
  const downloaded = useDownloadedWeddingPhotos();
  const swiperRef = useRef<SwiperInstance | null>(null);
  const thumbnailsRef = useRef<SwiperInstance | null>(null);
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(true);
  const [thumbnailEdges, setThumbnailEdges] = useState({ start: true, end: false });

  const updateThumbnailEdges = (swiper: SwiperInstance) => {
    setThumbnailEdges({ start: swiper.isBeginning, end: swiper.isEnd });
  };

  const syncSelection = (swiper: SwiperInstance) => {
    const selected = swiper.realIndex;
    prioritizeWeddingPhoto(selected);
    setIndex(selected);
    const thumbnails = thumbnailsRef.current;
    if (!thumbnails) return;
    const firstVisible = thumbnails.activeIndex;
    if (selected < firstVisible) thumbnails.slideTo(selected);
    else if (selected >= firstVisible + thumbnailsPerView) {
      thumbnails.slideTo(selected - thumbnailsPerView + 1);
    }
  };

  const toggleAutoplay = () => {
    const swiper = swiperRef.current;
    if (!swiper) return;
    if (swiper.autoplay.running) swiper.autoplay.stop();
    else swiper.autoplay.start();
  };

  return (
    <section className={`py-14 bg-white ${debugClass}`}>
      <div className="max-w-[420px] mx-auto relative">
        <div className="text-center">
          <div className="text-[28px] tracking-[0.18em] text-[#1a1a1a]">
            <span style={{ fontFamily: "'Elsie', serif" }}>GALLERY</span>
          </div>
        </div>

        <button
          type="button"
          className="absolute top-0 right-4 flex h-9 w-9 items-center justify-center text-[#444] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#9a9a67]"
          onClick={toggleAutoplay}
          aria-label={paused ? "play" : "pause"}
          title={paused ? "사진 자동 넘김 재생" : "사진 자동 넘김 일시정지"}
        >
          {paused ? <Play size={20} fill="currentColor" /> : <Pause size={20} fill="currentColor" />}
        </button>

        <div className="mt-10 relative">
          <Swiper
            className="wedding-gallery select-none"
            modules={[A11y, Autoplay, Keyboard]}
            onSwiper={(swiper) => { swiperRef.current = swiper; }}
            onSlideChange={syncSelection}
            onAutoplayStart={() => setPaused(false)}
            onAutoplayStop={() => setPaused(true)}
            slidesPerView={1}
            spaceBetween={0}
            loop
            speed={450}
            threshold={8}
            touchAngle={45}
            longSwipesRatio={0.2}
            touchStartPreventDefault={false}
            grabCursor
            keyboard={{ enabled: true, onlyInViewport: true }}
            autoplay={{ enabled: false, delay: 5000, disableOnInteraction: false }}
            a11y={{ containerMessage: "웨딩 사진 갤러리" }}
            style={{ touchAction: "pan-y pinch-zoom" }}
          >
            {images.map((photo, i) => (
              <SwiperSlide key={photo.full}>
                <div className="aspect-[3/4] overflow-hidden bg-[#f5f5f5]">
                  <img
                    src={downloaded.has(photo.full) && i === index ? photo.full : photo.preview}
                    alt={`웨딩 사진 ${i + 1}`}
                    loading="lazy"
                    decoding="async"
                    className="w-full h-full object-cover"
                    draggable={false}
                  />
                </div>
              </SwiperSlide>
            ))}
          </Swiper>

          <button
            type="button"
            onClick={() => swiperRef.current?.slidePrev()}
            aria-label="이전 사진"
            title="이전 사진"
            className="absolute left-1 top-1/2 -translate-y-1/2 z-20 flex h-11 w-11 items-center justify-center text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-white"
          >
            <ChevronLeft size={28} strokeWidth={2.2} />
          </button>
          <button
            type="button"
            onClick={() => swiperRef.current?.slideNext()}
            aria-label="다음 사진"
            title="다음 사진"
            className="absolute right-1 top-1/2 -translate-y-1/2 z-20 flex h-11 w-11 items-center justify-center text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-white"
          >
            <ChevronRight size={28} strokeWidth={2.2} />
          </button>
        </div>

        <div className="relative mt-3">
          <Swiper
            className="wedding-gallery-thumbnails select-none"
            modules={[A11y]}
            onSwiper={(swiper) => {
              thumbnailsRef.current = swiper;
              updateThumbnailEdges(swiper);
            }}
            onSlideChange={updateThumbnailEdges}
            onResize={updateThumbnailEdges}
            onReachBeginning={updateThumbnailEdges}
            onReachEnd={updateThumbnailEdges}
            slidesPerView={thumbnailsPerView}
            spaceBetween={4}
            speed={350}
            threshold={8}
            watchSlidesProgress
            a11y={{ containerMessage: "웨딩 사진 썸네일 목록" }}
            style={{ touchAction: "pan-y pinch-zoom" }}
          >
            {images.map((photo, i) => (
              <SwiperSlide key={photo.full}>
                <button
                  type="button"
                  onClick={() => swiperRef.current?.slideToLoop(i)}
                  className={`relative block aspect-square w-full overflow-hidden transition-opacity focus-visible:outline-none ${i === index ? "opacity-100" : "opacity-60 hover:opacity-100 focus-visible:opacity-100"}`}
                  aria-label={`웨딩 사진 ${i + 1} 선택`}
                  aria-current={i === index ? "true" : undefined}
                >
                  <img
                    src={photo.thumbnail}
                    alt=""
                    loading="lazy"
                    decoding="async"
                    draggable={false}
                    className="h-full w-full object-cover"
                  />
                  <span className={`pointer-events-none absolute inset-0 border-2 ${i === index ? "border-[#9a9a67]" : "border-transparent"} [button:focus-visible_&]:border-[#9a9a67]`} />
                </button>
              </SwiperSlide>
            ))}
          </Swiper>
          {images.length > thumbnailsPerView && (
            <>
            <button
              type="button"
              onClick={() => thumbnailsRef.current?.slideTo(Math.max(0, (thumbnailsRef.current?.activeIndex ?? 0) - thumbnailsPerView))}
              disabled={thumbnailEdges.start}
              aria-label="이전 썸네일 목록"
              title="이전 썸네일 목록"
              className="absolute left-1 top-1/2 z-20 flex h-11 w-7 -translate-y-1/2 items-center justify-center text-white disabled:pointer-events-none disabled:opacity-25 focus-visible:outline focus-visible:outline-2 focus-visible:outline-white"
            >
              <ChevronLeft size={22} />
            </button>
            <button
              type="button"
              onClick={() => thumbnailsRef.current?.slideTo(Math.min(images.length - thumbnailsPerView, (thumbnailsRef.current?.activeIndex ?? 0) + thumbnailsPerView))}
              disabled={thumbnailEdges.end}
              aria-label="다음 썸네일 목록"
              title="다음 썸네일 목록"
              className="absolute right-1 top-1/2 z-20 flex h-11 w-7 -translate-y-1/2 items-center justify-center text-white disabled:pointer-events-none disabled:opacity-25 focus-visible:outline focus-visible:outline-2 focus-visible:outline-white"
            >
              <ChevronRight size={22} />
            </button>
            </>
          )}
        </div>
      </div>
    </section>
  );
}
