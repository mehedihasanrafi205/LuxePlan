import React from "react";
import { FiX, FiTrash2 } from "react-icons/fi";

const DeleteConfirmationModal = ({ onClose, onConfirm, message }) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50 p-4">
      <div className="bg-[#1A1A1A]/90 border border-[#d4af37]/40 rounded-xl shadow-2xl max-w-md w-full p-6 flex flex-col gap-4 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-white/70 hover:text-white"
        >
          <FiX size={20} />
        </button>

        <h2 className="text-2xl font-bold text-white flex items-center gap-2">
          <FiTrash2 /> Confirm Delete
        </h2>
        <p className="text-white/70">{message || "Are you sure you want to delete this?"}</p>

        <div className="flex justify-end gap-3 mt-4">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-white/10 text-white rounded-lg hover:bg-white/20 transition"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-500 transition"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmationModal;
