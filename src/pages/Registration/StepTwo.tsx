import { IonButton, IonInput, IonText, IonChip, IonGrid } from "@ionic/react";
import React, { useEffect, useState } from "react";
import useFetchJobs from "../../hooks/job/use-jobs";
import { useAuthContext } from "../../helpers/context/AuthContext";
import LoadingSpinner from "../Other/LoadingSpinner";
import { User } from "../../interfaces/User/auth";
import Section from "../../components/Custom/Headers/Section";
import { useToast } from "../../helpers/context/ToastContext";

interface Props {
  userData: any;
  setUserData: React.Dispatch<React.SetStateAction<any>>;
  changePage: (dir: "next" | "back") => void;
}

const StepTwo: React.FC<Props> = ({ userData, setUserData, changePage }) => {
  const { user } = useAuthContext();
  const { showToast } = useToast();
  const { jobs, loading: jobLoading } = useFetchJobs();

  const [selected, setSelected] = useState<string[]>(userData.skills ?? []);
  const [selectedCategory, setSelectedCategory] = useState("design & creative");
  const [error, setError] = useState<string>("");

  const FilteredJobs = jobs.filter(
    (job) => job.category.title === selectedCategory
  );
  const Category = [
    ...new Set(jobs.map((item) => item.category.title).filter(Boolean)),
  ];

  useEffect(() => {
    setUserData((prev: User) => ({
      ...prev,
      skills: selected,
    }));
  }, [selected]);

  const handleNext = () => {
    if (!userData.fullName || !userData.email || !userData.contact) {
      showToast("Please fill in all fields.", "danger");
      return;
    }

    if (selected.length < 3) {
      showToast("Please select at least 3 skills.", "danger");
      return;
    }

    // All good
    setError("");
    changePage("next");
  };

  return (
    <>
      <Section light headerTitle="fill out your profile">
        <IonInput
          label="Full name"
          labelPlacement="floating"
          color={"light"}
          value={userData.fullName}
          onIonInput={(e) =>
            setUserData({ ...userData, fullName: e.detail.value! })
          }
        />
        <IonInput
          label="Email"
          labelPlacement="floating"
          type="email"
          color={"light"}
          value={userData.email}
          onIonInput={(e) =>
            setUserData({ ...userData, email: e.detail.value! })
          }
        />
        <IonInput
          label="Contact Number"
          labelPlacement="floating"
          type="tel"
          color={"light"}
          value={userData.contact}
          onIonInput={(e) =>
            setUserData({ ...userData, contact: e.detail.value! })
          }
        />
      </Section>
      <Section light headerTitle="select your skills">
        {jobLoading ? (
          <LoadingSpinner color="light" />
        ) : (
          <>
            {/* Category filter buttons */}
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginTop: "1rem",
              }}>
              {Category.map((category, index) => (
                <IonText
                  key={index}
                  className="agdasima-bold"
                  color={selectedCategory === category ? "light" : "medium"}
                  onClick={() => setSelectedCategory(category)}
                  style={{ cursor: "pointer" }}>
                  {category}
                </IonText>
              ))}
            </div>

            {/* Jobs list for selected category */}
            <div className="ion-padding-top">
              {FilteredJobs.map((job) => {
                const included = selected.includes(job._id);

                const toggleSkill = () => {
                  setSelected((prev) =>
                    included
                      ? prev.filter((id) => id !== job._id)
                      : [...prev, job._id]
                  );
                };

                return (
                  <IonButton
                    key={job._id}
                    size="small"
                    color={included ? "light" : "my-main"}
                    fill={"solid"}
                    className="agdasima-bold"
                    shape="round"
                    onClick={toggleSkill}>
                    {job.title}
                  </IonButton>
                );
              })}
            </div>
          </>
        )}

        <IonButton
          expand="block"
          onClick={() => changePage("back")}
          style={{ paddingTop: "1.5rem" }}>
          Back
        </IonButton>
        <IonButton color="my-main" expand="block" onClick={handleNext}>
          Next
        </IonButton>
        <IonText>
          {`${userData.fullName} ${userData.email} ${userData.contact} ${userData.skills}`}
        </IonText>
      </Section>
    </>
  );
};

export default StepTwo;
