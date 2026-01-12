import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useParams, Link, useNavigate } from "react-router";
import { FiArrowLeft, FiStar, FiCheck, FiMapPin, FiClock, FiDollarSign } from "react-icons/fi";
import { FaCheckCircle } from "react-icons/fa";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

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
      <div className="min-h-screen bg-base-100 pb-20 pt-32 animate-pulse">
        {/* Skeleton Header */}
        <div className="flex flex-col items-center gap-4 mb-12">
            <div className="h-6 w-32 bg-base-300 rounded-full"></div>
            <div className="h-16 w-3/4 max-w-2xl bg-base-300 rounded-xl"></div>
            <div className="h-4 w-64 bg-base-300 rounded-full"></div>
        </div>

        <div className="container mx-auto px-6 max-w-7xl">
            {/* Skeleton Hero Image */}
            <div className="w-full h-[350px] md:h-[500px] bg-base-300 rounded-[32px] mb-20"></div>

            <div className="flex flex-col lg:flex-row gap-16">
                {/* Skeleton Left Content */}
                <div className="flex-1 space-y-12">
                    <div className="space-y-4">
                        <div className="h-8 w-40 bg-base-300 rounded-lg"></div>
                        <div className="h-4 w-full bg-base-300 rounded"></div>
                        <div className="h-4 w-full bg-base-300 rounded"></div>
                        <div className="h-4 w-5/6 bg-base-300 rounded"></div>
                    </div>
                    <div className="grid grid-cols-2 gap-6">
                        <div className="h-20 bg-base-300 rounded-xl"></div>
                        <div className="h-20 bg-base-300 rounded-xl"></div>
                    </div>
                     <div className="h-64 bg-base-300 rounded-2xl"></div>
                </div>

                {/* Skeleton Right Sidebar */}
                <div className="lg:w-[400px]">
                    <div className="h-[400px] bg-base-300 rounded-3xl"></div>
                </div>
            </div>
        </div>
      </div>
    );

  if (isError || !service)
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-center text-error bg-base-100">
        <p className="text-xl font-bold mb-4">Service not found or failed to load.</p>
        <Link to="/services" className="btn btn-outline btn-primary">
          Back to Services
        </Link>
      </div>
    );

  const handleBookingClick = () => {
    if (!user) {
      navigate("/login");
    } else {
      setIsBookingOpen(true);
    }
  };

  return (
    <div className="min-h-screen bg-base-100 font-sans text-base-content selection:bg-primary/30 pb-20">
      
      {/* === HERO SECTION === */}
      <div className="relative h-[60vh] md:h-[70vh] w-full overflow-hidden">
        {/* Parallax-like Background Image */}
        <div className="absolute inset-0">
             <img
                src={service.image}
                alt={service.service_name}
                className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-base-100 via-base-100/50 to-transparent md:via-black/40" />
            <div className="absolute inset-0 bg-black/30" />
        </div>

        {/* Content Overlay */}
        <div className="absolute bottom-0 left-0 w-full z-10 pb-12 md:pb-20 pt-32 bg-gradient-to-t from-base-100 to-transparent">
            <div className="container mx-auto px-6">
                <Link to="/services" className="inline-flex items-center gap-2 text-white/80 hover:text-primary transition-colors mb-6 backdrop-blur-md bg-black/20 px-4 py-2 rounded-full border border-white/10 uppercase tracking-widest text-xs font-bold">
                    <FiArrowLeft /> Back to Services
                </Link>

                <div className="flex flex-col md:flex-row items-end justify-between gap-6">
                    <motion.div 
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        className="space-y-4 max-w-3xl"
                    >
                         <div className="flex items-center gap-3">
                            <span className="badge badge-primary badge-lg text-primary-content font-bold uppercase tracking-widest rounded-sm">
                                {service.service_category}
                            </span>
                            <div className="flex items-center gap-1 text-yellow-400 bg-black/40 backdrop-blur-sm px-3 py-1 rounded-full border border-yellow-500/30">
                                <FiStar fill="currentColor" />
                                <span className="font-bold text-sm tracking-wide">{service.ratings} (Premium)</span>
                            </div>
                        </div>
                        <h1 className="text-4xl md:text-6xl lg:text-7xl font-display font-black text-white leading-tight drop-shadow-2xl">
                            {service.service_name}
                        </h1>
                    </motion.div>
                </div>
            </div>
        </div>
      </div>

      {/* === MAIN CONTENT === */}
      <div className="container mx-auto px-6 -mt-10 relative z-20">
        <div className="flex flex-col lg:flex-row gap-12">
            
            {/* LEFT COLUMN: Details & Gallery */}
            <motion.div 
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="flex-1 space-y-16"
            >
                {/* Description */}
                <section>
                    <h2 className="text-2xl font-serif font-bold text-primary mb-6 flex items-center gap-3">
                        <span className="h-px w-12 bg-primary/50"></span>
                        About This Experience
                    </h2>
                    <p className="text-lg text-base-content/80 leading-loose border-l-4 border-primary/30 pl-6 italic">
                        {service.description}
                    </p>
                </section>

                {/* Key Features Grid */}
                {service.key_feature?.length > 0 && (
                    <section>
                         <h2 className="text-2xl font-serif font-bold text-primary mb-8 flex items-center gap-3">
                            <span className="h-px w-12 bg-primary/50"></span>
                            Curated Features
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {service.key_feature.map((feat, idx) => (
                                <div key={idx} className="flex items-start gap-4 p-5 rounded-xl bg-base-200/50 border border-base-300 hover:border-primary/40 transition-colors group">
                                    <div className="p-2 bg-primary/10 rounded-full text-primary group-hover:bg-primary group-hover:text-black transition-colors">
                                        <FiCheck size={18} />
                                    </div>
                                    <span className="text-base-content/80 font-medium pt-1">{feat}</span>
                                </div>
                            ))}
                        </div>
                    </section>
                )}

                 {/* Gallery Section */}
                  {service.gallery_image?.length > 0 && (
                    <section>
                        <h2 className="text-2xl font-serif font-bold text-primary mb-8 flex items-center gap-3">
                            <span className="h-px w-12 bg-primary/50"></span>
                            Visual Showcase
                        </h2>
                        <div className="grid grid-cols-2 gap-4 md:h-[500px]">
                            {/* Main Large Image */}
                             <div 
                                className="col-span-2 md:col-span-1 h-64 md:h-full rounded-2xl bg-cover bg-center shadow-lg hover:shadow-2xl transition-all duration-500 hover:scale-[1.01]"
                                style={{ backgroundImage: `url(${service.gallery_image[0]})` }} 
                             />
                             {/* Smaller Grid */}
                             <div className="col-span-2 md:col-span-1 grid grid-cols-2 gap-4 h-full">
                                {service.gallery_image.slice(1, 5).map((img, idx) => (
                                    <div
                                        key={idx}
                                        className="w-full h-32 md:h-full rounded-xl bg-cover bg-center shadow-md hover:shadow-xl transition-all duration-300 hover:scale-[1.02]"
                                        style={{ backgroundImage: `url(${img})` }}
                                    />
                                ))}
                             </div>
                        </div>
                    </section>
                  )}
            </motion.div>


            {/* RIGHT COLUMN: Sticky Booking Card */}
            <motion.div 
                 initial={{ opacity: 0, x: 20 }}
                 animate={{ opacity: 1, x: 0 }}
                 transition={{ duration: 0.8, delay: 0.4 }}
                 className="lg:w-[400px] relative mt-10 md:mt-0"
            >
                <div className="lg:sticky lg:top-32 space-y-6">
                    <div className="p-8 rounded-3xl bg-base-100/80 backdrop-blur-xl border border-primary/20 shadow-[0_0_50px_-10px_rgba(0,0,0,0.2)] dark:shadow-[0_0_50px_-10px_rgba(255,215,0,0.1)] relative overflow-hidden">
                        
                        {/* Decorative Gradient Blob */}
                        <div className="absolute -top-20 -right-20 w-40 h-40 bg-primary/20 rounded-full blur-3xl pointer-events-none" />

                        <div className="relative z-10">
                            <p className="text-center text-sm font-bold tracking-widest text-primary/70 uppercase mb-2">Starting From</p>
                            <div className="text-center mb-8 pb-8 border-b border-dashed border-base-content/20">
                                <h3 className="text-5xl font-black text-primary font-serif">
                                    {service.cost}
                                    <span className="text-lg font-sans font-medium text-base-content/50 ml-1">BDT</span>
                                </h3>
                                <p className="text-sm text-base-content/60 mt-2"> {service.unit}</p>
                            </div>

                            <div className="space-y-4 mb-8">
                                <div className="flex items-center justify-between text-base-content/80 text-sm">
                                    <div className="flex items-center gap-2">
                                        <FiClock className="text-primary"/> Duration
                                    </div>
                                    <span className="font-bold">Flexible</span>
                                </div>
                                <div className="flex items-center justify-between text-base-content/80 text-sm">
                                    <div className="flex items-center gap-2">
                                        <FiMapPin className="text-primary"/> Location
                                    </div>
                                    <span className="font-bold">Anywhere</span>
                                </div>
                                <div className="flex items-center justify-between text-base-content/80 text-sm">
                                    <div className="flex items-center gap-2">
                                        <FaCheckCircle className="text-primary"/> Consultant
                                    </div>
                                    <span className="font-bold">Expert Included</span>
                                </div>
                            </div>

                            <button
                                onClick={handleBookingClick}
                                className="w-full py-4 bg-primary text-black font-bold text-lg rounded-full shadow-lg shadow-primary/30 hover:shadow-primary/50 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 uppercase tracking-widest cursor-pointer"
                            >
                                Book Experience
                            </button>
                            
                            <p className="text-center text-xs text-base-content/40 mt-4">
                                No credit card required for initial inquiry.
                            </p>
                        </div>
                    </div>

                    {/* Help Card */}
                    <div className="p-6 rounded-2xl bg-base-200/50 border border-base-200 text-center">
                        <h4 className="font-bold text-base-content mb-2">Need Customization?</h4>
                        <p className="text-sm text-base-content/60 mb-4">We tailor every detail to your vision.</p>
                        <Link to="/contact" className="text-primary text-sm font-bold hover:underline">Contact Support</Link>
                    </div>
                </div>
            </motion.div>
        
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
