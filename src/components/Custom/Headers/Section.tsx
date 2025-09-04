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
  light?: boolean;
};

const Section: React.FC<Props> = ({
  ionTitle,
  headerTitle,
  subHeader,
  routerLink,
  children,
  light,
}) => {
  const color = light ? "light" : "dark";

  if (ionTitle) {
    return (
      <div className="title-container">
        <IonTitle className="title-header" color={color}>
          {ionTitle}
        </IonTitle>
      </div>
    );
  }

  if (headerTitle && subHeader) {
    return (
      <>
        <div className="header-title-container">
          <IonText className="title-header" color={color}>
            {headerTitle}
          </IonText>
          <IonText className="title-sub-header" color={color}>
            {subHeader}
          </IonText>
        </div>
        {children && <div className="content">{children}</div>}
      </>
    );
  }

  if (headerTitle) {
    return (
      <>
        <IonListHeader className="header-title-container" mode="md">
          <IonLabel className="title-header" color={color}>
            {headerTitle}
          </IonLabel>
          {routerLink && (
            <IonButton routerLink={routerLink} color={color}>
              Edit
            </IonButton>
          )}
        </IonListHeader>
        {children && <div className="content">{children}</div>}
      </>
    );
  }

  return null;
};

export default Section;
