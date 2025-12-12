import React from "react";
import { FiAlertTriangle } from "react-icons/fi";

const ConfirmRoleChangeModal = ({
  isOpen,
  onClose,
  onConfirm,
  user,
  newRole,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white/10 border border-white/20 rounded-xl p-6 w-[90%] max-w-md text-white shadow-xl">
        <div className="flex items-center gap-3 mb-4">
          <FiAlertTriangle className="text-yellow-400 text-3xl" />
          <h2 className="text-xl font-semibold">Confirm Role Change</h2>
        </div>

        <p className="text-white/70">
          Are you sure you want to change
          <span className="font-semibold text-white"> {user?.name}'s </span>
          role to
          <span className="font-semibold text-primary"> "{newRole}"</span>?
        </p>

        <div className="mt-6 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 transition cursor-pointer"
          >
            Cancel
          </button>

          <button
            onClick={onConfirm}
            className="px-4 py-2 rounded-lg bg-primary hover:bg-primary/80 text-white transition cursor-pointer"
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmRoleChangeModal;
