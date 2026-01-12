import React from "react";
import { FiStar } from "react-icons/fi";
import { FaQuoteRight } from "react-icons/fa";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";

// Import Swiper styles
import "swiper/css";

const Testimonials = () => {
  const reviews = [
    {
      name: "Sarah Jenkins",
      role: "Homeowner",
      text: "LuxePlan transformed my living room into a dream space. The decorators were professional and the result is stunning!",
      img: "https://i.pravatar.cc/150?img=32",
      rating: 5
    },
    {
      name: "Michael Ross",
      role: "CEO, TechFlow",
      text: "We used them for our office renovation. Efficient, stylish, and within budget. The team understood our brand identity perfectly.",
      img: "https://i.pravatar.cc/150?img=11",
      rating: 5
    },
    {
      name: "Emily Dao",
      role: "Event Planner",
      text: "The best decoration service I've ever used. Their attention to detail is unmatched, and they truly care about the client's vision.",
      img: "https://i.pravatar.cc/150?img=5",
      rating: 5
    },
    {
      name: "James Carter",
      role: "Hotel Manager",
      text: "LuxePlan's work on our lobby has received endless compliments. They managed to blend luxury with functionality effortlessly.",
      img: "https://i.pravatar.cc/150?img=60",
      rating: 5
    },
    {
      name: "Olivia Martinez",
      role: "Interior Enthusiast",
      text: "I hired them for a birthday gala, and the ambiance they created was magical. Professional, creative, and timely.",
      img: "https://i.pravatar.cc/150?img=9",
      rating: 4
    },
    {
      name: "David Kim",
      role: "Restaurant Owner",
      text: "Our restaurant's new look is attracting so many more customers. LuxePlan knows how to design for impact and comfort.",
      img: "https://i.pravatar.cc/150?img=3",
      rating: 5
    }
  ];

  return (
    <div className="py-24 md:py-32 relative overflow-hidden">
        {/* CSS Override for smooth linear transition and Equal Height */}
        <style>
            {`
            .swiper-wrapper {
                transition-timing-function: linear !important;
                will-change: transform;
            }
            .swiper-slide {
                height: auto !important;
                display: flex;
            }
            `}
        </style>

      {/* Background Decor */}
   
      <div className="absolute bottom-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="w-full relative z-10 overflow-hidden">
        <div className="container mx-auto px-4 text-center mb-16">
          <span className="text-primary uppercase tracking-[0.2em] text-sm font-semibold mb-2 block">
            Testimonials
          </span>
          <h2 className="text-4xl md:text-5xl font-extrabold font-serif text-primary mb-4 leading-tight">
            What Our Clients Say
          </h2>
          <p className="text-base-content/70 max-w-2xl mx-auto text-lg leading-relaxed">
             Hear from our esteemed clients about their experiences with LuxePlan.
          </p>
        </div>

        <Swiper
            spaceBetween={30}
            centeredSlides={true}
            speed={5000} // Slow speed for continuous effect
            autoplay={{
                delay: 0,
                disableOnInteraction: false,
                pauseOnMouseEnter: true, // Allow user to pause by hovering
            }}
            loop={true}
            allowTouchMove={true} // Allow manual swipe if needed, but primarily auto
            breakpoints={{
                640: {
                    slidesPerView: 1,
                },
                768: {
                    slidesPerView: 2,
                },
                1024: {
                    slidesPerView: 3,
                },
            }}
            modules={[Autoplay]}
            className="mySwiper !pb-12"
        >
            {reviews.map((review, index) => (
                <SwiperSlide key={index} className="!h-auto">
                    <div className="group w-full p-10 rounded-[2rem] border border-primary/20 shadow-lg hover:shadow-2xl hover:shadow-primary/10 transition-all duration-500 h-full flex flex-col justify-between relative overflow-hidden bg-white/5 backdrop-blur-sm">
                        
                        {/* Quote Icon Background */}
                        <div className="absolute top-6 right-8 text-primary/10 group-hover:text-primary/20 transition-colors duration-500">
                            <FaQuoteRight size={80} />
                        </div>

                        {/* Content Top */}
                        <div className="relative z-10">
                            {/* Text */}
                            <p className="text-lg text-base-content/80 leading-relaxed italic mb-8">
                                "{review.text}"
                            </p>
                            
                             {/* Rating */}
                             <div className="flex gap-1 mb-6 text-yellow-500">
                                {[...Array(review.rating)].map((_, i) => (
                                    <FiStar key={i} fill="currentColor" size={18} />
                                ))}
                            </div>
                        </div>

                        {/* User Profile - Bottom */}
                        <div className="flex items-center gap-4 pt-6 border-t border-base-content/5 relative z-10">
                            <div className="avatar">
                                <div className="w-14 rounded-full ring-2 ring-primary ring-offset-2 ring-offset-base-100">
                                    <img src={review.img} alt={review.name} />
                                </div>
                            </div>
                            <div>
                                <h4 className="text-lg font-bold font-serif text-base-content">{review.name}</h4>
                                <p className="text-xs uppercase tracking-wider text-primary font-semibold">{review.role}</p>
                            </div>
                        </div>
                        
                        {/* Hover Gradient Line */}
                        <div className="w-0 group-hover:w-full h-1 bg-gradient-to-r from-primary/50 to-transparent absolute bottom-0 left-0 transition-all duration-700 ease-out" />
                    </div>
                </SwiperSlide>
            ))}
        </Swiper>
      </div>
    </div>
  );
};

export default Testimonials;
