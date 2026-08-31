import { inject, Injectable } from "@angular/core";
import { ApiService } from "../../core/services/api.service";
import { JobApplication, JobPosting, SavedJob } from "./jobs.models";

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
}
