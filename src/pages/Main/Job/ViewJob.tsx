import { RouteComponentProps, useHistory } from "react-router-dom";
import IonicLayout from "../../../components/Layouts/IonicLayout";
import {
  IonButton,
  IonItem,
  IonList,
  IonListHeader,
  IonSpinner,
  IonText,
  useIonViewWillEnter,
} from "@ionic/react";
import useJobById from "../../../hooks/job/use-job-id";
import LoadingSpinner from "../../Other/LoadingSpinner";
import CardList from "../../../components/Custom/Card/CardList";
import FixedHeader from "../../../components/Custom/Headers/FixedHeader";
import { useAuthContext } from "../../../helpers/context/AuthContext";
import useSendApplication from "../../../hooks/job/application/use-send-application";
import useFetchNotifications from "../../../hooks/notification/use-notification";
import { useToast } from "../../../helpers/context/ToastContext";
import useFetchJobs from "../../../hooks/job/use-job";

interface ViewJobProps extends RouteComponentProps<{ id: string }> {}

const ViewJob: React.FC<ViewJobProps> = ({ match }) => {
  const jobId = match.params.id;
  const { job, loading, error } = useJobById(jobId);
  const {
    notifications,
    loading: notificationLoading,
    refresh: refetch,
  } = useFetchNotifications();
  const { showToast } = useToast();

  const jobStatus = notifications?.find((n) => {
    if (n?.job?._id === job?._id) {
      if ((n.applicationStatus as number) === 1) {
        return true; // Application in progress
      } else if ((n.appointmentStatus as number) === 1) {
        return true; // Appointment in progress
      } else if ((n.appointmentStatus as number) === 2) {
        return true; // Appointment recently completed
      }
    }
    return false;
  });

  let isJobDisabled = { disabled: false, message: "" };

  if (jobStatus?.job?._id === job?._id) {
    if ((jobStatus?.applicationStatus as number) === 1) {
      isJobDisabled = {
        disabled: true,
        message: "Application in progress",
      };
    } else if ((jobStatus?.appointmentStatus as number) === 1) {
      isJobDisabled = {
        disabled: true,
        message: "Appointment in progress",
      };
    } else if ((jobStatus?.appointmentStatus as number) === 2) {
      isJobDisabled = {
        disabled: true,
        message: "Appointment recently completed",
      };
    }
  }

  const { refresh } = useFetchJobs();
  const { refresh: refreshNotifications } = useFetchNotifications();
  const history = useHistory();
  const {
    sendApplication,
    isLoading,
    error: applicationError,
  } = useSendApplication(job?._id);

  const handleSubmit = async () => {
    await sendApplication();
    await refetch(); // get updated notifications

    history.push("/tabs");
  };
  return (
    <IonicLayout
      loading={loading}
      hasPadding={false}
      color="dark-bg"
      backUrl="/tabs/job">
      {loading ? (
        <LoadingSpinner />
      ) : (
        <>
          <FixedHeader title={`${job?.title}`} />
          <CardList
            style={{
              padding: "1.5rem ",
            }}>
            <IonListHeader>
              <h4>
                <strong>Why become a {job?.title}</strong>
              </h4>
            </IonListHeader>
            <IonItem>{job?.details?.why}</IonItem>
            <IonListHeader>
              <h4>
                <strong>What does the role require?</strong>
              </h4>
            </IonListHeader>
            <IonItem>{job?.details?.what}</IonItem>
            <IonListHeader>
              <h4>
                <strong>Typical responsibilities include:</strong>
              </h4>
            </IonListHeader>
            {job?.details?.responsibilities.map((res, index) => {
              return <IonItem key={index}>- {res}</IonItem>;
            })}
            <IonListHeader>
              <h4>
                <strong>Requirement and skills:</strong>
              </h4>
            </IonListHeader>
            {job?.details?.requirements.map((req, index) => {
              return <IonItem key={index}>- {req}</IonItem>;
            })}
            <IonListHeader>
              <h4>
                <strong>Benefits:</strong>
              </h4>
            </IonListHeader>
            <IonItem>
              <strong style={{ marginRight: "0.5rem" }}>Pay: </strong>
              {job?.details?.benefits.pay}
            </IonItem>
            <IonItem>
              <strong style={{ marginRight: "0.5rem" }}>Schedule: </strong>
              {job?.details?.benefits.schedule}
            </IonItem>

            <IonListHeader>
              <h4>
                <strong>Our hiring process:</strong>
              </h4>
            </IonListHeader>
            <IonItem>Initial Interview</IonItem>
            <IonItem>Final Interview</IonItem>
            <IonItem>Client Interview</IonItem>

            <IonButton
              size="default"
              color={"dark-bg"}
              expand="full"
              slot="end"
              disabled={isJobDisabled.disabled}
              onClick={handleSubmit}>
              {isJobDisabled.disabled ? isJobDisabled.message : "Apply"}
            </IonButton>
          </CardList>
        </>
      )}
    </IonicLayout>
  );
};

export default ViewJob;
