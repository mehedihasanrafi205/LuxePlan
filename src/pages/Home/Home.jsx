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

const Home = () => {
  return (
    <div>
      <Hero />
      <Stats />
      <WhyChooseUs />
      <TopServices />
      <Gallery />
      <TopDecorators />
      <Testimonials />
      <FAQ />
      <CoverageMap />
      <Newsletter />
    </div>
  );
};

export default Home;
