import React from "react";
import { IonList } from "@ionic/react";

type CardListProps = {
  children: React.ReactNode;
  style?: React.CSSProperties;
};

const CardList: React.FC<CardListProps> = ({ children, style }) => {
  return (
    <IonList
      lines="none"
      style={{
        borderTopRightRadius: "1.5rem",
        borderTopLeftRadius: "1.5rem",
        overflow: "hidden",
        ...style,
      }}>
      {children}
    </IonList>
  );
};

export default CardList;
