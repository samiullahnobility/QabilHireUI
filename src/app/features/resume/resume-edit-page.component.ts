import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { finalize, switchMap } from 'rxjs';
import { NotificationService } from '../../core/services/notification.service';
import { ResumeApiService } from './resume-api.service';
import { ResumeExtractedData, ResumeResponse } from './resume-api.models';

@Component({
  standalone: true,
  selector: 'app-resume-edit-page',
  imports: [FormsModule, MatButtonModule, MatFormFieldModule, MatInputModule],
  templateUrl: './resume-edit-page.component.html',
  styleUrl: './resume-edit-page.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ResumeEditPageComponent {
  private readonly api = inject(ResumeApiService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly notifications = inject(NotificationService);
  readonly loading = signal(true);
  readonly saving = signal(false);
  readonly extracting = signal(false);
  readonly resume = signal<ResumeResponse | null>(null);
  readonly data = signal<ResumeExtractedData>(this.emptyData());
  readonly issues = computed(() => {
    const data = this.data();
    const issues: string[] = [];
    if (!data.contact.name.trim()) issues.push('Name needs review.');
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.contact.email)) issues.push('Enter a valid email address.');
    if (!data.experience.length) issues.push('No experience entries were detected.');
    if (!data.education.length) issues.push('No education entries were detected.');
    if (!data.skills.length) issues.push('No skills were detected.');
    return issues;
  });
  readonly hasBlockingIssues = computed(() => this.issues().some(issue => issue.includes('valid email')));

  constructor() {
    const id = this.route.snapshot.paramMap.get('id')!;
    this.api.get(id).pipe(finalize(() => this.loading.set(false))).subscribe({
      next: current => {
        this.resume.set(current);
        try { this.data.set(current.extractedJson ? JSON.parse(current.extractedJson) : this.emptyData()); }
        catch { this.data.set(this.emptyData()); }
      },
      error: error => this.notifications.error(error, 'Unable to load extracted resume data.')
    });
  }

  save(): void {
    const current = this.resume();
    if (!current || this.hasBlockingIssues()) return;
    this.saving.set(true);
    this.api.updateExtractedData(current.id, JSON.stringify(this.data())).pipe(
      switchMap(() => this.api.analyze(current.id)),
      finalize(() => this.saving.set(false))
    ).subscribe({
      next: next => {
        this.resume.set(next);
        this.notifications.success('Resume confirmed and analyzed.');
        void this.router.navigate(['/app/resume', next.id, 'analysis']);
      },
      error: error => this.notifications.error(error, 'Unable to save corrections.')
    });
  }

  reExtract(): void {
    const current = this.resume();
    if (!current) return;
    this.extracting.set(true);
    this.api.extract(current.id).pipe(finalize(() => this.extracting.set(false))).subscribe({
      next: resume => {
        this.resume.set(resume);
        this.data.set(resume.extractedJson ? JSON.parse(resume.extractedJson) : this.emptyData());
        this.notifications.success('Resume extracted again.');
      },
      error: error => this.notifications.error(error, 'Unable to extract the resume again.')
    });
  }

  setList(field: keyof Pick<ResumeExtractedData, 'skills' | 'experience' | 'education' | 'projects' | 'certifications' | 'languages' | 'additional'>, value: string): void {
    this.data.update(data => ({ ...data, [field]: value.split('\n').map(item => item.trim()).filter(Boolean) }));
  }

  updateItem(field: ListField, index: number, value: string): void {
    this.data.update(data => ({ ...data, [field]: data[field].map((item, itemIndex) => itemIndex === index ? value : item) }));
  }

  addItem(field: ListField): void {
    this.data.update(data => ({ ...data, [field]: [...data[field], ''] }));
  }

  removeItem(field: ListField, index: number): void {
    this.data.update(data => ({ ...data, [field]: data[field].filter((_, itemIndex) => itemIndex !== index) }));
  }

  moveItem(field: ListField, index: number, direction: -1 | 1): void {
    const target = index + direction;
    if (target < 0 || target >= this.data()[field].length) return;
    this.data.update(data => {
      const items = [...data[field]];
      [items[index], items[target]] = [items[target], items[index]];
      return { ...data, [field]: items };
    });
  }

  private emptyData(): ResumeExtractedData {
    return { contact: { name: '', email: '', phone: '', linkedIn: '', website: '' }, summary: '', skills: [], experience: [], education: [], projects: [], certifications: [], languages: [], additional: [] };
  }
}

type ListField = 'experience' | 'education' | 'projects' | 'certifications' | 'languages' | 'additional';
