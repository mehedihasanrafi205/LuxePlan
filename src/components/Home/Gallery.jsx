import React from "react";

const Gallery = () => {
    // Ideally use real images or placeholders
    const images = [
        "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?q=80&w=600&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?q=80&w=600&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1616137466211-f939a420be84?q=80&w=600&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1616594039964-40891a90b3c9?q=80&w=600&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1617806118233-18e1de247200?q=80&w=600&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?q=80&w=600&auto=format&fit=crop"
    ];

  return (
    <div className="py-24 bg-base-200">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <span className="text-primary uppercase tracking-widest text-sm font-semibold">
            Portfolio
          </span>
          <h2 className="text-4xl md:text-5xl font-serif font-bold mt-3">
            Our Recent Works
          </h2>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {images.map((src, idx) => (
                <div key={idx} className="group relative overflow-hidden rounded-2xl h-64 md:h-80 cursor-pointer">
                    <img 
                        src={src} 
                        alt={`Gallery ${idx}`} 
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                        <span className="text-white font-serif text-xl border-b-2 border-primary pb-1">View Project</span>
                    </div>
                </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default Gallery;
