import { useEffect, useState } from "react";
import axios from "axios";
import { Job } from "../../interfaces/Job/Job";

const JOBS_URL = import.meta.env.VITE_APP_API_URL + "jobs";

const useFetchJobs = () => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchJobs = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get<Job[]>(JOBS_URL);
      setJobs(response.data);
    } catch (err: any) {
      setError(err?.message || "Failed to fetch jobs");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  return { jobs, loading, refresh: fetchJobs, error };
};

export default useFetchJobs;
