import TopServices from "../../components/Home/TopServices";
import Hero from "../../components/Home/Hero";
import WhyChooseUs from "../../components/Home/WhyChooseUs";
import TopDecorators from "../../components/Home/TopDecorators";

import "leaflet/dist/leaflet.css";
import CoverageMap from "../../components/Home/CoverageMap";

const Home = () => {
  return (
    <div>
      <Hero></Hero>
      <TopServices></TopServices>
      <TopDecorators></TopDecorators>
      <WhyChooseUs></WhyChooseUs>

      <CoverageMap></CoverageMap>
    </div>
  );
};

export default Home;
