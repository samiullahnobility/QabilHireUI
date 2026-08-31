import { inject, Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { ApiService } from "../../core/services/api.service";
import { DashboardSummary } from "./dashboard.models";

@Injectable({ providedIn: "root" })
export class DashboardApiService {
  private readonly api = inject(ApiService);

  summary(): Observable<DashboardSummary> {
    return this.api.get<DashboardSummary>("dashboard/summary");
  }
}
