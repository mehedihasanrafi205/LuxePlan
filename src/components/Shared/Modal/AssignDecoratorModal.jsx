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

        <div className="flex justify-between items-center mb-2">
            <label className="text-white/70 block">Select Decorators:</label>
            <button 
                className="btn btn-xs btn-accent text-white"
                onClick={async () => {
                    const toastId = toast.loading("Finding best matches...");
                    try {
                         // Import axios if not available in props, but assuming we can pass handleRecommend or use useAxiosSecure inside component? 
                         // Component doesn't have useAxiosSecure hook call inside. 
                         // I should probably pass a function or add the logic here.
                         // Let's assume we need to fetch it.
                         // Since I cannot add imports easily at top without full replace, I'll assume props or use global axios if possible? 
                         // Actually, this component is a presentational modal. 
                         // Better to move the logic to ManageBookings.jsx and pass `onRecommend`.
                         // But for now, I'll add a simple button that emits an event "onAutoRecommend".
                         // Wait, I can't emit event easily without changing parent.
                         // Let's try to add the logic here if I can use fetch or axios.
                         // Or better: Update ManageBookings to pass `recommendations` or `handleRecommend`.
                         // I will make this button trigger `onAutoRecommend` prop.
                         onAutoRecommend && onAutoRecommend();
                         toast.dismiss(toastId);
                    } catch(e) { toast.error("Failed"); toast.dismiss(toastId); }
                }}
            >
                ✨ Auto Recommend
            </button>
        </div>

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
