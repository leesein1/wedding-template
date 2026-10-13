import { useRef, useState } from "react";
import { ChevronLeft, ChevronRight, Pause, Play } from "lucide-react";
import type { Swiper as SwiperInstance } from "swiper";
import { A11y, Autoplay, Keyboard } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";

import g1 from "@/assets/img/비비엔다2.webp";
import g2 from "@/assets/img/이모님1.jpg";
import g3 from "@/assets/img/이모님2.jpg";
import g4 from "@/assets/img/이모님3.jpg";
import g5 from "@/assets/img/이모님4.jpg";

const images = [g1, g2, g3, g4, g5];

type GallerySectionProps = { debugClass?: string };

export default function GallerySection({ debugClass = "" }: GallerySectionProps) {
  const swiperRef = useRef<SwiperInstance | null>(null);
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(true);

  const toggleAutoplay = () => {
    const swiper = swiperRef.current;
    if (!swiper) return;
    if (swiper.autoplay.running) swiper.autoplay.stop();
    else swiper.autoplay.start();
  };

  return (
    <section className={`px-6 py-14 bg-white ${debugClass}`}>
      <div className="max-w-[420px] mx-auto relative">
        <div className="text-center">
          <div className="text-[28px] tracking-[0.18em] text-[#1a1a1a]">
            <span style={{ fontFamily: "'Elsie', serif" }}>GALLERY</span>
          </div>
        </div>

        <button
          type="button"
          className="absolute top-0 right-0 p-1 text-[#444]"
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
            onSlideChange={(swiper) => setIndex(swiper.realIndex)}
            onAutoplayStart={() => setPaused(false)}
            onAutoplayStop={() => setPaused(true)}
            slidesPerView={1}
            spaceBetween={14}
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
            {images.map((src, i) => (
              <SwiperSlide key={src}>
                <div className="h-[520px] rounded-2xl overflow-hidden shadow-sm border border-[#f0f0f0] bg-white">
                  <img
                    src={src}
                    alt={`gallery ${i + 1}`}
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
            aria-label="previous slide"
            title="이전 사진"
            className="absolute left-3 top-1/2 -translate-y-1/2 z-20 text-white"
          >
            <ChevronLeft size={28} strokeWidth={2.2} />
          </button>
          <button
            type="button"
            onClick={() => swiperRef.current?.slideNext()}
            aria-label="next slide"
            title="다음 사진"
            className="absolute right-3 top-1/2 -translate-y-1/2 z-20 text-white"
          >
            <ChevronRight size={28} strokeWidth={2.2} />
          </button>
        </div>

        <div className="mt-6 flex items-center justify-center gap-2">
          {images.map((src, i) => (
            <button
              key={src}
              type="button"
              onClick={() => swiperRef.current?.slideToLoop(i)}
              className="w-2.5 h-2.5 rounded-full transition-all"
              aria-label={`go to slide ${i + 1}`}
              aria-current={i === index ? "true" : undefined}
              style={{
                backgroundColor: i === index ? "#9a9a67" : "#d9d9c6",
                transform: i === index ? "scale(1.05)" : "scale(1)",
              }}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
