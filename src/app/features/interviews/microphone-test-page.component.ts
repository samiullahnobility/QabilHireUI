import { ChangeDetectionStrategy, Component, OnDestroy, inject, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { ActivatedRoute, Router } from '@angular/router';
import { finalize } from 'rxjs';
import { NotificationService } from '../../core/services/notification.service';
import { InterviewApiService } from './interview-api.service';

@Component({ standalone:true, selector:'app-microphone-test-page', imports:[MatButtonModule], templateUrl:'./microphone-test-page.component.html', styleUrl:'./interview-room.component.css', changeDetection:ChangeDetectionStrategy.OnPush })
export class MicrophoneTestPageComponent implements OnDestroy {
  private readonly route=inject(ActivatedRoute); private readonly router=inject(Router); private readonly api=inject(InterviewApiService); private readonly notifications=inject(NotificationService);
  private stream:MediaStream|null=null; private context:AudioContext|null=null; private frame=0;
  readonly id=this.route.snapshot.paramMap.get('id')!; readonly testing=signal(false); readonly granted=signal(false); readonly blocked=signal(false); readonly level=signal(0); readonly starting=signal(false);
  async test():Promise<void>{this.stop();this.testing.set(true);this.blocked.set(false);try{this.stream=await navigator.mediaDevices.getUserMedia({audio:true});this.granted.set(true);this.context=new AudioContext();const source=this.context.createMediaStreamSource(this.stream);const analyser=this.context.createAnalyser();analyser.fftSize=256;source.connect(analyser);const data=new Uint8Array(analyser.frequencyBinCount);const sample=()=>{analyser.getByteFrequencyData(data);this.level.set(Math.min(100,Math.round(data.reduce((a,b)=>a+b,0)/data.length)));this.frame=requestAnimationFrame(sample);};sample();}catch{this.blocked.set(true);this.granted.set(false);}finally{this.testing.set(false);}}
  continue():void{this.starting.set(true);this.stop();this.api.start(this.id).pipe(finalize(()=>this.starting.set(false))).subscribe({next:()=>void this.router.navigate(['/app/interviews',this.id,'room']),error:error=>this.notifications.error(error,'Unable to start this interview.')});}
  useText():void{this.starting.set(true);this.stop();this.api.start(this.id).pipe(finalize(()=>this.starting.set(false))).subscribe({next:()=>void this.router.navigate(['/app/interviews',this.id,'room'],{queryParams:{textFallback:'true'}}),error:error=>this.notifications.error(error,'Unable to start this interview.')});}
  private stop():void{if(this.frame)cancelAnimationFrame(this.frame);this.stream?.getTracks().forEach(track=>track.stop());void this.context?.close();this.stream=null;this.context=null;}
  ngOnDestroy():void{this.stop();}
}
