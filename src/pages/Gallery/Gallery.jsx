import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiX, FiMaximize2, FiArrowRight } from "react-icons/fi";

const Gallery = () => {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedImage, setSelectedImage] = useState(null);

  const categories = ["All", "Weddings", "Corporate", "Social", "Decor"];

  const images = [
    {
      id: 1,
      category: "Weddings",
      src: "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?q=80&w=1200&auto=format&fit=crop",
      title: "Grand Ballroom Nuptials",
      size: "tall",
    },
    {
      id: 2,
      category: "Corporate",
      src: "https://www.amchamthailand.com/wp-content/uploads/2024/10/Corporate-Innovation-Summit-2024-4.png",
      title: "Innovation Summit 2024",
      size: "wide",
    },
    {
      id: 3,
      category: "Social",
      src: "https://images.unsplash.com/photo-1470337458703-46ad1756a187?q=80&w=1200&auto=format&fit=crop",
      title: "Midnight Cocktail Soirée",
      size: "standard",
    },
    {
      id: 4,
      category: "Decor",
      src: "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?q=80&w=1200&auto=format&fit=crop",
      title: "Crystal Table Scapes",
      size: "tall",
    },
    {
      id: 5,
      category: "Weddings",
      src: "https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=1200&auto=format&fit=crop",
      title: "Coastal Ceremony",
      size: "standard",
    },
    {
      id: 6,
      category: "Corporate",
      src: "https://images.unsplash.com/photo-1505373877841-8d25f7d46678?q=80&w=1200&auto=format&fit=crop",
      title: "Executive Gala",
      size: "wide",
    },
    {
      id: 7,
      category: "Decor",
      src: "https://images.unsplash.com/photo-1513151233558-d860c5398176?q=80&w=1200&auto=format&fit=crop",
      title: "Minimalist Floral Art",
      size: "standard",
    },
    {
      id: 8,
      category: "Social",
      src: "https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?q=80&w=1200&auto=format&fit=crop",
      title: "Private Estate Party",
      size: "tall",
    },
    {
      id: 9,
      category: "Weddings",
      src: "https://images.unsplash.com/photo-1510076857177-7470076d4098?q=80&w=1200&auto=format&fit=crop",
      title: "The Altar Glow",
      size: "tall",
    },
    {
      id: 10,
      category: "Corporate",
      src: "https://images.unsplash.com/photo-1511578314322-379afb476865?q=80&w=1200&auto=format&fit=crop",
      title: "Networking Lounge",
      size: "standard",
    },
    {
      id: 11,
      category: "Decor",
      src: "https://images.unsplash.com/photo-1520854221256-17451cc331bf?q=80&w=1200&auto=format&fit=crop",
      title: "Luminous Hanging Florals",
      size: "wide",
    },
    {
      id: 12,
      category: "Social",
      src: "https://images.stockcake.com/public/e/a/d/eade4a42-3358-48e9-9688-caadd8928993_large/sunset-tea-party-stockcake.jpg",
      title: "Outdoor Anniversary Tea",
      size: "standard",
    },
    {
      id: 13,
      category: "Weddings",
      src: "https://chandelierslife.com/cdn/shop/articles/thumbnail_7a73d8a7-dd2e-476f-954e-814da754cb4a.jpg?v=1765996705",
      title: "Rustic Chandelier Night",
      size: "wide",
    },
    {
      id: 16,
      category: "Weddings",
      src: "https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?q=80&w=1200&auto=format&fit=crop",
      title: "Ethereal Bridal Suite",
      size: "tall",
    },
    {
      id: 15,
      category: "Social",
      src: "https://images.unsplash.com/photo-1527529482837-4698179dc6ce?q=80&w=1200&auto=format&fit=crop",
      title: "Vibrant Celebration",
      size: "standard",
    },
  ];

  const filteredImages =
    selectedCategory === "All"
      ? images
      : images.filter((img) => img.category === selectedCategory);

  return (
    <div className="min-h-screen  text-base-content font-sans selection:bg-primary/30">
     
      {/* Standard Page Heading */}
      <div className="container mx-auto px-4 pt-32 pb-12 text-center">
        <motion.h1 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-4xl md:text-5xl font-extrabold font-serif text-primary mb-4"
        >
          Our Portfolio
        </motion.h1>
        <motion.p 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-base-content/70 text-lg max-w-2xl mx-auto"
        >
          Explore our curated collection of breathtaking events and avant-garde designs.
        </motion.p>
      </div>

      <main className="max-w-7xl mx-auto px-6 py-16 relative z-20">
        {/* Refined Filter Bar */}
        <div className="flex flex-wrap justify-center gap-8 mb-16">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`relative px-6 py-2 rounded-full text-sm uppercase tracking-widest transition-colors duration-300 font-medium cursor-pointer z-10
                ${
                  selectedCategory === cat
                    ? "text-primary-content"
                    : "text-base-content/60 hover:text-primary"
                }`}
            >
              {cat}
              {selectedCategory === cat && (
                <motion.div
                  layoutId="activeCategory"
                  className="absolute inset-0 bg-primary rounded-full -z-10"
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                />
              )}
            </button>
          ))}
        </div>

        {/* Masonry Grid */}
        <motion.div
          layout
          className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6"
        >
          <AnimatePresence mode="popLayout">
            {filteredImages.map((image) => (
              <motion.div
                layout
                key={image.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.4 }}
                className="relative group cursor-pointer break-inside-avoid rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 will-change-transform"
                onClick={() => setSelectedImage(image)}
              >
                <div className="relative overflow-hidden bg-base-200">
                  <img
                    src={image.src}
                    alt={image.title}
                    className="w-full h-full object-cover grayscale-[0.1] group-hover:grayscale-0 transition-all duration-700 group-hover:scale-110"
                    loading="lazy"
                  />
                  {/* Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500">
                    <div className="absolute bottom-0 left-0 p-8 w-full">
                      <p className="text-primary text-xs uppercase tracking-widest mb-2">
                        {image.category}
                      </p>
                      <h3 className="text-xl font-medium text-white mb-4 font-serif">
                        {image.title}
                      </h3>
                      <div className="flex items-center text-white/80 text-sm gap-2 uppercase tracking-wider text-xs">
                        View Project <FiArrowRight className="text-primary" />
                      </div>
                    </div>
                    <div className="absolute top-6 right-6">
                      <div className="p-3 bg-white/10 backdrop-blur-md rounded-full text-white hover:bg-primary hover:text-black transition-colors">
                        <FiMaximize2 className="text-lg" />
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </main>

      {/* Luxury Lightbox */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-sm flex items-center justify-center p-6 md:p-12 cursor-pointer"
            onClick={() => setSelectedImage(null)}
          >
            <button className="absolute top-8 right-8 text-white/50 hover:text-white transition-colors z-[110] cursor-pointer">
              <FiX size={32} />
            </button>

            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
              className="relative max-w-6xl w-full grid md:grid-cols-4 bg-base-100 rounded-3xl overflow-hidden shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="md:col-span-3 overflow-hidden h-[50vh] md:h-[80vh] relative">
                <img
                  src={selectedImage.src}
                  alt={selectedImage.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent md:hidden" />
              </div>
              <div className="p-8 md:p-12 flex flex-col justify-center bg-base-100">
                <span className="text-primary uppercase tracking-widest text-xs mb-4 font-bold">
                  {selectedImage.category}
                </span>
                <h3 className="text-3xl font-serif mb-6 leading-tight text-base-content">
                  {selectedImage.title}
                </h3>
                <p className="text-base-content/70 text-sm leading-relaxed mb-8">
                  Creating unforgettable moments through meticulous planning and
                  avant-garde design. Every detail is a testament to our
                  commitment to excellence.
                </p>
                <button className="btn btn-outline btn-primary rounded-full px-8 uppercase tracking-widest text-xs">
                  Inquire Now
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Gallery;
