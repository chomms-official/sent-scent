"use client";

import { useState, useEffect } from "react";
import ScrollExpandMedia from "@/components/ui/scroll-expansion-hero";
import { SentScentLogo } from "@/components/sent-scent-logo";

interface MediaAbout {
  overview: string;
  conclusion: string;
}

interface MediaContent {
  src: string;
  poster?: string;
  background: string;
  title: string;
  date: string;
  scrollToExpand: string;
  about: MediaAbout;
}

interface MediaContentCollection {
  [key: string]: MediaContent;
}

const sampleMediaContent: MediaContentCollection = {
  step1: {
    src: "/presentation/step1.jpg",
    background: "/presentation/step1.jpg",
    title: "Earl Grey Garden",
    date: "Step 01",
    scrollToExpand: "Scroll to Expand Demo",
    about: {
      overview:
        "We use our 'Earl Grey Garden' blend with 63% active mosquito-repelling essential oils. Pure natural botanicals provide high efficacy without synthetic chemicals.",
      conclusion:
        "The high-concentration botanical formula forms the foundation of our natural repellent innovation.",
    },
  },
  step2: {
    src: "/presentation/step2.jpg",
    background: "/presentation/step2.jpg",
    title: "Natural Shell",
    date: "Step 02",
    scrollToExpand: "Scroll to Expand Demo",
    about: {
      overview:
        "Protected by a natural shell to lock in volatile oils and allow controlled release. Organic microencapsulation shields sensitive botanicals from environmental degradation.",
      conclusion:
        "This protective bio-shell extends longevity and maintains optimal scent potency until ready for use.",
    },
  },
  step3: {
    src: "/presentation/step3.jpg",
    background: "/presentation/step3.jpg",
    title: "Stable Powder",
    date: "Step 03",
    scrollToExpand: "Scroll to Expand Demo",
    about: {
      overview:
        "Converted into a stable, dry powder and formed into compact 5x5 cm films. Waterless solid format prevents leaks, cuts transportation emissions, and simplifies storage.",
      conclusion:
        "Each ultralight film strip contains precisely measured active ingredients ready for instant reconstitution.",
    },
  },
  step4: {
    src: "/presentation/step4.jpg",
    background: "/presentation/step4.jpg",
    title: "Dissolve & Pour",
    date: "Step 04",
    scrollToExpand: "Scroll to Expand Demo",
    about: {
      overview:
        "Just dissolve 1 film in clean water and pour it into your favorite spray bottle. Dissolves completely within seconds without leaving any residue or clumping.",
      conclusion:
        "Reusable spray bottles eliminate single-use plastic waste while ensuring maximum freshness every time.",
    },
  },
  step5: {
    src: "/presentation/step5.jpg",
    background: "/presentation/step5.jpg",
    title: "Ready to Use",
    date: "Step 05",
    scrollToExpand: "Scroll to Expand Demo",
    about: {
      overview:
        "Your natural mosquito repellent spray is fully prepared and ready to use! Enjoy all-day herbal protection with an uplifting citrus and tea aroma in the great outdoors.",
      conclusion:
        "Gentle on skin, tough on mosquitoes, and 100% biodegradable from source to spray.",
    },
  },
};

const stepKeys = ["step1", "step2", "step3", "step4", "step5"];

const MediaContent = ({
  stepKey,
  onNextStep,
}: {
  stepKey: string;
  onNextStep?: () => void;
}) => {
  const currentMedia = sampleMediaContent[stepKey];

  return (
    <div className="max-w-4xl mx-auto py-8">
      <h2 className="text-3xl font-bold mb-6 text-black dark:text-white">
        About This Step
      </h2>
      <p className="text-lg mb-6 text-black/80 dark:text-zinc-200 leading-relaxed">
        {currentMedia.about.overview}
      </p>

      <p className="text-lg mb-8 text-black/70 dark:text-zinc-300 leading-relaxed">
        {currentMedia.about.conclusion}
      </p>

      {onNextStep && (
        <button
          onClick={onNextStep}
          className="px-6 py-3 rounded-full bg-white text-black font-semibold hover:bg-zinc-200 transition-colors cursor-pointer shadow-lg"
        >
          Next Step →
        </button>
      )}
    </div>
  );
};

export default function Demo() {
  const [stepKey, setStepKey] = useState("step1");
  const currentMedia = sampleMediaContent[stepKey];

  useEffect(() => {
    window.scrollTo(0, 0);

    const resetEvent = new Event("resetSection");
    window.dispatchEvent(resetEvent);
  }, [stepKey]);

  const handleNextStep = () => {
    const currentIndex = stepKeys.indexOf(stepKey);
    const nextIndex = (currentIndex + 1) % stepKeys.length;
    setStepKey(stepKeys[nextIndex]);
  };

  return (
    <div className="min-h-screen bg-black text-white relative">
      {/* Brand Logo Top Left */}
      <div className="fixed top-4 left-4 z-50">
        <SentScentLogo className="text-white" />
      </div>

      {/* 5 Step Switcher Buttons Top Right */}
      <div className="fixed top-4 right-4 z-50 flex flex-wrap gap-1.5 md:gap-2">
        {stepKeys.map((key, index) => {
          const isActive = stepKey === key;
          return (
            <button
              key={key}
              onClick={() => setStepKey(key)}
              className={`px-3 py-1.5 md:px-4 md:py-2 rounded-lg text-xs md:text-sm font-medium transition-all ${
                isActive
                  ? "bg-white text-black font-bold shadow-lg"
                  : "bg-black/60 text-white border border-white/30 backdrop-blur-md hover:bg-white/10"
              }`}
            >
              Step 0{index + 1}
            </button>
          );
        })}
      </div>

      <ScrollExpandMedia
        mediaType="image"
        mediaSrc={currentMedia.src}
        bgImageSrc={currentMedia.background}
        title={currentMedia.title}
        date={currentMedia.date}
        scrollToExpand={currentMedia.scrollToExpand}
      >
        <MediaContent stepKey={stepKey} onNextStep={handleNextStep} />
      </ScrollExpandMedia>
    </div>
  );
}
