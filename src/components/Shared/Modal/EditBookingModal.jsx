import React, { useState, useEffect } from "react";
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
} from "react-icons/fi";
import toast from "react-hot-toast";

const ALL_SLOTS = ["10:00 AM", "12:00 PM", "02:00 PM", "04:00 PM", "06:00 PM"];

const EditBookingModal = ({ booking, onClose }) => {
  const [selectedDate, setSelectedDate] = useState(
    booking?.date ? new Date(booking.date) : new Date()
  );
  const [selectedTime, setSelectedTime] = useState(booking?.time || "");
  const [location, setLocation] = useState(booking?.location || "");
  const queryClient = useQueryClient();
  const API_URL = import.meta.env.VITE_API_URL;

  if (!booking) return null;

  const formattedDate = selectedDate
    ? selectedDate.toISOString().split("T")[0]
    : null;

  // Fetch booked slots for the selected date
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
    if (!selectedTime || !location) {
      return toast.error("Select time and location!");
    }
    mutation.mutate({
      date: formattedDate,
      time: selectedTime,
      location,
    });
  };

  const availableSlots = ALL_SLOTS.filter(
    (slot) => !bookedSlots.includes(slot)
  );

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50 p-4">
      <div className="bg-[#1A1A1A]/80 backdrop-blur-xl border border-[#d4af37]/40 rounded-xl shadow-2xl max-w-4xl w-full overflow-hidden flex flex-col lg:flex-row relative">
        {/* Left side: Booking Info */}
        <div className="flex-1 p-6 lg:p-8 flex flex-col gap-4">
          <div className="text-white/80 font-semibold flex items-center gap-2">
            <FiCheck /> Service
          </div>
          <input
            type="text"
            readOnly
            value={booking.service_name}
            className="bg-[#2a2a2a] border border-[#d4af37]/20 rounded-lg p-3 text-white"
          />

          <div className="text-white/80 font-semibold flex items-center gap-2 mt-4">
            <FiMapPin /> Venue Address
          </div>
          <input
            type="text"
            placeholder="Enter venue address"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="bg-[#2a2a2a] border border-[#d4af37]/20 rounded-lg p-3 text-white"
          />

          <button
            onClick={handleUpdate}
            className="mt-auto bg-[#d4af37] text-[#1A1A1A] p-4 rounded-lg font-bold hover:brightness-110 active:scale-[0.98]"
          >
            Update Booking
          </button>
        </div>

        {/* Right side: Date & Time */}
        <div className="flex-1 p-6 lg:p-8 border-t lg:border-t-0 lg:border-l border-[#d4af37]/20 flex flex-col gap-4">
          <div className="text-white/80 font-semibold flex items-center gap-2">
            <FiCalendar /> Select Date
          </div>
          <DayPicker
            mode="single"
            selected={selectedDate}
            onSelect={setSelectedDate}
            className="bg-[#2a2a2a] rounded-lg p-2"
            classNames={{
              today: `text-[#e9c03c]`,
              selected: `bg-[#e9c03c] border-[#e9c03c] rounded-full text-white`,
            }}
          />

          <div className="flex items-center gap-2 text-white/80 font-semibold mt-4">
            <FiClock /> Select Time
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {ALL_SLOTS.map((slot) => (
              <button
                key={slot}
                disabled={!availableSlots.includes(slot)}
                onClick={() => setSelectedTime(slot)}
                className={`flex items-center justify-center gap-1 p-2 rounded-lg text-sm font-medium ${
                  selectedTime === slot
                    ? "bg-[#d4af37] text-[#1A1A1A] border border-[#d4af37] ring-2 ring-offset-2 ring-[#1A1A1A] ring-[#d4af37]"
                    : !availableSlots.includes(slot)
                    ? "bg-[#2a2a2a] text-white/40 cursor-not-allowed border border-[#d4af37]/20"
                    : "bg-[#2a2a2a] text-white/90 border border-[#d4af37]/20 hover:bg-[#d4af37]/20 hover:border-[#d4af37]/50 transition-colors"
                }`}
              >
                {slot}
              </button>
            ))}
          </div>
        </div>

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-white/70 hover:text-white"
        >
          <FiX size={20} />
        </button>
      </div>
    </div>
  );
};

export default EditBookingModal;
