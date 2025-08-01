export interface Benefits {
  pay: string;
  schedule: string;
}

export interface JobDetails {
  benefits: Benefits;
  why: string;
  what: string;
  responsibilities: string[];
  requirements: string[];
}

export interface Jobs {
  job: Job;
}
export interface Job {
  _id: string;
  title: string;
  category: { title: string };
  details: JobDetails;
  createdAt: string;
  disabledUntil?: string;
}
