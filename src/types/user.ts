
export interface User {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  name?: string;
  profilePicture?: string;
  avatar?: string;
  bio?: string;
  role: 'ADMIN' | 'UPLOADER' | 'PROOFREADER' | 'CURATOR' | 'REVIEWER' | 'CONTRIBUTOR' | 'VIEWER';
  status: 'ACTIVE' | 'INACTIVE' | 'BANNED';
  createdAt: string;
  updatedAt?: string;
  lastLogin?: string;
  preferences?: any;
  subscription?: any;
  isVerified?: boolean;
}
