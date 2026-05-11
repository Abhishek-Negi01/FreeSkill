import React from "react";
import { useUser, useClerk } from "@clerk/clerk-react";
import { useNavigate } from "react-router-dom";
import { FaUser, FaEnvelope, FaTrash } from "react-icons/fa";
import useProfile from "../hooks/api/useProfile";
import useDeleteModal from "../hooks/ui/useDeleteModal";
import DeleteAccountModal from "../components/DeleteAccountModal";

const Profile = () => {
  const { user } = useUser();
  const { signOut } = useClerk();
  const navigate = useNavigate();
  const { deleting, deleteAccount } = useProfile();
  const { showDeleteModal, openModal, closeModal } = useDeleteModal();

  const handleDeleteConfirm = async () => {
    const result = await deleteAccount();
    if (result.success) {
      closeModal();
      await signOut();
      navigate("/");
    }
  };

  return (
    <div
      className="p-4 md:p-6 lg:p-8 min-h-screen"
      style={{
        background: "linear-gradient(135deg, #f9fafb 0%, #e5e7eb 100%)",
      }}
    >
      <div className="max-w-3xl mx-auto">
        <div
          className="bg-white rounded-xl shadow-lg p-6 md:p-8"
          style={{ border: "1px solid #e5e7eb" }}
        >
          <h1
            className="text-2xl md:text-3xl font-bold mb-6"
            style={{
              background: "linear-gradient(135deg, #2563eb 0%, #8b5cf6 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            My Profile
          </h1>

          <div className="space-y-4">
            <div
              className="p-4 rounded-lg"
              style={{ background: "#f9fafb", border: "1px solid #e5e7eb" }}
            >
              <label
                className="block text-xs font-semibold mb-1"
                style={{ color: "#6b7280" }}
              >
                FULL NAME
              </label>
              <p
                className="text-base font-semibold flex items-center gap-2"
                style={{ color: "#1f2937" }}
              >
                <FaUser style={{ color: "#6b7280" }} />
                {user?.fullName || "—"}
              </p>
            </div>

            <div
              className="p-4 rounded-lg"
              style={{ background: "#f9fafb", border: "1px solid #e5e7eb" }}
            >
              <label
                className="block text-xs font-semibold mb-1"
                style={{ color: "#6b7280" }}
              >
                USERNAME
              </label>
              <p
                className="text-base font-semibold"
                style={{ color: "#1f2937" }}
              >
                {user?.username || "—"}
              </p>
            </div>

            <div
              className="p-4 rounded-lg"
              style={{ background: "#f9fafb", border: "1px solid #e5e7eb" }}
            >
              <label
                className="block text-xs font-semibold mb-1"
                style={{ color: "#6b7280" }}
              >
                EMAIL
              </label>
              <p
                className="text-base font-semibold flex items-center gap-2"
                style={{ color: "#1f2937" }}
              >
                <FaEnvelope style={{ color: "#6b7280" }} />
                {user?.primaryEmailAddress?.emailAddress || "—"}
              </p>
            </div>
          </div>

          <p className="text-xs mt-6" style={{ color: "#9ca3af" }}>
            To update your profile or change your password, manage your account
            through Clerk.
          </p>

          <div
            className="mt-8 pt-6 border-t"
            style={{ borderColor: "#e5e7eb" }}
          >
            <h2 className="text-lg font-bold mb-4" style={{ color: "#dc2626" }}>
              Danger Zone
            </h2>
            <button
              onClick={openModal}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg font-semibold text-sm transition-all duration-300 hover:shadow-lg"
              style={{
                background: "linear-gradient(135deg, #ef4444 0%, #dc2626 100%)",
                color: "white",
              }}
            >
              <FaTrash className="w-4 h-4" />
              Delete Account
            </button>
          </div>
        </div>
      </div>

      <DeleteAccountModal
        isOpen={showDeleteModal}
        onClose={closeModal}
        onConfirm={handleDeleteConfirm}
        deleting={deleting}
      />
    </div>
  );
};

export default Profile;
