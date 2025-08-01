import React from "react";
import {
  IonContent,
  IonRefresher,
  IonRefresherContent,
  RefresherEventDetail,
} from "@ionic/react";
import "../../assets/styles/ionic-layout.css";

type IonicContentProps = {
  color?: string;
  children?: React.ReactNode;
  isScrollable?: boolean;
  hasPadding?: boolean;
  loading?: boolean;
};

const IonicContent: React.FC<IonicContentProps> = ({
  color,
  children,
  isScrollable = true,
  hasPadding = true,
  loading = false,
}) => {
  const handleRefresh = (event: CustomEvent<RefresherEventDetail>) => {
    event.detail.complete();
  };

  return (
    <IonContent
      fullscreen={false}
      scrollEvents={isScrollable}
      scrollY={isScrollable}
      scrollX={isScrollable}
      color={color}>
      {loading && (
        <IonRefresher
          slot="fixed"
          pullFactor={0.5}
          pullMin={100}
          pullMax={200}
          onIonRefresh={handleRefresh}>
          <IonRefresherContent />
        </IonRefresher>
      )}
      {hasPadding ? <div className="layout-wrapper">{children}</div> : children}
    </IonContent>
  );
};

export default IonicContent;
