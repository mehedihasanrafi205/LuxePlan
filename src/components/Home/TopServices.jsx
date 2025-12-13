import React, { useState, useEffect } from "react";
import { FaStar } from "react-icons/fa";
import { FiArrowRight, FiDollarSign } from "react-icons/fi";
import { Link } from "react-router";
import ServiceCard from "../ServiceCard";

const API_BASE_URL = import.meta.env.VITE_API_URL;

const ServiceSkeleton = () => {
  return (
    <div className="card bg-base-100 shadow-xl animate-pulse overflow-hidden">
      <div className="h-48 bg-base-300"></div>

      <div className="card-body p-6">
        <div className="h-6 bg-base-300 rounded w-3/4 mb-3"></div>
        <div className="h-4 bg-base-300 rounded w-full mb-2"></div>
        <div className="h-4 bg-base-300 rounded w-5/6 mb-4"></div>
        <div className="h-8 bg-primary/20 rounded w-1/3 mt-4"></div>
      </div>
    </div>
  );
};

const TopServices = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTopRatedServices = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/services/top-rated`);

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        setServices(data);
      } catch (err) {
        console.error("Fetch error:", err);
        setError("Failed to load top services. ");
      } finally {
        setLoading(false);
      }
    };

    fetchTopRatedServices();
  }, []);

  if (loading) {
    return (
      <section className="bg-base-200 text-base-content pt-20 md:pt-32">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16 animate-pulse">
            <div className="h-4 bg-base-300 w-40 mx-auto mb-4 rounded"></div>
            <div className="h-10 bg-base-300 w-2/3 mx-auto rounded mb-4"></div>
            <div className="h-5 bg-base-300 w-3/4 mx-auto rounded"></div>
          </div>

          <div className="grid lg:grid-cols-4 gap-10">
            {[...Array(4)].map((_, index) => (
              <ServiceSkeleton key={index} />
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <div className="text-center py-20 text-error font-bold">{error}</div>
    );
  }

  if (services.length === 0) {
    return (
      <div className="text-center py-20 text-base-content/70">
        No top-rated services found at this time.
      </div>
    );
  }

  return (
    <section className="bg-base-200 text-base-content pt-20 md:pt-32">
      <div className="container mx-auto px-4 ">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-lg font-semibold text-primary uppercase tracking-[0.2em] mb-3">
            Client Favorites
          </h2>
          <h3 className="text-4xl md:text-5xl font-extrabold! font-serif text-primary leading-tight">
            Our Top-Rated Luxury Services
          </h3>
          <p className="max-w-3xl mx-auto text-base-content/70 mt-4 text-lg">
            Experience the best of LuxePlan, as rated and loved by our esteemed
            clients.
          </p>
        </div>

        <div className="grid lg:grid-cols-4 gap-10">
          {services.map((service) => (
            <ServiceCard key={service._id} service={service}></ServiceCard>
          ))}
        </div>

        <div className="text-center mt-20">
          <p className="text-xl text-base-content/70 mb-6">
            Explore the full range of our high-end design and technology
            solutions.
          </p>
          <Link
            to="/services"
            className="btn btn-lg btn-primary shadow-xl shadow-primary/40 transition-all duration-300 hover:scale-[1.03] group"
          >
            Explore All Services
            <FiArrowRight
              size={20}
              className="ml-1 group-hover:translate-x-1 transition-transform"
            />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default TopServices;
