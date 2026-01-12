import React from "react";

const SkeletonLoader = ({ type, count = 1, className = "" }) => {
  // Card Skeleton (Image + Title + Text + Button)
  if (type === "card") {
    return (
      <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 ${className}`}>
        {Array.from({ length: count }).map((_, idx) => (
          <div key={idx} className="card card-compact bg-base-100 border border-base-200 rounded-2xl shadow-sm animate-pulse overflow-hidden">
            <div className="h-48 sm:h-60 bg-base-300 w-full"></div>
            <div className="card-body">
              <div className="h-6 bg-base-300 w-3/4 rounded mb-2"></div>
              <div className="h-4 bg-base-300 w-full rounded"></div>
              <div className="h-4 bg-base-300 w-5/6 rounded"></div>
              <div className="card-actions justify-between items-center mt-4">
                 <div className="h-6 bg-base-300 w-16 rounded"></div>
                 <div className="h-10 bg-base-300 w-28 rounded-lg"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  // Decorator Skeleton (Circle Avatar + Centered Text)
  if (type === "decorator") {
    return (
      <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 ${className}`}>
         {Array.from({ length: count }).map((_, idx) => (
            <div key={idx} className="card bg-base-100 shadow-xl p-6 animate-pulse items-center text-center border border-base-200 rounded-2xl">
                <div className="w-32 h-32 rounded-full bg-base-300 mb-6 mt-2"></div>
                <div className="h-6 bg-base-300 w-3/4 rounded mb-2"></div>
                <div className="h-4 bg-base-300 w-1/2 rounded mb-4"></div>
                <div className="flex gap-4 w-full justify-center mb-4">
                    <div className="h-8 w-16 bg-base-300 rounded"></div>
                    <div className="h-8 w-16 bg-base-300 rounded"></div>
                </div>
            </div>
         ))}
      </div>
    );
  }

  // Action Card Skeleton (Centered Icon + Text for Admin Dashboard)
  if (type === "action-card") {
    return (
      <div className={`grid grid-cols-1 md:grid-cols-3 gap-6 ${className}`}>
        {Array.from({ length: count }).map((_, idx) => (
          <div key={idx} className="card bg-base-200 border border-base-300 p-8 rounded-2xl shadow-lg animate-pulse flex flex-col items-center text-center">
            <div className="w-16 h-16 rounded-full bg-base-300 mb-4"></div>
            <div className="h-6 bg-base-300 w-1/2 rounded mb-2"></div>
            <div className="h-4 bg-base-300 w-3/4 rounded"></div>
          </div>
        ))}
      </div>
    );
  }

  // List Item Skeleton (Schedule/Project Item style)
  if (type === "list") {
    return (
      <div className={`flex flex-col gap-3 w-full ${className}`}>
        {Array.from({ length: count }).map((_, idx) => (
          <div key={idx} className="flex justify-between items-start w-full p-4 border border-base-200 rounded-xl animate-pulse bg-base-100 shadow-sm">
            <div className="space-y-2 w-2/3">
              <div className="h-5 bg-base-300 w-3/4 rounded"></div>
              <div className="h-3 bg-base-300 w-1/2 rounded"></div>
            </div>
            <div className="h-6 w-16 bg-base-300 rounded-full"></div>
          </div>
        ))}
      </div>
    );
  }

  // Table Skeleton
  if (type === "table") {
    return (
        <div className={`overflow-x-auto w-full border border-base-200 rounded-xl ${className}`}>
             <table className="table w-full">
                <thead>
                    <tr>
                        {Array.from({ length: 4 }).map((_, i) => <th key={i}><div className="h-4 w-20 bg-base-300 rounded animate-pulse"></div></th>)}
                    </tr>
                </thead>
                <tbody>
                 {Array.from({ length: count }).map((_, idx) => (
                    <tr key={idx} className="animate-pulse border-b border-base-200/50 last:border-none">
                        <td className="w-1/4"><div className="h-5 w-3/4 bg-base-300 rounded"></div></td>
                        <td className="w-1/4"><div className="h-4 w-full bg-base-300 rounded"></div></td>
                        <td className="w-1/4"><div className="h-4 w-1/2 bg-base-300 rounded"></div></td>
                        <td className="w-1/4"><div className="h-8 w-20 bg-base-300 rounded"></div></td>
                    </tr>
                 ))}
                </tbody>
             </table>
        </div>
    )
  }

  // Details Skeleton (Hero Image + Text Block)
  if (type === "detail") {
      return (
          <div className={`w-full ${className} animate-pulse`}>
              <div className="h-80 md:h-[480px] bg-base-300 rounded-xl mb-8 w-full"></div>
              <div className="flex flex-col lg:flex-row gap-8">
                  <div className="flex-1 space-y-4">
                      <div className="h-8 bg-base-300 w-1/3 rounded"></div>
                      <div className="h-12 bg-base-300 w-3/4 rounded"></div>
                      <div className="h-6 bg-base-300 w-1/4 rounded mb-6"></div>
                      <div className="space-y-2">
                          <div className="h-4 bg-base-300 w-full rounded"></div>
                          <div className="h-4 bg-base-300 w-full rounded"></div>
                          <div className="h-4 bg-base-300 w-5/6 rounded"></div>
                      </div>
                  </div>
                  <div className="lg:w-1/3 h-64 bg-base-300 rounded-xl"></div>
              </div>
          </div>
      )
  }

  // Stats/Metrics Skeleton (Simple Card with Icon + Text)
  if (type === "stats") {
      return (
          <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 ${className}`}>
             {Array.from({ length: count }).map((_, idx) => (
                 <div key={idx} className="card bg-base-100 shadow-xl p-6 border-l-4 border-base-300 animate-pulse">
                     <div className="flex items-center justify-between">
                         <div className="space-y-3 flex-1">
                             <div className="h-3 bg-base-300 w-1/2 rounded"></div>
                             <div className="h-8 bg-base-300 w-3/4 rounded"></div>
                         </div>
                         <div className="h-12 w-12 rounded-xl bg-base-300 ml-4"></div>
                     </div>
                 </div>
             ))}
          </div>
      )
  }

  // Chart Skeleton (Large block)
  if (type === "chart") {
      return (
          <div className={`w-full ${className}`}>
              <div className="bg-base-100 p-6 rounded-xl shadow-lg animate-pulse h-full border border-base-200">
                  <div className="h-6 bg-base-300 w-1/3 mb-6 rounded"></div>
                  <div className="h-64 bg-base-300 rounded-lg w-full"></div>
                  <div className="flex justify-between mt-4">
                      <div className="h-3 bg-base-300 w-10"></div>
                      <div className="h-3 bg-base-300 w-10"></div>
                      <div className="h-3 bg-base-300 w-10"></div>
                      <div className="h-3 bg-base-300 w-10"></div>
                  </div>
              </div>
          </div>
      )
  }

  // Profile Skeleton
  if (type === "profile") {
    return (
      <div className={`max-w-6xl mx-auto space-y-10 py-12 px-4 ${className} animate-pulse`}>
         {/* Profile Header Skeleton */}
         <div className="bg-base-100 p-8 rounded-2xl shadow-xl border border-base-200 flex flex-col md:flex-row items-center md:items-start gap-6">
            <div className="w-24 h-24 rounded-full bg-base-300 shrink-0"></div>
            <div className="flex-1 text-center md:text-left space-y-3 w-full">
               <div className="h-8 bg-base-300 w-1/2 md:w-1/4 rounded mx-auto md:mx-0"></div>
               <div className="h-4 bg-base-300 w-1/3 md:w-1/6 rounded mx-auto md:mx-0"></div>
               <div className="h-3 bg-base-300 w-1/4 md:w-1/8 rounded mx-auto md:mx-0"></div>
            </div>
            <div className="w-32 h-8 rounded-full bg-base-300"></div>
         </div>
         
         {/* Tabs & Content Skeleton */}
         <div className="bg-base-100 p-6 rounded-2xl shadow-xl border border-base-200 min-h-[400px]">
             <div className="flex gap-4 mb-8 border-b border-base-200 pb-4">
                 <div className="h-10 w-24 bg-base-300 rounded-lg"></div>
                 <div className="h-10 w-24 bg-base-300 rounded-lg"></div>
                 <div className="h-10 w-24 bg-base-300 rounded-lg"></div>
             </div>
             
             <div className="h-6 bg-base-300 w-1/4 mb-6 rounded"></div>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                 {Array.from({ length: 6 }).map((_, i) => (
                     <div key={i} className="bg-base-200 p-4 rounded-xl border border-base-300 h-24">
                         <div className="h-4 bg-base-300 w-1/3 mb-3 rounded"></div>
                         <div className="h-6 bg-base-300 w-2/3 rounded"></div>
                     </div>
                 ))}
             </div>
         </div>
      </div>
    );
  }

  return null;
};

export default SkeletonLoader;
