import { IonButton, IonText } from "@ionic/react";
import React, { useEffect, useState } from "react";
import Section from "../../components/Custom/Headers/Section";
import { FilePicker } from "@capawesome/capacitor-file-picker";
import { useToast } from "../../helpers/context/ToastContext";
import { User } from "../../interfaces/User/auth";

interface Props {
  userData: any;
  setUserData: React.Dispatch<React.SetStateAction<any>>;
  changePage: (dir: "next" | "back") => void;
}

const StepThree: React.FC<Props> = ({ userData, setUserData, changePage }) => {
  const { showToast } = useToast();
  const [selectedFile, setSelectedFile] = useState<{
    name: string;
    data: string;
    mimeType: string;
  } | null>(null);

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
      setUserData((prev: User) => ({
        ...prev,
        resume: {
          name: file.name,
          data: file.data ?? "",
          mimeType: file.mimeType ?? "application/octet-stream",
        },
      }));
    } catch (error) {
      console.error("File selection error:", error);
      showToast("File selection failed.");
    }
  };

  const handleNext = () => {
    // Additional validation
    if (!selectedFile?.name || !selectedFile?.mimeType || !selectedFile?.data) {
      showToast("Invalid file. Please upload a valid resume.", "danger");
      return;
    } else {
      const byteArray = new Uint8Array(
        Array.from(selectedFile.data, (char) => char.charCodeAt(0))
      );
      const blob = new Blob([byteArray], { type: selectedFile.mimeType });
      setUserData((prev: User) => ({
        ...prev,
        resume: selectedFile,
      }));

      changePage("next");
    }
  };
  useEffect(() => {
    setSelectedFile({
      name: userData.resume?.name,
      data: userData.resume?.data ?? "",
      mimeType: userData.resume?.mimeType ?? "application/octet-stream",
    });
  }, [userData]);

  return (
    <Section light headerTitle="Upload your resume">
      <IonButton expand="block" color="my-secondary" onClick={chooseFile}>
        {selectedFile?.name != undefined || userData?.resume?.name
          ? selectedFile?.name || userData?.resume?.name
          : "Upload"}
      </IonButton>

      <IonButton
        expand="block"
        onClick={() => changePage("back")}
        style={{ paddingTop: "1.5rem" }}>
        Back
      </IonButton>

      <IonButton color="my-main" expand="full" onClick={handleNext}>
        Next
      </IonButton>
      <IonText>{userData?.resume?.name || "No File uploaded"}</IonText>
    </Section>
  );
};

export default StepThree;
