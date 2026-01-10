import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";
import {
  FiUser,
  FiMail,
  FiCalendar,
  FiClock,
  FiMapPin,
  FiX,
  FiCheck,
  FiLayers,
} from "react-icons/fi";
import toast from "react-hot-toast";
import { useNavigate } from "react-router";
import { motion, AnimatePresence } from "framer-motion";
import {
  modalAnimation,
  staggerContainer,
  staggerItem,
} from "../../../utils/animations";

const ALL_SLOTS = ["10:00 AM", "12:00 PM", "02:00 PM", "04:00 PM", "06:00 PM"];

const BookingModal = ({ service, user, onClose }) => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedTime, setSelectedTime] = useState("");
  const [location, setLocation] = useState("");
  const [type, setType] = useState(service?.type || "on_site");
  
  // Coupon State
  const [couponCode, setCouponCode] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [discount, setDiscount] = useState(0);

  // Add-ons State
  const [selectedAddOns, setSelectedAddOns] = useState([]);

  const queryClient = useQueryClient();
  const API_URL = import.meta.env.VITE_API_URL;
  const navigate = useNavigate();

  if (!service || !user) return null;

  const formattedDate = selectedDate?.toISOString().split("T")[0];

  // Fetch booked slots
  const { data: bookedSlots = [] } = useQuery({
    queryKey:
      formattedDate && service._id
        ? ["bookings", service._id, formattedDate]
        : [],
    queryFn: async () => {
      const res = await axios.get(
        `${API_URL}/bookings?serviceId=${service._id}&date=${formattedDate}`
      );
      return res.data.map((b) => b.time);
    },
    enabled: !!formattedDate && !!service._id,
    keepPreviousData: true,
  });

  const mutation = useMutation({
    mutationFn: (newBooking) => axios.post(`${API_URL}/bookings`, newBooking),
    onSuccess: () => {
      toast.success("Booking confirmed!");
      navigate("/dashboard/my-bookings");
      queryClient.invalidateQueries(["bookings", service._id, formattedDate]);
      onClose();
    },
    onError: (err) =>
      toast.error(err.response?.data?.message || "Booking failed!"),
  });

  const handleAddOnToggle = (addOn) => {
    if (selectedAddOns.find((a) => a.name === addOn.name)) {
      setSelectedAddOns(selectedAddOns.filter((a) => a.name !== addOn.name));
    } else {
      setSelectedAddOns([...selectedAddOns, addOn]);
    }
  };

  const handleApplyCoupon = async () => {
    if (!couponCode) return toast.error("Enter a coupon code!");
    try {
      const res = await axios.post(`${API_URL}/coupons/validate`, {
        code: couponCode,
        serviceCost: service.cost,
      });
      console.log(res.data)
      if (res.data.success) {
        setAppliedCoupon(res.data); // { code, amount, type, discountAmount }
        setDiscount(res.data.discountAmount);
        toast.success(`Coupon Applied! Saved ৳${res.data.discountAmount}`);
      }
    } catch (err) {
      setAppliedCoupon(null);
      setDiscount(0);
      toast.error(err.response?.data?.message || "Invalid Coupon");
    }
  };

  const handleBooking = () => {
    if (!selectedTime || !type) {
        return toast.error("Please fill all fields!");
    }
  
    if (type === "on_site" && !location) {
        return toast.error("Venue location is required for On-Site service!");
    }
      
    const addOnsCost = selectedAddOns.reduce((sum, item) => sum + item.price, 0);
    const finalCost = (service.cost + addOnsCost) - discount;
  
    mutation.mutate({
        serviceId: service._id,
        service_name: service.service_name,
        userEmail: user.email,
        userName: user.displayName,
        date: formattedDate,
        time: selectedTime,
        location: type === "on_site" ? location : "In-Studio Consultation",
        cost: finalCost,
        originalServiceCost: service.cost,
        addOns: selectedAddOns,
        couponCode: appliedCoupon ? appliedCoupon.code : null,
        discount: discount,
        service_category: service.service_category,
        type,
    });
  };

  const availableSlots = ALL_SLOTS.filter(
    (slot) => !bookedSlots.includes(slot)
  );

  return (
    <AnimatePresence>
      <motion.div
        initial="hidden"
        animate="visible"
        exit="exit"
        variants={modalAnimation.backdrop}
        onClick={onClose}
        className="fixed inset-0 flex items-center justify-center bg-black/50 z-50 p-4"
      >
        <motion.div
          initial="hidden"
          animate="visible"
          exit="exit"
          variants={modalAnimation.modal}
          onClick={(e) => e.stopPropagation()}
          className="
  bg-[#1A1A1A]/90 
  backdrop-blur-xl 
  border border-[#d4af37]/40 
  rounded-xl 
  shadow-2xl 
  w-full 
  max-w-4xl 
  max-h-[90vh]
  overflow-hidden 
  flex 
  flex-col 
  lg:flex-row 
  relative
"
        >
          {/* Left Side */}
          <motion.div
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
            className="flex-1 p-5 sm:p-6 lg:p-8 flex flex-col gap-4 overflow-y-auto"
          >
            {/* Name */}
            <motion.div variants={staggerItem}>
              <div className="flex items-center gap-2 text-white/80 font-semibold">
                <FiUser /> Name
              </div>
              <input
                readOnly
                value={user.displayName || ""}
                className="bg-[#2a2a2a] border border-[#d4af37]/20 rounded-lg p-3 text-white"
              />
            </motion.div>

            {/* Email */}
            <motion.div variants={staggerItem}>
              <div className="flex items-center gap-2 text-white/80 font-semibold">
                <FiMail /> Email
              </div>
              <input
                readOnly
                value={user.email || ""}
                className="bg-[#2a2a2a] border border-[#d4af37]/20 rounded-lg p-3 text-white"
              />
            </motion.div>

            {/* Service */}
            <div className="flex items-center gap-2 text-white/80 font-semibold">
              <FiCheck /> Service
            </div>
            <input
              readOnly
              value={service.service_name}
              className="bg-[#2a2a2a] border border-[#d4af37]/20 rounded-lg p-3 text-white"
            />

            {/* Service Type (Radio) */}
            <div className="flex items-center gap-2 text-white/80 font-semibold">
              <FiLayers /> Service Type
            </div>

            <div className="flex flex-col gap-2 mt-1 text-white">
              {/* In-Studio */}
              <label className="flex items-center gap-3 bg-[#2a2a2a] border border-[#d4af37]/20 p-3 rounded-lg cursor-pointer hover:border-[#d4af37]/40 transition">
                <input
                  type="radio"
                  name="serviceType"
                  value="in_studio"
                  checked={type === "in_studio"}
                  onChange={(e) => setType(e.target.value)}
                  className="accent-[#d4af37] w-4 h-4"
                />
                <span>In-Studio Consultation</span>
              </label>

              {/* On-Site */}
              <label className="flex items-center gap-3 bg-[#2a2a2a] border border-[#d4af37]/20 p-3 rounded-lg cursor-pointer hover:border-[#d4af37]/40 transition">
                <input
                  type="radio"
                  name="serviceType"
                  value="on_site"
                  checked={type === "on_site"}
                  onChange={(e) => setType(e.target.value)}
                  className="accent-[#d4af37] w-4 h-4"
                />
                <span>On-Site Decoration</span>
              </label>
            </div>

            {/* Venue Address — SHOW ONLY IF on_site */}
            {type === "on_site" && (
              <>
                <div className="flex items-center gap-2 text-white/80 font-semibold">
                  <FiMapPin /> Venue Address
                </div>
                <input
                  type="text"
                  placeholder="Enter venue address"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="bg-[#2a2a2a] border border-[#d4af37]/20 rounded-lg p-3 text-white"
                />
              </>
            )}

            {/* Add-ons Selection */}
            {service.addOns && service.addOns.length > 0 && (
              <div className="mt-2">
                 <div className="flex items-center gap-2 text-white/80 font-semibold mb-2">
                   <FiCheck /> Recommended Add-ons
                 </div>
                 <div className="space-y-2">
                   {service.addOns.map((addOn, idx) => (
                      <label key={idx} className="flex items-center justify-between bg-[#2a2a2a] p-3 rounded-lg border border-[#d4af37]/10 cursor-pointer hover:border-[#d4af37]/40">
                         <div className="flex items-center gap-2">
                            <input 
                              type="checkbox"
                              checked={!!selectedAddOns.find(a => a.name === addOn.name)}
                              onChange={() => handleAddOnToggle(addOn)}
                              className="checkbox checkbox-primary checkbox-sm"
                            />
                            <span className="text-white/90">{addOn.name}</span>
                         </div>
                         <span className="text-[#d4af37] font-semibold">+ ৳{addOn.price}</span>
                      </label>
                   ))}
                 </div>
              </div>
            )}

            {/* Coupon Input */}
            <div className="mt-4">
               <div className="flex items-center gap-2 text-white/80 font-semibold mb-2">
                  <FiLayers /> Apply Coupon
               </div>
               {!appliedCoupon ? (
                 <div className="flex gap-2">
                   <input 
                     type="text" 
                     placeholder="Enter Code" 
                     className="input input-bordered w-full bg-[#2a2a2a] text-white"
                     value={couponCode}
                     onChange={(e) => setCouponCode(e.target.value)}
                   />
                   <button 
                     onClick={handleApplyCoupon}
                     className="btn btn-primary text-black"
                   >
                     Apply
                   </button>
                 </div>
               ) : (
                 <div className="flex items-center justify-between bg-green-900/30 border border-green-500/50 p-3 rounded-lg">
                   <span className="text-green-400 font-semibold">
                     Coupon <b>{appliedCoupon.code}</b> applied!
                   </span>
                   <button 
                     onClick={() => {
                       setAppliedCoupon(null);
                       setDiscount(0);
                       setCouponCode("");
                     }}
                     className="btn btn-xs btn-ghost text-red-400"
                   >
                     Remove
                   </button>
                 </div>
               )}
            </div>

            {/* Cost Display */}
            <div className="mt-4 p-4 bg-[#2a2a2a] rounded-xl space-y-2">
               <div className="flex justify-between text-white/70">
                 <span>Base Price:</span>
                 <span>৳ {service.cost}</span>
               </div>
               {selectedAddOns.length > 0 && (
                 <div className="flex justify-between text-white/70">
                    <span>Add-ons:</span>
                    <span>+ ৳ {selectedAddOns.reduce((sum, i) => sum + i.price, 0)}</span>
                 </div>
               )}
               {discount > 0 && (
                 <div className="flex justify-between text-green-400">
                   <span>Discount:</span>
                   <span>- ৳ {discount}</span>
                 </div>
               )}
               <div className="border-t border-white/10 pt-2 flex justify-between text-lg font-bold text-[#d4af37]">
                 <span>Total:</span>
                 <span>৳ {(service.cost + selectedAddOns.reduce((sum, i) => sum + i.price, 0)) - discount}</span>
               </div>
            </div>

            <motion.button
              variants={staggerItem}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleBooking}
              className="mt-auto bg-[#d4af37] text-[#1A1A1A] p-4 rounded-lg font-bold hover:brightness-110 transition"
            >
              Confirm Booking
            </motion.button>
          </motion.div>

          {/* Right Side */}
          <div className="flex-1 p-6 lg:p-8 border-t lg:border-t-0 lg:border-l border-[#d4af37]/20 flex flex-col gap-4 overflow-y-auto">
            <div className="flex items-center gap-2 text-white/80 font-semibold">
              <FiCalendar /> Select Date
            </div>

            <DayPicker
              mode="single"
              selected={selectedDate}
              onSelect={setSelectedDate}
              className="bg-[#2a2a2a] rounded-lg p-2"
              classNames={{
                today: `text-[#e9c03c]`,
                selected: `bg-[#e9c03c] rounded-full text-white`,
              }}
            />

            <div className="flex items-center gap-2 text-white/80 font-semibold mt-4">
              <FiClock /> Select Time
            </div>

            <motion.div
              initial="hidden"
              animate="visible"
              variants={staggerContainer}
              className="grid grid-cols-2 sm:grid-cols-3 gap-3"
            >
              {ALL_SLOTS.map((slot) => (
                <motion.button
                  key={slot}
                  variants={staggerItem}
                  whileHover={
                    availableSlots.includes(slot) ? { scale: 1.05 } : {}
                  }
                  whileTap={
                    availableSlots.includes(slot) ? { scale: 0.95 } : {}
                  }
                  disabled={!availableSlots.includes(slot)}
                  onClick={() => setSelectedTime(slot)}
                  className={`p-2 rounded-lg text-sm font-medium flex items-center justify-center gap-1 transition ${
                    selectedTime === slot
                      ? "bg-[#d4af37] text-black"
                      : !availableSlots.includes(slot)
                      ? "bg-[#2a2a2a] text-white/40 cursor-not-allowed"
                      : "bg-[#2a2a2a] text-white hover:bg-[#d4af37]/20"
                  }`}
                >
                  <FiClock /> {slot}
                </motion.button>
              ))}
            </motion.div>
          </div>

          {/* Close */}
          <motion.button
            whileHover={{ scale: 1.1, rotate: 90 }}
            whileTap={{ scale: 0.9 }}
            onClick={onClose}
            className="absolute top-4 right-4 text-white/70 hover:text-white transition cursor-pointer"
          >
            <FiX size={20} />
          </motion.button>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default BookingModal;
