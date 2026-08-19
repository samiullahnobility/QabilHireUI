import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({standalone:true,selector:'app-profile-management-page',imports:[RouterLink],templateUrl:'./profile-management-page.component.html',styleUrl:'./profile-management-page.component.css',changeDetection:ChangeDetectionStrategy.OnPush})
export class ProfileManagementPageComponent{
 readonly sections=[
  {title:'Personal Information',description:'Review and update saved information',link:'/app/profile/personal'},
  {title:'Career Preferences',description:'Review and update your career direction',link:'/app/profile/career'},
  {title:'Skills & Experience',description:'Manage education, experience, and skills',link:'/app/profile/skills-experience'},
  {title:'Resume Management',description:'Upload and manage your saved resume',link:'/app/profile/resume'},
  {title:'Interview Preferences',description:'Choose the interview formats you want to practise',link:'/app/profile/interview-preferences'},
  {title:'Password & Security',description:'Manage password and active sessions',link:'/app/profile/security'},
  {title:'Privacy & Data',description:'Download or permanently delete your data',link:'/app/profile/privacy'}
 ];
}
