import React from "react";
import TopServices from "../../components/Home/TopServices";
import Hero from "../../components/Home/Hero";
import WhyChooseUs from "../../components/Home/WhyChooseUs";
import TopDecorators from "../../components/Home/TopDecorators";
import Stats from "../../components/Home/Stats";
import Testimonials from "../../components/Home/Testimonials";
import FAQ from "../../components/Home/FAQ";
import Gallery from "../../components/Home/Gallery";
import Newsletter from "../../components/Home/Newsletter";

import "leaflet/dist/leaflet.css";
import CoverageMap from "../../components/Home/CoverageMap";
import useGSAPAnimations from "../../hooks/useGSAPAnimations";

const Home = () => {
  const { fadeUp } = useGSAPAnimations();

  // Initialize animations
  fadeUp(".gsap-section");

  return (
    <div className="overflow-hidden">
      <Hero />
      
      <div className="gsap-section">
        <Stats />
      </div>
      
      <div className="gsap-section">
        <WhyChooseUs />
      </div>

      <div className="gsap-section">
        <TopServices />
      </div>

      <div className="gsap-section">
        <Gallery />
      </div>

      <div className="gsap-section">
        <TopDecorators />
      </div>

      <div className="gsap-section">
        <Testimonials />
      </div>

      <div className="gsap-section">
        <FAQ />
      </div>

      <div className="gsap-section">
        <CoverageMap />
      </div>

      <div className="gsap-section">
        <Newsletter />
      </div>
    </div>
  );
};

export default Home;
