import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useState } from "react";
import ServiceCard from "../../components/ServiceCard";
import { FiFilter, FiSearch, FiDollarSign, FiZap } from "react-icons/fi";

// Skeleton Component Definitions
const ServiceCardSkeleton = () => (
  <div className="card bg-base-100 shadow-xl animate-pulse overflow-hidden">
    <div className="h-48 bg-base-300"></div>
    <div className="card-body p-6">
      <div className="h-6 bg-base-300 rounded w-3/4 mb-3"></div>
      <div className="h-4 bg-base-300 rounded w-full mb-2"></div>
      <div className="h-4 bg-base-300 rounded w-5/6 mb-4"></div>
      <div className="h-8 bg-primary/20 rounded w-1/3 mt-4"></div>
    </div>
  </div>
);

// Filter Content Component
const FilterSidebarContent = ({
  search,
  setSearch,
  category,
  setCategory,
  categories,
  minBudget,
  setMinBudget,
  maxBudget,
  setMaxBudget,
  refetch,
}) => (
  <>
    {/* SEARCH */}
    <div className="mb-6">
      <label className="font-semibold text-white/90 flex items-center mb-2">
        <FiSearch size={16} className="mr-2 text-primary" /> Search Service
      </label>
      <input
        type="text"
        placeholder="e.g., Wedding Decor"
        className="input input-bordered input-primary w-full mt-1 bg-base-200"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        onBlur={refetch}
        onKeyDown={(e) => e.key === "Enter" && refetch()}
      />
    </div>

    {/* CATEGORY */}
    <div className="mb-6">
      <label className="font-semibold text-white/90 flex items-center mb-2">
        <FiZap size={16} className="mr-2 text-primary" /> Category
      </label>
      <select
        value={category}
        className="select select-bordered select-primary w-full mt-1 bg-base-200"
        onChange={(e) => {
          setCategory(e.target.value);
          refetch();
        }}
      >
        {categories.map((cat) => (
          <option key={cat} value={cat}>
            {cat === "all"
              ? "All Categories"
              : cat.charAt(0).toUpperCase() + cat.slice(1)}
          </option>
        ))}
      </select>
    </div>

    {/* BUDGET */}
    <div className="mb-8">
      <label className="font-semibold text-white/90 flex items-center mb-2">
        <FiDollarSign size={16} className="mr-2 text-primary" /> Budget (BDT)
      </label>
      <div className="flex gap-2 mt-1">
        <input
          type="number"
          placeholder="Min"
          className="input input-bordered input-sm w-full bg-base-200"
          value={minBudget}
          onChange={(e) => setMinBudget(e.target.value)}
          onBlur={refetch}
          onKeyDown={(e) => e.key === "Enter" && refetch()}
        />
        <input
          type="number"
          placeholder="Max"
          className="input input-bordered input-sm w-full bg-base-200"
          value={maxBudget}
          onChange={(e) => setMaxBudget(e.target.value)}
          onBlur={refetch}
          onKeyDown={(e) => e.key === "Enter" && refetch()}
        />
      </div>
    </div>

    {/* RESET */}
    <button
      className="btn btn-outline btn-sm btn-primary w-full"
      onClick={() => {
        setSearch("");
        setCategory("all");
        setMinBudget("");
        setMaxBudget("");
        setTimeout(refetch, 0);
      }}
    >
      Reset All Filters
    </button>
  </>
);

// --- Main Component ---
const Services = () => {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [minBudget, setMinBudget] = useState("");
  const [maxBudget, setMaxBudget] = useState("");
  const [openSidebar, setOpenSidebar] = useState(false);

  const categories = [
    "all",
    "home",
    "wedding",
    "office",
    "seminar",
    "meeting",
    "birthday",
  ];

  // React Query fetch
  const {
    data: services = [],
    refetch,
    isFetching,
  } = useQuery({
    queryKey: ["services", search, category, minBudget, maxBudget],
    queryFn: async () => {
      const params = {
        ...(search && { search }),
        ...(category !== "all" && { category }),
        ...(minBudget && { minBudget }),
        ...(maxBudget && { maxBudget }),
      };
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/services`, {
        params,
      });
      return res.data;
    },
  });

  const itemsPerSkeleton = 9;

  return (
    <section className="bg-base-200 min-h-screen">
      <div className="container mx-auto px-4 py-16 md:py-24">
        {/* PAGE TITLE */}
        <div className="mb-12 text-center mt-18">
          <h1 className="text-4xl md:text-5xl font-extrabold font-serif text-primary">
            LuxePlan's Elite Portfolio
          </h1>
          <p className="text-base-content/70 mt-3 text-lg">
            Browse, filter, and discover services tailored to your exclusive
            needs.
          </p>
        </div>

        {/* MOBILE FILTER BUTTON */}
        <button
          className="btn btn-primary md:hidden mb-6 flex items-center gap-2 shadow-lg w-full"
          onClick={() => setOpenSidebar(true)}
        >
          <FiFilter /> Show Filters
        </button>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
          {/* --- MOBILE SIDEBAR --- */}
          <div
            className={`md:hidden fixed top-0 ${
              openSidebar ? "left-0" : "-left-full"
            } w-64 h-full bg-base-100 border border-base-200 shadow-xl p-5 z-50 transition-all duration-300 overflow-y-auto`}
          >
            <div className="flex justify-between items-center mb-5">
              <h2 className="text-lg font-bold text-white">Filters</h2>
              <button
                className="btn btn-sm btn-ghost"
                onClick={() => setOpenSidebar(false)}
              >
                Close
              </button>
            </div>

            <FilterSidebarContent
              search={search}
              setSearch={setSearch}
              category={category}
              setCategory={setCategory}
              categories={categories}
              minBudget={minBudget}
              setMinBudget={setMinBudget}
              maxBudget={maxBudget}
              setMaxBudget={setMaxBudget}
              refetch={refetch}
            />
          </div>

          {/* Overlay for mobile */}
          {openSidebar && (
            <div
              className="fixed inset-0 bg-black/50 md:hidden z-40"
              onClick={() => setOpenSidebar(false)}
            />
          )}

          {/* Overlay backdrop for mobile */}
          {openSidebar && (
            <div
              className="fixed inset-0 bg-black/50 md:hidden z-40"
              onClick={() => setOpenSidebar(false)}
            />
          )}

          {/* --- DESKTOP SIDEBAR --- */}
          <aside className="hidden md:block md:col-span-3">
            <div
              className="
              bg-base-100 border border-base-200 rounded-xl shadow-md p-5
              md:sticky md:top-30 md:max-h-[425px] overflow-y-auto
              "
            >
              <FilterSidebarContent
                search={search}
                setSearch={setSearch}
                category={category}
                setCategory={setCategory}
                categories={categories}
                minBudget={minBudget}
                setMinBudget={setMinBudget}
                maxBudget={maxBudget}
                setMaxBudget={setMaxBudget}
                refetch={refetch}
              />
            </div>
          </aside>

          {/* SERVICES GRID - Use col-span-9 to match sidebar */}
          <main className="md:col-span-9">
            {isFetching ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(itemsPerSkeleton)].map((_, idx) => (
                  <ServiceCardSkeleton key={idx} />
                ))}
              </div>
            ) : services.length === 0 ? (
              <div className="p-10 bg-base-100 rounded-xl shadow-xl text-center">
                <p className="text-xl text-primary font-semibold mb-2">
                  No services matched your criteria.
                </p>
                <p className="text-base-content/70">
                  Try adjusting your search terms or broadening your budget and
                  category filters.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {services.map((item) => (
                  <ServiceCard key={item._id} service={item} />
                ))}
              </div>
            )}
          </main>
        </div>
      </div>
    </section>
  );
};

export default Services;
