"use client";

import { InfiniteScrollPresentation, PresentationStep } from "@/components/infinite-scroll-presentation";

const presentationSteps: PresentationStep[] = [
  {
    src: "/presentation/step1.jpg",
    bg: "/presentation/step1.jpg",
    title: "Earl Grey Garden",
    date: "Step 01",
    tabLabel: "Earl Grey",
    tagline: "Essential Oil Blend",
    overview: "We use our 'Earl Grey Garden' blend with 63% active mosquito-repelling essential oils.",
  },
  {
    src: "/presentation/step2.jpg",
    bg: "/presentation/step2.jpg",
    title: "Natural Shell",
    date: "Step 02",
    tabLabel: "Natural Shell",
    tagline: "Microencapsulation",
    overview: "Protected by a natural bio-shell to lock in volatile oils and provide controlled, long-lasting release.",
  },
  {
    src: "/presentation/step3.jpg",
    bg: "/presentation/step3.jpg",
    title: "Stable Powder & Film",
    date: "Step 03",
    tabLabel: "Film Matrix",
    tagline: "Compact Solidification",
    overview: "Converted into a stable, dry powder and formed into compact 5x5 cm dissolving repellent films.",
  },
  {
    src: "/presentation/step4.jpg",
    bg: "/presentation/step4.jpg",
    title: "Dissolve & Pour",
    date: "Step 04",
    tabLabel: "Dissolve",
    tagline: "Instant Activation",
    overview: "Just dissolve 1 film in clean water and pour it into your favorite spray bottle in seconds.",
  },
  {
    src: "/presentation/step5.jpg",
    bg: "/presentation/step5.jpg",
    title: "Ready to Protect",
    date: "Step 05",
    tabLabel: "Ready to Spray",
    tagline: "All-Day Defense",
    overview: "Your natural mosquito repellent spray is fully activated — ready to shield your skin anywhere with refreshing herbal aroma.",
  },
];

export default function PresentationPage() {
  return (
    <main className="w-full min-h-screen bg-black">
      <InfiniteScrollPresentation steps={presentationSteps} />
    </main>
  );
}
