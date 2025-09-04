import React, { useState } from "react";
import IonicLayout from "../../components/Layouts/IonicLayout";
import StepOne from "./StepOne";
import StepTwo from "./StepTwo";
import StepThree from "./StepThree";
import StepFour from "./StepFour";
import LoadingSpinner from "../Other/LoadingSpinner";
import SplashScreen from "../Other/SplashScreen";

type UserData = {
  _id?: string;
  fullName: string;
  contact: string;
  email: string;
  username: string;
  password: string;
  position: number; // 1 = admin, 2 = client, 3 = applicant
  skills: string[]; // Array of Job ObjectIds
  applicationStatus: number; // 2 = Pending, 3 = Accepted, 4 = Rejected
  resume?: GoogleFile;
  portfolio?: GoogleFile[];
};
type GoogleFile = {
  id?: string;
  name?: string;
  mimeType?: string;
  fileType?: string;
  filename?: string;
  extension?: string;
};
const Registration: React.FC = () => {
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false); // <-- new state
  const [userData, setUserData] = useState<UserData>({
    fullName: "",
    contact: "",
    email: "",
    username: "",
    password: "",
    position: 3, // applicant
    skills: [],
    applicationStatus: 2, // pending
    resume: undefined,
    portfolio: [],
  });

  const changePage = (dir: "next" | "back") => {
    setLoading(true); // show loader
    setTimeout(() => {
      setPage((prev) => {
        if (dir === "next" && prev < 4) return prev + 1;
        if (dir === "back" && prev > 1) return prev - 1;
        return prev;
      });
      setLoading(false); // hide loader after 1s
    }, 1000);
  };
  if (loading) {
    return <SplashScreen />;
  }
  return (
    <IonicLayout hasPadding isScrollable paddingInline="1rem" color="dark-bg">
      <div style={{ marginTop: "1.5rem" }}>
        {page === 1 && (
          <StepOne
            userData={userData}
            setUserData={setUserData}
            changePage={changePage}
          />
        )}
        {page === 2 && (
          <StepTwo
            userData={userData}
            setUserData={setUserData}
            changePage={changePage}
          />
        )}
        {page === 3 && (
          <StepThree
            userData={userData}
            setUserData={setUserData}
            changePage={changePage}
          />
        )}
        {page === 4 && (
          <StepFour
            userData={userData}
            setUserData={setUserData}
            changePage={changePage}
          />
        )}
      </div>
    </IonicLayout>
  );
};

export default Registration;
