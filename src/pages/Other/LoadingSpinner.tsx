import { IonSpinner } from "@ionic/react";
import IonicLayout from "../../components/Layouts/IonicLayout";

interface LoadingSpinnerProps {
  color?: string;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ color }) => {
  return (
    <div style={{ display: "flex", justifyContent: "center", width: "100%" }}>
      <IonSpinner name="circular" color={color || "light"} />
    </div>
  );
};

export default LoadingSpinner;
