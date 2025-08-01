import {
  IonPage,
  IonContent,
  IonText,
  IonInput,
  IonButton,
} from "@ionic/react";
import React, { useState } from "react";
import IonicLayout from "../../../../components/Layouts/IonicLayout";
import { useAuthContext } from "../../../../helpers/context/AuthContext";
import axios from "axios";
import { useHistory } from "react-router";
import { useToast } from "../../../../helpers/context/ToastContext";

const ProfileUpdateDetails: React.FC = () => {
  const { showToast } = useToast();
  const { user, initialize } = useAuthContext();
  const history = useHistory(); // Add this line
  const UPDATE_URL = import.meta.env.VITE_APP_API_URL + `user/${user?._id}`;
  const [fullName, setFullName] = useState<string | null>(
    user?.fullName || null
  );
  const [email, setEmail] = useState<string | null>(user?.email || null);
  const [contact, setContact] = useState<string | null>(user?.contact || null);

  const handleSubmit = async () => {
    try {
      const updatedDetails = {
        fullName: fullName?.trim(),
        email: email?.trim(),
        contact: contact?.trim(),
      };
      const response = await axios.put(UPDATE_URL, updatedDetails);
      if (!response) return showToast(response);
      await initialize();
      history.replace("/tabs/profile");
      showToast("User update successfully");
    } catch (error: any) {
      console.error(error);
      alert("Failed to update profile.");
    }
  };
  return (
    <IonicLayout
      hasPadding
      paddingBlock="1rem"
      paddingInline="1.3rem"
      backUrl="/tabs/profile"
      color="dark"
      title={`Update Details`}>
      <IonInput
        label="Full Name"
        color={"light"}
        labelPlacement="floating"
        value={fullName ?? ""}
        onIonInput={(e) => setFullName(e.detail.value ?? "")}
      />
      <IonInput
        label="Email"
        color={"light"}
        labelPlacement="floating"
        value={email ?? ""}
        onIonInput={(e) => setEmail(e.detail.value ?? "")}
      />
      <IonInput
        label="Contact"
        color={"light"}
        labelPlacement="floating"
        value={contact ?? ""}
        onIonInput={(e) => setContact(e.detail.value ?? "")}
      />
      <div className="ion-float-end">
        <IonButton onClick={handleSubmit}>Save changes</IonButton>
      </div>
    </IonicLayout>
  );
};

export default ProfileUpdateDetails;
