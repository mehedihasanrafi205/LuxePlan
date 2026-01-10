import React from "react";

const FAQ = () => {
  const faqs = [
    {
        q: "Do you offer free consultations?",
        a: "Yes! We offer a complimentary 30-minute initial consultation to discuss your vision and requirements."
    },
    {
        q: "What is the typical timeline for a project?",
        a: "Timelines vary by scope. A single room refresh might take 2 weeks, while a full renovation could take 2-3 months."
    },
    {
        q: "Can I choose my own materials?",
        a: "Absolutely. We can work with your preferred vendors or source high-quality materials from our exclusive partners."
    },
    {
        q: "Do you handle commercial projects?",
        a: "Yes, we specialize in both residential and commercial spaces including offices, retail stores, and lobbies."
    }
  ];

  return (
    <div className="py-24 bg-base-100">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="text-center mb-16">
          <span className="text-primary uppercase tracking-widest text-sm font-semibold">
            FAQ
          </span>
          <h2 className="text-4xl md:text-5xl font-serif font-bold mt-3">
            Common Questions
          </h2>
        </div>

        <div className="join join-vertical w-full">
          {faqs.map((faq, index) => (
            <div key={index} className="collapse collapse-plus join-item border-b border-base-300">
              <input type="radio" name="my-accordion-4" defaultChecked={index === 0} />
              <div className="collapse-title text-xl font-medium font-serif">
                {faq.q}
              </div>
              <div className="collapse-content">
                <p className="text-base-content/70">{faq.a}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FAQ;
