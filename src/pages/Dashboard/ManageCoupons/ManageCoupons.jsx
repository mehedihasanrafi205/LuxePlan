import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import LoadingSpinner from "../../../components/LoadingSpinner";
import { FiTrash2, FiPlus, FiTag, FiCalendar, FiPercent, FiDollarSign } from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";
import DeleteConfirmationModal from "../../../components/Shared/Modal/DeleteConfirmationModal";

const ManageCoupons = () => {
  const axiosSecure = useAxiosSecure();
  const queryClient = useQueryClient(); // Correctly use queryClient
  const { register, handleSubmit, reset } = useForm();
  
  const [deleteCoupon, setDeleteCoupon] = useState(null);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  const {
    data: coupons = [],
    isLoading,
  } = useQuery({
    queryKey: ["coupons"],
    queryFn: async () => {
      const res = await axiosSecure.get("/coupons");
      return res.data;
    },
  });

  const createMutation = useMutation({
    mutationFn: async (data) => axiosSecure.post("/coupons", data),
    onSuccess: () => {
      toast.success("Coupon created successfully!");
      reset();
      queryClient.invalidateQueries(["coupons"]);
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || "Failed to create coupon");
    }
  });

  const deleteMutation = useMutation({
    mutationFn: async (id) => axiosSecure.delete(`/coupons/${id}`),
    onSuccess: () => {
      toast.success("Coupon deleted!");
      queryClient.invalidateQueries(["coupons"]);
      setIsDeleteOpen(false);
    },
    onError: () => {
      toast.error("Failed to delete coupon");
    }
  });

  const onSubmit = (data) => {
    createMutation.mutate(data);
  };

  const handleDeleteClick = (coupon) => {
    setDeleteCoupon(coupon);
    setIsDeleteOpen(true);
  };

  const confirmDelete = () => {
    if (deleteCoupon) {
      deleteMutation.mutate(deleteCoupon._id);
    }
  };

  const isExpired = (date) => new Date() > new Date(date);

  return (
    <div className="min-h-screen px-4 md:px-8 py-10 bg-base-100/50">
      <div className="max-w-7xl mx-auto">
        <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
             className="mb-8"
        >
             <h1 className="text-3xl md:text-4xl text-primary font-bold mb-2">Manage Coupons</h1>
             <p className="text-base-content/70">
                Create and oversee promotional codes. <span className="badge badge-neutral ml-2">{coupons.length} Active</span>
            </p>
        </motion.div>

        {/* CREATE FORM */}
        <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-base-100 rounded-2xl shadow-xl border border-base-200 p-6 mb-8 relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 p-10 opacity-5 pointer-events-none">
              <FiTag size={120} />
          </div>

          <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
            <span className="bg-primary/10 p-2 rounded-full text-primary"><FiPlus /></span> 
            Create New Coupon
          </h3>
          
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 items-end"
          >
            <div className="form-control">
              <label className="label font-bold text-xs uppercase text-base-content/60">Coupon Code</label>
              <div className="relative">
                  <FiTag className="absolute left-3 top-1/2 -translate-y-1/2 text-base-content/40" />
                  <input
                    type="text"
                    placeholder="e.g. SUMMER20"
                    {...register("code", { required: true })}
                    className="input input-bordered w-full pl-10 uppercase font-mono tracking-wider focus:border-primary focus:ring-1 focus:ring-primary"
                  />
              </div>
            </div>

            <div className="form-control">
              <label className="label font-bold text-xs uppercase text-base-content/60">Discount Type</label>
              <select
                {...register("discountType", { required: true })}
                className="select select-bordered w-full font-medium"
              >
                <option value="percent">Percentage (%)</option>
                <option value="flat">Flat Amount (৳)</option>
              </select>
            </div>

            <div className="form-control">
              <label className="label font-bold text-xs uppercase text-base-content/60">Amount</label>
              <input
                type="number"
                placeholder="e.g. 10 or 500"
                {...register("amount", { required: true })}
                className="input input-bordered w-full font-bold text-primary"
              />
            </div>

            <div className="form-control">
              <label className="label font-bold text-xs uppercase text-base-content/60">Expiry Date</label>
              <div className="relative">
                 <FiCalendar className="absolute left-3 top-1/2 -translate-y-1/2 text-base-content/40" /> 
                 <input
                    type="date"
                    {...register("expiryDate", { required: true })}
                    className="input input-bordered w-full pl-10"
                  />
              </div>
            </div>

            <button 
                type="submit" 
                className="btn btn-primary w-full shadow-lg shadow-primary/20 hover:shadow-primary/40"
                disabled={createMutation.isLoading}
            >
              {createMutation.isLoading ? <span className="loading loading-spinner loading-sm"></span> : <FiPlus />}
              Create Coupon
            </button>
          </form>
        </motion.div>

        {/* LOADING STATE */}
        {isLoading && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <LoadingSpinner type="card" count={6} />
            </div>
        )}

        {/* MOBILE CARDS */}
        <div className="grid grid-cols-1 md:hidden gap-4">
             <AnimatePresence>
              {coupons.map((coupon, idx) => (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ delay: idx * 0.05 }}
                  key={coupon._id}
                  className="bg-base-100 border border-base-200 rounded-xl p-5 shadow-lg relative overflow-hidden"
                >
                  <div className={`absolute top-0 right-0 w-20 h-20 -mr-10 -mt-10 rotate-45 ${isExpired(coupon.expiryDate) ? 'bg-error/20' : 'bg-primary/20'}`}></div>

                  <div className="flex justify-between items-start mb-4">
                      <div>
                          <div className="font-mono text-xl font-bold tracking-wider text-primary">{coupon.code}</div>
                          <span className="text-xs uppercase font-bold text-base-content/50">{coupon.discountType} Discount</span>
                      </div>
                      <div className="text-right">
                          <div className="text-2xl font-bold text-base-content">
                              {coupon.discountType === "percent" ? `${coupon.amount}%` : `৳${coupon.amount}`}
                          </div>
                          {coupon.discountType === "percent" ? <FiPercent className="inline text-base-content/40 ml-1" /> : <FiDollarSign className="inline text-base-content/40 ml-1" />}
                      </div>
                  </div>

                  <div className="flex items-center justify-between text-sm text-base-content/60 bg-base-200/50 p-3 rounded-lg">
                      <div className="flex items-center gap-2">
                          <FiCalendar /> Expires: {new Date(coupon.expiryDate).toLocaleDateString()}
                      </div>
                      {isExpired(coupon.expiryDate) && (
                          <span className="badge badge-error badge-sm">Expired</span>
                      )}
                  </div>

                  <button
                      onClick={() => handleDeleteClick(coupon)}
                      className="btn btn-sm btn-error btn-outline w-full mt-4 gap-2"
                  >
                      <FiTrash2 /> Delete Coupon
                  </button>
                </motion.div>
              ))}
             </AnimatePresence>
        </div>

        {/* DESKTOP TABLE */}
        <div className="hidden md:block">
            {!isLoading && coupons.length > 0 && (
                <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="bg-base-100 rounded-2xl shadow-xl border border-base-200 overflow-hidden"
                >
                <table className="table table-lg w-full">
                    <thead className="bg-base-200/50">
                    <tr>
                        <th className="font-bold text-xs uppercase tracking-wider text-base-content/50 pl-6">#</th>
                        <th className="font-bold text-xs uppercase tracking-wider text-base-content/50">Code</th>
                        <th className="font-bold text-xs uppercase tracking-wider text-base-content/50">Discount Type</th>
                        <th className="font-bold text-xs uppercase tracking-wider text-base-content/50">Amount</th>
                        <th className="font-bold text-xs uppercase tracking-wider text-base-content/50">Expiry Date</th>
                        <th className="font-bold text-xs uppercase tracking-wider text-base-content/50 text-right pr-6">Actions</th>
                    </tr>
                    </thead>
                    <tbody>
                    {coupons.map((coupon, idx) => (
                        <tr key={coupon._id} className="hover:bg-base-200/30 transition-colors border-b border-base-100 last:border-none">
                        <td className="pl-6 font-mono text-base-content/40">{idx + 1}</td>
                        <td>
                            <span className="font-mono font-bold text-lg text-primary bg-primary/10 px-3 py-1 rounded-md tracking-wider">
                                {coupon.code}
                            </span>
                        </td>
                        <td className="capitalize font-medium text-base-content/70">{coupon.discountType}</td>
                        <td>
                            <div className="font-bold text-xl text-base-content flex items-center gap-1">
                                {coupon.discountType === "percent" ? `${coupon.amount}%` : `৳${coupon.amount}`}
                            </div>
                        </td>
                        <td className="text-base-content/70">
                            <div className="flex items-center gap-2">
                                <FiCalendar className="text-base-content/40" /> 
                                {new Date(coupon.expiryDate).toLocaleDateString()}
                                {isExpired(coupon.expiryDate) && (
                                <span className="badge badge-error badge-sm text-white font-bold animate-pulse">
                                    Expired
                                </span>
                                )}
                            </div>
                        </td>
                        <td className="text-right pr-6">
                            <button
                            onClick={() => handleDeleteClick(coupon)}
                            className="btn btn-sm btn-ghost text-error hover:bg-error/10 hover:text-error rounded-full gap-2 transition-all"
                            disabled={deleteMutation.isLoading}
                            >
                            <FiTrash2 /> Delete
                            </button>
                        </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
                </motion.div>
            )}

            {!isLoading && coupons.length === 0 && (
                <div className="text-center py-20 bg-base-100 rounded-2xl border border-dashed border-base-300">
                    <div className="text-6xl mb-4">🏷️</div>
                    <h3 className="text-xl font-bold text-base-content">No active coupons</h3>
                    <p className="text-base-content/60">Create your first coupon above to get started.</p>
                </div>
            )}
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {isDeleteOpen && deleteCoupon && (
        <DeleteConfirmationModal 
            onClose={() => setIsDeleteOpen(false)}
            onConfirm={confirmDelete}
            message={`Are you sure you want to delete the coupon "${deleteCoupon.code}"?`}
        />
      )}
    </div>
  );
};

export default ManageCoupons;
