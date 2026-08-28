import { inject, Injectable } from "@angular/core";
import { ApiService } from "../../core/services/api.service";
import { CreateJobMatchRequest, JobMatch } from "./job-match.models";

@Injectable({ providedIn: "root" })
export class JobMatchApiService {
  private readonly api = inject(ApiService);
  create(request: CreateJobMatchRequest) {
    return this.api.post<JobMatch, CreateJobMatchRequest>(
      "job-matches",
      request,
    );
  }
  get(id: string) {
    return this.api.get<JobMatch>(`job-matches/${id}`);
  }
  list() {
    return this.api.get<JobMatch[]>("job-matches");
  }
  delete(id: string) {
    return this.api.delete<void>(`job-matches/${id}`);
  }
}
