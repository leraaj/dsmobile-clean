import React from "react";
import { RouteComponentProps } from "react-router";
import IonicLayout from "../../../components/Layouts/IonicLayout";
import useNotificationById from "../../../hooks/notification/use-notification-id";
import { getNotificationMessage } from "../../../helpers/messages/getNotificationMessage";
import {
  IonChip,
  IonCol,
  IonGrid,
  IonRow,
  IonSpinner,
  IonText,
} from "@ionic/react";
import "../../../assets/styles/notification/view-notification.css";
import LoadingSpinner from "../../Other/LoadingSpinner";
import useHandleInterview from "../../../hooks/job/interview/use-handle-interview";
import { useToast } from "../../../helpers/context/ToastContext";

interface ViewNotificationProps extends RouteComponentProps<{ id: string }> {}
interface InterviewResponseParams {
  response: number;
}
const ViewNotification: React.FC<ViewNotificationProps> = ({ match }) => {
  const notifId = match.params.id;

  const { showToast } = useToast();
  const { notification, loading, error } = useNotificationById(notifId);

  const {
    handleInterview,
    loading: interviewLoading,
    error: interviewError,
    message: interviewMessage,
  } = useHandleInterview();

  const isInitialInterview =
    notification?.phase === 1 &&
    notification?.appointmentStatus === 1 &&
    notification?.complete === 0;
  const isFinalInterview =
    notification?.phase === 2 &&
    notification?.appointmentStatus === 1 &&
    notification?.complete === 0;
  const isClientInterview =
    notification?.phase === 3 &&
    notification?.appointmentStatus === 1 &&
    notification?.complete === 0;
  const isTeamBriefing =
    notification?.phase === 3 &&
    notification?.appointmentStatus === 2 &&
    notification?.complete === 0;

  const showResponseButtons =
    isInitialInterview || isFinalInterview || isClientInterview;

  const handleInterviewResponse = ({ response }: InterviewResponseParams) => {
    if (isInitialInterview) {
      handleInitialInterview({ response });
    } else if (isFinalInterview) {
      handleFinalInterview({ response });
    } else if (isClientInterview) {
      handleClientInterview({ response });
    } else if (isTeamBriefing) {
      handleTeamBriefing({ response });
    }
  };

  const handleInitialInterview = async ({
    response,
  }: InterviewResponseParams) => {
    const data = {
      phase: 1,
      appointmentStatus: response === 1 ? 2 : -1,
      complete: 0,
    };
    await handleInterview(data, notifId);
  };
  const handleFinalInterview = async ({
    response,
  }: InterviewResponseParams) => {
    const data = {
      phase: 2,
      appointmentStatus: response === 1 ? 2 : -1,
      complete: 0,
    };
    await handleInterview(data, notifId);
  };
  const handleClientInterview = async ({
    response,
  }: InterviewResponseParams) => {
    const data = {
      phase: 3,
      appointmentStatus: response === 1 ? 2 : -1,
      complete: 0,
    };
    await handleInterview(data, notifId);
  };
  const handleTeamBriefing = async ({ response }: InterviewResponseParams) => {
    const data = {
      phase: 3,
      appointmentStatus: response === 1 ? 2 : -1,
      complete: 0,
    };
    await handleInterview(data, notifId);
  };

  const notifInfo = notification
    ? getNotificationMessage(
        {
          phase: notification.phase,
          applicationStatus: notification.applicationStatus,
          appointmentStatus: notification.appointmentStatus,
          complete: notification.complete,
          jobTitle: notification.job.title,
          meetingLink: notification.meetingLink,
          meetingTime: notification.meetingTime,
        },
        "details"
      )
    : null;

  return (
    <IonicLayout color="light" backUrl="/tabs/notification">
      <div style={{ padding: "1rem" }}>
        {loading ? (
          <LoadingSpinner color="dark" />
        ) : (
          <>
            <IonText className="notif-msg">
              <h2>{notifInfo?.message}</h2>
            </IonText>
            <IonText className="notif-info">
              {/* {notifId} */}
              {notification?.meetingLink &&
                (!notification.initialRemarks ||
                  !notification.finalRemarks ||
                  !notification.hiringRemarks) && (
                  <span>
                    <strong>Meeting Link:</strong>
                    <br />
                    <a
                      href={notification.meetingLink}
                      target="_blank"
                      rel="noopener noreferrer">
                      {notification.meetingLink}
                    </a>
                  </span>
                )}
            </IonText>
            <IonText className="notif-info">
              {notification?.meetingTime &&
                (!notification.initialRemarks ||
                  !notification.finalRemarks ||
                  !notification.hiringRemarks) && (
                  <span>
                    <strong>Meeting Time:</strong>
                    <br />
                    {new Date(notification.meetingTime).toLocaleString()}
                  </span>
                )}
            </IonText>
            <IonText className="notif-info">
              {notification?.initialRemarks && (
                <span>
                  <strong>Initial interview remarks:</strong>
                  <br />
                  {notification.initialRemarks}
                </span>
              )}
            </IonText>
            {notification?.finalRemarks && (
              <IonText className="notif-info">
                {notification?.finalRemarks && (
                  <span>
                    <strong>final interview remarks:</strong>
                    <br />
                    {notification.finalRemarks}
                  </span>
                )}
              </IonText>
            )}
            {notification?.hiringRemarks && (
              <IonText className="notif-info">
                {notification?.hiringRemarks && (
                  <span>
                    <strong>hiring remarks:</strong>
                    <br />
                    {notification.hiringRemarks}
                  </span>
                )}
              </IonText>
            )}
            {showResponseButtons && (
              <>
                <div className="btn-container">
                  <IonChip
                    color={"dark"}
                    onClick={() => handleInterviewResponse({ response: 0 })}>
                    Not available
                  </IonChip>
                  <IonChip
                    outline={true}
                    onClick={() => handleInterviewResponse({ response: 1 })}>
                    Available
                  </IonChip>
                </div>
              </>
            )}
          </>
        )}
      </div>
    </IonicLayout>
  );
};

export default ViewNotification;
