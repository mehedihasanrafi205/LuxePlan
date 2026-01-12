import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useForm } from "react-hook-form";
import {
  FiUser,
  FiSettings,
  FiCreditCard,
  FiMail,
  FiPhone,
  FiMapPin,
  FiEdit2,
  FiLogOut,
  FiCalendar,
  FiSave,
  FiX,
  FiUpload,
  FiShield,
  FiActivity
} from "react-icons/fi";
import useAuth from "../../../hooks/useAuth";
import toast from "react-hot-toast";
import { imageUpload } from "../../../utils";
import useRole from "../../../hooks/useRole";
import LoadingSpinner from "../../../components/LoadingSpinner";

// Helper function to format dates nicely
const formatDate = (dateString) => {
  if (!dateString) return "N/A";
  const date = new Date(dateString);
  if (isNaN(date)) return "N/A";
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

const Profile = () => {
  const { user, loading, updateUserProfile, refetchUser } = useAuth();
  const { role, isRoleLoading } = useRole();
  const [activeTab, setActiveTab] = useState("profile");
  const [isEditing, setIsEditing] = useState(false);
  const fileInputRef = useRef(null);

  const [profileData, setProfileData] = useState({
    displayName: user?.displayName || "User Name",
    photoURL: user?.photoURL || "",
    phone: user?.phoneNumber || "+1 XXX XXX XXXX",
    location: "Address Not Set",
    role: role,
  });

  const [selectedImage, setSelectedImage] = useState(null);
  const [previewURL, setPreviewURL] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    defaultValues: {
      displayName: profileData.displayName,
      phone: profileData.phone,
      location: profileData.location,
    },
  });

  useEffect(() => {
    if (user) {
      setProfileData((prev) => ({
        ...prev,
        displayName: user.displayName || "User Name",
        photoURL: user.photoURL || "",
        phone: user.phoneNumber || "+1 XXX XXX XXXX",
        location: prev.location,
        role: role || prev.role || "client",
      }));

      reset({
        displayName: user.displayName || "User Name",
        phone: user.phoneNumber || "+1 XXX XXX XXXX",
        location: profileData.location,
      });

      setPreviewURL(user.photoURL || "");
    }
  }, [user, role, reset]);

  // Handle image selection from file picker
  const handleImageSelect = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Check if file is an image
    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file");
      return;
    }

    // Check if file is too large (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image size should be less than 5MB");
      return;
    }

    // Save selected image
    setSelectedImage(file);
    setPreviewURL(URL.createObjectURL(file));
  };

  // Save profile changes
  const onSubmit = async (formData) => {
    const loadingToast = toast.loading("Updating profile...");

    try {
      let imageURL = profileData.photoURL;

      if (selectedImage) {
        imageURL = await imageUpload(selectedImage);
      }

      await updateUserProfile(
        formData.displayName,
        imageURL,
        formData.phone,
        formData.location
      );
      await refetchUser();
      
      setProfileData((prev) => ({
        ...prev,
        displayName: formData.displayName,
        phone: formData.phone,
        location: formData.location,
        photoURL: imageURL,
      }));

      toast.success("Profile updated successfully!", {
        id: loadingToast,
      });

      setIsEditing(false);
      setSelectedImage(null);
    } catch (error) {
      toast.error(error.message || "Update failed!", {
        id: loadingToast,
      });
    }
  };

  if (loading || isRoleLoading) {
    return <LoadingSpinner type="profile" />;
  }

  const ProfileContent = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-bold flex items-center gap-2">
            <FiUser className="text-primary" /> Personal Information
        </h3>
        <button
          className="btn btn-sm btn-outline btn-primary gap-2"
          onClick={() => setIsEditing(true)}
        >
          <FiEdit2 size={16} /> Edit
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {[
            { icon: <FiUser />, label: "Display Name", value: profileData.displayName },
            { icon: <FiMail />, label: "Email Address", value: user.email },
            { icon: <FiPhone />, label: "Phone Number", value: profileData.phone },
            { icon: <FiMapPin />, label: "Location", value: profileData.location },
            { icon: <FiShield />, label: "Account Role", value: profileData?.role },
            { icon: <FiCalendar />, label: "Joined", value: formatDate(user.metadata?.creationTime) },
            { icon: <FiActivity />, label: "Last Active", value: formatDate(user.metadata?.lastSignInTime) },
        ].map((item, index) => (
             <InfoCard
                key={index}
                icon={item.icon}
                label={item.label}
                value={item.value}
                index={index}
             />
        ))}
      </div>
    </div>
  );

  const SettingsContent = () => (
    <div className="space-y-6">
        <h3 className="text-xl font-bold flex items-center gap-2">
            <FiSettings className="text-primary" /> Security & Privacy
        </h3>
        <div className="bg-base-200/50 p-6 rounded-2xl border border-base-200">
             <div className="flex justify-between items-center">
                <div>
                     <h4 className="font-bold text-base-content">Password</h4>
                     <p className="text-sm text-base-content/60">Change your account password securely.</p>
                </div>
                <button
                    className="btn btn-warning btn-sm"
                    onClick={() =>
                    toast("Password change email sent!", { icon: "📧" })
                    }
                >
                    Change Password
                </button>
             </div>
        </div>
        <div className="bg-base-200/50 p-6 rounded-2xl border border-base-200">
             <div className="flex justify-between items-center">
                <div>
                     <h4 className="font-bold text-base-content">Delete Account</h4>
                     <p className="text-sm text-base-content/60">Permanently remove your account and data.</p>
                </div>
                <button
                    className="btn btn-error btn-outline btn-sm"
                    onClick={() => toast.error("Please contact admin to delete account.")}
                >
                    Delete Account
                </button>
             </div>
        </div>
    </div>
  );

  const BillingContent = () => (
    <div className="space-y-6">
       <h3 className="text-xl font-bold flex items-center gap-2">
            <FiCreditCard className="text-primary" /> Billing Information
        </h3>
       <div className="text-center py-12 bg-base-200/50 rounded-2xl border border-dashed border-base-300">
            <FiCreditCard className="mx-auto text-4xl text-base-content/20 mb-2" />
            <p className="text-base-content/60">No payment methods saved.</p>
            <button className="btn btn-primary btn-sm mt-4">Add Payment Method</button>
        </div>
    </div>
  );

  const ProfileEditModal = () => {
    return (
      <AnimatePresence>
        {isEditing && (
          <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto overflow-x-hidden p-4 sm:p-6">
             {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsEditing(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
            />

             {/* Modal Content */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-lg bg-base-100 rounded-2xl shadow-2xl overflow-hidden border border-base-200"
            >
               {/* Header Background Gradient */}
              <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-r from-primary/20 via-secondary/20 to-accent/20 block" />

              <div className="relative px-6 pb-6 pt-0">
                
                {/* Close Button */}
                <button
                    className="absolute top-4 right-4 btn btn-sm btn-circle btn-ghost text-base-content/70 hover:bg-base-100/50 z-10"
                    onClick={() => setIsEditing(false)}
                >
                    <FiX size={20} />
                </button>

                {/* Avatar Upload Section */}
                <div className="flex flex-col items-center mt-12 mb-6">
                    <div className="relative group cursor-pointer" onClick={() => fileInputRef.current?.click()}>
                        <div className="w-28 h-28 rounded-full ring-4 ring-base-100 shadow-xl overflow-hidden bg-base-100">
                             <img
                                src={
                                    previewURL ||
                                    profileData.photoURL ||
                                    `https://api.dicebear.com/7.x/initials/svg?seed=${
                                    profileData.displayName || user.email
                                    }`
                                }
                                alt="Avatar Preview"
                                className="object-cover w-full h-full group-hover:opacity-75 transition-opacity"
                            />
                        </div>
                         {/* Hover Overlay Icon */}
                        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-10">
                             <div className="bg-black/40 rounded-full p-2">
                                <FiUpload className="text-white text-xl" />
                             </div>
                        </div>
                        {/* Status Indicator */}
                        <div className="absolute bottom-2 right-2 bg-primary text-white p-1.5 rounded-full shadow-lg ring-2 ring-base-100">
                           <FiEdit2 size={12} />
                        </div>
                    </div>
                     <p className="text-xs text-base-content/60 mt-2 font-medium">Click to change avatar</p>
                      {/* Hidden file input */}
                    <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                         className="hidden"
                        onChange={handleImageSelect}
                    />
                </div>

                <h2 className="text-2xl font-bold text-center mb-6">Edit Profile</h2>

                {/* Edit Form */}
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                    
                    {/* Display Name Input */}
                    <div className="form-control w-full">
                    <label className="label">
                        <span className="label-text font-medium text-base-content">Full Name</span>
                    </label>
                    <div className="relative">
                        <input
                        type="text"
                        {...register("displayName", {
                            required: "Display name is required",
                            minLength: {
                            value: 2,
                            message: "Name must be at least 2 characters",
                            },
                        })}
                        placeholder="e.g. John Doe"
                        className={`input input-bordered w-full pl-10 focus:input-primary ${
                             errors.displayName ? "input-error" : ""
                        }`}
                        />
                        <FiUser className="absolute left-3 top-3.5 text-base-content/40" />
                    </div>
                    {errors.displayName && (
                        <span className="text-xs text-error mt-1 ml-1">{errors.displayName.message}</span>
                    )}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {/* Phone Number Input */}
                        <div className="form-control w-full">
                            <label className="label">
                                <span className="label-text font-medium text-base-content">Phone</span>
                            </label>
                            <div className="relative">
                                <input
                                type="tel"
                                {...register("phone")}
                                placeholder="+1 (555) 000-0000"
                                className="input input-bordered w-full pl-10 focus:input-primary"
                                />
                                <FiPhone className="absolute left-3 top-3.5 text-base-content/40" />
                            </div>
                        </div>

                        {/* Location Input */}
                        <div className="form-control w-full">
                            <label className="label">
                                <span className="label-text font-medium text-base-content">Location</span>
                            </label>
                            <div className="relative">
                                <input
                                type="text"
                                {...register("location")}
                                placeholder="City, Country"
                                className="input input-bordered w-full pl-10 focus:input-primary"
                                />
                                <FiMapPin className="absolute left-3 top-3.5 text-base-content/40" />
                            </div>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="pt-6 flex gap-3">
                        <button
                            type="button"
                            className="btn btn-ghost flex-1"
                            onClick={() => setIsEditing(false)}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="btn btn-primary flex-1 shadow-lg shadow-primary/20"
                        >
                            <FiSave size={18} /> Save Changes
                        </button>
                    </div>
                </form>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    );
  };

  return (
    <section className="bg-base-100/50 min-h-screen">
      <div className="py-12 px-4 sm:px-6 lg:px-8 ">
        <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-6xl mx-auto space-y-8"
        >
{/* Profile Header Card */}
<div className="card w-full bg-base-100 shadow-xl border border-base-200 overflow-hidden group">
  
  {/* Decorative Banner */}
  <div className="h-40 w-full bg-gradient-to-r from-primary/20 via-secondary/10 to-base-100 relative">
    {/* Abstract Pattern Overlay (Optional) */}
    <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#444cf7_1px,transparent_1px)] [background-size:16px_16px]"></div>
  </div>

  <div className="card-body pt-0 relative">
    
    {/* Flex Container for Avatar + Content */}
    <div className="flex flex-col md:flex-row items-center md:items-start gap-6 -mt-16 md:-mt-20">
      
      {/* Avatar with Ring & Shadow */}
      <div className="avatar relative z-10">
        <div className="w-32 md:w-40 rounded-full ring-4 ring-base-100 shadow-2xl bg-base-100">
          <img
            src={
              previewURL ||
              user.photoURL ||
              `https://api.dicebear.com/7.x/initials/svg?seed=${
                profileData.displayName || user.email
              }`
            }
            alt="User Avatar"
            className="object-cover"
          />
        </div>
        {/* Optional: Online Status Indicator */}
        <div className="absolute bottom-4 right-4 w-5 h-5 bg-success rounded-full border-4 border-base-100"></div>
      </div>

      {/* User Information */}
      <div className="flex-1 text-center md:text-left mt-2 md:mt-20">
        <div className="flex flex-col md:flex-row justify-between items-center md:items-start gap-4">
          
          {/* Text Content */}
          <div className="mt-5">
            <h1 className="text-3xl md:text-4xl font-black text-base-content tracking-tight">
              {profileData.displayName}
            </h1>
            
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-2 mt-2">
              <span className="badge badge-primary badge-sm font-semibold uppercase tracking-wider">
                {profileData.role}
              </span>
              <span className="flex items-center gap-1.5 text-sm text-base-content/60 px-2">
                <FiMail className="w-4 h-4" /> {user.email}
              </span>
            </div>

            <p className="text-sm text-base-content/70 mt-4 max-w-lg leading-relaxed">
              Welcome to your personal dashboard. Manage your bookings, update your profile, and configure key security settings.
            </p>
          </div>

          {/* Right Side: Badge & Actions */}
          <div className="flex flex-col items-center md:items-end gap-3 min-w-max">
            {/* Premium Gold Badge */}
 <div className="md:ml-auto md:self-center mt-5">
              <span className="badge text-xs font-semibold px-4 py-3 rounded-full bg-linear-to-r from-yellow-600 to-yellow-400 text-black shadow-[0_0_10px_rgba(212,175,55,0.4)]">
                LUXEPLAN MEMBER
              </span>
            </div>

            
            <button 
                onClick={() => setIsEditing(true)} 
                className="btn btn-outline btn-sm rounded-full gap-2 hover:bg-base-content hover:text-base-100 transition-all duration-300"
            >
              <FiEdit2 className="w-3.5 h-3.5" /> 
              Edit Profile
            </button>
          </div>

        </div>
      </div>
    </div>
  </div>
</div>

          {/* Tabs Section */}
          <div className="bg-base-100 rounded-3xl shadow-xl border border-base-300 overflow-hidden">
            {/* Tab Navigation */}
            <div className="flex border-b border-base-200">
               {[
                 { id: 'profile', icon: FiUser, label: 'Profile' },
                 { id: 'settings', icon: FiSettings, label: 'Security' },
                 { id: 'billing', icon: FiCreditCard, label: 'Billing' },
               ].map((tab) => (
                 <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex-1 py-4 text-center font-medium text-sm flex items-center justify-center gap-2 transition-all relative cursor-pointer ${activeTab === tab.id ? 'text-primary' : 'text-base-content/60 hover:text-base-content/80'}`}
                 >
                    <tab.icon size={18} /> {tab.label}
                    {activeTab === tab.id && (
                        <motion.div layoutId="profileTabLine" className="absolute bottom-0 left-0 w-full h-1 bg-primary" />
                    )}
                 </button>
               ))}
            </div>

            {/* Tab Content */}
            <div className="p-8 min-h-[400px]">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={activeTab}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.2 }}
                    >
                        {activeTab === "profile" && <ProfileContent />}
                        {activeTab === "settings" && <SettingsContent />}
                        {activeTab === "billing" && <BillingContent />}
                    </motion.div>
                </AnimatePresence>
            </div>
          </div>
        </motion.div>

        {/* Edit Modal */}
        <ProfileEditModal />
      </div>
    </section>
  );
};

// Reusable card for displaying user information
const InfoCard = ({ icon, label, value, index = 0 }) => (
  <motion.div 
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: index * 0.05 }}
    className="bg-base-200/40 p-5 rounded-2xl border border-base-200/60 hover:border-primary/20 hover:bg-base-200/80 transition-all duration-300 group"
  >
    <div className="flex items-center gap-3 mb-2">
      <div className="bg-base-100 p-2 rounded-lg text-primary group-hover:scale-110 transition-transform">
        {icon}
      </div>
      <p className="text-xs uppercase tracking-wider font-bold text-base-content/40">
        {label}
      </p>
    </div>
    <p className="text-lg font-semibold text-base-content pl-1">{value || "Not Set"}</p>
  </motion.div>
);

export default Profile;
