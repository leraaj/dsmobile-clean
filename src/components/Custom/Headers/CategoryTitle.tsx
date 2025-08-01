import React, { ReactNode } from "react";
import "../../../assets/styles/header/category-title.css";
import { IonListHeader } from "@ionic/react";
type Props = {
  categoryTitle?: string;
};

const CategoryTitle: React.FC<Props> = ({ categoryTitle }) => {
  return (
    <IonListHeader className="ion-text-uppercase category-title" mode="md">
      <h4>
        <strong>{categoryTitle}</strong>
      </h4>
    </IonListHeader>
  );
};

export default CategoryTitle;
