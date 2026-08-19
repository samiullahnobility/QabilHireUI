import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ProfileDraftService } from './profile-draft.service';

@Component({standalone:true,selector:'app-profile-career-goals-page',imports:[ReactiveFormsModule],templateUrl:'./profile-career-goals-page.component.html',styleUrl:'./profile-setup.shared.css',changeDetection:ChangeDetectionStrategy.OnPush})
export class ProfileCareerGoalsPageComponent{
 private readonly draft=inject(ProfileDraftService);private readonly router=inject(Router);private readonly fb=inject(FormBuilder);readonly options=['Technical','Behavioral','Project-based','Voice mode'];
 readonly form=this.fb.nonNullable.group({targetRole:[this.draft.value().targetRole,Validators.required],industry:[this.draft.value().industry,Validators.required],location:[this.draft.value().location,Validators.required],careerGoal:[this.draft.value().careerGoal,Validators.required]});
 readonly selected=new Set(this.draft.value().preferences);
 toggle(value:string):void{this.selected.has(value)?this.selected.delete(value):this.selected.add(value);this.form.markAsDirty();}
 hasUnsavedChanges():boolean{return this.form.dirty;}
 back():void{this.draft.update({...this.form.getRawValue(),preferences:[...this.selected]});this.form.markAsPristine();void this.router.navigateByUrl('/onboarding/profile/education');}
 submit():void{if(this.form.invalid){this.form.markAllAsTouched();return;}this.draft.update({...this.form.getRawValue(),preferences:[...this.selected]});this.form.markAsPristine();void this.router.navigateByUrl('/onboarding/profile/review');}
}
