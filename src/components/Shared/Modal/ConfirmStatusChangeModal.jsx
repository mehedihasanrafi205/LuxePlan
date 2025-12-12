import React from "react";

const ConfirmStatusChangeModal = ({ isOpen, onClose, onConfirm, newStatus }) => {
  if (!isOpen) return null;

  const format = (t) => t.replace(/_/g, " ");

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-base-100 p-6 rounded-xl max-w-sm w-full shadow-xl">
        <h2 className="text-xl font-semibold mb-2">Confirm Status Change</h2>
        <p className="mb-5">
          Are you sure you want to update status to 
          <span className="font-bold"> "{format(newStatus)}"</span>?
        </p>

        <div className="flex justify-end gap-3">
          <button className="btn btn-sm btn-outline" onClick={onClose}>
            Cancel
          </button>
          <button className="btn btn-sm btn-primary" onClick={onConfirm}>
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmStatusChangeModal;
