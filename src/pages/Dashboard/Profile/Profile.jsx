import React, { useState, useEffect, useRef } from "react";
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
} from "react-icons/fi";
import useAuth from "../../../hooks/useAuth";
import toast from "react-hot-toast";
import { imageUpload } from "../../../utils";

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
  // Get user data from auth hook
  const { user, loading, logOut, updateUserProfile, refetchUser } = useAuth();

  console.log("user?.photoURL", user?.photoURL);

  // Track which tab is active (profile, settings, or billing)
  const [activeTab, setActiveTab] = useState("profile");

  // Track if edit modal is open
  const [isEditing, setIsEditing] = useState(false);

  // Reference to hidden file input
  const fileInputRef = useRef(null);

  // Store profile data
  const [profileData, setProfileData] = useState({
    displayName: user?.displayName || "User Name",
    photoURL: user?.photoURL || "",
    phone: user?.phoneNumber || "+1 XXX XXX XXXX",
    location: "Address Not Set",
    role: "Client",
  });

  // Store selected image file
  const [selectedImage, setSelectedImage] = useState(null);

  // Store preview URL for selected image
  const [previewURL, setPreviewURL] = useState("");

  // React Hook Form setup
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

  // Update profile data when user data changes
  useEffect(() => {
    if (user) {
      const newData = {
        displayName: user.displayName || "User Name",
        photoURL: user.photoURL || "",
        phone: user.phoneNumber || "+1 XXX XXX XXXX",
        location: profileData.location,
        role: profileData.role,
      };
      setProfileData(newData);
      setPreviewURL(user.photoURL || "");

      // Reset form with new values
      reset({
        displayName: newData.displayName,
        phone: newData.phone,
        location: newData.location,
      });
    }
  }, [user, reset]);

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

    // Create preview URL
    setPreviewURL(URL.createObjectURL(file));
  };

  // Save profile changes - using React Hook Form
  const onSubmit = async (formData) => {
    const loadingToast = toast.loading("Updating profile...");

    try {
      let imageURL = profileData.photoURL;

      // Upload new image to image hosting
      if (selectedImage) {
        imageURL = await imageUpload(selectedImage);
      }

      // Call firebase update profile
      await updateUserProfile(formData.displayName, imageURL);

      await refetchUser();
      // Update UI state
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

  // Show loading spinner while checking auth
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-base-200">
        <span className="loading loading-spinner loading-lg text-primary"></span>
      </div>
    );
  }

  // ====== TAB CONTENT COMPONENTS ======

  // Profile tab - shows user information
  const ProfileContent = () => (
    <div className="space-y-6">
      <h3 className="text-2xl font-semibold text-primary">
        Personal Information
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <InfoCard
          icon={<FiUser />}
          label="Display Name"
          value={profileData.displayName}
        />
        <InfoCard icon={<FiMail />} label="Email Address" value={user.email} />
        <InfoCard
          icon={<FiPhone />}
          label="Phone Number"
          value={profileData.phone}
        />
        <InfoCard
          icon={<FiMapPin />}
          label="Location"
          value={profileData.location}
        />
        <InfoCard
          icon={<FiUser />}
          label="Account Role"
          value={profileData.role}
        />
        <InfoCard
          icon={<FiCalendar />}
          label="Creation Date"
          value={formatDate(user.metadata?.creationTime)}
        />
        <InfoCard
          icon={<FiCalendar />}
          label="Last Login"
          value={formatDate(user.metadata?.lastSignInTime)}
        />
      </div>

      <div className="pt-4 flex gap-4">
        {/* Button to open edit modal */}
        <button
          className="btn btn-primary flex items-center gap-2"
          onClick={() => setIsEditing(true)}
        >
          <FiEdit2 size={16} /> Edit Profile
        </button>

        {/* Logout button */}
        <button
          className="btn btn-error btn-outline flex items-center gap-2"
          onClick={() =>
            toast.promise(logOut(), {
              loading: "Logging out...",
              success: "Logged out successfully!",
              error: "Logout failed!",
            })
          }
        >
          <FiLogOut size={16} /> Log Out
        </button>
      </div>
    </div>
  );

  // Settings tab - placeholder for security settings
  const SettingsContent = () => (
    <div className="space-y-4 p-4 border border-base-300 rounded-xl">
      <h3 className="text-xl font-semibold text-base-content">
        Account & Security Settings
      </h3>
      <p className="text-base-content/70">
        Manage your password, notifications, and privacy preferences here.
      </p>
      <button
        className="btn btn-sm btn-warning"
        onClick={() =>
          toast("Password change initiated. Check your email!", { icon: "🔑" })
        }
      >
        Change Password
      </button>
    </div>
  );

  // Billing tab - placeholder for billing information
  const BillingContent = () => (
    <div className="space-y-4 p-4 border border-base-300 rounded-xl">
      <h3 className="text-xl font-semibold text-base-content">
        Billing & Subscriptions
      </h3>
      <p className="text-base-content/70">
        View your payment history and manage your subscription plan. (Requires
        DB)
      </p>
      <button
        className="btn btn-sm btn-accent"
        onClick={() => toast.error("Feature not yet implemented.")}
      >
        Manage Subscription
      </button>
    </div>
  );

  // ====== EDIT PROFILE MODAL ======
  const ProfileEditModal = () => {
    // Don't show modal if not editing
    if (!isEditing) return null;

    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
        <div className="bg-base-100 rounded-2xl shadow-2xl w-full max-w-lg p-6 m-4 relative">
          {/* Modal Header */}
          <h2 className="text-3xl font-bold text-primary mb-4 flex items-center">
            <FiEdit2 className="mr-2" /> Edit Profile
          </h2>

          {/* Close button */}
          <button
            className="btn btn-sm btn-circle absolute right-4 top-4"
            onClick={() => setIsEditing(false)}
          >
            <FiX size={20} />
          </button>

          {/* Edit Form - Using React Hook Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* Profile Picture Section */}
            <div className="form-control w-full">
              <label className="label">
                <span className="label-text font-medium text-base-content">
                  Profile Picture
                </span>
              </label>
              <div className="flex items-center gap-4">
                {/* Avatar Preview */}
                <div className="w-20 h-20 rounded-full overflow-hidden ring ring-primary ring-offset-base-100 ring-offset-2">
                  <img
                    src={
                      previewURL ||
                      profileData.photoURL ||
                      `https://api.dicebear.com/7.x/initials/svg?seed=${
                        profileData.displayName || user.email
                      }`
                    }
                    alt="Avatar Preview"
                    className="object-cover w-full h-full"
                  />
                </div>

                {/* Hidden file input */}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleImageSelect}
                />

                {/* Button to trigger file picker */}
                <button
                  type="button"
                  className="btn btn-sm btn-outline flex items-center gap-2"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <FiUpload size={16} /> Change Avatar
                </button>
              </div>
            </div>

            {/* Display Name Input - with validation */}
            <label className="form-control w-full">
              <div className="label">
                <span className="label-text font-medium text-base-content">
                  Display Name
                </span>
              </div>
              <input
                type="text"
                {...register("displayName", {
                  required: "Display name is required",
                  minLength: {
                    value: 2,
                    message: "Name must be at least 2 characters",
                  },
                })}
                placeholder="Your full name"
                className={`input input-bordered w-full ${
                  errors.displayName ? "input-error" : ""
                }`}
              />
              {errors.displayName && (
                <div className="label">
                  <span className="label-text-alt text-error">
                    {errors.displayName.message}
                  </span>
                </div>
              )}
            </label>

            {/* Phone Number Input  */}
            <label className="form-control w-full">
              <div className="label">
                <span className="label-text font-medium text-base-content">
                  Phone Number
                </span>
              </div>
              <input
                type="tel"
                {...register("phone")}
                placeholder="+1 555 123 4567"
                className={`input input-bordered w-full `}
              />
            </label>

            {/* Location Input */}
            <label className="form-control w-full">
              <div className="label">
                <span className="label-text font-medium text-base-content">
                  Location
                </span>
              </div>
              <input
                type="text"
                {...register("location")}
                placeholder="City, Country"
                className="input input-bordered w-full"
              />
            </label>

            {/* Form Buttons */}
            <div className="pt-4 flex justify-end gap-3">
              <button
                type="button"
                className="btn btn-ghost"
                onClick={() => setIsEditing(false)}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn btn-primary flex items-center gap-2"
              >
                <FiSave size={16} /> Save Changes
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  };

  // ====== MAIN RENDER ======
  return (
    <section className="bg-base-200">
      <div className="min-h-screen py-15 px-4 sm:px-6 lg:px-8 ">
        <div className="max-w-6xl mx-auto space-y-10">
          {/* Profile Header Card */}
          <div className="bg-base-100 p-8 rounded-2xl shadow-xl border border-base-300 flex flex-col md:flex-row items-center md:items-start gap-6">
            {/* Avatar */}
            <div className="avatar">
              <div className="w-24 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2 overflow-hidden">
                <img
                  src={
                    previewURL ||
                    user.photoURL ||
                    `https://api.dicebear.com/7.x/initials/svg?seed=${
                      profileData.displayName || user.email
                    }`
                  }
                  alt="User Avatar"
                />
              </div>
            </div>

            {/* User Info */}
            <div className="text-center md:text-left">
              <h1 className="text-4xl font-bold text-base-content">
                {profileData.displayName}
              </h1>
              <p className="text-lg text-primary font-medium mt-1">
                {profileData.role}
              </p>
              <p className="text-sm text-base-content/70 mt-2">
                UID: {user.uid}
              </p>
            </div>

            {/* Member Badge */}
            <div className="md:ml-auto md:self-center">
              <span className="badge text-xs font-semibold px-4 py-3 rounded-full bg-gradient-to-r from-yellow-600 to-yellow-400 text-black shadow-[0_0_10px_rgba(212,175,55,0.4)]">
                LUXEPLAN MEMBER
              </span>
            </div>
          </div>

          <hr />

          {/* Tabs Section */}
          <div className="bg-base-100 p-6 rounded-2xl shadow-xl border border-base-300">
            {/* Tab Navigation */}
            <div role="tablist" className="tabs tabs-bordered tabs-lg">
              <a
                role="tab"
                className={`tab flex items-center gap-2 ${
                  activeTab === "profile" ? "tab-active text-primary" : ""
                }`}
                onClick={() => setActiveTab("profile")}
              >
                <FiUser size={18} /> Profile
              </a>
              <a
                role="tab"
                className={`tab flex items-center gap-2 ${
                  activeTab === "settings" ? "tab-active text-primary" : ""
                }`}
                onClick={() => setActiveTab("settings")}
              >
                <FiSettings size={18} /> Security
              </a>
              <a
                role="tab"
                className={`tab flex items-center gap-2 ${
                  activeTab === "billing" ? "tab-active text-primary" : ""
                }`}
                onClick={() => setActiveTab("billing")}
              >
                <FiCreditCard size={18} /> Billing
              </a>
            </div>

            {/* Tab Content */}
            <div className="py-8 min-h-[300px]">
              {activeTab === "profile" && <ProfileContent />}
              {activeTab === "settings" && <SettingsContent />}
              {activeTab === "billing" && <BillingContent />}
            </div>
          </div>
        </div>

        {/* Edit Modal (shown when isEditing is true) */}
        <ProfileEditModal />
      </div>
    </section>
  );
};

// ====== INFO CARD COMPONENT ======
// Reusable card for displaying user information
const InfoCard = ({ icon, label, value }) => (
  <div className="bg-base-200 p-4 rounded-xl border border-base-300">
    <div className="flex items-center text-primary mb-2">
      {icon}
      <p className="ml-2 text-sm uppercase tracking-wider font-medium text-primary">
        {label}
      </p>
    </div>
    <p className="text-lg font-semibold text-base-content">{value}</p>
  </div>
);

export default Profile;
