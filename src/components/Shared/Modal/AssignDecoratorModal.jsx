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

        <label className="text-white/70 mb-2 block">Select Decorators:</label>

        <div className="max-h-60 overflow-y-auto bg-[#2a2a2a] border border-white/10 rounded-lg p-2 mb-4 space-y-2">
            {decorators.map((d) => {
                const isSelected = selectedDecorator.some(sel => sel._id === d._id);
                return (
                    <label key={d._id} className={`flex items-center gap-3 p-2 rounded cursor-pointer transition ${isSelected ? 'bg-primary/20 border border-primary/40' : 'hover:bg-white/5'}`}>
                        <input 
                            type="checkbox"
                            className="checkbox checkbox-primary checkbox-sm"
                            checked={isSelected}
                            onChange={() => {
                                if(isSelected) {
                                    setSelectedDecorator(selectedDecorator.filter(sel => sel._id !== d._id));
                                } else {
                                    setSelectedDecorator([...selectedDecorator, d]);
                                }
                            }}
                        />
                        <div>
                           <div className="font-bold text-white/90">{d.fullName}</div>
                           <div className="text-xs text-white/50">{d.email}</div>
                           <div className="text-xs text-primary">{d.specialty}</div>
                        </div>
                    </label>
                )
            })}
        </div>

        <div className="flex gap-2 justify-end">
          <button onClick={onClose} className="btn btn-outline">
            Cancel
          </button>

          <button
            onClick={onAssign}
            className="btn btn-primary"
            disabled={loading || selectedDecorator.length === 0}
          >
            {loading ? "Assigning..." : `Assign (${selectedDecorator.length})`}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AssignDecoratorModal;
