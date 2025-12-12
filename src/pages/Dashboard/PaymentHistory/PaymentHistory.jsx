import React from "react";
import { useQuery } from "@tanstack/react-query";
import { FiLoader } from "react-icons/fi";
import useAuth from "../../../hooks/useAuth";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import LoadingSpinner from "../../../components/LoadingSpinner";

const PaymentHistory = () => {
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();

  const { data: payments = [], isLoading } = useQuery({
    queryKey: ["payments", user?.email],
    queryFn: async () => {
      const res = await axiosSecure.get(`/payments?email=${user.email}`);
      return res.data;
    },
    enabled: !!user?.email,
  });

  if (isLoading)
    return (
      <LoadingSpinner/>
    );

  if (payments.length === 0)
    return (
      <div className="min-h-screen flex items-center justify-center ">
        No payment history found.
      </div>
    );

  return (
    <div className="min-h-screen  px-4 md:px-6 py-10">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl text-primary font-bold mb-2">Payment History</h1>


        {/* Mobile cards */}
        <div className="space-y-4 md:hidden">
          {payments.map((p) => (
            <div
              key={p._id}
              className="bg-base-200 border border-[#d4af37]/20 rounded-xl p-4 backdrop-blur-sm"
            >
              <h2 className="text-lg font-semibold">{p.serviceName}</h2>
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
        <div className="hidden md:block bg-white/5  rounded-xl backdrop-blur-sm overflow-x-auto shadow-xl border border-base-300">
          <table className="w-full table min-w-[700px]">
            <thead>
              <tr className="border-b border-b-white/10">
                <th className="px-6 py-4 text-left  text-sm uppercase">
                  Service
                </th>
                <th className="px-6 py-4 text-left  text-sm uppercase">
                  Amount
                </th>
                <th className="px-6 py-4 text-left  text-sm uppercase">
                  Transaction ID
                </th>
                <th className="px-6 py-4 text-left  text-sm uppercase">
                  Date
                </th>
                <th className="px-6 py-4 text-left  text-sm uppercase">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="">
              {payments.map((p) => (
                <tr key={p._id}>
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
      </div>
    </div>
  );
};

export default PaymentHistory;
