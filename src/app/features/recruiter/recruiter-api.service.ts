import { inject, Injectable } from "@angular/core";
import { ApiService } from "../../core/services/api.service";
import {
  Applicant,
  ApplicantDetail,
  ApplicantList,
  ApplicantListItem,
  CreateInterviewRequest,
  CreateJobPostingRequest,
  RecruiterDashboard,
  RecruiterInterview,
  RecruiterJobPosting,
  RecruiterProfile,
  SubmitFeedbackRequest,
  UpdateInterviewRequest,
  UpdateJobPostingRequest,
  UpdateRecruiterProfileRequest,
} from "./recruiter.models";

export interface ApplicantFilters {
  search?: string;
  jobId?: string;
  status?: string;
  page?: number;
  pageSize?: number;
}

@Injectable({ providedIn: "root" })
export class RecruiterApiService {
  private readonly api = inject(ApiService);

  dashboard() {
    return this.api.get<RecruiterDashboard>("recruiter/dashboard");
  }

  jobs() {
    return this.api.get<RecruiterJobPosting[]>("recruiter/jobs");
  }

  job(id: string) {
    return this.api.get<RecruiterJobPosting>(`recruiter/jobs/${id}`);
  }

  createJob(request: CreateJobPostingRequest) {
    return this.api.post<RecruiterJobPosting, CreateJobPostingRequest>(
      "recruiter/jobs",
      request,
    );
  }

  updateJob(id: string, request: UpdateJobPostingRequest) {
    return this.api.put<RecruiterJobPosting, UpdateJobPostingRequest>(
      `recruiter/jobs/${id}`,
      request,
    );
  }

  deleteJob(id: string) {
    return this.api.delete<void>(`recruiter/jobs/${id}`);
  }

  applicants(id: string) {
    return this.api.get<Applicant[]>(`recruiter/jobs/${id}/applications`);
  }

  applications(filters: ApplicantFilters = {}) {
    const query = new URLSearchParams();
    if (filters.search) query.set("search", filters.search);
    if (filters.jobId) query.set("jobId", filters.jobId);
    if (filters.status) query.set("status", filters.status);
    if (filters.page) query.set("page", String(filters.page));
    if (filters.pageSize) query.set("pageSize", String(filters.pageSize));
    const suffix = query.toString() ? `?${query}` : "";
    return this.api.get<ApplicantList>(`recruiter/applications${suffix}`);
  }

  application(id: string) {
    return this.api.get<ApplicantDetail>(`recruiter/applications/${id}`);
  }

  updateApplicationStatus(id: string, status: string) {
    return this.api.put<ApplicantListItem, { status: string }>(
      `recruiter/applications/${id}/status`,
      { status },
    );
  }

  applicationResume(id: string) {
    return this.api.getBlob(`recruiter/applications/${id}/resume`);
  }

  interviews(status?: string, jobId?: string) {
    const query = new URLSearchParams();
    if (status) query.set("status", status);
    if (jobId) query.set("jobId", jobId);
    const suffix = query.toString() ? `?${query}` : "";
    return this.api.get<RecruiterInterview[]>(`recruiter/interviews${suffix}`);
  }

  interview(id: string) {
    return this.api.get<RecruiterInterview>(`recruiter/interviews/${id}`);
  }

  createInterview(request: CreateInterviewRequest) {
    return this.api.post<RecruiterInterview, CreateInterviewRequest>(
      "recruiter/interviews",
      request,
    );
  }

  updateInterview(id: string, request: UpdateInterviewRequest) {
    return this.api.put<RecruiterInterview, UpdateInterviewRequest>(
      `recruiter/interviews/${id}`,
      request,
    );
  }

  cancelInterview(id: string) {
    return this.api.post<RecruiterInterview, Record<string, never>>(
      `recruiter/interviews/${id}/cancel`,
      {},
    );
  }

  completeInterview(id: string) {
    return this.api.post<RecruiterInterview, Record<string, never>>(
      `recruiter/interviews/${id}/complete`,
      {},
    );
  }

  submitFeedback(id: string, request: SubmitFeedbackRequest) {
    return this.api.post<RecruiterInterview, SubmitFeedbackRequest>(
      `recruiter/interviews/${id}/feedback`,
      request,
    );
  }

  profile() {
    return this.api.get<RecruiterProfile>("recruiter/profile");
  }

  updateProfile(request: UpdateRecruiterProfileRequest) {
    return this.api.put<RecruiterProfile, UpdateRecruiterProfileRequest>(
      "recruiter/profile",
      request,
    );
  }
}
