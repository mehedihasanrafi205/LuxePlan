import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useState, useMemo } from "react";
import ServiceCard from "../../components/ServiceCard";
import { FiFilter } from "react-icons/fi";

const Services = () => {
  const { data: services = [], isLoading } = useQuery({
    queryKey: ["services"],
    queryFn: async () => {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/services`);
      return res.data;
    },
  });

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [minBudget, setMinBudget] = useState("");
  const [maxBudget, setMaxBudget] = useState("");
  const [openSidebar, setOpenSidebar] = useState(false);

  const categories = ["all", "home", "wedding", "office", "seminar", "meeting", "birthday"];

  const filteredServices = useMemo(() => {
    return services
      .filter((item) =>
        item.service_name.toLowerCase().includes(search.toLowerCase())
      )
      .filter((item) =>
        category === "all" ? true : item.service_category === category
      )
      .filter((item) =>
        minBudget ? item.cost >= Number(minBudget) : true
      )
      .filter((item) =>
        maxBudget ? item.cost <= Number(maxBudget) : true
      );
  }, [services, search, category, minBudget, maxBudget]);

  if (isLoading)
    return (
      <div className="min-h-screen flex items-center justify-center">
        <span className="loading loading-spinner loading-lg text-primary"></span>
      </div>
    );

  return (
    <div className="container mx-auto px-4 pb-15 pt-35">
      {/* PAGE TITLE */}
      <div className="mb-8 text-center">
        <h1 className="text-4xl font-bold text-primary">Our Premium Services</h1>
        <p className="text-gray-500 mt-1">Filter services based on category, budget & search.</p>
        <div className="w-24 h-1 bg-primary mx-auto mt-3 rounded-full"></div>
      </div>

      {/* MOBILE FILTER BUTTON */}
      <button
        className="btn btn-outline md:hidden mb-4 flex items-center gap-2"
        onClick={() => setOpenSidebar(true)}
      >
        <FiFilter /> Filters
      </button>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* SIDEBAR */}
        <div
          className={`md:col-span-1 bg-base-100 border border-base-200 rounded-xl shadow-md p-5
          md:sticky md:top-30 md:max-h-[425px] overflow-y-auto
          fixed top-0 ${openSidebar ? "left-0" : "-left-full"} w-64 md:w-full h-full transition-all duration-300 z-50`}
        >
          {/* Close button for mobile */}
          <div className="flex justify-between md:hidden mb-4">
            <h2 className="font-bold text-lg">Filters</h2>
            <button className="btn btn-sm" onClick={() => setOpenSidebar(false)}>
              Close
            </button>
          </div>

          {/* SEARCH */}
          <div className="mb-5">
            <label className="font-semibold">Search</label>
            <input
              type="text"
              placeholder="Search by name..."
              className="input input-bordered w-full mt-1"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          {/* CATEGORY */}
          <div className="mb-5">
            <label className="font-semibold">Category</label>
            <select
              value={category}
              className="select select-bordered w-full mt-1"
              onChange={(e) => setCategory(e.target.value)}
            >
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat === "all" ? "All Categories" : cat}
                </option>
              ))}
            </select>
          </div>

          {/* BUDGET */}
          <div className="mb-5">
            <label className="font-semibold">Budget (৳)</label>
            <div className="flex gap-2 mt-1">
              <input
                type="number"
                placeholder="Min"
                className="input input-bordered w-full"
                value={minBudget}
                onChange={(e) => setMinBudget(e.target.value)}
              />
              <input
                type="number"
                placeholder="Max"
                className="input input-bordered w-full"
                value={maxBudget}
                onChange={(e) => setMaxBudget(e.target.value)}
              />
            </div>
          </div>

          {/* RESET */}
          <button
            className="btn btn-sm btn-outline w-full"
            onClick={() => {
              setSearch("");
              setCategory("all");
              setMinBudget("");
              setMaxBudget("");
            }}
          >
            Reset Filters
          </button>
        </div>

        {/* SERVICES GRID */}
        <div className="md:col-span-3">
          {filteredServices.length === 0 ? (
            <p className="text-gray-500 text-center">No services found.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredServices.map((item) => (
                <ServiceCard key={item._id} service={item} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Services;
