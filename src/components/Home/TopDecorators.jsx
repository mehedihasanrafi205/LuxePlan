import React from "react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { FaStar } from "react-icons/fa";
import { FiArrowRight, FiBriefcase } from "react-icons/fi";
import { Link } from "react-router";
import LoadingSpinner from "../LoadingSpinner";

const API_BASE_URL = import.meta.env.VITE_API_URL;

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
    return <LoadingSpinner></LoadingSpinner>;
  }

  if (isError) {
    return (
      <div className="text-center py-20 text-error font-bold">
        Failed to load top decorators.
      </div>
    );
  }

  return (
    <section className="bg-base-200 text-base-content pt-20 md:pt-32">
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
        <div className="grid lg:grid-cols-4 gap-10">
          {decorators.map((decorator) => (
            <div
              key={decorator._id}
              className="card bg-base-100 shadow-xl border-t-4 border-primary/50 p-6 
                         transition-all duration-300 hover:shadow-2xl hover:shadow-primary/30 hover:-translate-y-1 text-center"
            >
              <div className="card-body p-0 items-center">
                {/* Profile Image */}
                <div className="avatar mb-6 mt-4">
                  <div className="w-32 rounded-full ring ring-primary ring-offset-base-200 ring-offset-4">
                    <img
                      src={decorator.profileImage}
                      alt={decorator.fullName}
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src =
                          "https://via.placeholder.com/150?text=LuxePlan";
                      }}
                    />
                  </div>
                </div>

                {/* Name */}
                <h4 className="text-3xl font-bold mb-1">
                  {decorator.fullName}
                </h4>

                {/* Role */}
                <p className="text-lg font-medium text-primary mb-3">
                  {decorator.role}
                </p>

                <div className="divider my-2 opacity-10"></div>

                {/* Stats */}
                <div className="flex justify-around w-full mb-4 text-base-content/70">
                  <div className="flex flex-col items-center">
                    <div className="flex items-center text-yellow-500 font-bold text-lg">
                      <FaStar size={16} className="mr-1" />
                      {(decorator.ratings || 4.8).toFixed(1)}
                    </div>
                    <span className="text-xs">Avg. Rating</span>
                  </div>

                  <div className="flex flex-col items-center">
                    <div className="flex items-center text-info font-bold text-lg">
                      <FiBriefcase size={16} className="mr-1" />
                      {decorator.projects || 0}+
                    </div>
                    <span className="text-xs">Projects</span>
                  </div>
                </div>

                {/* Specialty */}
                <p className="text-base-content/90 font-semibold mt-2 mb-6">
                  Specialty:{" "}
                  <span className="text-white/80 font-normal">
                    {Array.isArray(decorator.specialties)
                      ? decorator.specialties.join(", ")
                      : decorator.specialties}
                  </span>
                </p>

               
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
            className="btn btn-lg btn-primary shadow-xl shadow-primary/40 hover:scale-[1.03] transition-transform"
          >
            Book a Consultation
          </Link>
        </div>
      </div>
    </section>
  );
};

export default TopDecorators;
