import React, { useEffect, useState } from "react";
import IonicLayout from "../../../components/Layouts/IonicLayout";
import {
  IonAvatar,
  IonButton,
  IonCol,
  IonGrid,
  IonInput,
  IonItem,
  IonLabel,
  IonRow,
  IonText,
} from "@ionic/react";
import { useAuthContext } from "../../../helpers/context/AuthContext";
import { useHistory } from "react-router";
import { useLogout } from "../../../hooks/auth/use-logout";
import Section from "../../../components/Custom/Headers/Section";
import ProfilePlaceholder from "../../../assets/images/emptyImage.png";
import "../../../assets/styles/profile/profile.css";
import useFetchJobs from "../../../hooks/job/use-job";
import LoadingSpinner from "../../Other/LoadingSpinner";
import CategoryTitle from "../../../components/Custom/Headers/CategoryTitle";
// Todo: Finish the update profile

const Profile = () => {
  const { user, loading: userLoading, initialize } = useAuthContext();
  const PROFILE_ID = user?.profile?.id;
  const { jobs, loading: jobLoading } = useFetchJobs();
  const { logout } = useLogout();
  const history = useHistory();
  const handleLogout = async () => {
    try {
      await logout(); // Call logout function
      history.replace("/login"); // Navigate to login screen
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };
  const [profileLoaded, setProfileLoaded] = useState(false);
  const [profileEror, setProfileError] = useState(false);

  return (
    <IonicLayout
      isMain
      hasPadding
      paddingBlock="1rem"
      paddingInline="1.3rem"
      color="light"
      title={user?.fullName}
      toolbarEnd={<IonButton onClick={handleLogout}>Logout</IonButton>}
      loading={userLoading}
      onRefresh={async () => {
        await initialize(); // Your data refresh function
      }}>
      {/* PROFILE PICTURE - NOT */}
      <Section headerTitle="profile picture" routerLink="/tabs/update/picture">
        {userLoading ? (
          <LoadingSpinner />
        ) : (
          <div className="profile-container">
            <IonAvatar
              style={{
                height: "150px",
                width: "150px",
                "--border-radius": "1rem",
              }}>
              {PROFILE_ID && profileLoaded ? (
                <img
                  src={`https://drive.google.com/thumbnail?id=${PROFILE_ID}&sz=w500`}
                  onLoad={() => setProfileLoaded(true)}
                  onError={() => setProfileError(true)}
                  style={{
                    objectFit: "cover",
                    borderRadius: "1rem",
                    padding: "0rem",
                    border: "none",
                  }}
                />
              ) : (
                <iframe
                  title="Uploaded Resume"
                  src={`https://drive.google.com/file/d/${PROFILE_ID}/preview`}
                  width="100%"
                  height="100%"
                  allow="autoplay"
                  style={{
                    objectFit: "cover",
                    borderRadius: "1rem",
                    padding: "0rem",
                    border: "none",
                  }}
                />
              )}
            </IonAvatar>
          </div>
        )}
      </Section>
      {/* DETAILS - DONE */}
      <Section headerTitle="details" routerLink="/tabs/update/details">
        {userLoading ? (
          <LoadingSpinner />
        ) : (
          <>
            <IonInput
              label="Full Name"
              color={"dark"}
              labelPlacement="floating"
              value={user?.fullName}
              readonly
            />
            <IonInput
              label="Email"
              color={"dark"}
              labelPlacement="floating"
              value={user?.email}
              readonly
            />
            <IonInput
              label="Contact"
              color={"dark"}
              labelPlacement="floating"
              value={user?.contact}
              readonly
            />
          </>
        )}
      </Section>
      {/* FILES - NOT */}
      <Section headerTitle="cv/resume" routerLink="/tabs/update/cvresume">
        {userLoading ? (
          <LoadingSpinner />
        ) : (
          <div style={{ display: "flex", flexDirection: "column" }}>
            <IonText>
              {user?.resume?.name || "Please upload you CV/Resume here"}
            </IonText>
          </div>
        )}
      </Section>
      <Section headerTitle="portfolio" routerLink="/tabs/update/portfolio">
        {userLoading ? (
          <LoadingSpinner />
        ) : (
          <IonGrid>
            <IonRow>
              {user?.portfolio?.length === 0 ? (
                <IonText>Upload your works here</IonText>
              ) : (
                user?.portfolio?.map((pf, index) => {
                  return (
                    <IonCol
                      size-xs="4"
                      size-sm="3"
                      size-md="3"
                      size-lg="3"
                      style={{ "--border-radius": "1rem" }}>
                      <iframe
                        src={`https://drive.google.com/file/d/${pf?.id}/preview`}
                        width="100%"
                        height="100px"
                        allow="autoplay"
                        style={{
                          width: "100%",
                          padding: "0rem",
                          border: "none",
                          borderRadius: "1rem",
                        }}
                      />
                    </IonCol>
                  );
                })
              )}
            </IonRow>
          </IonGrid>
        )}
      </Section>
      {/* SKILL - DONE */}
      <Section headerTitle="skills" routerLink="/tabs/update/skills">
        <div>
          {jobLoading || userLoading ? (
            <LoadingSpinner color="dark" />
          ) : (user?.skills?.length as any) < 3 ? (
            <IonText>{`Please select at least 3 skills`}</IonText>
          ) : (
            jobs
              .filter((job) => user?.skills?.includes(job._id))
              .map((selectedJob) => (
                <IonButton
                  key={selectedJob._id}
                  size="small"
                  className="ion-text-capitalize"
                  shape="round"
                  color="dark-bg">
                  {selectedJob.title}
                </IonButton>
              ))
          )}
        </div>
      </Section>
    </IonicLayout>
  );
};

export default Profile;
