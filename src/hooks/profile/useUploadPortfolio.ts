import { useState } from "react";
import axios from "axios";
import { useAuthContext } from "../../helpers/context/AuthContext";
import { useToast } from "../../helpers/context/ToastContext";
import { useHistory } from "react-router";

export function useUploadPortfolio() {
  const { user } = useAuthContext();
  const { showToast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const history = useHistory();

  const uploadPortfolio = async (files: File[], registeredId?: string) => {
    const effectiveId = registeredId || user?._id; // use provided ID or fallback to logged-in user

    if (!effectiveId) {
      showToast("User ID is missing", "danger");
      return;
    }

    if (!files || files.length === 0) {
      showToast("No files selected", "warning");
      return;
    }

    const formData = new FormData();
    formData.append("id", effectiveId);

    files.forEach((file) => {
      formData.append("portfolio", file);
    });

    // Debug log FormData content
    for (const [key, value] of formData.entries()) {
      console.log(`${key}:`, value);
    }

    try {
      setIsLoading(true);
      const response = await axios.post(
        `${import.meta.env.VITE_APP_API_URL}upload-portfolio`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response?.data?.success) {
        showToast(response.data.message, "success");

        // ✅ Only redirect if this was triggered by a logged-in user
        if (!registeredId) {
          history.replace("/tabs/profile");
        }

        return response.data;
      } else {
        showToast("Failed to upload portfolio", "danger");
        return null;
      }
    } catch (error) {
      console.error("Upload error:", error);
      showToast("An error occurred during upload", "danger");
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  return { uploadPortfolio, isLoading };
}
