import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { finalize } from 'rxjs';
import { AuthService } from '../../core/auth/auth.service';
import { NotificationService } from '../../core/services/notification.service';
import { ProfileDraftService } from '../onboarding/profile-draft.service';

@Component({standalone:true,selector:'app-profile-page',imports:[ReactiveFormsModule],templateUrl:'./profile-page.component.html',styleUrl:'./profile-page.component.css',changeDetection:ChangeDetectionStrategy.OnPush})
export class ProfilePageComponent{
 private readonly draft=inject(ProfileDraftService);private readonly notifications=inject(NotificationService);private readonly auth=inject(AuthService);private readonly fb=inject(FormBuilder);
 readonly loading=signal(true);readonly saving=signal(false);readonly preferences=['Technical','Behavioral','Project-based','Voice mode'];readonly selected=new Set<string>();
 readonly form=this.fb.nonNullable.group({headline:['',Validators.required],experienceLevel:['',Validators.required],education:['',Validators.required],currentRole:['',Validators.required],skills:['',Validators.required],company:['',Validators.required],responsibilities:['',Validators.required],achievement:['',Validators.required],institution:['',Validators.required],qualification:['',Validators.required],linkedInUrl:[''],portfolioUrl:[''],targetRole:['',Validators.required],industry:['',Validators.required],location:['',Validators.required],careerGoal:['',Validators.required]});
 constructor(){this.draft.load().pipe(finalize(()=>this.loading.set(false))).subscribe({next:()=>this.populate(),error:error=>this.notifications.error(error,'Unable to load your profile.')});}
  toggle(value:string):void{this.selected.has(value)?this.selected.delete(value):this.selected.add(value);this.form.markAsDirty();}
  hasUnsavedChanges():boolean{return this.form.dirty;}
  save():void{if(this.form.invalid||this.saving()){this.form.markAllAsTouched();return;}const value=this.form.getRawValue();this.draft.update({...value,skills:value.skills.split(',').map(x=>x.trim()).filter(Boolean),preferences:[...this.selected]});this.saving.set(true);this.draft.save().pipe(finalize(()=>this.saving.set(false))).subscribe({next:()=>{this.form.markAsPristine();this.auth.markProfileComplete();this.notifications.success('Your profile has been updated.');},error:error=>this.notifications.error(error,'Unable to update your profile.')});}
 private populate():void{const p=this.draft.value();this.form.patchValue({...p,skills:p.skills.join(', ')});this.selected.clear();p.preferences.forEach(value=>this.selected.add(value));}
}
