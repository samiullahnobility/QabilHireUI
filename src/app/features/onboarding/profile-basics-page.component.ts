import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ProfileDraftService } from './profile-draft.service';

@Component({standalone:true,selector:'app-profile-basics-page',imports:[ReactiveFormsModule],templateUrl:'./profile-basics-page.component.html',styleUrls:['./profile-setup.shared.css','./profile-basics-page.component.css'],changeDetection:ChangeDetectionStrategy.OnPush})
export class ProfileBasicsPageComponent{
 private readonly draft=inject(ProfileDraftService);private readonly router=inject(Router);private readonly fb=inject(FormBuilder);
 readonly form=this.fb.nonNullable.group({headline:[this.draft.value().headline,Validators.required],experienceLevel:[this.draft.value().experienceLevel,Validators.required],education:[this.draft.value().education,Validators.required],currentRole:[this.draft.value().currentRole,Validators.required],skills:[this.draft.value().skills.join(', '),Validators.required]});
 hasUnsavedChanges():boolean{return this.form.dirty;}
 submit():void{if(this.form.invalid){this.form.markAllAsTouched();return;}const v=this.form.getRawValue();this.draft.update({...v,skills:v.skills.split(',').map(x=>x.trim()).filter(Boolean)});this.form.markAsPristine();void this.router.navigateByUrl('/onboarding/profile/experience');}
}
