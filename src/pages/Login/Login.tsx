import React, { useState } from "react";
import IonicLayout from "../../components/Layouts/IonicLayout";
import {
  IonButton,
  IonInput,
  IonSpinner,
  IonText,
  IonToast,
} from "@ionic/react";
import "../../assets/styles/login.css";
import { useLogin } from "../../hooks/auth/use-login";
import { useHistory } from "react-router";
import { useAuthContext } from "../../helpers/context/AuthContext";
import useFetchJobs from "../../hooks/job/use-job";
import DarkshotProductions from "../../assets/images/darkshot-logo-collapsed.png";
import Icon from "../../assets/images/darkshotproduction-logo.png";

const Login = () => {
  const { token, user, loading, error } = useAuthContext();
  const { login } = useLogin();
  const { jobs } = useFetchJobs();
  const history = useHistory();
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [showToast, setShowToast] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); // Prevent page reload on form submit
    try {
      const response = await login(username, password);
      if (response) {
        setShowToast(true);
        history.replace("/tabs");
      }
    } catch (error) {}
  };

  return (
    <IonicLayout
      isMain
      hasPadding
      paddingInline="1rem"
      isScrollable={true}
      color="dark-bg">
      <div className="login-container">
        <form onSubmit={handleSubmit} className="login-forms">
          <IonToast
            isOpen={showToast}
            onDidDismiss={() => setShowToast(false)}
            message="Hello from IonToast!"
            duration={2000}
            color="success"
            position="bottom"
          />

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
            }}>
            <img
              src={DarkshotProductions}
              style={{ height: "8rem", objectFit: "contain" }}
            />
            <img src={Icon} style={{ width: "10rem" }} />
          </div>

          <IonInput
            type="text"
            color="light"
            className={`${error && "ion-invalid ion-touched"}`}
            labelPlacement="floating"
            label="Username"
            value={username}
            onIonInput={(e) => setUsername(e.detail.value ?? "")}
            required
          />

          <IonInput
            type="password"
            color="light"
            className={`${error && "ion-invalid ion-touched"}`}
            labelPlacement="floating"
            label="Password"
            value={password}
            onIonInput={(e) => setPassword(e.detail.value ?? "")}
            required
          />

          <div className="login-buttons ion-padding-top">
            <IonButton
              color="my-main"
              expand="full"
              type="submit" // Submit type button inside form
              disabled={loading}>
              {loading ? <IonSpinner name="dots" color="light" /> : "sign in"}
            </IonButton>
            <div style={{ textAlign: "end", cursor: "pointer" }}>
              <IonText onClick={() => history.push("/register")}>
                Don’t have an account? <strong>Sign up</strong>
              </IonText>
            </div>
            <br />
            <IonText>{import.meta.env.VITE_APP_API_URL}</IonText>
          </div>
        </form>
      </div>
    </IonicLayout>
  );
};

export default Login;
