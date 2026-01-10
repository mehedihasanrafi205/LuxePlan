import React from "react";
import { FiMessageSquare } from "react-icons/fi";

const Testimonials = () => {
  const reviews = [
    {
      name: "Sarah Jenkins",
      role: "Homeowner",
      text: "LuxePlan transformed my living room into a dream space. The decorators were professional and the result is stunning!",
      img: "https://i.pravatar.cc/150?img=32",
    },
    {
      name: "Michael Ross",
      role: "Business Owner",
      text: "We used them for our office renovation. Efficient, stylish, and within budget. Highly recommended!",
      img: "https://i.pravatar.cc/150?img=11",
    },
    {
      name: "Emily Dao",
      role: "Event Planner",
      text: "The best decoration service I've ever used. Their attention to detail is unmatched.",
      img: "https://i.pravatar.cc/150?img=5",
    },
  ];

  return (
    <div className="py-24 bg-base-200/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <span className="text-primary uppercase tracking-widest text-sm font-semibold">
            Testimonials
          </span>
          <h2 className="text-4xl md:text-5xl font-serif font-bold mt-3 mb-6">
            What Our Clients Say
          </h2>
          <div className="w-24 h-1 bg-primary mx-auto rounded-full"></div>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {reviews.map((review, index) => (
            <div
              key={index}
              className="bg-base-100 p-8 rounded-3xl border border-primary/10 shadow-lg hover:shadow-primary/5 transition-all duration-300 relative"
            >
              <FiMessageSquare className="absolute top-8 right-8 text-primary/10 text-6xl" />
              <div className="flex items-center gap-4 mb-6">
                <div className="avatar">
                  <div className="w-16 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
                    <img src={review.img} alt={review.name} />
                  </div>
                </div>
                <div>
                  <h4 className="text-xl font-bold font-serif">{review.name}</h4>
                  <p className="text-sm text-primary">{review.role}</p>
                </div>
              </div>
              <p className="text-base-content/80 italic leading-relaxed">
                "{review.text}"
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Testimonials;
