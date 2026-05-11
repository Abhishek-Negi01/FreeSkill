import React from "react";
import { FaExclamationTriangle, FaTimes } from "react-icons/fa";

const DeleteAccountModal = ({ isOpen, onClose, onConfirm, deleting }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div
        className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6"
        style={{ border: "1px solid #e5e7eb" }}
      >
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-full flex items-center justify-center"
              style={{ background: "#fef2f2" }}
            >
              <FaExclamationTriangle
                className="w-5 h-5"
                style={{ color: "#ef4444" }}
              />
            </div>
            <h3 className="text-lg font-bold" style={{ color: "#1f2937" }}>
              Delete Account
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
            disabled={deleting}
          >
            <FaTimes style={{ color: "#6b7280" }} />
          </button>
        </div>

        <div className="mb-6">
          <p className="text-sm mb-3" style={{ color: "#374151" }}>
            Are you sure you want to delete your account? This action cannot be
            undone.
          </p>
          <p className="text-sm font-semibold" style={{ color: "#dc2626" }}>
            All your courses, questions, answers, and data will be permanently
            deleted.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={onConfirm}
            disabled={deleting}
            className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-3 rounded-lg font-semibold text-sm transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            style={{
              background: deleting
                ? "#9ca3af"
                : "linear-gradient(135deg, #ef4444 0%, #dc2626 100%)",
              color: "white",
            }}
          >
            {deleting ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Deleting...
              </>
            ) : (
              "Delete Account"
            )}
          </button>
          <button
            onClick={onClose}
            disabled={deleting}
            className="flex-1 px-4 py-3 rounded-lg font-semibold text-sm transition-all duration-300 disabled:opacity-50"
            style={{
              background: "#f3f4f6",
              color: "#374151",
              border: "1px solid #d1d5db",
            }}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteAccountModal;
