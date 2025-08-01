import { useState } from "react";
import axios from "axios";
import { useAuthContext } from "../../helpers/context/AuthContext";
import { useToast } from "../../helpers/context/ToastContext";
import { useHistory } from "react-router";

export function useDeletePortfolio() {
  const { user, initialize } = useAuthContext();
  const history = useHistory();
  const { showToast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const deletePortfolio = async (fileIds: string[]) => {
    if (!user?._id) {
      showToast("User ID is missing", "danger");
      return null;
    }

    if (!fileIds || fileIds.length === 0) {
      showToast("No files selected for deletion", "warning");
      return null;
    }

    try {
      setIsLoading(true);
      const response = await axios.post(
        `${import.meta.env.VITE_APP_API_URL}delete-portfolio`,
        {
          userId: user._id,
          fileIds,
        }
      );

      if (response.data?.success) {
        showToast(response.data.message, "success");
        await initialize();
        history.replace("/tabs/profile");
        return response.data;
      } else {
        showToast(response.data?.message || "Failed to delete files", "danger");
        return null;
      }
    } catch (error) {
      console.error("Delete error:", error);
      showToast("An error occurred while deleting files", "danger");
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  return { deletePortfolio, isLoading };
}
