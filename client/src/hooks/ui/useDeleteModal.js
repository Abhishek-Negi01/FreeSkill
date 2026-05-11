import { useState } from "react";

const useDeleteModal = () => {
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const openModal = () => setShowDeleteModal(true);
  const closeModal = () => setShowDeleteModal(false);

  return {
    showDeleteModal,
    openModal,
    closeModal,
  };
};

export default useDeleteModal;
