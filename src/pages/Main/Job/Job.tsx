import React, { Fragment } from "react";
import IonicLayout from "../../../components/Layouts/IonicLayout";
import { Job as JobInt } from "../../../interfaces/Job/Job";
import useFetchJobs from "../../../hooks/job/use-job";
import JobLists from "../../../components/Lists/JobLists";
import FixedHeader from "../../../components/Custom/Headers/FixedHeader";
import { IonText, useIonViewWillEnter } from "@ionic/react";

const Job = () => {
  const { jobs, loading, refresh } = useFetchJobs();

  // Group jobs by category title
  const jobsByCategory = jobs.reduce<Record<string, JobInt[]>>((acc, job) => {
    const category = job.category.title;
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(job);
    return acc;
  }, {});
  useIonViewWillEnter(() => {
    refresh(); // ⬅️ Automatically refetches data when page is navigated to
  });
  return (
    <IonicLayout
      isMain
      color="dark-bg"
      hasPadding={false}
      loading={loading}
      onRefresh={refresh}>
      <FixedHeader>
        <IonText className="h3" style={{ fontFamily: "Montserrat" }}>
          Let's find the perfect
          <br /> job for you
        </IonText>
      </FixedHeader>

      <JobLists jobsByCategory={jobsByCategory} />
    </IonicLayout>
  );
};

export default Job;
