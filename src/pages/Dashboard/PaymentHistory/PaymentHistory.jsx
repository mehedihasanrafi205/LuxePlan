import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { FiLoader, FiChevronLeft, FiChevronRight, FiCreditCard } from "react-icons/fi";
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
    isFetching,
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

  const pageNumbers = [...Array(totalPages).keys()].map((i) => i + 1);

  if (payments.length === 0 && !isFetching && !isLoading)
    return (
      <div className="min-h-screen flex flex-col items-center justify-center space-y-4">
        <FiCreditCard className="text-6xl text-base-content/20" />
        <p className="text-lg text-base-content/60">No payment history found.</p>
      </div>
    );

  return (
    <div className="min-h-screen px-4 md:px-8 py-10 bg-base-100/50">
      <div className="max-w-7xl mx-auto">
        <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
        >
            <h1 className="text-3xl md:text-4xl font-bold text-primary mb-2">
            Payment History
            </h1>
            <p className="text-base-content/70">
                Track all your transactions and invoices. <span className="badge badge-neutral ml-2">{totalCount} Record{totalCount !== 1 && 's'}</span>
            </p>
        </motion.div>

        {isFetching && !isLoading && (
          <div className="fixed top-4 right-4 z-50">
             <span className="loading loading-spinner text-primary"></span>
          </div>
        )}

        {/* Mobile cards */}
        <div className="grid grid-cols-1 gap-4 md:hidden">
          {isLoading ? (
               <LoadingSpinner type="card" count={itemsPerPage} />
          ) : (
              payments.map((p, index) => (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  key={p._id}
                  className="bg-base-100 rounded-2xl shadow-lg border border-base-200 overflow-hidden relative group p-5"
                >
                  <div className="absolute top-0 left-0 w-1 h-full bg-success"></div>
                  
                  <div className="flex justify-between items-start mb-4 pl-2">
                    <div>
                        <h2 className="font-bold text-lg text-base-content">{p.serviceName}</h2>
                        <p className="text-xs text-base-content/50 font-mono mt-1 uppercase tracking-wide">{(p.transactionId || "N/A").substring(0, 18)}...</p>
                    </div>
                    <span className="badge badge-success badge-sm bg-success/10 text-success border-none">Paid</span>
                  </div>

                  <div className="divider my-2"></div>

                  <div className="flex justify-between items-center pl-2">
                     <div>
                        <p className="text-xs text-base-content/60 mb-1">Date</p>
                        <p className="text-sm font-medium">{new Date(p.paidAt).toLocaleDateString()}</p>
                     </div>
                     <div className="text-right">
                        <p className="text-xs text-base-content/60 mb-1">Amount</p>
                        <p className="text-xl font-bold text-primary">${p.amount}</p>
                     </div>
                  </div>
                </motion.div>
              ))
          )}
        </div>

        {/* Desktop table */}
        <div className="hidden md:block">
            {isLoading ? (
                <LoadingSpinner type="table" count={itemsPerPage} className="border-none" />
            ) : (
                <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="bg-base-100 rounded-2xl shadow-xl border border-base-200 overflow-hidden"
                >
                    <table className="table table-lg w-full">
                        <thead className="bg-base-200/50">
                        <tr>
                            <th className="font-bold text-xs uppercase tracking-wider text-base-content/50">#</th>
                            <th className="font-bold text-xs uppercase tracking-wider text-base-content/50">Service Details</th>
                            <th className="font-bold text-xs uppercase tracking-wider text-base-content/50">Transaction ID</th>
                            <th className="font-bold text-xs uppercase tracking-wider text-base-content/50">Date</th>
                            <th className="font-bold text-xs uppercase tracking-wider text-base-content/50 text-right">Amount</th>
                            <th className="font-bold text-xs uppercase tracking-wider text-base-content/50 text-center">Status</th>
                        </tr>
                        </thead>
                        <tbody>
                        {payments.map((p, index) => (
                            <tr key={p._id} className="hover:bg-base-200/30 transition-colors border-b border-base-100 last:border-none group">
                                <td className="font-mono text-base-content/40">{(currentPage - 1) * itemsPerPage + index + 1}</td>
                                <td>
                                    <div className="font-bold text-base-content">{p.serviceName}</div>
                                </td>
                                <td>
                                    <span className="font-mono text-xs text-base-content/70 bg-base-200 px-2 py-1 rounded select-all hover:bg-base-300 transition-colors cursor-copy" title={p.transactionId}>
                                        {p.transactionId?.substring(0, 8)}...
                                    </span>
                                </td>
                                <td className="text-sm">
                                    {new Date(p.paidAt).toLocaleDateString(undefined, {
                                        year: 'numeric',
                                        month: 'short',
                                        day: 'numeric'
                                    })}
                                    <div className="text-xs text-base-content/40">
                                        {new Date(p.paidAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </div>
                                </td>
                                <td className="text-right font-bold text-primary">${p.amount}</td>
                                <td className="text-center">
                                    <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-success/10 text-success border border-success/20">
                                        <div className="w-1.5 h-1.5 rounded-full bg-success animate-pulse"></div>
                                        Paid
                                    </span>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </motion.div>
             )}
        </div>

        {/* PAGINATION CONTROLS */}
        {totalPages > 1 && (
          <div className="flex justify-center mt-12">
            <div className="join shadow-sm border border-base-300 bg-base-100 rounded-lg p-1">
              {/* Previous Button */}
              <button
                className="join-item btn btn-sm btn-ghost hover:bg-base-200"
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1 || isFetching}
              >
                <FiChevronLeft />
              </button>

              {/* Page Buttons */}
              {pageNumbers.map((page) => (
                <button
                  key={page}
                  className={`join-item btn btn-sm ${
                    currentPage === page ? "btn-primary text-primary-content shadow-md" : "btn-ghost hover:bg-base-200"
                  }`}
                  onClick={() => handlePageChange(page)}
                  disabled={isFetching}
                >
                  {page}
                </button>
              ))}

              {/* Next Button */}
              <button
                className="join-item btn btn-sm btn-ghost hover:bg-base-200"
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
