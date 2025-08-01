import { useEffect, useState } from "react";
import axios from "axios";
import { Job } from "../../interfaces/Job/Job";
import { useAuthContext } from "../../helpers/context/AuthContext";

const JOBS_URL = import.meta.env.VITE_APP_API_URL + "jobs-mobile";

const useFetchJobs = () => {
  const { user } = useAuthContext();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchJobs = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get<Job[]>(JOBS_URL, {
        params: { userId: user?._id }, // ✅ FIXED
      });
      setJobs(response.data);
    } catch (err: any) {
      setError(err?.message || "Failed to fetch jobs");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?._id) {
      fetchJobs();
    }
  }, [user?._id]);

  return { jobs, loading, refresh: fetchJobs, error };
};

export default useFetchJobs;
