"use client";

import {
  useEffect,
  useRef,
  useState,
  useCallback,
} from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { SentScentLogo } from "./sent-scent-logo";

export interface PresentationStep {
  src: string;
  bg: string;
  title: string;
  date: string;
  overview: string;
  tabLabel?: string;
  tagline?: string;
}

interface InfiniteScrollPresentationProps {
  steps: PresentationStep[];
}

export const InfiniteScrollPresentation = ({ steps }: InfiniteScrollPresentationProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState<number>(1);
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [progress, setProgress] = useState<number>(0);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);

  const isTransitioningRef = useRef<boolean>(false);
  const touchStartPos = useRef<{ x: number; y: number } | null>(null);
  const AUTOPLAY_DURATION = 6500; // 6.5s per slide

  const goToStep = useCallback(
    (newIndex: number, forcedDirection?: number) => {
      if (newIndex === currentIndex) return;
      const dir = forcedDirection !== undefined 
        ? forcedDirection 
        : newIndex > currentIndex ? 1 : -1;
      setDirection(dir);
      setCurrentIndex(newIndex);
      setProgress(0);
    },
    [currentIndex]
  );

  const nextStep = useCallback(() => {
    setDirection(1);
    setCurrentIndex((prev) => (prev + 1) % steps.length);
    setProgress(0);
  }, [steps.length]);

  const prevStep = useCallback(() => {
    setDirection(-1);
    setCurrentIndex((prev) => (prev - 1 + steps.length) % steps.length);
    setProgress(0);
  }, [steps.length]);

  // Autoplay timer with progress bar
  useEffect(() => {
    if (!isPlaying) return;

    const intervalTime = 50;
    const increment = (intervalTime / AUTOPLAY_DURATION) * 100;

    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          nextStep();
          return 0;
        }
        return prev + increment;
      });
    }, intervalTime);

    return () => clearInterval(timer);
  }, [isPlaying, nextStep]);

  // Wheel / Trackpad navigation with debounced threshold
  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      if (isTransitioningRef.current) return;

      if (Math.abs(e.deltaY) > 25 || Math.abs(e.deltaX) > 25) {
        isTransitioningRef.current = true;
        if (e.deltaY > 0 || e.deltaX > 0) {
          nextStep();
        } else {
          prevStep();
        }

        setTimeout(() => {
          isTransitioningRef.current = false;
        }, 600);
      }
    };

    window.addEventListener("wheel", handleWheel, { passive: false });
    return () => window.removeEventListener("wheel", handleWheel);
  }, [nextStep, prevStep]);

  // Touch Swipe navigation
  useEffect(() => {
    const handleTouchStart = (e: TouchEvent) => {
      touchStartPos.current = {
        x: e.touches[0].clientX,
        y: e.touches[0].clientY,
      };
    };

    const handleTouchEnd = (e: TouchEvent) => {
      if (!touchStartPos.current || isTransitioningRef.current) return;

      const touchEndX = e.changedTouches[0].clientX;
      const touchEndY = e.changedTouches[0].clientY;

      const deltaX = touchStartPos.current.x - touchEndX;
      const deltaY = touchStartPos.current.y - touchEndY;

      const minSwipeDistance = 45;

      if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > minSwipeDistance) {
        isTransitioningRef.current = true;
        if (deltaX > 0) {
          nextStep();
        } else {
          prevStep();
        }
        setTimeout(() => {
          isTransitioningRef.current = false;
        }, 500);
      } else if (Math.abs(deltaY) > minSwipeDistance) {
        isTransitioningRef.current = true;
        if (deltaY > 0) {
          nextStep();
        } else {
          prevStep();
        }
        setTimeout(() => {
          isTransitioningRef.current = false;
        }, 500);
      }

      touchStartPos.current = null;
    };

    window.addEventListener("touchstart", handleTouchStart, { passive: true });
    window.addEventListener("touchend", handleTouchEnd, { passive: true });

    return () => {
      window.removeEventListener("touchstart", handleTouchStart);
      window.removeEventListener("touchend", handleTouchEnd);
    };
  }, [nextStep, prevStep]);

  // Keyboard navigation (Arrow keys, Space, 1-5, F, P)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return;
      }

      switch (e.key) {
        case "ArrowRight":
        case "ArrowDown":
        case "PageDown":
          e.preventDefault();
          nextStep();
          break;
        case "ArrowLeft":
        case "ArrowUp":
        case "PageUp":
          e.preventDefault();
          prevStep();
          break;
        case " ":
          e.preventDefault();
          setIsPlaying((prev) => !prev);
          break;
        case "f":
        case "F":
          toggleFullscreen();
          break;
        case "p":
        case "P":
          setIsPlaying((prev) => !prev);
          break;
        case "1":
        case "2":
        case "3":
        case "4":
        case "5":
          const idx = parseInt(e.key, 10) - 1;
          if (idx >= 0 && idx < steps.length) {
            goToStep(idx);
          }
          break;
        default:
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [nextStep, prevStep, goToStep, steps.length]);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().then(() => setIsFullscreen(true)).catch(() => {});
    } else {
      document.exitFullscreen().then(() => setIsFullscreen(false)).catch(() => {});
    }
  };

  const currentStep = steps[currentIndex];

  const slideVariants = {
    enter: (dir: number) => ({
      opacity: 0,
      scale: 0.94,
      y: dir > 0 ? 30 : -30,
      filter: "blur(6px)",
    }),
    center: {
      opacity: 1,
      scale: 1,
      y: 0,
      filter: "blur(0px)",
      transition: {
        duration: 0.65,
        ease: [0.16, 1, 0.3, 1] as const,
      },
    },
    exit: (dir: number) => ({
      opacity: 0,
      scale: 1.04,
      y: dir > 0 ? -30 : 30,
      filter: "blur(6px)",
      transition: {
        duration: 0.5,
        ease: [0.16, 1, 0.3, 1] as const,
      },
    }),
  };

  return (
    <div className="relative w-full h-[100dvh] overflow-hidden bg-black select-none font-sans text-white">
      {/* Invisible Preloader for zero-latency image transitions */}
      <div className="sr-only" aria-hidden="true">
        {steps.map((s, idx) => (
          <img key={idx} src={s.src} alt="" />
        ))}
      </div>

      {/* Layer 1: Ambient Blurred Background Crossfade */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <AnimatePresence mode="popLayout">
          <motion.div
            key={currentStep.bg}
            initial={{ opacity: 0, scale: 1.08 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] as const }}
            className="absolute inset-0 w-full h-full"
          >
            <Image
              src={currentStep.bg}
              alt="Background Ambient"
              fill
              priority
              className="object-cover object-center filter blur-3xl brightness-[0.35] saturate-150 scale-105"
            />
            {/* Vignette Overlay for Depth */}
            <div className="absolute inset-0 bg-radial from-transparent via-black/40 to-black/85" />
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Layer 2: Top Floating Header Bar */}
      <header className="absolute top-0 inset-x-0 z-50 flex items-center justify-between px-6 py-5 md:px-12 md:py-7">
        <div className="flex items-center gap-3">
          <SentScentLogo className="text-white hover:opacity-90 transition-opacity" />
          <span className="hidden sm:inline-block text-[11px] uppercase tracking-widest font-semibold px-2.5 py-1 rounded-full bg-white/10 border border-white/15 text-zinc-300 backdrop-blur-md">
            Product Presentation
          </span>
        </div>

        <div className="flex items-center gap-2 md:gap-3">
          {/* Autoplay Toggle Button with Timer Ring */}
          <button
            onClick={() => setIsPlaying((p) => !p)}
            className="relative flex items-center gap-2 px-3.5 py-1.5 md:px-4 md:py-2 rounded-full bg-black/40 hover:bg-black/60 border border-white/15 backdrop-blur-xl text-xs md:text-sm font-medium transition-all hover:scale-105 active:scale-95 shadow-lg"
            title={isPlaying ? "Pause autoplay (Space)" : "Resume autoplay (Space)"}
          >
            {isPlaying ? (
              <>
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-zinc-200">Auto</span>
                {/* Micro Pause Icon */}
                <svg className="w-3.5 h-3.5 fill-current text-zinc-300" viewBox="0 0 24 24">
                  <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
                </svg>
              </>
            ) : (
              <>
                <span className="w-2 h-2 rounded-full bg-amber-400" />
                <span className="text-zinc-200">Paused</span>
                {/* Micro Play Icon */}
                <svg className="w-3.5 h-3.5 fill-current text-zinc-300" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z" />
                </svg>
              </>
            )}
          </button>

          {/* Step Counter Badge */}
          <div className="px-3.5 py-1.5 md:px-4 md:py-2 rounded-full bg-black/40 border border-white/15 backdrop-blur-xl text-xs md:text-sm font-mono tracking-wider text-zinc-200 shadow-lg">
            <span className="text-white font-bold">{String(currentIndex + 1).padStart(2, "0")}</span>
            <span className="text-zinc-500 mx-1">/</span>
            <span className="text-zinc-400">{String(steps.length).padStart(2, "0")}</span>
          </div>

          {/* Fullscreen Toggle */}
          <button
            onClick={toggleFullscreen}
            className="hidden sm:flex items-center justify-center p-2 md:p-2.5 rounded-full bg-black/40 hover:bg-black/60 border border-white/15 backdrop-blur-xl text-zinc-300 hover:text-white transition-all hover:scale-105 active:scale-95 shadow-lg"
            title="Toggle Fullscreen (F)"
          >
            {isFullscreen ? (
              <svg className="w-4 h-4 fill-none stroke-current stroke-2" viewBox="0 0 24 24">
                <path d="M8 3v3a2 2 0 0 1-2 2H3m18 0h-3a2 2 0 0 1-2-2V3m0 18v-3a2 2 0 0 1 2-2h3M3 16h3a2 2 0 0 1 2 2v3" />
              </svg>
            ) : (
              <svg className="w-4 h-4 fill-none stroke-current stroke-2" viewBox="0 0 24 24">
                <path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7" />
              </svg>
            )}
          </button>
        </div>
      </header>

      {/* Layer 3: Main Showcase Frame (Card + Overlaid Content) */}
      <main className="relative z-10 w-full h-full flex flex-col items-center justify-center px-4 sm:px-8 md:px-16 pt-16 pb-24 md:pb-28">
        <div className="relative w-full max-w-5xl h-[56vh] sm:h-[62vh] md:h-[66vh] max-h-[720px] flex items-center justify-center">
          <AnimatePresence mode="popLayout" custom={direction} initial={false}>
            <motion.div
              key={currentStep.src}
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              className="absolute inset-0 w-full h-full rounded-2xl md:rounded-3xl overflow-hidden border border-white/20 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.9)] bg-zinc-950"
            >
              {/* Product Image */}
              <Image
                src={currentStep.src}
                alt={currentStep.title}
                fill
                priority
                className="object-cover object-center w-full h-full"
                sizes="(max-width: 768px) 95vw, (max-width: 1200px) 85vw, 1200px"
              />

              {/* Cinematic Bottom Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/45 to-transparent pointer-events-none" />

              {/* Floating Content Banner on the Image */}
              <div className="absolute inset-x-0 bottom-0 p-6 sm:p-8 md:p-10 flex flex-col items-start text-left z-20">
                {/* Step Badge & Tagline */}
                <div className="flex flex-wrap items-center gap-2 mb-2 sm:mb-3">
                  <span className="px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider bg-amber-500/25 text-amber-300 border border-amber-500/35 backdrop-blur-md">
                    {currentStep.date}
                  </span>
                  {currentStep.tagline && (
                    <span className="text-xs uppercase tracking-widest text-zinc-300 font-medium hidden sm:inline-block">
                      • {currentStep.tagline}
                    </span>
                  )}
                </div>

                {/* Title */}
                <h1 className="text-2xl sm:text-3xl md:text-5xl font-black tracking-tight text-white mb-2 md:mb-3 drop-shadow-md">
                  {currentStep.title}
                </h1>

                {/* Overview Description */}
                <p className="text-sm sm:text-base md:text-lg text-zinc-200 font-normal leading-relaxed max-w-3xl drop-shadow">
                  {currentStep.overview}
                </p>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Floating Navigation Arrow: PREV */}
          <button
            onClick={prevStep}
            className="absolute left-2 sm:-left-5 md:-left-7 top-1/2 -translate-y-1/2 z-30 p-2.5 sm:p-3.5 rounded-full bg-black/60 hover:bg-black/90 text-white/80 hover:text-white border border-white/20 backdrop-blur-xl transition-all hover:scale-110 active:scale-95 shadow-2xl focus:outline-none"
            aria-label="Previous step"
            title="Previous (Left Arrow)"
          >
            <svg className="w-5 h-5 md:w-6 md:h-6 fill-none stroke-current stroke-2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          {/* Floating Navigation Arrow: NEXT */}
          <button
            onClick={nextStep}
            className="absolute right-2 sm:-right-5 md:-right-7 top-1/2 -translate-y-1/2 z-30 p-2.5 sm:p-3.5 rounded-full bg-black/60 hover:bg-black/90 text-white/80 hover:text-white border border-white/20 backdrop-blur-xl transition-all hover:scale-110 active:scale-95 shadow-2xl focus:outline-none"
            aria-label="Next step"
            title="Next (Right Arrow)"
          >
            <svg className="w-5 h-5 md:w-6 md:h-6 fill-none stroke-current stroke-2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </main>

      {/* Layer 4: Interactive Bottom Timeline Dock */}
      <footer className="absolute bottom-4 sm:bottom-6 inset-x-0 z-40 flex flex-col items-center justify-center px-4">
        <div className="flex items-center gap-1.5 sm:gap-2 p-1.5 sm:p-2 rounded-full bg-black/60 border border-white/15 backdrop-blur-2xl shadow-2xl max-w-full overflow-x-auto no-scrollbar">
          {steps.map((step, idx) => {
            const isActive = idx === currentIndex;
            return (
              <button
                key={idx}
                onClick={() => goToStep(idx)}
                className={`relative px-3 py-1.5 sm:px-4 sm:py-2 rounded-full text-xs sm:text-sm font-medium transition-all duration-300 flex items-center gap-2 shrink-0 ${
                  isActive
                    ? "bg-white/20 text-white border border-white/30 shadow-md font-semibold"
                    : "text-zinc-400 hover:text-zinc-200 hover:bg-white/5"
                }`}
              >
                <span className={`text-[10px] sm:text-xs font-mono ${isActive ? "text-amber-300 font-bold" : "text-zinc-500"}`}>
                  0{idx + 1}
                </span>
                <span className="hidden sm:inline-block">
                  {step.tabLabel || step.title}
                </span>

                {/* Active Micro Timer Progress Bar */}
                {isActive && isPlaying && (
                  <span
                    className="absolute bottom-0 left-2 right-2 h-[2px] bg-amber-400 rounded-full transition-all"
                    style={{ width: `${progress}%` }}
                  />
                )}
              </button>
            );
          })}
        </div>

        {/* Presentation Hint Keyboard Instructions */}
        <p className="hidden md:block text-[11px] text-zinc-400 mt-2 font-light tracking-wide">
          Use <kbd className="px-1.5 py-0.5 rounded bg-white/10 text-zinc-300 font-mono text-[10px]">←</kbd> <kbd className="px-1.5 py-0.5 rounded bg-white/10 text-zinc-300 font-mono text-[10px]">→</kbd> keys or scroll • Press <kbd className="px-1.5 py-0.5 rounded bg-white/10 text-zinc-300 font-mono text-[10px]">Space</kbd> to pause
        </p>
      </footer>
    </div>
  );
};
