import React from "react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { FaStar } from "react-icons/fa";
import { FiArrowRight, FiBriefcase } from "react-icons/fi";
import { Link } from "react-router";

const API_BASE_URL = import.meta.env.VITE_API_URL;

const DecoratorSkeleton = () => {
  return (
    <div className="card bg-base-100 shadow-xl p-6 animate-pulse text-center">
      <div className="card-body p-0 items-center">
        {/* Avatar */}
        <div className="w-32 h-32 rounded-full bg-base-300 mb-6 mt-4"></div>

        {/* Name */}
        <div className="h-7 bg-base-300 rounded w-2/3 mb-2"></div>

        {/* Role */}
        <div className="h-5 bg-primary/20 rounded w-1/2 mb-4"></div>

        <div className="divider my-2 opacity-10"></div>

        {/* Stats */}
        <div className="flex justify-around w-full mb-4">
          <div className="flex flex-col items-center gap-2">
            <div className="h-5 w-12 bg-base-300 rounded"></div>
            <div className="h-3 w-16 bg-base-300 rounded"></div>
          </div>

          <div className="flex flex-col items-center gap-2">
            <div className="h-5 w-12 bg-base-300 rounded"></div>
            <div className="h-3 w-16 bg-base-300 rounded"></div>
          </div>
        </div>

        {/* Specialty */}
        <div className="h-4 bg-base-300 rounded w-4/5 mt-2 mb-6"></div>
      </div>
    </div>
  );
};

const TopDecorators = () => {
  const {
    data: decorators = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["top-decorators"],
    queryFn: async () => {
      const res = await axios.get(`${API_BASE_URL}/decorators/top-rated`);
      return res.data;
    },
  });

  if (isLoading) {
    return (
      <section className="bg-base-200 text-base-content pt-20 md:pt-32">
        <div className="container mx-auto px-4 max-w-7xl">
          {/* Header Skeleton */}
          <div className="text-center mb-16 animate-pulse">
            <div className="h-4 bg-base-300 w-40 mx-auto mb-4 rounded"></div>
            <div className="h-10 bg-base-300 w-2/3 mx-auto rounded mb-4"></div>
            <div className="h-5 bg-base-300 w-3/4 mx-auto rounded"></div>
          </div>

          {/* Skeleton Cards */}
          <div className="grid lg:grid-cols-4 gap-10">
            {[...Array(4)].map((_, i) => (
              <DecoratorSkeleton key={i} />
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (isError) {
    return (
      <div className="text-center py-20 text-error font-bold">
        Failed to load top decorators.
      </div>
    );
  }

  return (
    <section className="bg-base-200 text-base-content py-24 md:py-32">
      <div className="container mx-auto px-4 max-w-7xl">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-lg font-semibold text-primary uppercase tracking-[0.25em] mb-3">
            LuxePlan Elite
          </h2>
          <h3 className="text-4xl md:text-5xl font-extrabold! font-serif text-primary leading-tight">
            Top Rated Decorators
          </h3>
          <p className="max-w-3xl mx-auto text-base-content/70 mt-4 text-lg">
            The highest-rated specialists dedicated to turning your vision into
            luxury reality.
          </p>
        </div>

        {/* Card Grid */}
        <div className="grid lg:grid-cols-4 gap-8">
          {decorators.map((decorator) => (
            <div
              key={decorator._id}
              className="group relative bg-base-100/50 backdrop-blur-sm rounded-[2rem] border border-primary/20 p-8 
                         transition-all duration-500 hover:border-primary/50 hover:shadow-[0_0_40px_-10px_rgba(212,175,55,0.15)] hover:-translate-y-2 overflow-hidden"
            >
              {/* Decorative Gradient Blob */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-3xl -mr-16 -mt-16 group-hover:bg-primary/10 transition-colors duration-500"></div>

              <div className="relative flex flex-col items-center text-center">
                {/* Profile Image */}
                <div className="relative mb-6">
                  <div className="w-28 h-28 rounded-full p-1 border-2 border-dashed border-primary/30 group-hover:border-primary transition-colors duration-500">
                    <div className="w-full h-full rounded-full overflow-hidden bg-base-300">
                        <img
                        src={decorator.profileImage}
                        alt={decorator.fullName}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                        onError={(e) => {
                            e.target.onerror = null;
                            e.target.src =
                            "https://via.placeholder.com/150?text=LuxePlan";
                        }}
                        />
                    </div>
                  </div>
                   {/* Verification Badge (Optional Concept) */}
                   <div className="absolute bottom-0 right-0 bg-primary text-black text-[10px] font-bold px-2 py-0.5 rounded-full shadow-lg">
                      ELITE
                   </div>
                </div>

                {/* Name */}
                <h4 className="text-2xl font-serif font-bold text-base-content group-hover:text-primary transition-colors duration-300 mb-1">
                  {decorator.fullName}
                </h4>

                {/* Role */}
                <p className="text-sm uppercase tracking-widest text-primary/80 mb-6 font-medium">
                  {decorator.role}
                </p>

                {/* Divider */}
                <div className="w-12 h-px bg-primary/20 mb-6 group-hover:w-24 transition-all duration-500"></div>

                {/* Stats Row */}
                <div className="flex items-center justify-center gap-4 w-full mb-6">
                  <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-base-200/50 border border-base-content/5 group-hover:border-primary/20 transition-colors">
                      <FaStar className="text-yellow-500 text-xs" />
                      <span className="text-sm font-bold">{(decorator.ratings || 4.8).toFixed(1)}</span>
                  </div>
                   <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-base-200/50 border border-base-content/5 group-hover:border-primary/20 transition-colors">
                      <FiBriefcase className="text-primary text-xs" />
                      <span className="text-sm font-bold">{decorator.projects || 0}+ Projects</span>
                  </div>
                </div>

                {/* Specialty Tags */}
                <div className="flex flex-wrap justify-center gap-2">
                     <span className="text-xs text-base-content/60 font-medium w-full block mb-1">Specializes in:</span>
                     {Array.isArray(decorator.specialties) ? (
                        decorator.specialties.slice(0, 2).map((spec, idx) => (
                          <span key={idx} className="text-xs px-2 py-1 rounded bg-primary/5 text-primary border border-primary/10">
                            {spec}
                          </span>
                        ))
                     ) : (
                        <span className="text-xs px-2 py-1 rounded bg-primary/5 text-primary border border-primary/10">
                            {decorator.specialties}
                        </span>
                     )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Footer CTA */}
        <div className="text-center mt-20">
          <p className="text-xl text-base-content/70 mb-4">
            Want a premium décor experience?
          </p>
          <Link
            to="/contact"
            className="btn btn-primary btn-lg shadow-2xl shadow-primary/50 transition-all duration-300 hover:scale-[1.05] hover:shadow-primary/70 mt-4 group"
          >
            Book a Consultation
             <FiArrowRight
                size={22}
                className="ml-2 group-hover:translate-x-1 transition-transform"
              />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default TopDecorators;
