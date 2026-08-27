import { inject, Injectable } from '@angular/core';
import { ApiService } from '../../core/services/api.service';
import { ActiveInterviewQuestion, CreateInterviewSessionRequest, InterviewResult, InterviewSession, SubmitInterviewAnswerResponse } from './interview.models';

@Injectable({ providedIn: 'root' })
export class InterviewApiService {
  private readonly api = inject(ApiService);
  create(request: CreateInterviewSessionRequest) { return this.api.post<InterviewSession, CreateInterviewSessionRequest>('interviews', request); }
  get(id: string) { return this.api.get<InterviewSession>(`interviews/${id}`); }
  list() { return this.api.get<InterviewSession[]>('interviews'); }
  start(id: string) { return this.api.post<ActiveInterviewQuestion, Record<string, never>>(`interviews/${id}/start`, {}); }
  activeQuestion(id: string) { return this.api.get<ActiveInterviewQuestion>(`interviews/${id}/active-question`); }
  submitAnswer(id: string, questionId: string, answerText: string, source: string) {
    return this.api.post<SubmitInterviewAnswerResponse, {questionId:string;answerText:string;source:string}>(`interviews/${id}/answers`, { questionId, answerText, source });
  }
  transcribe(id: string, questionId: string, audio: Blob) {
    const form = new FormData(); form.append('file', audio, 'answer.webm');
    return this.api.postForm<{transcript:string}>(`interviews/${id}/questions/${questionId}/transcribe`, form);
  }
  evaluate(id: string) { return this.api.post<InterviewResult,Record<string,never>>(`interviews/${id}/evaluate`, {}); }
  results(id: string) { return this.api.get<InterviewResult>(`interviews/${id}/results`); }
}
