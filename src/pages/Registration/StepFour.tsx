import {
  IonButton,
  IonText,
  IonTextarea,
  IonGrid,
  IonRow,
  IonCol,
  IonIcon,
} from "@ionic/react";
import React, { useEffect, useRef, useState } from "react";
import Section from "../../components/Custom/Headers/Section";
import { trashSharp } from "ionicons/icons";
import { useToast } from "../../helpers/context/ToastContext";
import { useRegister } from "../../hooks/user/use-register";

interface Props {
  userData: any;
  setUserData: React.Dispatch<React.SetStateAction<any>>;
  changePage: (dir: "next" | "back") => void;
}

const StepFour: React.FC<Props> = ({ userData, setUserData, changePage }) => {
  const { showToast } = useToast();
  const { register } = useRegister();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Local staged files before committing to userData
  const [selectedAddFiles, setSelectedAddFiles] = useState<File[]>([]);

  // Remove file by index
  const handleRemoveAddFile = (index: number) => {
    // Update local state
    setSelectedAddFiles((prev) => prev.filter((_, i) => i !== index));

    // Update userData.portfolio
    setUserData((prev: any) => ({
      ...prev,
      portfolio: prev.portfolio.filter((_: any, i: number) => i !== index),
    }));
  };

  // Handle file input change (multiple files)
  const handleAddFiles = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) return;
    setSelectedAddFiles((prev) => [...prev, ...Array.from(files)]); // Store staged files in userData before final submit
    setUserData({
      ...userData,
      portfolio: [...Array.from(files)],
    });
  };

  // When submitting final registration
  const handleSubmit = async () => {
    if (selectedAddFiles.length === 0) {
      showToast("Please upload at least one portfolio file.", "danger");
      return;
    }

    // Store staged files in userData before final submit
    setUserData({
      ...userData,
      portfolio: selectedAddFiles,
    });

    // console.log("Final Data:", { ...userData, portfolio: selectedAddFiles });
    // alert("Registration Complete!");

    await register(userData);
  };

  // Sync already selected files from userData (if coming back)
  useEffect(() => {
    if (userData?.portfolio?.length > 0) {
      setSelectedAddFiles(userData.portfolio);
    }
  }, [userData]);

  return (
    <Section light headerTitle="Upload your Works">
      {/* File input */}
      <input
        type="file"
        accept="image/*,application/pdf"
        multiple
        onChange={handleAddFiles}
        ref={fileInputRef}
        style={{ display: "none" }}
      />

      <IonButton expand="block" onClick={() => fileInputRef.current?.click()}>
        Choose Files
      </IonButton>

      <IonGrid>
        <IonRow>
          {selectedAddFiles.map((file, index) => {
            const objectUrl = URL.createObjectURL(file);
            return (
              <IonCol
                key={index}
                size="12"
                size-xs="12"
                size-sm="4"
                size-md="3"
                size-lg="3"
                style={{ "--border-radius": "1rem", height: "100%" }}>
                {file.type.startsWith("image/") ? (
                  <img
                    src={objectUrl}
                    style={{
                      height: "300px",
                      width: "100%",
                      borderRadius: "1rem",
                      objectFit: "contain",
                    }}
                    alt={file.name}
                  />
                ) : (
                  <div
                    style={{
                      height: "300px",
                      width: "100%",
                      padding: "1rem",
                      borderRadius: "1rem",
                      backgroundColor: "#333",
                      color: "white",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}>
                    <p>{file.name}</p>
                  </div>
                )}
                <div style={{ display: "flex", justifyContent: "end" }}>
                  <IonButton
                    color="danger"
                    shape="round"
                    onClick={() => handleRemoveAddFile(index)}>
                    <IonIcon slot="icon-only" icon={trashSharp} />
                  </IonButton>
                </div>
              </IonCol>
            );
          })}
        </IonRow>
      </IonGrid>

      <IonButton
        expand="block"
        onClick={() => changePage("back")}
        style={{ paddingTop: "1.5rem" }}>
        Back
      </IonButton>

      <IonButton color="my-main" expand="block" onClick={handleSubmit}>
        Submit
      </IonButton>

      <IonText>{`Selected: ${selectedAddFiles.length} file(s)`}</IonText>
    </Section>
  );
};

export default StepFour;
