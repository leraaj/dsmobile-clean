import axios from "axios";
import { useUploadPortfolio } from "../profile/useUploadPortfolio";
import { useToast } from "../../helpers/context/ToastContext";
import { useHistory } from "react-router";

interface UserData {
  fullName: string;
  contact: string;
  email: string;
  username: string;
  password: string;
  position: number;
  skills: string[];
  applicationStatus: number;
  resume?: {
    data: string;
    name: string;
    mimeType: string;
  };
  portfolio: any[]; // adjust type if you have a defined structure
}

export function useRegister() {
  const { showToast } = useToast();
  const { uploadPortfolio, isLoading } = useUploadPortfolio();

  const history = useHistory();
  const register = async (userData: UserData) => {
    try {
      // 1. Register User
      const registerRes = await axios.post(
        `${import.meta.env.VITE_APP_API_URL}user`,
        {
          fullName: userData.fullName,
          email: userData.email,
          contact: userData.contact,
          username: userData.username,
          password: userData.password,
          position: userData.position,
          applicationStatus: userData.applicationStatus,
          skills: userData.skills,
        }
      );

      const registeredId = registerRes.data?._id;
      if (!registeredId) throw new Error("Failed to get registered user ID");

      // 2. Upload Resume
      if (userData.resume) {
        const byteCharacters = atob(userData.resume.data);
        const byteArray = new Uint8Array(
          Array.from(byteCharacters, (char) => char.charCodeAt(0))
        );
        const blob = new Blob([byteArray], {
          type: userData.resume.mimeType,
        });

        const formData = new FormData();
        formData.append("resume", blob, userData.resume.name);
        formData.append("id", registeredId);

        await axios.post(
          `${import.meta.env.VITE_APP_API_URL}upload-resume`,
          formData,
          {
            headers: { "Content-Type": "multipart/form-data" },
          }
        );
      }

      // 3. Upload Portfolio
      try {
        showToast("Uploading portfolio...");
        const formData = new FormData();

        userData.portfolio.forEach((file) => {
          formData.append("portfolio", file);
        });
        formData.append("id", registeredId);

        // Debug log FormData content
        for (const [key, value] of formData.entries()) {
          console.log(`${key}:`, value);
        }
        await uploadPortfolio(userData.portfolio, registeredId); // uses registeredId

        showToast("Portfolio uploaded successfully");
        // ✅ Success
        showToast("Registration completed, try logging-in");
        history.replace("/login");
      } catch (err) {
        console.error("Portfolio upload failed:", err);
        showToast("Portfolio upload failed");
        throw err; // optional: rethrow to stop registration flow
      }
    } catch (error: any) {
      console.error("Registration failed:", error);
      showToast("Registration failed. Please try again.");
    }
  };

  return { register };
}
