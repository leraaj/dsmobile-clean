import { IonButton, IonCol, IonRow, IonText } from "@ionic/react";
import React, { useState, useEffect, useRef } from "react";
import { useHistory } from "react-router";
import { useAuthContext } from "../../../../../helpers/context/AuthContext";
import LoadingSpinner from "../../../../Other/LoadingSpinner";
import IonicLayout from "../../../../../components/Layouts/IonicLayout";
import axios from "axios";
import { FilePicker } from "@capawesome/capacitor-file-picker";
import { Browser } from "@capacitor/browser";
import { useToast } from "../../../../../helpers/context/ToastContext";

const ProfileUpdateCvResume: React.FC = () => {
  const { showToast } = useToast();
  const history = useHistory();
  const { user, initialize } = useAuthContext();
  const [isLoading, setIsLoading] = useState(false);
  const RESUME_NAME = user?.resume?.name;

  const [selectedFile, setSelectedFile] = useState<{
    name: string;
    data: string;
    mimeType: string;
  } | null>(null);

  const [filePreviewUrl, setFilePreviewUrl] = useState<string | null>(null);
  const previewUrlRef = useRef<string | null>(null);

  // Clean up Blob URLs to avoid memory leaks
  useEffect(() => {
    if (selectedFile) {
      const byteArray = new Uint8Array(
        Array.from(selectedFile.data, (char) => char.charCodeAt(0))
      );
      const blob = new Blob([byteArray], { type: selectedFile.mimeType });
      console.log(JSON.stringify(selectedFile.mimeType));
      const url = URL.createObjectURL(blob);
      setFilePreviewUrl(url);
      previewUrlRef.current = url;
    }

    return () => {
      if (previewUrlRef.current) {
        URL.revokeObjectURL(previewUrlRef.current);
        previewUrlRef.current = null;
      }
    };
  }, [selectedFile]);

  const chooseFile = async () => {
    try {
      const result = await FilePicker.pickFiles({
        types: [
          "application/pdf",
          "application/msword",
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        ],
        readData: true,
      });

      const file = result.files[0];
      if (!file) return;

      setSelectedFile({
        name: file.name,
        data: file.data ?? "",
        mimeType: file.mimeType ?? "application/octet-stream",
      });
    } catch (error) {
      console.error("File selection error:", error);
      showToast("File selection failed.");
    }
  };

  const handleSubmit = async () => {
    if (!selectedFile || !user?._id) {
      return showToast("No file selected or user not found.");
    }

    setIsLoading(true);
    try {
      const byteCharacters = atob(selectedFile.data);
      const byteArray = new Uint8Array(
        Array.from(byteCharacters, (char) => char.charCodeAt(0))
      );
      const blob = new Blob([byteArray], { type: selectedFile.mimeType });

      const formData = new FormData();
      formData.append("resume", blob, selectedFile.name);
      formData.append("id", user._id);

      await axios.post(
        `${import.meta.env.VITE_APP_API_URL}upload-resume`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      await initialize();
      history.replace("/tabs/profile");
      showToast("Resume uploaded successfully.");
    } catch (error) {
      console.error("Upload failed:", error);
      showToast("Upload failed.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <IonicLayout
      hasPadding
      paddingBlock="1rem"
      paddingInline="1.3rem"
      backUrl="/tabs/profile"
      color="dark"
      title="Upload Resume">
      {/* Preview selected PDF file */}
      {selectedFile && <IonText color={"danger"}>{selectedFile.name}</IonText>}
      {/* Show existing uploaded resume via Google Drive embed */}
      {!selectedFile && user?.resume?.id && (
        <div style={{ height: "100%" }}>
          <IonText>{`${RESUME_NAME} ` || "No resume uploaded."}</IonText>
          <iframe
            title="Uploaded Resume"
            src={`https://drive.google.com/file/d/${user.resume.id}/preview`}
            width="100%"
            height="650px"
            allow="autoplay"
            style={{ border: "none" }}
          />
        </div>
      )}

      <div style={{ marginTop: "2rem" }}>
        <IonButton expand="block" color={"my-secondary"} onClick={chooseFile}>
          Select Resume
        </IonButton>
        <IonButton
          color={"light"}
          fill="outline"
          expand="block"
          disabled={!selectedFile}
          onClick={handleSubmit}>
          {isLoading ? <LoadingSpinner /> : "Save Changes"}
        </IonButton>
      </div>
    </IonicLayout>
  );
};

export default ProfileUpdateCvResume;
