import { inject, Injectable } from "@angular/core";
import { ApiService } from "../../core/services/api.service";
import { AdminRole, AdminUser } from "../jobs/jobs.models";
import {
  AdminActivity,
  AdminJob,
  AdminReports,
  AdminSettings,
  AdminSummary,
  AdminSystemHealth,
} from "./admin.models";

@Injectable({ providedIn: "root" })
export class AdminApiService {
  private readonly api = inject(ApiService);

  users() {
    return this.api.get<AdminUser[]>("admin/users");
  }

  updateRole(id: string, role: string) {
    return this.api.put<void, { role: string }>(`admin/users/${id}/role`, {
      role,
    });
  }

  updateLock(id: string, locked: boolean) {
    return this.api.put<void, { locked: boolean }>(`admin/users/${id}/lock`, {
      locked,
    });
  }

  roles() {
    return this.api.get<AdminRole[]>("admin/roles");
  }

  summary() {
    return this.api.get<AdminSummary>("admin/summary");
  }

  jobs() {
    return this.api.get<AdminJob[]>("admin/jobs");
  }

  updateJobStatus(id: string, isActive: boolean) {
    return this.api.put<void, { isActive: boolean }>(`admin/jobs/${id}/status`, {
      isActive,
    });
  }

  deleteJob(id: string) {
    return this.api.delete<void>(`admin/jobs/${id}`);
  }

  activity() {
    return this.api.get<AdminActivity[]>("admin/activity?limit=100");
  }

  reports() {
    return this.api.get<AdminReports>("admin/reports");
  }

  health() {
    return this.api.get<AdminSystemHealth>("admin/health");
  }

  settings() {
    return this.api.get<AdminSettings>("admin/settings");
  }
}
