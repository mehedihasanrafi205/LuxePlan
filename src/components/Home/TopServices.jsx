import React, { useState, useEffect } from "react";
import { FaStar } from "react-icons/fa";
import { FiArrowRight, FiDollarSign } from "react-icons/fi";
import { Link } from "react-router";
import ServiceCard from "../ServiceCard";

const API_BASE_URL = import.meta.env.VITE_API_URL;

// Utility component for rendering stars based on rating
const RatingStars = ({ rating }) => {
  const fullStars = Math.floor(rating);
  const starsArray = [];

  for (let i = 0; i < fullStars; i++) {
    starsArray.push(<FaStar key={i} className="text-yellow-400" />);
  }
  // Add an empty/half star if the rating is not a whole number (optional)
  if (rating % 1 !== 0) {
    starsArray.push(
      <FaStar key="half" className="text-yellow-400 opacity-50" />
    );
  }

  return <div className="flex items-center gap-1">{starsArray}</div>;
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
        setError(
          "Failed to load top services. Please check the API connection."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchTopRatedServices();
  }, []);

  if (loading) {
    return (
      <div className="text-center py-20">
        <span className="loading loading-spinner loading-lg text-primary"></span>
        <p className="mt-4 text-base-content/70">
          Loading top-rated luxury services...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-20 text-error font-bold">{error}</div>
    );
  }

  // Ensure the section only renders if services are available
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

        {/* Services Grid (Limited to 3 by your API endpoint) */}
        <div className="grid lg:grid-cols-4 gap-10">
          {services.map((service) => (
            <ServiceCard key={service._id} service={service}></ServiceCard>
          ))}
        </div>

        {/* Footer CTA */}
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
