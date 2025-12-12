import React from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { FiSave, FiPlus, FiMinus } from "react-icons/fi";
import toast from "react-hot-toast";
import useAuth from "../../../hooks/useAuth";
import { useMutation } from "@tanstack/react-query";
import useAxiosSecure from "../../../hooks/useAxiosSecure";

const ApplyDecorator = () => {
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();

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
    const toastId = toast.loading("Submitting...");

    try {
      const decoratorData = {
        fullName: data.fullName,
        email: data.email,
        phoneNumber: data.phoneNumber,
        role: "decorator",
        profileImage: user?.photoURL || "",
        specialties: data.specialties.map((f) => f.name).filter(Boolean),
        description: data.description,
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
        specialties: [{ name: "" }],
      });
    } catch (error) {
      toast.dismiss(toastId);

      // Handle 409 Conflict → duplicate application
      if (error?.response?.status === 409) {
        return toast.error("You have already applied.");
      }

      // Other errors
      toast.error(error?.response?.data?.message || "Something went wrong!");
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6 bg-base-100 rounded-2xl shadow-xl border border-base-300">
      <h2 className="text-2xl font-bold text-primary mb-4">
        Apply as a Decorator
      </h2>

      <div className="flex items-center mb-4">
        {user?.photoURL && (
          <img
            src={user.photoURL}
            alt="Profile"
            className="w-16 h-16 rounded-full mr-4 object-cover"
          />
        )}
        <div>
          <p className="font-semibold">{user?.displayName}</p>
          <p className="text-sm text-gray-500">{user?.email}</p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <input
          type="text"
          placeholder="Full Name"
          {...register("fullName", { required: true })}
          className={`input input-bordered w-full ${
            errors.fullName && "input-error"
          }`}
        />

        <input
          type="email"
          placeholder="Email"
          {...register("email", { required: true })}
          className={`input input-bordered w-full ${
            errors.email && "input-error"
          }`}
          readOnly
        />

        <input
          type="text"
          placeholder="Phone Number"
          {...register("phoneNumber", { required: true })}
          className={`input input-bordered w-full ${
            errors.phoneNumber && "input-error"
          }`}
        />

        <textarea
          placeholder="Short Bio / Description"
          {...register("description", { required: true })}
          className={`textarea textarea-bordered w-full ${
            errors.description && "textarea-error"
          }`}
        />

        {/* Specialties */}
        <div>
          <label className="label">
            <span className="label-text">Specialties</span>
          </label>
          {fields.map((field, index) => (
            <div key={field.id} className="flex gap-2 mb-2">
              <select
                {...register(`specialties.${index}.name`, { required: true })}
                className="select select-bordered flex-1"
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
                className="btn btn-error btn-sm"
                onClick={() => remove(index)}
              >
                <FiMinus />
              </button>
            </div>
          ))}
          <button
            type="button"
            className="btn btn-outline btn-sm"
            onClick={() => append({ name: "" })}
          >
            <FiPlus /> Add Specialty
          </button>
        </div>

        <button type="submit" className="btn btn-primary flex gap-2">
          <FiSave /> Submit Application
        </button>
      </form>
    </div>
  );
};

export default ApplyDecorator;
