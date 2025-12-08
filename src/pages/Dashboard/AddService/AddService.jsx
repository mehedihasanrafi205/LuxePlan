import React, { useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { FiSave, FiPlus, FiMinus } from "react-icons/fi";
import toast from "react-hot-toast";
import { imageUpload } from "../../../utils";
import useAuth from "../../../hooks/useAuth";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";

const AddService = () => {
  const { user } = useAuth();
  const [mainImage, setMainImage] = useState(null);
  const [mainPreview, setMainPreview] = useState("");
  const [galleryFiles, setGalleryFiles] = useState([]);
  const [galleryPreviews, setGalleryPreviews] = useState([]);

  const { mutateAsync } = useMutation({
    mutationFn: async (payload) => {
      return await axios.post(
        `${import.meta.env.VITE_API_URL}/service`,
        payload
      );
    },
    onSuccess: () => {
      toast.dismiss();
      toast.success("Service added successfully!");
    },
    onError: () => {
      toast.dismiss();
      toast.error("Failed to add service");
    },
  });

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: { key_feature: [{ name: "" }] },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "key_feature",
  });

  const categories = [
    "home",
    "wedding",
    "office",
    "seminar",
    "meeting",
    "birthday",
  ];

  const handleMainImage = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setMainImage(file);
    setMainPreview(URL.createObjectURL(file));
  };

  const handleGalleryImages = (e) => {
    const files = Array.from(e.target.files);
    setGalleryFiles(files);
    setGalleryPreviews(files.map((f) => URL.createObjectURL(f)));
  };

  const onSubmit = async (data) => {
    const toastId = toast.loading("Uploading...");

    try {
      const mainImageUrl = mainImage ? await imageUpload(mainImage) : "";
      const galleryUrls = [];

      for (const file of galleryFiles) {
        const url = await imageUpload(file);
        galleryUrls.push(url);
      }

      const serviceData = {
        service_name: data.service_name,
        cost: Number(data.cost),
        unit: data.unit,
        service_category: data.service_category,
        description: data.description,
        image: mainImageUrl,
        gallery_image: galleryUrls,
        ratings: Number(data.ratings) || 0,
        createdByEmail: user?.email || "admin@gmail.com",
        createdAt: new Date(),
        key_feature: data.key_feature.map((f) => f.name).filter(Boolean),
      };

      await mutateAsync(serviceData);

      reset();
      setMainImage(null);
      setMainPreview("");
      setGalleryFiles([]);
      setGalleryPreviews([]);
    } catch (error) {
      toast.dismiss();
      toast.error(error.message || "Something went wrong");
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6 bg-base-100 rounded-2xl shadow-lg">
      <h2 className="text-2xl font-bold text-primary mb-4">Add New Service</h2>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <input
          type="text"
          placeholder="Service Name"
          {...register("service_name", { required: true })}
          className={`input input-bordered w-full ${
            errors.service_name && "input-error"
          }`}
        />

        <input
          type="number"
          placeholder="Cost (BDT)"
          {...register("cost", { required: true })}
          className={`input input-bordered w-full ${
            errors.cost && "input-error"
          }`}
        />

        <input
          type="text"
          placeholder="Unit (e.g., per event)"
          {...register("unit", { required: true })}
          className={`input input-bordered w-full ${
            errors.unit && "input-error"
          }`}
        />

        <select
          {...register("service_category", { required: true })}
          className={`select select-bordered w-full ${
            errors.service_category && "select-error"
          }`}
        >
          <option value="">Select Category</option>
          {categories.map((cat) => (
            <option key={cat} value={cat}>
              {cat.charAt(0).toUpperCase() + cat.slice(1)}
            </option>
          ))}
        </select>

        <textarea
          placeholder="Description"
          {...register("description", { required: true })}
          className={`textarea textarea-bordered w-full ${
            errors.description && "textarea-error"
          }`}
        />

        <input
          type="number"
          step="0.1"
          placeholder="Ratings (e.g., 4.9)"
          {...register("ratings")}
          className="input input-bordered w-full"
        />

        {/* Main Image */}
        <div>
          <label className="label">
            <span className="label-text">Main Image</span>
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={handleMainImage}
            className="file-input file-input-bordered w-full"
          />
          {mainPreview && (
            <img
              src={mainPreview}
              className="w-40 h-40 object-cover rounded-lg mt-2"
            />
          )}
        </div>

        {/* Gallery Images */}
        <div>
          <label className="label">
            <span className="label-text">Gallery Images</span>
          </label>
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={handleGalleryImages}
            className="file-input file-input-bordered w-full"
          />
          <div className="flex gap-2 mt-2 flex-wrap">
            {galleryPreviews.map((url, idx) => (
              <img key={idx} src={url} className="w-24 h-24 rounded-lg" />
            ))}
          </div>
        </div>

        {/* Key Features */}
        <div>
          <label className="label">
            <span className="label-text">Key Features</span>
          </label>
          {fields.map((field, index) => (
            <div key={field.id} className="flex gap-2 mb-2">
              <input
                type="text"
                {...register(`key_feature.${index}.name`)}
                placeholder="Feature"
                className="input input-bordered flex-1"
              />
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
            <FiPlus /> Add Feature
          </button>
        </div>

        <button type="submit" className="btn btn-primary flex gap-2">
          <FiSave /> Add Service
        </button>
      </form>
    </div>
  );
};

export default AddService;
