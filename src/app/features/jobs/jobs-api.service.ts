import { inject, Injectable } from "@angular/core";
import { ApiService } from "../../core/services/api.service";
import {
  Applicant,
  JobApplication,
  JobPosting,
  RecruiterJobPosting,
  SavedJob,
} from "./jobs.models";

export interface CreateJobPostingRequest {
  title: string;
  company: string;
  location: string | null;
  workType: "Remote" | "Hybrid" | "Onsite";
  salaryRange: string | null;
  description: string;
  requiredSkills: string[];
}

export interface UpdateJobPostingRequest extends CreateJobPostingRequest {
  isActive: boolean;
}

@Injectable({ providedIn: "root" })
export class JobsApiService {
  private readonly api = inject(ApiService);

  search(search?: string, workType?: string) {
    const query = new URLSearchParams();
    if (search) query.set("search", search);
    if (workType) query.set("workType", workType);
    const suffix = query.toString() ? `?${query}` : "";
    return this.api.get<JobPosting[]>(`jobs${suffix}`);
  }

  get(id: string) {
    return this.api.get<JobPosting>(`jobs/${id}`);
  }

  apply(id: string) {
    return this.api.post<void, Record<string, never>>(`jobs/${id}/apply`, {});
  }

  withdraw(id: string) {
    return this.api.delete<void>(`jobs/${id}/application`);
  }

  save(id: string) {
    return this.api.post<void, Record<string, never>>(`jobs/${id}/save`, {});
  }

  unsave(id: string) {
    return this.api.delete<void>(`jobs/${id}/save`);
  }

  applications() {
    return this.api.get<JobApplication[]>("applications");
  }

  savedJobs() {
    return this.api.get<SavedJob[]>("saved-jobs");
  }

  recruiterJobs() {
    return this.api.get<RecruiterJobPosting[]>("recruiter/jobs");
  }

  recruiterCreate(request: CreateJobPostingRequest) {
    return this.api.post<RecruiterJobPosting, CreateJobPostingRequest>(
      "recruiter/jobs",
      request,
    );
  }

  recruiterUpdate(id: string, request: UpdateJobPostingRequest) {
    return this.api.put<RecruiterJobPosting, UpdateJobPostingRequest>(
      `recruiter/jobs/${id}`,
      request,
    );
  }

  recruiterDelete(id: string) {
    return this.api.delete<void>(`recruiter/jobs/${id}`);
  }

  applicants(id: string) {
    return this.api.get<Applicant[]>(`recruiter/jobs/${id}/applications`);
  }
}
