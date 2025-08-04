import { IonAvatar, IonButton, IonItem, IonList, IonText } from "@ionic/react";
import IonicLayout from "../../../components/Layouts/IonicLayout";
import "../../../assets/styles/notification/notification-card.css";
import "../../../assets/styles/notification/view-btn.css";

import useFetchNotifications from "../../../hooks/notification/use-notification";
import NotificationCard from "../../../components/Custom/Card/NotificationCard";
import { getNotificationMessage } from "../../../helpers/messages/getNotificationMessage";
import LoadingSpinner from "../../Other/LoadingSpinner";

interface InterviewResponseParams {
  response: number;
}
// Todo: Make the interviews functional
const Notification = () => {
  const { notifications, refresh, loading } = useFetchNotifications();

  // Use the first notification for your detailed checks (adjust as needed)
  const firstNotification = notifications?.[0];

  const isInitialInterview =
    firstNotification?.phase === 1 &&
    firstNotification?.appointmentStatus === 1 &&
    firstNotification?.complete === 0;
  const isFinalInterview =
    firstNotification?.phase === 2 &&
    firstNotification?.appointmentStatus === 1 &&
    firstNotification?.complete === 0;
  const isClientInterview =
    firstNotification?.phase === 3 &&
    firstNotification?.appointmentStatus === 1 &&
    firstNotification?.complete === 0;
  const isTeamBriefing =
    firstNotification?.phase === 3 &&
    firstNotification?.appointmentStatus === 2 &&
    firstNotification?.complete === 0;

  const showResponseButtons =
    isInitialInterview ||
    isFinalInterview ||
    isClientInterview ||
    isTeamBriefing;

  const handleInterviewResponse = ({ response }: InterviewResponseParams) => {
    if (isInitialInterview) {
      handleInitialInterview({ response });
    }
    if (isClientInterview) {
      handleFinalInterview({ response });
    }
    if (isFinalInterview) {
      handleClientInterview({ response });
    }
    if (isTeamBriefing) {
      handleTeamBriefing({ response });
    }
  };

  const handleInitialInterview = ({ response }: InterviewResponseParams) => {
    alert(
      response === 1
        ? "(isInitialInterview) Accepted"
        : "(isInitialInterview) Declined"
    );
  };
  const handleFinalInterview = ({ response }: InterviewResponseParams) => {
    alert(
      response === 1
        ? "(isClientInterview) Accepted"
        : "(isClientInterview) Declined"
    );
  };
  const handleClientInterview = ({ response }: InterviewResponseParams) => {
    alert(
      response === 1
        ? "(isFinalInterview) Accepted"
        : "(isFinalInterview) Declined"
    );
  };
  const handleTeamBriefing = ({ response }: InterviewResponseParams) => {
    alert(
      response === 1 ? "(isTeamBriefing) Accepted" : "(isTeamBriefing) Declined"
    );
  };

  return (
    <IonicLayout
      isMain
      hasPadding
      paddingBlock="1rem"
      paddingInline="1.3rem"
      color="light"
      title="Notification"
      loading={loading}
      onRefresh={async () => {
        await refresh(); // Your data refresh function
      }}>
      <IonList lines="none" style={{ background: "transparent" }}>
        {loading ? (
          <LoadingSpinner color="dark" />
        ) : notifications?.length <= 0 ? (
          <IonText>There is no notifications at the moment</IonText>
        ) : (
          notifications?.map((notif) => {
            // Destructure relevant values
            const { phase, applicationStatus, complete } = notif;

            // Check if the notification should be hidden
            const shouldHide =
              phase === 1 && applicationStatus === 2 && complete === 1;

            // If condition is met, skip rendering
            if (shouldHide) return null;

            const notifInfo = getNotificationMessage(
              {
                phase: notif.phase,
                applicationStatus: notif.applicationStatus,
                appointmentStatus: notif.appointmentStatus,
                complete: notif.complete,
                jobTitle: notif.job.title,
                meetingLink: notif.meetingLink,
                meetingTime: notif.meetingTime,
                initialRemarks: notif?.initialRemarks,
              },
              "summary"
            );

            return (
              <NotificationCard
                key={notif._id}
                fullname={"darkshot-production"}
                position={"Client"}
                message={notifInfo.message}
                link={`/tabs/notification/${notif._id}`}
                time={notif.createdAt}
                initialRemarks={notif.initialRemarks}
              />
            );
          })
        )}
      </IonList>
    </IonicLayout>
  );
};

export default Notification;
