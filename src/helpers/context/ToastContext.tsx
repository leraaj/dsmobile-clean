// context/ToastContext.tsx
import React, { createContext, useCallback, useContext, useState } from "react";
import { IonToast } from "@ionic/react";

type ToastColor =
  | "success"
  | "danger"
  | "warning"
  | "primary"
  | "medium"
  | "light"
  | "dark";

interface ToastContextProps {
  showToast: (message: string, color?: ToastColor, duration?: number) => void;
}

const ToastContext = createContext<ToastContextProps | undefined>(undefined);

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [toastConfig, setToastConfig] = useState<{
    isOpen: boolean;
    message: string;
    color: ToastColor;
    duration: number;
  }>({
    isOpen: false,
    message: "",
    color: "primary",
    duration: 2000,
  });

  const showToast = useCallback(
    (message: string, color: ToastColor = "primary", duration = 2000) => {
      setToastConfig({ isOpen: true, message, color, duration });
    },
    []
  );

  const handleDismiss = () => {
    setToastConfig((prev) => ({ ...prev, isOpen: false }));
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <IonToast
        isOpen={toastConfig.isOpen}
        message={toastConfig.message}
        color={toastConfig.color}
        duration={toastConfig.duration}
        onDidDismiss={handleDismiss}
        position="top"
      />
    </ToastContext.Provider>
  );
};

export const useToast = (): ToastContextProps => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
};
