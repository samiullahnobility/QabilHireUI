import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { InterviewApiService } from './interview-api.service';
import { InterviewResult } from './interview.models';
@Component({standalone:true,selector:'app-interview-feedback-page',imports:[MatButtonModule,RouterLink],templateUrl:'./interview-feedback-page.component.html',styleUrl:'./interview-feedback.component.css',changeDetection:ChangeDetectionStrategy.OnPush})
export class InterviewFeedbackPageComponent{private readonly route=inject(ActivatedRoute);private readonly api=inject(InterviewApiService);readonly id=this.route.snapshot.paramMap.get('id')!;readonly result=signal<InterviewResult|null>(null);readonly failed=signal(false);readonly expanded=signal<string|null>(null);constructor(){this.api.results(this.id).subscribe({next:r=>this.result.set(r),error:()=>this.failed.set(true)});}toggle(id:string):void{this.expanded.update(v=>v===id?null:id);}}
