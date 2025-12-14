import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { FiLoader, FiChevronLeft, FiChevronRight } from "react-icons/fi";
import useAuth from "../../../hooks/useAuth";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import LoadingSpinner from "../../../components/LoadingSpinner";

const PaymentHistory = () => {
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 9; 

  const { 
    data: paymentData = {}, 
    isLoading,
    isFetching 
  } = useQuery({
    queryKey: ["payments", user?.email, currentPage, itemsPerPage], 
    queryFn: async () => {
      const res = await axiosSecure.get(`/payments`, {
        params: {
          email: user.email,
          page: currentPage, 
          size: itemsPerPage, 
        },
      });
      return res.data; 
    },
    enabled: !!user?.email,
    keepPreviousData: true,
  });

  // Extract data for clarity
  const payments = paymentData.payments || [];
  const totalCount = paymentData.count || 0;
  const totalPages = Math.ceil(totalCount / itemsPerPage);
  
  // PAGINATION HANDLERS
  const handlePageChange = (page) => {
    if (page > 0 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const pageNumbers = [...Array(totalPages).keys()].map(i => i + 1);


  if (isLoading)
    return (
      <LoadingSpinner/>
    );

  if (payments.length === 0 && !isFetching)
    return (
      <div className="min-h-screen flex items-center justify-center ">
        No payment history found.
      </div>
    );

  return (
    <div className="min-h-screen px-4 md:px-6 py-10">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl text-primary font-bold mb-2">Payment History ({totalCount} Total)</h1>
        
        {isFetching && (
          <div className="text-center text-primary mb-4">
            <FiLoader className="inline animate-spin mr-2" /> Fetching history...
          </div>
        )}

        {/* Mobile cards */}
        <div className={`space-y-4 md:hidden ${isFetching ? 'opacity-50' : ''}`}>
          {payments.map((p, index) => (
            <div
              key={p._id}
              className="bg-base-200 border border-[#d4af37]/20 rounded-xl p-4 backdrop-blur-sm"
            >
              <div className="flex justify-between items-center mb-1">
                <h2 className="text-lg font-semibold">{p.serviceName}</h2>
                <span className="text-sm ">#{(currentPage - 1) * itemsPerPage + index + 1}</span>
              </div>
              <p className=" text-sm mt-1">
                Amount Paid: ${p.amount}
              </p>
              <p className=" text-sm mt-1">
                Transaction ID: {p.transactionId}
              </p>
              <p className="text-sm mt-1">
                Date: {new Date(p.paidAt).toLocaleDateString()}
              </p>
              <span className="inline-block bg-green-600/20 text-green-400 px-3 py-1 rounded-full text-xs mt-2">
                Paid
              </span>
            </div>
          ))}
        </div>

        {/* Desktop table */}
        <div className={`hidden md:block bg-white/5 rounded-xl backdrop-blur-sm overflow-x-auto shadow-xl border border-base-300 ${isFetching ? 'opacity-50' : ''}`}>
          <table className="w-full table min-w-[700px]">
            <thead>
              <tr className="border-b border-b-white/10">
                <th className="px-6 py-4 text-left text-sm uppercase">#</th>
                <th className="px-6 py-4 text-left text-sm uppercase">
                  Service
                </th>
                <th className="px-6 py-4 text-left text-sm uppercase">
                  Amount
                </th>
                <th className="px-6 py-4 text-left text-sm uppercase">
                  Transaction ID
                </th>
                <th className="px-6 py-4 text-left text-sm uppercase">
                  Date
                </th>
                <th className="px-6 py-4 text-left text-sm uppercase">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="">
              {payments.map((p, index) => (
                <tr key={p._id}>
                  {/* Calculate index based on current page */}
                  <td className="px-6 py-4">{(currentPage - 1) * itemsPerPage + index + 1}</td>
                  <td className="px-6 py-4 ">{p.serviceName}</td>
                  <td className="px-6 py-4 ">${p.amount}</td>
                  <td className="px-6 py-4 ">{p.transactionId}</td>
                  <td className="px-6 py-4 ">
                    {new Date(p.paidAt).toLocaleString()}
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center rounded-full h-7 px-3 text-xs font-semibold bg-green-600/20 text-green-400">
                      Paid
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {/*  PAGINATION CONTROLS */}
        {totalPages > 1 && (
          <div className="flex justify-center mt-8">
            <div className="join shadow-md">
              {/* Previous Button */}
              <button
                className="join-item btn btn-md btn-primary/80 disabled:bg-base-300"
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1 || isFetching}
              >
                <FiChevronLeft />
              </button>

              {/* Page Buttons */}
              {pageNumbers.map((page) => (
                <button
                  key={page}
                  className={`join-item btn btn-md ${
                    currentPage === page
                      ? "btn-primary shadow-xl"
                      : "btn-ghost"
                  }`}
                  onClick={() => handlePageChange(page)}
                  disabled={isFetching}
                >
                  {page}
                </button>
              ))}

              {/* Next Button */}
              <button
                className="join-item btn btn-md btn-primary/80 disabled:bg-base-300"
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages || isFetching}
              >
                <FiChevronRight />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PaymentHistory;