import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import LoadingSpinner from "../../../components/LoadingSpinner";
import { FiTrash2 } from "react-icons/fi";

const ManageCoupons = () => {
  const axiosSecure = useAxiosSecure();
  const { register, handleSubmit, reset } = useForm();

  const {
    data: coupons = [],
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["coupons"],
    queryFn: async () => {
      const res = await axiosSecure.get("/coupons");
      return res.data;
    },
  });

  const onSubmit = async (data) => {
    try {
      await axiosSecure.post("/coupons", data);
      toast.success("Coupon created successfully!");
      reset();
      refetch();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to create coupon");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this coupon?")) return;
    try {
      await axiosSecure.delete(`/coupons/${id}`);
      toast.success("Coupon deleted!");
      refetch();
    } catch (err) {
      toast.error("Failed to delete coupon");
    }
  };

  if (isLoading) return <LoadingSpinner />;

  return (
    <div className="w-full p-5 text-gray-800 dark:text-gray-100">
      <h2 className="text-3xl font-bold mb-8 text-center font-display">
        Manage Coupons
      </h2>

      {/* CREATE FORM */}
      <div className="bg-base-100 p-6 rounded-xl shadow-md mb-8 border border-base-300">
        <h3 className="text-xl font-bold mb-4">Create New Coupon</h3>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 items-end"
        >
          <div className="form-control">
            <label className="label">Code</label>
            <input
              type="text"
              placeholder="e.g. SUMMER20"
              {...register("code", { required: true })}
              className="input input-bordered w-full uppercase"
            />
          </div>

          <div className="form-control">
            <label className="label">Discount Type</label>
            <select
              {...register("discountType", { required: true })}
              className="select select-bordered w-full"
            >
              <option value="percent">Percentage (%)</option>
              <option value="flat">Flat Amount (৳)</option>
            </select>
          </div>

          <div className="form-control">
            <label className="label">Amount</label>
            <input
              type="number"
              placeholder="e.g. 10 or 500"
              {...register("amount", { required: true })}
              className="input input-bordered w-full"
            />
          </div>

          <div className="form-control">
            <label className="label">Expiry Date</label>
            <input
              type="date"
              {...register("expiryDate", { required: true })}
              className="input input-bordered w-full"
            />
          </div>

          <button type="submit" className="btn btn-primary w-full">
            Create Coupon
          </button>
        </form>
      </div>

      {/* LIST */}
      <div className="overflow-x-auto bg-base-100 rounded-xl shadow-md border border-base-300">
        <table className="table w-full">
          {/* head */}
          <thead className="bg-base-200">
            <tr>
              <th>#</th>
              <th>Code</th>
              <th>Type</th>
              <th>Amount</th>
              <th>Expiry</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {coupons.length === 0 ? (
              <tr>
                <td colSpan="6" className="text-center py-4">
                  No coupons found.
                </td>
              </tr>
            ) : (
              coupons.map((coupon, idx) => (
                <tr key={coupon._id} className="hover">
                  <th>{idx + 1}</th>
                  <td className="font-bold text-primary">{coupon.code}</td>
                  <td className="capitalize">{coupon.discountType}</td>
                  <td>
                    {coupon.discountType === "percent"
                      ? `${coupon.amount}%`
                      : `৳${coupon.amount}`}
                  </td>
                  <td>
                    {new Date(coupon.expiryDate).toLocaleDateString()}
                    {new Date() > new Date(coupon.expiryDate) && (
                      <span className="ml-2 badge badge-error badge-sm text-white">
                        Expired
                      </span>
                    )}
                  </td>
                  <td>
                    <button
                      onClick={() => handleDelete(coupon._id)}
                      className="btn btn-sm btn-square btn-error text-white"
                    >
                      <FiTrash2 />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ManageCoupons;
