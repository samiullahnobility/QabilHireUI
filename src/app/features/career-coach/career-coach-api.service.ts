import { inject, Injectable } from "@angular/core";
import { ApiService } from "../../core/services/api.service";
import { CareerCoachReply, CoachTurn } from "./career-coach.models";

@Injectable({ providedIn: "root" })
export class CareerCoachApiService {
  private readonly api = inject(ApiService);
  ask(message: string, history: CoachTurn[]) {
    return this.api.post<
      CareerCoachReply,
      { message: string; history: CoachTurn[] }
    >("career-coach/message", { message, history });
  }
}
