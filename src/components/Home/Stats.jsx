import React from "react";
import { FiUsers, FiCheckCircle, FiAward, FiCalendar } from "react-icons/fi";

const Stats = () => {
  const stats = [
    { icon: <FiUsers size={32} />, value: "500+", label: "Happy Clients" },
    { icon: <FiCheckCircle size={32} />, value: "1200+", label: "Projects Done" },
    { icon: <FiAward size={32} />, value: "50+", label: "Awards Won" },
    { icon: <FiCalendar size={32} />, value: "10+", label: "Years Experience" },
  ];

  return (
    <div className="py-20 bg-base-100">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="text-center p-6 border border-primary/10 rounded-2xl bg-base-200/50 hover:bg-base-200 hover:scale-105 transition-all duration-300"
            >
              <div className="text-primary mb-4 flex justify-center">{stat.icon}</div>
              <h3 className="text-3xl md:text-4xl font-serif font-bold mb-2">
                {stat.value}
              </h3>
              <p className="text-base-content/70 uppercase tracking-widest text-sm">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Stats;
