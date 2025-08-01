import {
  IonPage,
  IonContent,
  IonText,
  IonButton,
  IonSpinner,
  IonChip,
} from "@ionic/react";
import React, { useState } from "react";
import IonicLayout from "../../../../components/Layouts/IonicLayout";
import useFetchJobs from "../../../../hooks/job/use-job";
import { useAuthContext } from "../../../../helpers/context/AuthContext";
import { useHistory } from "react-router";
import axios from "axios";
import LoadingSpinner from "../../../Other/LoadingSpinner";
import { useToast } from "../../../../helpers/context/ToastContext";

const ProfileUpdateSkills: React.FC = () => {
  const { showToast } = useToast();
  const { user, initialize } = useAuthContext();
  const { jobs, loading: jobLoading } = useFetchJobs();
  const history = useHistory(); // Add this line
  const UPDATE_URL = import.meta.env.VITE_APP_API_URL + `user/${user?._id}`;
  // Default selected category is "Design and Creative"
  const [selectedCategory, setSelectedCategory] = useState("design & creative");

  // Get all unique category titles
  const Category = [
    ...new Set(jobs.map((item) => item.category.title).filter(Boolean)),
  ];
  const FilteredJobs = jobs.filter(
    (job) => job.category.title === selectedCategory
  );
  const [selected, setSelected] = useState<string[]>(user?.skills ?? []);

  const handleSubmit = async () => {
    try {
      const updatedSkills = {
        skills: selected,
      };
      const response = await axios.put(UPDATE_URL, updatedSkills);
      if (!response) return showToast(response);
      await initialize();
      history.replace("/tabs/profile");
      showToast("User update successfully");
    } catch (error: any) {
      console.error(error);
      alert("Failed to update profile.");
    }
  };
  return (
    <IonicLayout
      hasPadding
      paddingBlock="1rem"
      paddingInline="1.3rem"
      backUrl="/tabs/profile"
      color="dark-bg"
      title="Update Skills">
      {jobLoading ? (
        <LoadingSpinner color={"light"} />
      ) : (
        <>
          {/* Category filter buttons */}
          <div>
            {Category.map((category, index) => (
              // <IonText
              //   key={index}
              //   color={selectedCategory === category ? "light" : "medium"}
              //   onClick={() => setSelectedCategory(category)}
              //   className="ion-padding-end ion-text-uppercase"
              //   style={{
              //     fontFamily: "Agdasima-Bold",
              //     fontSize: "1.2rem",
              //     cursor: "pointer",
              //   }}>
              //   {category}
              // </IonText>
              <IonChip
                className="ion-text-uppercase"
                color={selectedCategory === category ? "light" : "medium"}
                outline={selectedCategory ? false : true}
                onClick={() => setSelectedCategory(category)}>
                {category}
              </IonChip>
            ))}
          </div>

          {/* Jobs list for selected category */}

          <div className="ion-padding-top">
            {FilteredJobs.map((job, index) => {
              const included = selected.includes(job._id);

              const toggleSkill = () => {
                if (included) {
                  setSelected(selected.filter((id) => id !== job._id));
                } else {
                  setSelected([...selected, job._id]);
                }
              };

              return (
                <IonButton
                  key={index}
                  size="small"
                  color={included ? "light" : "dark-bg"}
                  className="ion-text-capitalize"
                  shape="round"
                  onClick={toggleSkill}>
                  {job.title}
                </IonButton>
              );
            })}
          </div>
        </>
      )}
      <div className="ion-padding-top ion-float-end">
        <IonButton color={"light"} fill="outline" onClick={handleSubmit}>
          Save changes
        </IonButton>
      </div>
    </IonicLayout>
  );
};

export default ProfileUpdateSkills;
