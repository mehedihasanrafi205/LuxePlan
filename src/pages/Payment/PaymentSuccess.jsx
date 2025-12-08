import React, { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router";
import axios from "axios";
import { FiCheckCircle, FiLoader } from "react-icons/fi";
import toast from "react-hot-toast";

const PaymentSuccess = () => {
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get("session_id");
  const [paymentInfo, setPaymentInfo] = useState(null);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    if (!sessionId) return;

    const fetchPayment = async () => {
      try {
        const { data } = await axios.patch(
          `${import.meta.env.VITE_API_URL}/payment-success`,
          { sessionId }
        );

        if (data.success) {
          setPaymentInfo(data.paymentInfo);
        } else {
          toast.error("Payment verification failed!");
        }
      } catch (err) {
        console.error(err);
        toast.error("Failed to verify payment!");
      } finally {
        setLoading(false);
      }
    };

    fetchPayment();
  }, [sessionId]);

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center text-[#d4af37]">
        <FiLoader className="animate-spin text-6xl" />
      </div>
    );

  if (!paymentInfo)
    return (
      <div className="min-h-screen flex items-center justify-center text-red-500">
        Payment not found.
      </div>
    );

  return (
    <div className="min-h-screen flex flex-col items-center justify-center  px-4 space-y-6">
      <FiCheckCircle className="text-green-400 text-7xl mb-4" />
      <h1 className="text-4xl font-bold">Payment Successful!</h1>
      <p className="text-white/70">
        Thank you, <span className="font-semibold">{paymentInfo.customer_email}</span>!
      </p>

      <div className="bg-white/10 rounded-xl p-6 w-full max-w-md space-y-3">
        <div>
          <span className="font-semibold">Service:</span> {paymentInfo.serviceName}
        </div>
        <div>
          <span className="font-semibold">Amount Paid:</span> ${paymentInfo.amount}
        </div>
        <div>
          <span className="font-semibold">Transaction ID:</span> {paymentInfo.transactionId}
        </div>
        <div>
          <span className="font-semibold">Status:</span> {paymentInfo.paymentStatus}
        </div>
      </div>

      <div className="flex gap-4 mt-6">
        <button
          onClick={() => navigate("/dashboard/my-bookings")}
          className="bg-[#d4af37] text-black px-6 py-3 rounded-full font-semibold hover:brightness-110 transition"
        >
          Back to My Bookings
        </button>
        <button
          onClick={() => navigate("/dashboard/payment-history")}
          className="bg-transparent border border-[#d4af37] text-[#d4af37] px-6 py-3 rounded-full font-semibold hover:bg-[#d4af37] hover:text-black transition"
        >
          Payment History
        </button>
      </div>
    </div>
  );
};

export default PaymentSuccess;
