export interface GoogleFileDetails {
  id?: string;
  name?: string;
  mimeType?: string;
  fileType?: string;
  filename?: string;
  extension?: string;
}

export interface Directories {
  root: string;
  profile: string;
  resume: string;
  portfolio: string;
}

export interface User {
  _id: string;
  fullName: string;
  contact: string;
  email: string;
  username: string;
  password: string;
  position: number;
  applicationStatus: number;
  createdAt: string;
  updatedAt: string;
  __v: number;
  loggedIn?: number;
  currentDeviceId?: string | null;
  skills: any[]; // Replace with more specific type if possible
  profile?: GoogleFileDetails;
  resume?: GoogleFileDetails;
  portfolio?: GoogleFileDetails[];
  directories: Directories;
}

export interface LoginResponse {
  user: User;
  token: string;
}

export interface LogoutResponse {
  message?: string;
}
