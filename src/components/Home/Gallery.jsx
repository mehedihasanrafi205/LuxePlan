import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiX, FiMaximize2, FiArrowRight } from "react-icons/fi";

const Gallery = () => {
  const [selectedImage, setSelectedImage] = useState(null);

  // Curated list of 3 premium images for the Home Page
  const images = [
    {
      id: 1,
      category: "Weddings",
      src: "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?q=80&w=1200&auto=format&fit=crop",
      title: "Grand Ballroom Nuptials",
    },
    {
      id: 4,
      category: "Decor",
      src: "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?q=80&w=1200&auto=format&fit=crop",
      title: "Crystal Table Scapes",
    },
    {
      id: 2,
      category: "Corporate",
      src: "https://www.amchamthailand.com/wp-content/uploads/2024/10/Corporate-Innovation-Summit-2024-4.png",
      title: "Innovation Summit 2024",
    },
  ];

  return (
    <div className="py-24 md:py-32 bg-base-100 relative text-base-content font-sans selection:bg-primary/30">
        
        {/* Background Decor */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-[100px] pointer-events-none" />

      {/* Standard Section Heading */}
      <div className="container mx-auto px-4 text-center mb-16 relative z-10">
          <span className="text-primary uppercase tracking-[0.2em] text-sm font-semibold mb-2 block">
            Portfolio
          </span>
          <h2 className="text-4xl md:text-5xl font-extrabold font-serif text-primary mb-4 leading-tight">
            Our Recent Works
          </h2>
          <p className="text-base-content/70 max-w-2xl mx-auto text-lg leading-relaxed">
            A glimpse into our world of elegance and precision.
          </p>
      </div>

      <main className="container mx-auto px-4 relative z-20">
        
        {/* Curated Grid - 3 Column Focus */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {images.map((image, index) => (
              <motion.div
                key={image.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="relative group cursor-pointer rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 h-[300px] md:h-[500px] will-change-transform" 
                onClick={() => setSelectedImage(image)}
              >
                <div className="relative w-full h-full bg-base-200">
                  <img
                    src={image.src}
                    alt={image.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    loading="lazy"
                  />
                  {/* Premium Overlay */}
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-all duration-300 flex flex-col justify-end p-8">
                      <div className="transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                        <p className="text-primary text-xs uppercase tracking-widest mb-2 font-semibold">
                            {image.category}
                        </p>
                        <h3 className="text-2xl font-serif text-white mb-4">
                            {image.title}
                        </h3>
                        <div className="flex items-center gap-3 text-white/90 text-sm uppercase tracking-wide group-hover:gap-4 transition-all">
                             View Project <FiArrowRight className="text-primary" />
                        </div>
                      </div>
                  </div>
                  
                  {/* Icon */}
                  <div className="absolute top-4 right-4 translate-x-4 -translate-y-4 opacity-0 group-hover:translate-x-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500 delay-100">
                      <div className="bg-white/10 backdrop-blur-md p-3 rounded-full text-white hover:bg-primary hover:text-black transition-colors">
                        <FiMaximize2 />
                      </div>
                  </div>
                </div>
              </motion.div>
            ))}
        </div>
        
        {/* View All Button */}
        <div className="text-center mt-12">
            <p className="text-xl text-base-content/70 mb-6">
                Browse our complete collection of unforgettable moments.
            </p>
            <a href="/gallery" className="btn btn-primary btn-lg shadow-2xl shadow-primary/50 transition-all duration-300 hover:scale-[1.05] hover:shadow-primary/70 group">
                VIEW FULL GALLERY <FiArrowRight size={22} className="ml-2 group-hover:translate-x-1 transition-transform" />
            </a>
        </div>
      </main>

      {/* Lightbox */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-sm flex items-center justify-center p-6 cursor-pointer"
            onClick={() => setSelectedImage(null)}
          >
            <button className="absolute top-8 right-8 text-white/50 hover:text-white transition-colors z-[110]">
              <FiX size={32} />
            </button>

            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative max-w-5xl w-full max-h-[90vh] bg-transparent rounded-none shadow-none"
              onClick={(e) => e.stopPropagation()}
            >
                <img
                  src={selectedImage.src}
                  alt={selectedImage.title}
                  className="w-full h-full object-contain rounded-lg shadow-2xl"
                />
                <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/80 to-transparent text-white text-center">
                    <h3 className="text-2xl font-serif">{selectedImage.title}</h3>
                    <p className="text-white/70 text-sm mt-1 uppercase tracking-widest">{selectedImage.category}</p>
                </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Gallery;
