import { Job } from "../Job/Job";
import { User } from "../User/auth";

export interface Notifications {
  notifications?: Notification;
}

export interface Notification {
  _id: string;
  job: Job;
  user: User;
  meetingLink?: string;
  meetingTime?: string;
  phase: number;
  appointmentStatus?: string | number;
  applicationStatus?: string | number;
  initialRemarks?: string | any;
  finalRemarks?: string | any;
  hiringRemarks?: string | any;
  complete: string | number;
  createdAt: string;
  updatedAt?: string;
}
export interface NotificationResponse {
  applications: Notification[];
  appointments: Notification[];
}
