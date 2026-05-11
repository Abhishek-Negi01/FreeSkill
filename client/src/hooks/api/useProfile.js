import { useState } from "react";
import { userService } from "../../api/services/users";
import toast from "react-hot-toast";

const useProfile = () => {
  const [deleting, setDeleting] = useState(false);

  const deleteAccount = async () => {
    setDeleting(true);
    try {
      const response = await userService.deleteAccount();
      toast.success(response?.data?.message || "Account deleted successfully");
      return { success: true };
    } catch (error) {
      const errorMsg =
        error.response?.data?.message || "Failed to delete account";
      toast.error(errorMsg);
      return { success: false, error: errorMsg };
    } finally {
      setDeleting(false);
    }
  };

  return {
    deleting,
    deleteAccount,
  };
};

export default useProfile;
