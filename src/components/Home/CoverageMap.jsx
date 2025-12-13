import React from "react";
import Map from "../Map"; 
import { FiMapPin } from "react-icons/fi";

const CoverageMap = () => {
  return (
    <section className="bg-base-200 text-base-content py-20 md:py-32">
      <div className="container mx-auto px-4 max-w-7xl">
        
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-lg font-semibold text-primary uppercase tracking-[0.25em] mb-3">
            Our Location
          </h2>
          <h2 className="text-4xl md:text-5xl font-extrabold! font-serif text-primary leading-tight">
            Our Global Design Footprint
          </h2>
          <p className="max-w-3xl mx-auto text-base-content/70 mt-4 text-lg">
            Based in Dhaka, LuxePlan services discerning clients across Asia, Europe, and North America.
          </p>

        </div>

        {/* Map Display */}
        <Map />
        
        {/* Footer Text */}
        <div className="text-center mt-12">
            <p className="text-base-content/70 italic">
                Note: The map shows our central office location. We operate internationally.
            </p>
        </div>

      </div>
    </section>
  );
};

export default CoverageMap;