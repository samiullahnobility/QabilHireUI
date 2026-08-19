import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ProfileDraftService } from './profile-draft.service';

@Component({standalone:true,selector:'app-profile-experience-page',imports:[ReactiveFormsModule],templateUrl:'./profile-experience-page.component.html',styleUrl:'./profile-setup.shared.css',changeDetection:ChangeDetectionStrategy.OnPush})
export class ProfileExperiencePageComponent{
 private readonly draft=inject(ProfileDraftService);private readonly router=inject(Router);private readonly fb=inject(FormBuilder);
 readonly form=this.fb.nonNullable.group({company:[this.draft.value().company,Validators.required],responsibilities:[this.draft.value().responsibilities,Validators.required],achievement:[this.draft.value().achievement,Validators.required]});
 hasUnsavedChanges():boolean{return this.form.dirty;}
 back():void{this.draft.update(this.form.getRawValue());this.form.markAsPristine();void this.router.navigateByUrl('/onboarding/profile');}
 submit():void{if(this.form.invalid){this.form.markAllAsTouched();return;}this.draft.update(this.form.getRawValue());this.form.markAsPristine();void this.router.navigateByUrl('/onboarding/profile/education');}
}
