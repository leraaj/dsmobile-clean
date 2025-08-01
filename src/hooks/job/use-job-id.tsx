import useFetchJobs from "./use-job";
import { Job } from "../../interfaces/Job/Job";

const useJobById = (
  id: string
): {
  job: Job | undefined;
  loading: boolean;
  error: string | null;
} => {
  const { jobs, loading, error } = useFetchJobs();
  const job = jobs.find((job) => job._id === id);

  return { job, loading, error };
};

export default useJobById;
