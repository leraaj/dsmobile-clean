import { IonButton, IonInput, IonText, IonNote } from "@ionic/react";
import React, { useState } from "react";
import { useHistory } from "react-router";
import { useToast } from "../../helpers/context/ToastContext";

interface Props {
  userData: any;
  setUserData: React.Dispatch<React.SetStateAction<any>>;
  changePage: (dir: "next" | "back") => void;
}

const StepOne: React.FC<Props> = ({ userData, setUserData, changePage }) => {
  const history = useHistory();
  const { showToast } = useToast();
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState<{
    username?: string;
    password?: string;
    confirmPassword?: string;
  }>({});

  const validate = () => {
    const newErrors: typeof errors = {};

    if (!userData.username) {
      newErrors.username = "Username is required.";
    }

    if (!userData.password) {
      newErrors.password = "Password is required.";
    } else if (userData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters.";
    }

    if (!userData.confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password.";
    } else if (userData.password !== userData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  const handleConfirmPasswordChange = (value: string) => {
    if (value === userData.password) {
      // Keep the original password, don't overwrite
      setUserData((prev: any) => ({
        ...prev,
        confirmPassword: prev.password,
      }));
    } else {
      // Store what user typed (optional)
      setUserData((prev: any) => ({
        ...prev,
        confirmPassword: value,
      }));
    }
  };

  const handleNext = () => {
    if (validate()) {
      changePage("next");
    }
  };

  return (
    <>
      <div style={{ marginTop: "8rem" }}>
        <IonText
          style={{
            fontFamily: "Montserrat",
            fontSize: "24px",
          }}>
          <span style={{ fontWeight: "bolder" }}>Looking</span> for Jobs? <br />
          Want to <span style={{ fontWeight: "bolder" }}>provide</span>{" "}
          services?
          <div style={{ padding: "1rem" }} />
          Join us
          <div style={{ padding: "2rem" }} />
        </IonText>
      </div>

      <IonInput
        label="Username"
        labelPlacement="floating"
        color={`${errors.username ? "danger" : ""}`}
        value={userData.username || ""}
        onIonInput={(e) =>
          setUserData({ ...userData, username: e.detail.value! })
        }
      />
      {/* {errors.username && <IonNote color="danger">{errors.username}</IonNote>} */}

      <IonInput
        label="Password"
        className={`${errors.password && "ion-invalid"} `}
        labelPlacement="floating"
        type="password"
        color={"light"}
        value={userData.password || ""}
        onIonInput={(e) =>
          setUserData({ ...userData, password: e.detail.value! })
        }
      />
      {errors.password && <IonNote color="danger">{errors.password}</IonNote>}

      <IonInput
        label="Re-Enter your password"
        labelPlacement="floating"
        type="password"
        value={userData.confirmPassword || ""}
        onIonInput={(e) => handleConfirmPasswordChange(e.detail.value!)}
      />
      {errors.confirmPassword && (
        <IonNote color="danger">{errors.confirmPassword}</IonNote>
      )}

      <IonButton
        color="my-main"
        expand="full"
        onClick={handleNext}
        style={{ paddingTop: "1.5rem" }}>
        Next
      </IonButton>

      <div style={{ textAlign: "end", cursor: "pointer", marginTop: "1rem" }}>
        <IonText
          onClick={() => history.push("/login")}
          style={{ fontFamily: "Montserrat" }}>
          Already have an account? <strong>Sign in</strong>
        </IonText>
      </div>
      <IonText>
        {`Username: ${userData?.username} Password: ${userData?.password}`}
      </IonText>
    </>
  );
};

export default StepOne;
