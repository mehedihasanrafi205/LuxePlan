import React, { useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { FiSave, FiPlus, FiMinus, FiBriefcase, FiLink, FiPhone, FiUser, FiMail, FiStar, FiClock } from "react-icons/fi";
import toast from "react-hot-toast";
import useAuth from "../../../hooks/useAuth";
import { useMutation } from "@tanstack/react-query";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import { motion, AnimatePresence } from "framer-motion";

const ApplyDecorator = () => {
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      fullName: user?.displayName || "",
      email: user?.email || "",
      phoneNumber: "",
      description: "",
      portfolio: "",
      yearsOfExperience: "",
      specialties: [{ name: "" }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "specialties",
  });

  const categories = [
    "home",
    "wedding",
    "office",
    "seminar",
    "meeting",
    "birthday",
  ];

  const onSubmit = async (data) => {
    setLoading(true);
    const toastId = toast.loading("Submitting application...");

    try {
      const decoratorData = {
        fullName: data.fullName,
        email: data.email,
        phoneNumber: data.phoneNumber,
        role: "decorator",
        profileImage: user?.photoURL || "",
        specialties: data.specialties.map((f) => f.name).filter(Boolean),
        description: data.description,
        portfolio: data.portfolio,
        yearsOfExperience: Number(data.yearsOfExperience),
        createdAt: new Date(),
      };

      await axiosSecure.post(`/decorator`, decoratorData);

      toast.dismiss(toastId);
      toast.success("Application submitted successfully!");

      reset({
        fullName: user?.displayName || "",
        email: user?.email || "",
        phoneNumber: "",
        description: "",
        portfolio: "",
        yearsOfExperience: "",
        specialties: [{ name: "" }],
      });
    } catch (error) {
      toast.dismiss(toastId);

      // Handle 409 Conflict → duplicate application
      if (error?.response?.status === 409) {
        toast.error("You have already applied.");
      } else {
        toast.error(error?.response?.data?.message || "Something went wrong!");
      }
    } finally {
        setLoading(false);
    }
  };

  return (
    <div className="min-h-screen px-4 md:px-8 py-10 bg-base-100/50 flex items-center justify-center">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-4xl bg-base-100 rounded-3xl shadow-2xl border border-base-200 overflow-hidden flex flex-col md:flex-row"
      >
          
        {/* Sidebar / Info Section */}
        <div className="w-full md:w-1/3 bg-primary/5 p-8 border-r border-base-200 flex flex-col items-center justify-center text-center">
             <div className="mb-6 relative">
                 <div className="w-24 h-24 rounded-full p-1 border-2 border-primary border-dashed">
                    <img
                        src={user?.photoURL || "https://placehold.co/100"}
                        alt="Profile"
                        className="w-full h-full rounded-full object-cover"
                    />
                 </div>
                 <div className="absolute bottom-0 right-0 bg-primary text-white p-1 rounded-full text-xs">
                     <FiStar />
                 </div>
             </div>
             
             <h2 className="text-xl font-bold text-base-content mb-1">{user?.displayName}</h2>
             <p className="text-sm text-base-content/60 mb-6">{user?.email}</p>

             <div className="text-left w-full space-y-4">
                 <div className="bg-base-100 p-4 rounded-xl border border-base-200 shadow-sm">
                     <h3 className="font-bold text-primary text-sm flex items-center gap-2 mb-2"><FiBriefcase /> Why Join Us?</h3>
                     <p className="text-xs text-base-content/70 leading-relaxed">
                         Become a verified LuxePlan decorator to access exclusive projects, manage your schedule, and grow your earnings.
                     </p>
                 </div>
                 <div className="bg-base-100 p-4 rounded-xl border border-base-200 shadow-sm">
                     <h3 className="font-bold text-secondary text-sm flex items-center gap-2 mb-2"><FiStar /> Benefits</h3>
                     <ul className="text-xs text-base-content/70 space-y-1 list-disc pl-4">
                         <li>Verified Badge on Profile</li>
                         <li>Direct Booking Management</li>
                         <li>Secure Payments</li>
                         <li>Analytics Dashboard</li>
                     </ul>
                 </div>
             </div>
        </div>

        {/* Form Section */}
        <div className="w-full md:w-2/3 p-8">
            <h2 className="text-2xl font-bold text-base-content mb-6 flex items-center gap-2">
                 Submit Application
             </h2>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="form-control">
                        <label className="label font-bold text-xs uppercase text-base-content/60">Phone Number</label>
                        <div className="relative">
                            <FiPhone className="absolute left-3 top-1/2 -translate-y-1/2 text-base-content/40" />
                            <input
                                type="text"
                                placeholder="+880 1XXX..."
                                {...register("phoneNumber", { required: true })}
                                className={`input input-bordered w-full pl-10 ${errors.phoneNumber && "input-error"}`}
                            />
                        </div>
                    </div>

                    <div className="form-control">
                         <label className="label font-bold text-xs uppercase text-base-content/60">Experience (Years)</label>
                         <div className="relative">
                            <FiClock className="absolute left-3 top-1/2 -translate-y-1/2 text-base-content/40" />
                            <input
                                type="number"
                                placeholder="e.g. 3"
                                {...register("yearsOfExperience", { required: true, min: 0 })}
                                className={`input input-bordered w-full pl-10 ${errors.yearsOfExperience && "input-error"}`}
                            />
                         </div>
                    </div>
                </div>

                <div className="form-control">
                    <label className="label font-bold text-xs uppercase text-base-content/60">Portfolio Link</label>
                    <div className="relative">
                        <FiLink className="absolute left-3 top-1/2 -translate-y-1/2 text-base-content/40" />
                        <input
                            type="url"
                            placeholder="https://yourportfolio.com"
                            {...register("portfolio", { required: true })}
                            className={`input input-bordered w-full pl-10 ${errors.portfolio && "input-error"}`}
                        />
                    </div>
                </div>

                <div className="form-control">
                    <label className="label font-bold text-xs uppercase text-base-content/60">Bio</label>
                    <textarea
                        placeholder="Tell us about your style and expertise..."
                        {...register("description", { required: true })}
                        className={`textarea textarea-bordered w-full h-24 ${errors.description && "textarea-error"}`}
                    />
                </div>

                {/* Specialties */}
                <div className="bg-base-200/50 p-4 rounded-xl border border-base-200">
                    <div className="flex justify-between items-center mb-2">
                        <label className="label font-bold text-xs uppercase text-base-content/60 p-0">Specialties</label>
                        <button
                            type="button"
                            className="btn btn-xs btn-ghost text-primary"
                            onClick={() => append({ name: "" })}
                        >
                            <FiPlus /> Add
                        </button>
                    </div>
                    <div className="space-y-2">
                        <AnimatePresence>
                        {fields.map((field, index) => (
                            <motion.div 
                                key={field.id}
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: "auto" }}
                                exit={{ opacity: 0, height: 0 }}
                                className="flex gap-2"
                            >
                                <select
                                    {...register(`specialties.${index}.name`, { required: true })}
                                    className="select select-bordered select-sm flex-1"
                                >
                                    <option value="">Select Specialty</option>
                                    {categories.map((cat) => (
                                    <option key={cat} value={cat}>
                                        {cat.charAt(0).toUpperCase() + cat.slice(1)}
                                    </option>
                                    ))}
                                </select>
                                <button
                                    type="button"
                                    className="btn btn-square btn-error btn-sm btn-outline"
                                    onClick={() => remove(index)}
                                >
                                    <FiMinus />
                                </button>
                            </motion.div>
                        ))}
                        </AnimatePresence>
                    </div>
                </div>

                <button 
                    type="submit" 
                    className="btn btn-primary w-full shadow-lg shadow-primary/20 hover:shadow-primary/40"
                    disabled={loading}
                >
                    {loading ? <span className="loading loading-spinner"></span> : <FiSave />}
                    Submit Application
                </button>
            </form>
        </div>
      </motion.div>
    </div>
  );
};

export default ApplyDecorator;
