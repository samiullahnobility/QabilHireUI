import { inject, Injectable, signal } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { ApiService } from '../../core/services/api.service';

export interface ProfileDraft { headline:string; experienceLevel:string; education:string; currentRole:string; skills:string[]; company:string; responsibilities:string; achievement:string; institution:string; qualification:string; linkedInUrl:string; portfolioUrl:string; targetRole:string; industry:string; location:string; preferences:string[]; careerGoal:string; }
const initial: ProfileDraft={headline:'',experienceLevel:'',education:'',currentRole:'',skills:[],company:'',responsibilities:'',achievement:'',institution:'',qualification:'',linkedInUrl:'',portfolioUrl:'',targetRole:'',industry:'',location:'',preferences:[],careerGoal:''};
@Injectable({providedIn:'root'})
export class ProfileDraftService {
  private readonly api=inject(ApiService);
  private readonly key='qabilhire_profile_draft';
  readonly value=signal<ProfileDraft>(this.restore());
  update(patch:Partial<ProfileDraft>):void{const next={...this.value(),...patch};this.value.set(next);sessionStorage.setItem(this.key,JSON.stringify(next));}
  load():Observable<CandidateProfileResponse>{return this.api.get<CandidateProfileResponse>('profile').pipe(tap(profile=>this.update({...profile,preferences:profile.interviewPreferences})));}
  save():Observable<CandidateProfileResponse>{const {preferences,...profile}=this.value();return this.api.put<CandidateProfileResponse,UpsertCandidateProfileRequest>('profile',{...profile,interviewPreferences:preferences}).pipe(tap(saved=>this.update({...saved,preferences:saved.interviewPreferences})));}
  private restore():ProfileDraft{try{return {...initial,...JSON.parse(sessionStorage.getItem(this.key)??'{}') as Partial<ProfileDraft>};}catch{return initial;}}
}

interface UpsertCandidateProfileRequest extends Omit<ProfileDraft,'preferences'>{interviewPreferences:string[];}
interface CandidateProfileResponse extends UpsertCandidateProfileRequest{id:string;isComplete:boolean;updatedAtUtc:string;}
