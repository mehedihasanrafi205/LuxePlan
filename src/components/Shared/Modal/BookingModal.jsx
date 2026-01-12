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
  FiDollarSign,
  FiCreditCard
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
        className="fixed inset-0 flex items-start justify-center bg-black/80 z-[150] p-4 pt-20 md:pt-28 backdrop-blur-sm cursor-pointer"
      >
        <motion.div
          initial="hidden"
          animate="visible"
          exit="exit"
          variants={modalAnimation.modal}
          onClick={(e) => e.stopPropagation()}
          className="
            bg-base-100/90 
            backdrop-blur-xl
            text-base-content
            border border-primary/20 
            rounded-2xl 
            shadow-2xl 
            w-full 
            max-w-5xl 
            h-[85vh] 
            flex 
            flex-col 
            lg:flex-row 
            relative
            overflow-hidden
            cursor-default
          "
        >
          {/* Mobile Header (Sticky) */}
          <div className="lg:hidden p-4 border-b border-base-200 bg-base-100 flex justify-between items-center shrink-0">
             <h3 className="font-serif font-bold text-lg text-primary">Booking Details</h3>
             <button onClick={onClose} className="btn btn-ghost btn-circle btn-sm">
                <FiX size={20} />
             </button>
          </div>

          {/* Left Side (Form) - Scrollable */}
          <motion.div
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
            className="flex-1 p-5 lg:p-6 overflow-y-auto custom-scrollbar flex flex-col gap-5"
          >
            <div className="hidden lg:block shrink-0">
                <h3 className="font-serif font-bold text-2xl text-primary">Confirm Reservation</h3>
                <p className="text-base-content/60 text-xs mt-1">Review details and secure your slot.</p>
            </div>

            {/* Read-Only Info Group - Compact Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 shrink-0">
                {/* Name */}
                <div className="form-control">
                  <label className="label py-1">
                    <span className="label-text font-semibold flex items-center gap-1.5 text-xs text-base-content/70"><FiUser className="text-primary"/> Name</span>
                  </label>
                  <input
                    readOnly
                    value={user.displayName || ""}
                    className="input input-sm input-bordered w-full bg-base-200/50 text-base-content cursor-default focus:outline-none text-sm"
                  />
                </div>

                {/* Email */}
                <div className="form-control">
                  <label className="label py-1">
                    <span className="label-text font-semibold flex items-center gap-1.5 text-xs text-base-content/70"><FiMail className="text-primary"/> Email</span>
                  </label>
                  <input
                    readOnly
                    value={user.email || ""}
                    className="input input-sm input-bordered w-full bg-base-200/50 text-base-content cursor-default focus:outline-none text-sm"
                  />
                </div>
            </div>

            {/* Service & Type */}
            <div className="p-4 bg-base-200/40 rounded-xl border border-base-200 shrink-0">
                 <div className="flex items-center justify-between mb-3">
                     <span className="font-bold flex items-center gap-2 text-sm md:text-base"><FiCheck className="text-primary"/> {service.service_name}</span>
                     <span className="badge badge-primary badge-outline font-bold badge-sm">{service.service_category}</span>
                 </div>
                 
                 <div className="divider my-0"></div>

                 <div className="flex flex-col sm:flex-row sm:items-center gap-2 mt-3">
                    <span className="font-semibold flex items-center gap-2 text-sm w-28 shrink-0"><FiLayers className="text-primary"/> Type:</span>
                    <div className="flex gap-4">
                         <label className="cursor-pointer flex items-center gap-2 hover:text-primary transition-colors">
                            <input type="radio" name="serviceType" value="in_studio" checked={type === "in_studio"} onChange={(e) => setType(e.target.value)} className="radio radio-primary radio-xs" />
                            <span className="text-sm font-medium">In-Studio</span>
                        </label>
                        <label className="cursor-pointer flex items-center gap-2 hover:text-primary transition-colors">
                            <input type="radio" name="serviceType" value="on_site" checked={type === "on_site"} onChange={(e) => setType(e.target.value)} className="radio radio-primary radio-xs" />
                            <span className="text-sm font-medium">On-Site</span>
                        </label>
                    </div>
                 </div>
                 
                 {/* Venue Address */}
                 <AnimatePresence>
                    {type === "on_site" && (
                     <motion.div 
                        initial={{ opacity: 0, height: 0 }} 
                        animate={{ opacity: 1, height: 'auto' }} 
                        exit={{ opacity: 0, height: 0 }}
                        className="mt-3"
                     >
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-base-content/40">
                                <FiMapPin size={14} />
                            </div>
                            <input
                            type="text"
                            placeholder="Enter detailed venue address..."
                            value={location}
                            onChange={(e) => setLocation(e.target.value)}
                            className="input input-sm input-bordered w-full pl-9 focus:border-primary focus:ring-1 focus:ring-primary/20 bg-base-100 text-sm"
                            />
                        </div>
                     </motion.div>
                    )}
                 </AnimatePresence>
            </div>

            {/* Add-ons & Coupon Accordion */}
            <div className="collapse collapse-arrow bg-base-200/30 border border-base-200 rounded-xl shrink-0">
                <input type="checkbox" /> 
                <div className="collapse-title font-medium flex items-center gap-2 text-sm py-3 min-h-0">
                    <FiCreditCard className="text-primary" /> Extras & Discounts
                </div>
                <div className="collapse-content space-y-3 pb-3">
                     {/* Add-ons */}
                    {service.addOns && service.addOns.length > 0 && (
                    <div>
                        <span className="text-[10px] font-bold uppercase text-base-content/50 mb-1 block tracking-widest">Recommended Add-ons</span>
                        <div className="space-y-1">
                        {service.addOns.map((addOn, idx) => (
                            <label key={idx} className="flex items-center justify-between p-2 rounded-lg bg-base-100 border border-base-200 hover:border-primary/40 cursor-pointer transition-all hover:shadow-sm group">
                                <div className="flex items-center gap-2">
                                    <input 
                                    type="checkbox"
                                    checked={!!selectedAddOns.find(a => a.name === addOn.name)}
                                    onChange={() => handleAddOnToggle(addOn)}
                                    className="checkbox checkbox-primary checkbox-xs rounded-sm"
                                    />
                                    <span className="text-xs font-medium group-hover:text-primary transition-colors">{addOn.name}</span>
                                </div>
                                <span className="text-primary font-bold text-xs">+ ৳{addOn.price}</span>
                            </label>
                        ))}
                        </div>
                    </div>
                    )}

                    {/* Coupon */}
                    <div>
                         <span className="text-[10px] font-bold uppercase text-base-content/50 mb-1 block tracking-widest">Coupon Code</span>
                        {!appliedCoupon ? (
                            <div className="join w-full">
                                <input 
                                    type="text" 
                                    placeholder="Enter Code" 
                                    className="input input-sm input-bordered join-item w-full focus:outline-none text-sm"
                                    value={couponCode}
                                    onChange={(e) => setCouponCode(e.target.value)}
                                />
                                <button 
                                    onClick={handleApplyCoupon}
                                    className="btn btn-sm btn-primary join-item text-black font-bold"
                                >
                                    Apply
                                </button>
                            </div>
                        ) : (
                            <div className="flex items-center justify-between bg-success/10 border border-success/30 p-2 rounded-lg">
                                <div className="flex items-center gap-2">
                                    <FiCheck className="text-success" size={14} />
                                    <span className="text-success font-bold text-xs">
                                        Coupon <b>{appliedCoupon.code}</b> applied!
                                    </span>
                                </div>
                                <button 
                                    onClick={() => {
                                    setAppliedCoupon(null);
                                    setDiscount(0);
                                    setCouponCode("");
                                    }}
                                    className="btn btn-xs btn-circle btn-ghost text-error"
                                >
                                    <FiX size={14} />
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
          </motion.div>

          {/* Right Side (Scheduler & Total) - Fixed height column */}
          <div className="lg:w-[380px] bg-base-200/50 flex flex-col border-t lg:border-t-0 lg:border-l border-base-300 relative h-full">
             <button onClick={onClose} className="hidden lg:flex absolute top-3 right-3 btn btn-circle btn-ghost btn-sm hover:bg-base-300 z-10">
                <FiX size={18} />
             </button>

             {/* Scrollable Content (Date & Time) */}
             <div className="overflow-y-auto custom-scrollbar flex-1 p-5 lg:p-6 pb-0">
                 {/* Date Picker */}
                 <div className="mb-6">
                     <h4 className="flex items-center gap-2 font-bold text-sm mb-3 text-primary font-serif">
                       <FiCalendar/> Select Date
                     </h4>
                     <div className="bg-base-100 p-2 rounded-xl shadow-sm border border-base-200 flex justify-center transform scale-95 origin-top-left sm:scale-100 sm:origin-center">
                        <DayPicker
                        mode="single"
                        selected={selectedDate}
                        onSelect={setSelectedDate}
                        className="rdp-custom !m-0"
                        modifiersClassNames={{
                            selected: "bg-primary text-primary-content font-bold rounded-full",
                            today: "text-primary font-bold"
                        }}
                        styles={{
                            caption: { color: 'var(--color-primary)', fontSize: '0.9rem' },
                            head_cell: { color: 'var(--color-base-content)', opacity: 0.6, fontSize: '0.8rem' },
                            cell: { fontSize: '0.9rem' }
                        }}
                        />
                     </div>
                 </div>

                 {/* Time Picker */}
                 <div className="mb-4">
                     <h4 className="flex items-center gap-2 font-bold text-sm mb-3 text-primary font-serif">
                       <FiClock/> Available Slots
                     </h4>
                     <div className="grid grid-cols-2 gap-2">
                        {ALL_SLOTS.map((slot) => {
                            const isAvailable = availableSlots.includes(slot);
                            const isSelected = selectedTime === slot;
                            return (
                                <button
                                key={slot}
                                disabled={!isAvailable}
                                onClick={() => setSelectedTime(slot)}
                                className={`
                                    py-2 px-3 rounded-lg text-xs font-semibold transition-all duration-300 border
                                    ${isSelected 
                                        ? "bg-primary text-black border-primary shadow-lg shadow-primary/20 scale-105" 
                                        : isAvailable 
                                            ? "bg-base-100 border-base-200 hover:border-primary/50 hover:shadow-md" 
                                            : "bg-base-200/50 text-base-content/30 border-transparent cursor-not-allowed decoration-slice"}
                                `}
                                >
                                {slot}
                                </button>
                            )
                        })}
                     </div>
                 </div>
             </div>

             {/* Fixed Bottom Section (Summary & Action) */}
             <div className="p-5 lg:p-6 border-t border-base-300 bg-base-100/80 backdrop-blur-md shrink-0">
                  <div className="flex justify-between items-end mb-4">
                      <div className="text-xs text-base-content/70 flex flex-col gap-1">
                          <span className="flex justify-between w-24">Base: <span>৳{service.cost}</span></span>
                          {discount > 0 && <span className="flex justify-between w-24 text-success">Save: <span>-৳{discount}</span></span>}
                      </div>
                      <div className="text-right">
                          <span className="text-xs text-base-content/50 block">Total Amount</span>
                          <span className="text-xl font-black text-primary font-serif lh-1">
                            ৳{(service.cost + selectedAddOns.reduce((sum, i) => sum + i.price, 0)) - discount}
                          </span>
                      </div>
                  </div>

                  <button
                    onClick={handleBooking}
                    className="btn btn-primary w-full rounded-xl shadow-lg shadow-primary/20 font-bold text-black"
                  >
                    Confirm Booking
                  </button>
             </div>
          </div>

        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default BookingModal;
