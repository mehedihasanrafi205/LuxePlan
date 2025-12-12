import React from "react";
// 🚨 FIX: FiArrowRight must be imported along with the other icons
import {
  FiHeart,
  FiZap,
  FiCompass,
  FiFeather,
  FiArrowRight,
  FiAward,
  FiPenTool,
} from "react-icons/fi";

const reasons = [
  {
    icon: FiHeart,
    title: "Bespoke Design, Your Vision",
    description:
      "We don't offer templates; we craft narratives. Every project is a unique, tailored masterpiece designed specifically to reflect your individual style and aspirations. Total customization is our standard.",
    accent: "primary",
  },
  {
    icon: FiZap,
    title: "Seamless Smart Integration",
    description:
      "Technology should enhance, not clutter. We merge cutting-edge smart home systems and interactive event technology flawlessly into the design, ensuring intuitive function and aesthetic harmony.",
    accent: "info",
  },
  {
    icon: FiCompass,
    title: "Uncompromising Excellence",
    description:
      "From the selection of premium materials to meticulous on-site execution and post-project support, we maintain the highest standards of craftsmanship and professionalism globally.",
    accent: "success",
  },
];

const WhyChooseUs = () => {
  return (
    <section className="bg-base-200 text-base-content pt-20 md:pt-32">
      <div className="container mx-auto px-4 ">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-lg font-semibold text-primary uppercase tracking-[0.2em] mb-3">
            LuxePlan Difference
          </h2>
          <h2 className="text-4xl md:text-5xl font-extrabold! font-serif text-primary leading-tight">
            The LuxePlan Advantage
          </h2>
          <p className="max-w-3xl mx-auto text-base-content/70 mt-4 text-lg">
            We transcend traditional design, delivering a synthesis of high art,
            seamless technology, and dedicated partnership.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-10 w-full">
          {/* Value 1: Creativity/Bespoke */}
          <div className="flex flex-col items-center gap-4 card bg-base-100 p-8 shadow-xl border-t-4 border-primary transition-transform duration-300 hover:scale-[1.03]">
            <div className="flex items-center justify-center w-14 h-14 rounded-full bg-primary/10 text-primary mb-2">
              <FiPenTool size={28} />
            </div>
            <h4 className="text-xl font-bold text-accent">
              Bespoke Creativity
            </h4>
            <p className="text-base-content/70 text-center text-sm">
              Innovative design solutions tailored for every unique client
              experience, ensuring no two projects are ever the same.
            </p>
          </div>

          {/* Value 2: Technology/Integration */}
          <div className="flex flex-col items-center gap-4 card bg-base-100 p-8 shadow-xl border-t-4 border-info transition-transform duration-300 hover:scale-[1.03]">
            <div className="flex items-center justify-center w-14 h-14 rounded-full bg-info/10 text-info mb-2">
              <FiZap size={28} />
            </div>
            <h4 className="text-xl font-bold text-accent">Smart Integration</h4>
            <p className="text-base-content/70 text-center text-sm">
              Seamlessly blending sophisticated technology with artistic décor
              for intuitive, luxurious smart spaces.
            </p>
          </div>

          {/* Value 3: Excellence/Quality */}
          <div className="flex flex-col items-center gap-4 card bg-base-100 p-8 shadow-xl border-t-4 border-success transition-transform duration-300 hover:scale-[1.03]">
            <div className="flex items-center justify-center w-14 h-14 rounded-full bg-success/10 text-success mb-2">
              <FiAward size={28} />
            </div>
            <h4 className="text-xl font-bold text-accent">
              Unmatched Excellence
            </h4>
            <p className="text-base-content/70 text-center text-sm">
              Uncompromising quality, meticulous attention to detail, and the
              highest standards of craftsmanship.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhyChooseUs;
