export interface CoachTurn {
  role: "user" | "assistant";
  content: string;
}

export interface CareerCoachReply {
  reply: string;
}
