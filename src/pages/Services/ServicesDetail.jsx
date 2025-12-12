import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useParams, Link, useNavigate } from "react-router";
import { FiArrowLeft, FiStar } from "react-icons/fi";
import { FaCheckCircle } from "react-icons/fa";
import { useState } from "react";

import BookingModal from "../../components/Shared/Modal/BookingModal";
import useAuth from "../../hooks/useAuth";
import LoadingSpinner from "../../components/LoadingSpinner";

const ServiceDetail = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const navigate = useNavigate();
  const {
    data: service,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["service", id],
    queryFn: async () => {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/service/${id}`);
      return res.data;
    },
  });

  if (isLoading)
    return (
     <LoadingSpinner/>
    );

  if (isError || !service)
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-center text-red-500">
        <p>Service not found or failed to load.</p>
        <Link to="/services" className="text-primary underline mt-2">
          Back to Services
        </Link>
      </div>
    );

  const handleBookingClick = () => {
    if (!user) {
      // Redirect to login if user is not logged in
      navigate("/login");
    } else {
      setIsBookingOpen(true);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 pb-15 pt-35 font-sans text-white dark:text-white">
      {/* BACK BUTTON */}
      <Link
        to="/services"
        className="inline-flex items-center gap-2 text-primary font-semibold mb-5"
      >
        <FiArrowLeft /> Back to Services
      </Link>

      {/* HERO IMAGE */}
      <div className="w-full h-80 md:h-[480px] relative rounded-xl overflow-hidden shadow-lg">
        <img
          referrerPolicy="no-referrer"
          src={service.image}
          alt={service.service_name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
      </div>

      <div className="mt-8 flex flex-col lg:flex-row gap-12">
        {/* LEFT CONTENT */}
        <div className="flex-1 space-y-6">
          {/* CATEGORY & TITLE */}
          <div className="flex flex-wrap items-center gap-3">
            <span className="px-4 py-1 rounded-full bg-primary/20 text-primary font-medium text-sm">
              {service.service_category}
            </span>
          </div>

          <h1 className="text-4xl md:text-5xl font-display font-black">
            {service.service_name}
          </h1>
          <p className="text-primary text-2xl font-bold">
            ৳ {service.cost} / {service.unit}
          </p>

          {/* RATINGS */}
          <div className="flex items-center gap-2 text-yellow-400">
            <FiStar /> <span className="font-semibold">{service.ratings}</span>
          </div>

          {/* DESCRIPTION */}
          <div>
            <h2 className="text-2xl font-display font-bold border-b border-primary/20 pb-2 mb-3">
              About This Service
            </h2>
            <p className="text-white/80 leading-relaxed">{service.description}</p>
          </div>

          {/* KEY FEATURES */}
          {service.key_feature?.length > 0 && (
            <div>
              <h2 className="text-2xl font-display font-bold border-b border-primary/20 pb-2 mb-3">
                Key Features
              </h2>
              <ul className="space-y-2 list-disc list-inside text-white/80">
                {service.key_feature.map((feat, idx) => (
                  <li key={idx}>{feat}</li>
                ))}
              </ul>
            </div>
          )}

          {/* GALLERY */}
          {service.gallery_image?.length > 0 && (
            <div>
              <h2 className="text-2xl font-display font-bold border-b border-primary/20 pb-2 mb-3">
                Gallery
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {service.gallery_image.map((img, idx) => (
                  <div
                    key={idx}
                    className="aspect-square w-full rounded-lg bg-cover bg-center shadow-md"
                    style={{ backgroundImage: `url(${img})` }}
                  />
                ))}
              </div>
            </div>
          )}
        </div>

        {/* RIGHT SIDEBAR */}
        <div className="lg:w-1/3 lg:sticky lg:top-28 self-start">
          <div className="flex flex-col gap-4 p-6 rounded-xl border border-primary/20 bg-black/50 backdrop-blur-md">
            <h3 className="font-display text-xl font-bold text-white">
              Service at a Glance
            </h3>
            <ul className="space-y-3">
              {service.key_feature?.map((feat, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="material-symbols-outlined text-primary mt-1 text-base">
                    <FaCheckCircle />
                  </span>
                  <span className="text-white/80">{feat}</span>
                </li>
              ))}
            </ul>
            <button
              onClick={handleBookingClick}
              className="mt-4 w-full h-12 bg-primary text-black font-bold rounded-full hover:shadow-[0_0_20px_0_rgba(212,175,55,0.7)] transition-shadow"
            >
              Book This Service
            </button>
          </div>
        </div>
      </div>

      {/* Booking Modal */}
      {isBookingOpen && (
        <BookingModal
          service={service}
          user={user}
          onClose={() => setIsBookingOpen(false)}
        />
      )}
    </div>
  );
};

export default ServiceDetail;
