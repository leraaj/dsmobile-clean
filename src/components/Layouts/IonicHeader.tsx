import React from "react";
import {
  IonBackButton,
  IonButtons,
  IonHeader,
  IonTitle,
  IonToolbar,
} from "@ionic/react";
import HeaderTitle from "../Custom/Headers/Section";

type IonicHeaderProps = {
  title?: string;
  color?: string;
  backUrl?: string;
  toolbarStart?: React.ReactNode;
  toolbarEnd?: React.ReactNode;
};

const IonicHeader: React.FC<IonicHeaderProps> = ({
  title,
  color,
  backUrl,
  toolbarStart,
  toolbarEnd,
}) => {
  if (!title && !backUrl && !toolbarStart && !toolbarEnd) return null;

  return (
    <IonHeader mode="md">
      <IonToolbar color={color}>
        {(backUrl || toolbarStart) && (
          <IonButtons slot="start">
            {backUrl && <IonBackButton defaultHref={backUrl} />}
            {toolbarStart}
          </IonButtons>
        )}
        {title && <HeaderTitle ionTitle={title} />}
        {toolbarEnd && <IonButtons slot="end">{toolbarEnd}</IonButtons>}
      </IonToolbar>
    </IonHeader>
  );
};

export default IonicHeader;
