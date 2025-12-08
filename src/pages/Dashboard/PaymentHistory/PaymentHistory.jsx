import React from "react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { FiLoader } from "react-icons/fi";
import useAuth from "../../../hooks/useAuth";

const PaymentHistory = () => {
  const { user } = useAuth();
  const API_URL = import.meta.env.VITE_API_URL;

  const { data: payments = [], isLoading } = useQuery({
    queryKey: ["payments", user?.email],
    queryFn: async () => {
      const res = await axios.get(`${API_URL}/payments?email=${user.email}`);
      return res.data;
    },
    enabled: !!user?.email,
  });

  if (isLoading)
    return (
      <div className="min-h-screen flex items-center justify-center text-[#d4af37]">
        <FiLoader className="animate-spin text-6xl" />
      </div>
    );

  if (payments.length === 0)
    return (
      <div className="min-h-screen flex items-center justify-center text-white/70">
        No payment history found.
      </div>
    );

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white px-4 md:px-6 py-10">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-serif font-bold mb-2">Payment History</h1>
        <p className="text-white/60 mb-8">
          View all your past payments for booked services.
        </p>

        {/* Mobile cards */}
        <div className="space-y-4 md:hidden">
          {payments.map((p) => (
            <div
              key={p._id}
              className="bg-white/5 border border-[#d4af37]/20 rounded-xl p-4 backdrop-blur-sm"
            >
              <h2 className="text-lg font-semibold">{p.serviceName}</h2>
              <p className="text-white/60 text-sm mt-1">
                Amount Paid: ${p.amount}
              </p>
              <p className="text-white/60 text-sm mt-1">
                Transaction ID: {p.transactionId}
              </p>
              <p className="text-white/60 text-sm mt-1">
                Date: {new Date(p.paidAt).toLocaleDateString()}
              </p>
              <span
                className="inline-block bg-green-600/20 text-green-400 px-3 py-1 rounded-full text-xs mt-2"
              >
                Paid
              </span>
            </div>
          ))}
        </div>
        {/* Desktop table */}
        <div className="hidden md:block bg-white/5 border border-[#d4af37]/20 rounded-xl backdrop-blur-sm overflow-x-auto">
          <table className="w-full min-w-[700px]">
            <thead>
              <tr className="border-b border-b-white/10">
                <th className="px-6 py-4 text-left text-white/70 text-sm uppercase">Service</th>
                <th className="px-6 py-4 text-left text-white/70 text-sm uppercase">Amount</th>
                <th className="px-6 py-4 text-left text-white/70 text-sm uppercase">Transaction ID</th>
                <th className="px-6 py-4 text-left text-white/70 text-sm uppercase">Date</th>
                <th className="px-6 py-4 text-left text-white/70 text-sm uppercase">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10">
              {payments.map((p) => (
                <tr key={p._id}>
                  <td className="px-6 py-4 text-white">{p.serviceName}</td>
                  <td className="px-6 py-4 text-white/70">${p.amount}</td>
                  <td className="px-6 py-4 text-white/70">{p.transactionId}</td>
                  <td className="px-6 py-4 text-white/70">{new Date(p.paidAt).toLocaleString()}</td>
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
      </div>
    </div>
  );
};

export default PaymentHistory;
