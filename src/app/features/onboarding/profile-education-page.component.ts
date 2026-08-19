import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { ProfileDraftService } from './profile-draft.service';

@Component({standalone:true,selector:'app-profile-education-page',templateUrl:'./profile-education-page.component.html',styleUrl:'./profile-setup.shared.css',changeDetection:ChangeDetectionStrategy.OnPush})
export class ProfileEducationPageComponent{
 private readonly draft=inject(ProfileDraftService);private readonly router=inject(Router);
 readonly search=signal('');readonly levels=['Learning','Working knowledge','Proficient','Expert'];readonly skills=['ASP.NET Core','C#','Angular','SQL Server','REST APIs','React','PostgreSQL','Azure','System Design','Git'];readonly suggested=['Entity Framework Core','JWT Authentication','Third-party integrations'];readonly selected=new Set(this.draft.value().skills);readonly level=signal(this.draft.value().skillLevel||'Proficient');readonly dirty=signal(false);
 filteredSkills():string[]{const q=this.search().trim().toLowerCase();return q?this.skills.filter(x=>x.toLowerCase().includes(q)):this.skills;}
 toggle(skill:string):void{this.selected.has(skill)?this.selected.delete(skill):this.selected.add(skill);this.dirty.set(true);}
 chooseLevel(level:string):void{this.level.set(level);this.dirty.set(true);}
 hasUnsavedChanges():boolean{return this.dirty();}
 back():void{this.persist();void this.router.navigateByUrl('/onboarding/profile/experience');}
 submit():void{this.persist();void this.router.navigateByUrl('/onboarding/profile/career-goals');}
 private persist():void{this.draft.update({skills:[...this.selected],skillLevel:this.level()});this.dirty.set(false);}
}
