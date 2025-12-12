import React from "react";
import { FiX } from "react-icons/fi";

const AssignDecoratorModal = ({
  isOpen,
  booking,
  decorators,
  selectedDecorator,
  setSelectedDecorator,
  onClose,
  onAssign,
  loading,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-background-dark border border-primary/20 p-6 rounded-xl w-full max-w-md relative">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-white/60 hover:text-white cursor-pointer"
        >
          <FiX size={22} />
        </button>

        <h3 className="text-xl font-bold mb-4">
          Assign Decorator for:
          <br />
          <span className="text-primary">{booking?.service_name}</span>
        </h3>

        <label className="text-white/70 mb-2 block">Select Decorator:</label>

        <select
          className="select select-bordered w-full mb-4"
          value={selectedDecorator?._id || ""}
          onChange={(e) => {
            const decorator = decorators.find((d) => d._id === e.target.value);
            setSelectedDecorator(decorator);
          }}
        >
          <option value="">Choose decorator</option>
          {decorators.map((d) => (
            <option key={d._id} value={d._id}>
              {d.fullName} — {d.email}
            </option>
          ))}
        </select>

        <div className="flex gap-2 justify-end">
          <button onClick={onClose} className="btn btn-outline">
            Cancel
          </button>

          <button
            onClick={onAssign}
            className="btn btn-primary"
            disabled={loading || !selectedDecorator}
          >
            {loading ? "Assigning..." : "Assign"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AssignDecoratorModal;
