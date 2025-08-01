import { IonSpinner } from "@ionic/react";
import DarkshotProductions from "../../assets/images/darkshot-logo-collapsed.png";
import Icon from "../../assets/images/darkshotproduction-logo.png";
interface SplashScreenProps {
  color?: string;
}

const SplashScreen: React.FC<SplashScreenProps> = () => {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100dvh",
        width: "100%",
      }}>
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
    </div>
  );
};

export default SplashScreen;
