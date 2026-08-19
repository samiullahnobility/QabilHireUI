import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ProfileDraftService } from './profile-draft.service';

@Component({standalone:true,selector:'app-profile-education-page',imports:[ReactiveFormsModule],templateUrl:'./profile-education-page.component.html',styleUrl:'./profile-setup.shared.css',changeDetection:ChangeDetectionStrategy.OnPush})
export class ProfileEducationPageComponent{
 private readonly draft=inject(ProfileDraftService);private readonly router=inject(Router);private readonly fb=inject(FormBuilder);
 readonly form=this.fb.nonNullable.group({institution:[this.draft.value().institution,Validators.required],qualification:[this.draft.value().qualification,Validators.required],linkedInUrl:[this.draft.value().linkedInUrl],portfolioUrl:[this.draft.value().portfolioUrl]});
 hasUnsavedChanges():boolean{return this.form.dirty;}
 back():void{this.draft.update(this.form.getRawValue());this.form.markAsPristine();void this.router.navigateByUrl('/onboarding/profile/experience');}
 submit():void{if(this.form.invalid){this.form.markAllAsTouched();return;}this.draft.update(this.form.getRawValue());this.form.markAsPristine();void this.router.navigateByUrl('/onboarding/profile/career-goals');}
}
