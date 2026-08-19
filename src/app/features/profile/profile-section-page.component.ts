import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { finalize } from 'rxjs';
import { NotificationService } from '../../core/services/notification.service';
import { ProfileDraftService } from '../onboarding/profile-draft.service';

type ProfileSection = 'personal'|'career'|'skills'|'interview'|'resume'|'security'|'privacy';

@Component({
  standalone:true,
  selector:'app-profile-section-page',
  imports:[ReactiveFormsModule,RouterLink],
  templateUrl:'./profile-section-page.component.html',
  styleUrl:'./profile-section-page.component.css',
  changeDetection:ChangeDetectionStrategy.OnPush
})
export class ProfileSectionPageComponent {
  private readonly draft=inject(ProfileDraftService);
  private readonly notifications=inject(NotificationService);
  private readonly fb=inject(FormBuilder);
  readonly section=inject(ActivatedRoute).snapshot.data['section'] as ProfileSection;
  readonly loading=signal(this.isEditable);
  readonly saving=signal(false);
  readonly preferenceOptions=['Technical','Behavioral','Project-based','Voice mode'];
  readonly selected=new Set<string>();
  readonly form=this.fb.nonNullable.group({
    headline:['',Validators.required],experienceLevel:['',Validators.required],education:['',Validators.required],currentRole:['',Validators.required],linkedInUrl:[''],portfolioUrl:[''],
    targetRole:['',Validators.required],industry:['',Validators.required],location:['',Validators.required],careerGoal:['',Validators.required],
    qualification:['',Validators.required],institution:['',Validators.required],graduationYear:[''],company:['',Validators.required],experienceDuration:[''],responsibilities:['',Validators.required],achievement:['',Validators.required],skills:['',Validators.required],skillLevel:[''],
  });

  constructor(){
    if(this.isEditable){
      this.draft.load().pipe(finalize(()=>this.loading.set(false))).subscribe({next:()=>this.populate(),error:error=>this.notifications.error(error,'Unable to load your profile.')});
    }
  }

  get isEditable():boolean{return ['personal','career','skills','interview'].includes(this.section);}
  get title():string{return ({personal:'Personal information',career:'Career preferences',skills:'Skills & experience',interview:'Interview preferences',resume:'Resume management',security:'Password & security',privacy:'Privacy & data'} as const)[this.section];}
  get subtitle():string{return ({personal:'Keep your identity and professional links up to date',career:'Define the opportunities you want to prepare for',skills:'Maintain your education, work history, and expertise',interview:'Control how your mock interviews are personalized',resume:'Keep the resume used for analysis current',security:'Protect your account and manage access',privacy:'Control your personal information and account data'} as const)[this.section];}
  togglePreference(value:string):void{this.selected.has(value)?this.selected.delete(value):this.selected.add(value);this.form.markAsDirty();}
  hasUnsavedChanges():boolean{return this.isEditable&&this.form.dirty;}
  save():void{
    if(!this.isEditable||this.saving()){return;}
    const value=this.form.getRawValue();
    this.draft.update({...value,skills:value.skills.split(',').map(x=>x.trim()).filter(Boolean),preferences:[...this.selected]});
    this.saving.set(true);
    this.draft.save().pipe(finalize(()=>this.saving.set(false))).subscribe({next:()=>{this.form.markAsPristine();this.notifications.success(`${this.title} updated.`);},error:error=>this.notifications.error(error,'Unable to update your profile.')});
  }
  private populate():void{const p=this.draft.value();this.form.patchValue({...p,skills:p.skills.join(', ')});p.preferences.forEach(x=>this.selected.add(x));this.form.markAsPristine();}
}
