import {
  IonBackButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonPage,
  IonRefresher,
  IonRefresherContent,
  IonSpinner,
  IonTitle,
  IonToolbar,
  RefresherEventDetail,
} from "@ionic/react";
import "../../assets/styles/ionic-layout.css";
import React from "react";
import IonicHeader from "./IonicHeader";
import IonicContent from "./IonicContent";

type IonicLayoutProps = {
  title?: string;
  color?: string;
  children?: React.ReactNode;
  backUrl?: string;
  toolbarStart?: React.ReactNode;
  toolbarEnd?: React.ReactNode;
  isScrollable?: boolean;
  hasPadding?: boolean;
  padding?: string;
  paddingBlock?: string;
  paddingInline?: string;
  loading?: boolean; // ✅ keep loading prop
  isMain?: boolean;
  onRefresh?: () => Promise<void> | void;
};

const IonicLayout = (props: IonicLayoutProps) => {
  const {
    title,
    color,
    children,
    backUrl,
    toolbarStart,
    toolbarEnd,
    isScrollable = true,
    loading = false,
    hasPadding = true,
    padding,
    paddingBlock,
    paddingInline,
    isMain = false,
  } = props;

  const userProvidedLoading = Object.prototype.hasOwnProperty.call(
    props,
    "loading"
  );

  // Optional: You can log or act on this condition
  // console.log("User explicitly set loading:", userProvidedLoading);

  const handleRefresh = async (event: CustomEvent<RefresherEventDetail>) => {
    if (props.onRefresh) {
      await props.onRefresh();
    }
    event.detail.complete();
  };

  return isMain ? (
    <IonPage>
      <IonicHeader
        title={title}
        color={color}
        backUrl={backUrl}
        toolbarStart={toolbarStart}
        toolbarEnd={toolbarEnd}
      />

      <IonicContent
        color={color}
        isScrollable={isScrollable}
        hasPadding={hasPadding}
        loading={userProvidedLoading}>
        {userProvidedLoading && (
          <IonRefresher
            slot="fixed"
            pullFactor={0.5}
            pullMin={100}
            pullMax={200}
            onIonRefresh={handleRefresh}>
            <IonRefresherContent color="dark" />
          </IonRefresher>
        )}
        {hasPadding ? (
          <div
            className="layout-wrapper"
            style={{
              padding: padding || "1rem",
              paddingBlock: paddingBlock || 0,
              paddingInline: paddingInline || 0,
            }}>
            {children}
          </div>
        ) : (
          children
        )}
      </IonicContent>
    </IonPage>
  ) : (
    <IonPage>
      <IonicHeader
        title={title}
        color={color}
        backUrl={backUrl}
        toolbarStart={toolbarStart}
        toolbarEnd={toolbarEnd}
      />

      <IonicContent
        color={color}
        isScrollable={isScrollable}
        hasPadding={hasPadding}
        loading={userProvidedLoading}>
        {userProvidedLoading && (
          <IonRefresher
            slot="fixed"
            pullFactor={0.5}
            pullMin={100}
            pullMax={200}
            onIonRefresh={handleRefresh}>
            <IonRefresherContent color="dark" />
          </IonRefresher>
        )}
        {hasPadding ? (
          <div
            className="layout-wrapper"
            style={{
              padding: padding || "1rem",
              paddingBlock: paddingBlock || 0,
              paddingInline: paddingInline || 0,
            }}>
            {children}
          </div>
        ) : (
          children
        )}
      </IonicContent>
    </IonPage>
  );
};

export default IonicLayout;
