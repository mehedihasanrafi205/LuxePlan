import { Link } from "react-router";
import { FiArrowRight, FiStar } from "react-icons/fi";

const ServiceCard = ({ service }) => {
  return (
    <div className="bg-base-100 border border-base-300 rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden group">
      {/* IMAGE */}
      <div className="relative">
        <img
          referrerPolicy="no-referrer"
          src={service.image}
          alt={service.service_name}
          className="w-full h-60 object-cover group-hover:scale-105 transition-all duration-500"
        />

        {/* CATEGORY BADGE */}
        <div
          className="absolute top-3 left-3 px-4 py-1 rounded-full text-xs font-semibold 
                        bg-gradient-to-r from-primary/80 to-primary text-black shadow"
        >
          {service.service_category}
        </div>

        {/* GOLD OVERLAY HOVER */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500" />
      </div>

      {/* BODY */}
      <div className="p-5 space-y-3">
        {/* TITLE */}
        <h2 className="text-lg font-bold text-base-content group-hover:text-primary transition">
          {service.service_name}
        </h2>

        {/* PRICE */}
        <p className="text-primary font-semibold text-base">
          ৳ {service.cost}
          <span className="text-sm text-gray-500 font-medium">
            {" "}
            / {service.unit}
          </span>
        </p>

        {/* RATINGS */}
        <div className="flex items-center gap-1 text-yellow-500">
          <FiStar className="text-lg" />
          <span className="font-semibold">{service.ratings}</span>
        </div>

        {/* KEY FEATURES */}
        <ul className="text-sm text-gray-600 leading-6 space-y-1">
          {service.key_feature?.slice(0, 3).map((feat, i) => (
            <li key={i} className="flex items-start gap-2">
              <span className="text-primary font-bold">•</span>
              <span>{feat}</span>
            </li>
          ))}
        </ul>

        {/* DETAILS BUTTON */}
        <Link
          to={`/service/${service._id}`}
          className="btn btn-primary w-full mt-4 flex items-center justify-center gap-2 rounded-xl 
                     bg-primary text-black font-bold hover:bg-primary/80 transition"
        >
          View Details <FiArrowRight className="text-lg" />
        </Link>
      </div>
    </div>
  );
};

export default ServiceCard;
