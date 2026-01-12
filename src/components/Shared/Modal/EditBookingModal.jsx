import React, { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";
import {
  FiX,
  FiCalendar,
  FiClock,
  FiMapPin,
  FiCheck,
  FiLayers,
} from "react-icons/fi";
import toast from "react-hot-toast";

const ALL_SLOTS = ["10:00 AM", "12:00 PM", "02:00 PM", "04:00 PM", "06:00 PM"];

const EditBookingModal = ({ booking, onClose }) => {
  const [selectedDate, setSelectedDate] = useState(
    booking?.date ? new Date(booking.date) : new Date()
  );
  const [selectedTime, setSelectedTime] = useState(booking?.time || "");
  const [location, setLocation] = useState(
    booking?.type === "on_site" ? booking.location : ""
  );
  const [type, setType] = useState(booking?.type || "on_site");

  const queryClient = useQueryClient();
  const API_URL = import.meta.env.VITE_API_URL;

  if (!booking) return null;

  const formattedDate = selectedDate?.toISOString().split("T")[0];

  // Fetch booked slots for selected date
  const { data: bookedSlots = [] } = useQuery({
    queryKey:
      formattedDate && booking.serviceId
        ? ["bookings", booking.serviceId, formattedDate]
        : [],
    queryFn: async () => {
      const res = await axios.get(
        `${API_URL}/bookings?serviceId=${booking.serviceId}&date=${formattedDate}`
      );
      // Exclude current booking time so user can keep same slot
      return res.data
        .filter((b) => b._id !== booking._id)
        .map((b) => b.time);
    },
    enabled: !!formattedDate && !!booking.serviceId,
    keepPreviousData: true,
  });

  const mutation = useMutation({
    mutationFn: (updatedBooking) =>
      axios.put(`${API_URL}/bookings/${booking._id}`, updatedBooking),
    onSuccess: () => {
      toast.success("Booking updated!");
      queryClient.invalidateQueries(["myBookings", booking.userEmail]);
      onClose();
    },
    onError: () => toast.error("Failed to update booking"),
  });

  const handleUpdate = () => {
    if (!selectedTime || !type) {
      return toast.error("Please fill all fields!");
    }

    if (type === "on_site" && !location) {
      return toast.error("Venue location is required for On-Site service!");
    }

    mutation.mutate({
      date: formattedDate,
      time: selectedTime,
      location: type === "on_site" ? location : "In-Studio Consultation",
      type,
    });
  };

  const availableSlots = ALL_SLOTS.filter(
    (slot) => !bookedSlots.includes(slot)
  );

  return (
    <div className="fixed inset-0 flex items-start justify-center bg-black/80 z-[150] p-4 pt-20 md:pt-28 backdrop-blur-sm cursor-pointer">
      <div 
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
      ">
        
        {/* Mobile Header (Sticky) */}
        <div className="lg:hidden p-4 border-b border-base-200 bg-base-100 flex justify-between items-center shrink-0">
             <h3 className="font-serif font-bold text-lg text-primary">Edit Booking</h3>
             <button onClick={onClose} className="btn btn-ghost btn-circle btn-sm cursor-pointer">
                <FiX size={20} />
             </button>
        </div>

        {/* Left Side (Form) - Scrollable */}
        <div className="flex-1 p-5 lg:p-6 overflow-y-auto custom-scrollbar flex flex-col gap-5">
            <div className="hidden lg:block shrink-0">
                <h3 className="font-serif font-bold text-2xl text-primary">Edit Reservation</h3>
                <p className="text-base-content/60 text-xs mt-1">Modify your booking details.</p>
            </div>

            {/* Service & Type */}
            <div className="p-4 bg-base-200/40 rounded-xl border border-base-200 shrink-0">
                 <div className="flex items-center justify-between mb-3">
                     <span className="font-bold flex items-center gap-2 text-sm md:text-base"><FiCheck className="text-primary"/> {booking.service_name}</span>
                 </div>
                 
                 <div className="divider my-0"></div>

                 <div className="flex flex-col sm:flex-row sm:items-center gap-2 mt-3">
                    <span className="font-semibold flex items-center gap-2 text-sm w-28 shrink-0"><FiLayers className="text-primary"/> Type:</span>
                    <div className="flex gap-4">
                         <label className="cursor-pointer flex items-center gap-2 hover:text-primary transition-colors">
                            <input type="radio" name="serviceType" value="in_studio" checked={type === "in_studio"} onChange={(e) => setType(e.target.value)} className="radio radio-primary radio-xs cursor-pointer" />
                            <span className="text-sm font-medium">In-Studio</span>
                        </label>
                        <label className="cursor-pointer flex items-center gap-2 hover:text-primary transition-colors">
                            <input type="radio" name="serviceType" value="on_site" checked={type === "on_site"} onChange={(e) => setType(e.target.value)} className="radio radio-primary radio-xs cursor-pointer" />
                            <span className="text-sm font-medium">On-Site</span>
                        </label>
                    </div>
                 </div>
                 
                 {/* Venue Address */}
                 {type === "on_site" && (
                    <div className="mt-3 animate-pulse-once">
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
                    </div>
                 )}
            </div>
        </div>

        {/* Right Side (Scheduler & Action) */}
        <div className="lg:w-[380px] bg-base-200/50 flex flex-col border-t lg:border-t-0 lg:border-l border-base-300 relative h-full">
            <button onClick={onClose} className="hidden lg:flex absolute top-3 right-3 btn btn-circle btn-ghost btn-sm hover:bg-base-300 z-10 cursor-pointer">
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
                                    py-2 px-3 rounded-lg text-xs font-semibold transition-all duration-300 border cursor-pointer
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
             
             {/* Sticky Footer Action */}
             <div className="p-5 lg:p-6 border-t border-base-300 bg-base-100/80 backdrop-blur-md shrink-0">
                  <button
                    onClick={handleUpdate}
                    className="btn btn-primary w-full rounded-xl shadow-lg shadow-primary/20 font-bold text-black cursor-pointer"
                  >
                    Update Booking
                  </button>
             </div>
        </div>

      </div>
    </div>
  );
};

export default EditBookingModal;
