import { inject, Injectable } from "@angular/core";
import { ApiService } from "../../core/services/api.service";
import { AdminRole, AdminUser } from "../jobs/jobs.models";

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
}
