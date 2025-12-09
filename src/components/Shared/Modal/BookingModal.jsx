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

const ALL_SLOTS = ["10:00 AM", "12:00 PM", "02:00 PM", "04:00 PM", "06:00 PM"];

const BookingModal = ({ service, user, onClose }) => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedTime, setSelectedTime] = useState("");
  const [location, setLocation] = useState("");
  const [type, setType] = useState(service?.type || "on_site");

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

  const handleBooking = () => {
    if (!selectedTime || !type) {
      return toast.error("Please fill all fields!");
    }

    if (type === "on_site" && !location) {
      return toast.error("Venue location is required for On-Site service!");
    }

    mutation.mutate({
      serviceId: service._id,
      service_name: service.service_name,
      userEmail: user.email,
      userName: user.displayName,
      date: formattedDate,
      time: selectedTime,
      location: type === "on_site" ? location : "In-Studio Consultation",
      cost: service.cost,
      service_category: service.service_category,
      type,
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

          {/* Name */}
          <div className="flex items-center gap-2 text-white/80 font-semibold">
            <FiUser /> Name
          </div>
          <input
            readOnly
            value={user.displayName || ""}
            className="bg-[#2a2a2a] border border-[#d4af37]/20 rounded-lg p-3 text-white"
          />

          {/* Email */}
          <div className="flex items-center gap-2 text-white/80 font-semibold">
            <FiMail /> Email
          </div>
          <input
            readOnly
            value={user.email || ""}
            className="bg-[#2a2a2a] border border-[#d4af37]/20 rounded-lg p-3 text-white"
          />

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

          {/* Cost */}
          <div className="mt-2 text-white/80 font-semibold">
            Cost: <span className="text-[#d4af37] font-bold">৳ {service.cost}</span>
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
              selected: `bg-[#e9c03c] rounded-full text-white`,
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
                className={`p-2 rounded-lg text-sm font-medium flex items-center justify-center gap-1 ${
                  selectedTime === slot
                    ? "bg-[#d4af37] text-black"
                    : !availableSlots.includes(slot)
                    ? "bg-[#2a2a2a] text-white/40 cursor-not-allowed"
                    : "bg-[#2a2a2a] text-white hover:bg-[#d4af37]/20"
                }`}
              >
                <FiClock /> {slot}
              </button>
            ))}
          </div>
        </div>

        {/* Close */}
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
