export type ApplicationStatus = "Applied" | "Interview" | "Offer" | "Reject" | "Withdrawn";

export interface User {
  id: string;
  email: string;
  name?: string;
  phone?: string;
  location?: string;
  professional_summary?: string;
  skills?: string;
  experience?: string;
  education?: string;
  projects?: string;
  linkedin_url?: string;
  github_url?: string;
  portfolio_url?: string;
  created_at: string;
  updated_at: string;
}

export interface JobPosting {
  id: string;
  company: string;
  role: string;
  location?: string;
  employment_type?: string;
  description?: string;
  source_url?: string;
  external_id?: string;
  created_at: string;
  updated_at: string;
}

export interface Application {
  id: string;
  job_id: string;
  application_date: string;
  current_status: ApplicationStatus;
  notes?: string;
  job: JobPosting;
  created_at: string;
  updated_at: string;
}

export interface ApplicationHistory {
  id: string;
  application_id: string;
  old_status?: ApplicationStatus;
  new_status: ApplicationStatus;
  changed_at: string;
  note?: string;
}

export interface Draft {
  id: string;
  application_id?: string;
  job_id?: string;
  user_id: string;
  type: "cover_letter" | "follow_up_email";
  contents: string;
  status: "draft" | "sent" | "archived";
  created_at: string;
  updated_at: string;
}

export interface Nudge {
  id: string;
  application_id: string;
  type: string;
  message: string;
  scheduled_for: string;
  status: string;
  created_at: string;
}

export interface ImportJob {
  id: string;
  user_id: string;
  filename: string;
  status: string;
  records_processed: number;
  records_failed: number;
  error_summary?: string;
  created_at: string;
  completed_at?: string;
}
