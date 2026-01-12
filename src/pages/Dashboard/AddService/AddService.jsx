import React, { useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { FiSave, FiPlus, FiMinus, FiImage, FiList, FiDollarSign, FiTag, FiType, FiStar, FiGrid } from "react-icons/fi";
import toast from "react-hot-toast";
import { imageUpload } from "../../../utils";
import useAuth from "../../../hooks/useAuth";
import { useMutation } from "@tanstack/react-query";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import { useNavigate } from "react-router";
import { motion, AnimatePresence } from "framer-motion";

const AddService = () => {
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();
  const navigate = useNavigate();
  const [mainImage, setMainImage] = useState(null);
  const [mainPreview, setMainPreview] = useState("");
  const [galleryFiles, setGalleryFiles] = useState([]);
  const [galleryPreviews, setGalleryPreviews] = useState([]);
  const [loading, setLoading] = useState(false);

  const { mutateAsync } = useMutation({
    mutationFn: async (payload) => {
      return await axiosSecure.post(`/service`, payload);
    },
    onSuccess: () => {
      setLoading(false);
      toast.dismiss();
      navigate("/dashboard/manage-services");
      toast.success("Service added successfully!");
    },
    onError: () => {
      setLoading(false);
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
    defaultValues: { 
        key_feature: [{ name: "" }],
        addOns: [{ name: "", price: "" }] 
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "key_feature",
  });

  const {
    fields: addOnFields,
    append: appendAddOn,
    remove: removeAddOn,
  } = useFieldArray({
    control,
    name: "addOns",
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
    setLoading(true);
    const toastId = toast.loading("Uploading images & creating service...");

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
        addOns: data.addOns?.map(a => ({ name: a.name, price: Number(a.price) })).filter(a => a.name && a.price) || [],
      };

      await mutateAsync(serviceData);
      
      // Cleanup
      reset();
      setMainImage(null);
      setMainPreview("");
      setGalleryFiles([]);
      setGalleryPreviews([]);
    } catch (error) {
      setLoading(false);
      toast.dismiss(toastId);
      toast.error(error.message || "Something went wrong");
    }
  };

  return (
    <div className="min-h-screen px-4 md:px-8 py-10 bg-base-100/50">
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-4xl mx-auto"
      >
        <div className="mb-8 text-center">
            <h1 className="text-3xl md:text-4xl text-primary font-bold mb-2">Create New Service</h1>
            <p className="text-base-content/70">Add a premium decoration package to your offerings.</p>
        </div>

        <div className="bg-base-100 rounded-2xl shadow-xl border border-base-200 p-6 md:p-8 relative overflow-hidden">
           
           <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            
            {/* Basic Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="form-control">
                    <label className="label font-bold text-xs uppercase text-base-content/60">Service Name</label>
                    <div className="relative">
                        <FiType className="absolute left-3 top-1/2 -translate-y-1/2 text-base-content/40" />
                        <input
                            type="text"
                            placeholder="e.g. Royal Wedding Package"
                            {...register("service_name", { required: true })}
                            className={`input input-bordered w-full pl-10 focus:border-primary ${errors.service_name && "input-error"}`}
                        />
                    </div>
                </div>

                <div className="form-control">
                    <label className="label font-bold text-xs uppercase text-base-content/60">Category</label>
                    <div className="relative">
                        <FiGrid className="absolute left-3 top-1/2 -translate-y-1/2 text-base-content/40" />
                        <select
                            {...register("service_category", { required: true })}
                            className={`select select-bordered w-full pl-10 focus:border-primary ${errors.service_category && "select-error"}`}
                        >
                            <option value="">Select Category</option>
                            {categories.map((cat) => (
                                <option key={cat} value={cat}>
                                {cat.charAt(0).toUpperCase() + cat.slice(1)}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                <div className="form-control">
                    <label className="label font-bold text-xs uppercase text-base-content/60">Price (BDT)</label>
                    <div className="relative">
                        <FiDollarSign className="absolute left-3 top-1/2 -translate-y-1/2 text-base-content/40" />
                        <input
                            type="number"
                            placeholder="e.g. 50000"
                            {...register("cost", { required: true })}
                            className={`input input-bordered w-full pl-10 font-bold text-primary focus:border-primary ${errors.cost && "input-error"}`}
                        />
                    </div>
                </div>

                <div className="form-control">
                    <label className="label font-bold text-xs uppercase text-base-content/60">Unit</label>
                    <div className="relative">
                        <FiTag className="absolute left-3 top-1/2 -translate-y-1/2 text-base-content/40" />
                        <input
                            type="text"
                            placeholder="e.g. per event"
                            {...register("unit", { required: true })}
                            className={`input input-bordered w-full pl-10 focus:border-primary ${errors.unit && "input-error"}`}
                        />
                    </div>
                </div>
            </div>

            <div className="form-control">
                <label className="label font-bold text-xs uppercase text-base-content/60">Description</label>
                <textarea
                    placeholder="Describe the service details..."
                    {...register("description", { required: true })}
                    className={`textarea textarea-bordered h-32 w-full focus:border-primary ${errors.description && "textarea-error"}`}
                />
            </div>

             <div className="form-control w-full md:w-1/2">
                    <label className="label font-bold text-xs uppercase text-base-content/60">Initial Rating</label>
                    <div className="relative">
                        <FiStar className="absolute left-3 top-1/2 -translate-y-1/2 text-base-content/40" />
                        <input
                            type="number"
                            step="0.1"
                            max="5"
                            placeholder="e.g. 5.0"
                            {...register("ratings")}
                            className="input input-bordered w-full pl-10"
                        />
                    </div>
            </div>

            <div className="divider"></div>

            {/* Images */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                   <label className="label font-bold text-xs uppercase text-base-content/60 mb-2">Main Cover Image <span className="text-error">*</span></label>
                   <div className="border-2 border-dashed border-base-300 rounded-2xl p-6 text-center hover:border-primary transition-colors bg-base-200/30">
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleMainImage}
                            className="hidden"
                            id="main-image-upload"
                        />
                        <label htmlFor="main-image-upload" className="cursor-pointer flex flex-col items-center gap-2">
                             {mainPreview ? (
                                <img src={mainPreview} className="w-full h-48 object-cover rounded-xl shadow-md" />
                             ) : (
                                <>
                                <FiImage className="text-4xl text-base-content/30" />
                                <span className="text-sm font-medium text-base-content/60">Click to upload cover</span>
                                </>
                             )}
                        </label>
                   </div>
                </div>

                <div>
                   <label className="label font-bold text-xs uppercase text-base-content/60 mb-2">Gallery Images</label>
                   <div className="border-2 border-dashed border-base-300 rounded-2xl p-6 text-center hover:border-primary transition-colors bg-base-200/30">
                        <input
                            type="file"
                            multiple
                            accept="image/*"
                            onChange={handleGalleryImages}
                            className="hidden"
                            id="gallery-images-upload"
                        />
                        <label htmlFor="gallery-images-upload" className="cursor-pointer flex flex-col items-center gap-2">
                             <FiImage className="text-4xl text-base-content/30" />
                             <span className="text-sm font-medium text-base-content/60">Click to upload multiple</span>
                        </label>
                   </div>
                   {galleryPreviews.length > 0 && (
                        <div className="flex gap-2 mt-4 flex-wrap">
                            {galleryPreviews.slice(0, 4).map((url, idx) => (
                            <img key={idx} src={url} className="w-16 h-16 object-cover rounded-lg shadow-sm border border-base-200" />
                            ))}
                             {galleryPreviews.length > 4 && (
                                <div className="w-16 h-16 rounded-lg bg-base-300 flex items-center justify-center text-xs font-bold">
                                    +{galleryPreviews.length - 4}
                                </div>
                             )}
                        </div>
                   )}
                </div>
            </div>

            <div className="divider"></div>

            {/* Features & Addons */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Key Features */}
                <div className="bg-base-200/50 p-6 rounded-2xl border border-base-300">
                    <div className="flex justify-between items-center mb-4">
                        <label className="font-bold text-sm uppercase text-base-content/70 flex items-center gap-2"><FiList /> Key Features</label>
                        <button
                            type="button"
                            className="btn btn-xs btn-ghost text-primary"
                            onClick={() => append({ name: "" })}
                        >
                            <FiPlus /> Add
                        </button>
                    </div>
                    <div className="space-y-3">
                         <AnimatePresence>
                        {fields.map((field, index) => (
                            <motion.div 
                                key={field.id} 
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: "auto" }}
                                exit={{ opacity: 0, height: 0 }}
                                className="flex gap-2"
                            >
                                <input
                                    type="text"
                                    {...register(`key_feature.${index}.name`)}
                                    placeholder={`Feature ${index + 1}`}
                                    className="input input-sm input-bordered flex-1"
                                />
                                <button
                                    type="button"
                                    className="btn btn-square btn-sm btn-ghost text-error"
                                    onClick={() => remove(index)}
                                >
                                    <FiMinus />
                                </button>
                            </motion.div>
                        ))}
                        </AnimatePresence>
                    </div>
                </div>

                {/* Add-ons */}
                <div className="bg-base-200/50 p-6 rounded-2xl border border-base-300">
                     <div className="flex justify-between items-center mb-4">
                        <label className="font-bold text-sm uppercase text-base-content/70 flex items-center gap-2"><FiPlus /> Optional Add-ons</label>
                        <button
                            type="button"
                            className="btn btn-xs btn-ghost text-primary"
                            onClick={() => appendAddOn({ name: "", price: "" })}
                        >
                            <FiPlus /> Add
                        </button>
                    </div>
                    <div className="space-y-3">
                        <AnimatePresence>
                        {addOnFields.map((field, index) => (
                             <motion.div 
                                key={field.id} 
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: "auto" }}
                                exit={{ opacity: 0, height: 0 }}
                                className="flex gap-2"
                             >
                                <input
                                    type="text"
                                    {...register(`addOns.${index}.name`)}
                                    placeholder="Add-on Name"
                                    className="input input-sm input-bordered flex-1 w-1/2"
                                />
                                <input
                                    type="number"
                                    {...register(`addOns.${index}.price`)}
                                    placeholder="Price"
                                    className="input input-sm input-bordered w-24"
                                />
                                <button
                                    type="button"
                                    className="btn btn-square btn-sm btn-ghost text-error"
                                    onClick={() => removeAddOn(index)}
                                >
                                    <FiMinus />
                                </button>
                             </motion.div>
                        ))}
                        </AnimatePresence>
                    </div>
                </div>
            </div>

            <div className="mt-8">
                <button 
                    type="submit" 
                    className="btn btn-primary w-full btn-lg shadow-xl shadow-primary/20 hover:shadow-primary/40 transform active:scale-95 transition-all"
                    disabled={loading}
                >
                    {loading ? <span className="loading loading-spinner"></span> : <FiSave />}
                    Publish Service
                </button>
            </div>

           </form>
        </div>
      </motion.div>
    </div>
  );
};

export default AddService;
