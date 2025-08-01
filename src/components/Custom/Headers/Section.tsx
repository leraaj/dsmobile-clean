import React from "react";
import "../../../assets/styles/header/header-title.css";
import {
  IonButton,
  IonLabel,
  IonListHeader,
  IonText,
  IonTitle,
} from "@ionic/react";

type Props = {
  ionTitle?: string;
  headerTitle?: string;
  subHeader?: string;
  routerLink?: string;
  children?: React.ReactNode;
};

const Section: React.FC<Props> = ({
  ionTitle,
  headerTitle,
  subHeader,
  routerLink,
  children,
}) => {
  if (ionTitle) {
    return (
      <div className="title-container">
        <IonTitle className="title-header">{ionTitle}</IonTitle>
      </div>
    );
  }

  if (headerTitle && subHeader) {
    return (
      <>
        <div className="header-title-container">
          <IonText className="title-header">{headerTitle}</IonText>
          <IonText className="title-sub-header">{subHeader}</IonText>
        </div>
        {children && <div className="content">{children}</div>}
      </>
    );
  }

  if (headerTitle) {
    return (
      <>
        <IonListHeader className="header-title-container" mode="md">
          <IonLabel className="title-header">{headerTitle}</IonLabel>
          {routerLink && <IonButton routerLink={routerLink}>Edit</IonButton>}
        </IonListHeader>
        {children && <div className="content">{children}</div>}
      </>
    );
  }

  return null;
};

export default Section;
