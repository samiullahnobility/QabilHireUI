export interface CreateInterviewSessionRequest {
  targetRole: string;
  category: string;
  difficulty: string;
  mode: string;
  responseMode: string;
}

export interface InterviewSession {
  id: string;
  targetRole: string;
  category: string;
  difficulty: string;
  mode: string;
  responseMode: string;
  status: string;
  questionCount: number;
  createdAtUtc: string;
  updatedAtUtc: string;
}

export interface ActiveInterviewQuestion {
  sessionId: string; targetRole: string; category: string; difficulty: string; mode: string;
  responseMode: string; status: string; currentQuestion: number; totalQuestions: number;
  questionId: string; question: string; startedAtUtc: string;
}

export interface SubmitInterviewAnswerResponse {
  status: string; answeredQuestions: number; totalQuestions: number; isCompleted: boolean;
  nextQuestion: ActiveInterviewQuestion | null;
}

export interface InterviewScores { overall:number;technical:number;communication:number;relevance:number;problemSolving:number;confidence:number;professionalism:number; }
export interface InterviewQuestionFeedback { questionId:string;order:number;question:string;answer:string;source:string;score:number;doneWell:string;improvement:string;improvedAnswer:string; }
export interface InterviewResult { sessionId:string;targetRole:string;category:string;difficulty:string;mode:string;completedAtUtc:string;scores:InterviewScores;strongestArea:string;priorityArea:string;summary:string;roadmap:string[];questions:InterviewQuestionFeedback[]; }
