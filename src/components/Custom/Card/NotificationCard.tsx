import React from "react";
import { IonAvatar, IonButton, IonItem } from "@ionic/react";
import "../../../assets/styles/notification/notification-card.css";
import { getRelativeTime } from "../../../helpers/utils/getRelativeTime";

type NotificationCardProps = {
  fullname: string;
  position?: string | number;
  message?: string;
  time: string;
  link?: string;
  photo?: string;
  initialRemarks?: string;
  finalRemarks?: string;
};
const NotificationCard: React.FC<NotificationCardProps> = ({
  fullname,
  position,
  message,
  time,
  link,
  photo = "https://ionicframework.com/docs/img/demos/avatar.svg",
  initialRemarks,
}) => {
  return (
    <IonItem color="light" mode="md">
      <IonButton color="light" className="notification-card">
        <div className="notification-wrapper">
          <div className="photo-container">
            <IonAvatar>
              <img alt="User Avatar" src={photo} />
            </IonAvatar>
          </div>
          <div className="details-container">
            <span className="fullname">{fullname}</span>
            <span className="position">
              {position === 1
                ? "admin"
                : position === 2
                ? "client"
                : position === 3
                ? "applicant"
                : "Client"}
            </span>
            <span className="message">
              <span className="hide-message">{message}</span>
            </span>
            <div className="details-footer">
              <span className="time">{getRelativeTime(time)}</span>
              <IonButton className="view-btn" color="my-main" routerLink={link}>
                view
              </IonButton>
            </div>
          </div>
        </div>
      </IonButton>
    </IonItem>
  );
};

export default NotificationCard;
