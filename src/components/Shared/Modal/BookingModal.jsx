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
} from "react-icons/fi";
import toast from "react-hot-toast";
import { useNavigate } from "react-router";

const ALL_SLOTS = ["10:00 AM", "12:00 PM", "02:00 PM", "04:00 PM", "06:00 PM"];

const BookingModal = ({ service, user, onClose }) => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedTime, setSelectedTime] = useState("");
  const [location, setLocation] = useState("");
  const queryClient = useQueryClient();
  const API_URL = import.meta.env.VITE_API_URL;
  const navigate = useNavigate();

  if (!service || !user) return null; // Safety check

  const formattedDate = selectedDate
    ? selectedDate.toISOString().split("T")[0]
    : null;

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
    onError: (err) => {
      toast.error(err.response?.data?.message || "Booking failed!");
    },
  });

  const handleBooking = () => {
    if (!selectedTime || !location) {
      return toast.error("Select time and location!");
    }
    mutation.mutate({
      serviceId: service._id,
      service_name: service.service_name,
      userEmail: user.email,
      userName: user.displayName,
      date: formattedDate,
      time: selectedTime,
      location,
      cost: service.cost,
      service_category: service.service_category,
    });
  };

  const availableSlots = ALL_SLOTS.filter(
    (slot) => !bookedSlots.includes(slot)
  );

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50 p-4">
      <div className="bg-[#1A1A1A]/80 backdrop-blur-xl border border-[#d4af37]/40 rounded-xl shadow-2xl max-w-4xl w-full overflow-hidden flex flex-col lg:flex-row relative">
        {/* Left Side */}
        <div className="flex-1 p-6 lg:p-8 flex flex-col gap-4">
          <div className="flex items-center gap-2 text-white/80 font-semibold">
            <FiUser /> Name
          </div>
          <input
            type="text"
            readOnly
            value={user.displayName || ""}
            className="bg-[#2a2a2a] border border-[#d4af37]/20 rounded-lg p-3 text-white"
          />

          <div className="flex items-center gap-2 text-white/80 font-semibold">
            <FiMail /> Email
          </div>
          <input
            type="email"
            readOnly
            value={user.email || ""}
            className="bg-[#2a2a2a] border border-[#d4af37]/20 rounded-lg p-3 text-white"
          />

          <div className="flex items-center gap-2 text-white/80 font-semibold">
            <FiCheck /> Service
          </div>
          <input
            type="text"
            readOnly
            value={service.service_name || ""}
            className="w-full bg-[#2a2a2a] border border-[#d4af37]/20 rounded-lg p-3 text-white"
          />

          <div className="flex items-center gap-2 text-white/80 font-semibold">
            <FiMapPin /> Venue Address
          </div>
          <input
            type="text"
            placeholder="Enter venue address"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="w-full bg-[#2a2a2a] border border-[#d4af37]/20 rounded-lg p-3 text-white"
          />

          {/* Service Cost */}
          <div className="mt-2 text-white/80 font-semibold">
            Cost:{" "}
            <span className="text-[#d4af37] font-bold">৳ {service.cost}</span>
          </div>

          <button
            onClick={handleBooking}
            className="mt-auto bg-[#d4af37] text-[#1A1A1A] p-4 rounded-lg font-bold hover:brightness-110 active:scale-[0.98]"
          >
            Confirm Booking
          </button>
        </div>

        {/* Right Side */}
        <div className="flex-1 p-6 lg:p-8 border-t lg:border-t-0 lg:border-l border-[#d4af37]/20 flex flex-col gap-4">
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
                <FiClock /> {slot}
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

export default BookingModal;
