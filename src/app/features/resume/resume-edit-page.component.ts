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
    const categories = new Set(data.sections.map(section => section.category));
    const issues: string[] = [];
    if (!data.contact.name.trim()) issues.push('Name needs review.');
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.contact.email)) issues.push('Enter a valid email address.');
    if (!categories.has('experience')) issues.push('No experience section was detected.');
    if (!categories.has('education')) issues.push('No education section was detected.');
    if (!categories.has('skills')) issues.push('No skills section was detected.');
    return issues;
  });
  readonly hasBlockingIssues = computed(() => this.issues().some(issue => issue.includes('valid email')));

  constructor() {
    const id = this.route.snapshot.paramMap.get('id')!;
    this.api.get(id).pipe(finalize(() => this.loading.set(false))).subscribe({
      next: current => {
        this.resume.set(current);
        try { this.data.set(this.normalizeData(current.extractedJson ? JSON.parse(current.extractedJson) : this.emptyData())); }
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
        this.data.set(this.normalizeData(resume.extractedJson ? JSON.parse(resume.extractedJson) : this.emptyData()));
        this.notifications.success('Resume extracted again.');
      },
      error: error => this.notifications.error(error, 'Unable to extract the resume again.')
    });
  }

  updateHeading(sectionIndex: number, heading: string): void {
    this.data.update(data => ({ ...data, sections: data.sections.map((section, index) => index === sectionIndex ? { ...section, heading } : section) }));
  }

  updateItem(sectionIndex: number, itemIndex: number, value: string): void {
    this.data.update(data => ({ ...data, sections: data.sections.map((section, index) => index === sectionIndex ? { ...section, items: section.items.map((item, childIndex) => childIndex === itemIndex ? value : item) } : section) }));
  }

  addItem(sectionIndex: number): void {
    this.data.update(data => ({ ...data, sections: data.sections.map((section, index) => index === sectionIndex ? { ...section, items: [...section.items, ''] } : section) }));
  }

  removeItem(sectionIndex: number, itemIndex: number): void {
    this.data.update(data => ({ ...data, sections: data.sections.map((section, index) => index === sectionIndex ? { ...section, items: section.items.filter((_, childIndex) => childIndex !== itemIndex) } : section) }));
  }

  moveItem(sectionIndex: number, itemIndex: number, direction: -1 | 1): void {
    const target = itemIndex + direction;
    const section = this.data().sections[sectionIndex];
    if (target < 0 || target >= section.items.length) return;
    this.data.update(data => {
      const sections = [...data.sections];
      const items = [...sections[sectionIndex].items];
      [items[itemIndex], items[target]] = [items[target], items[itemIndex]];
      sections[sectionIndex] = { ...sections[sectionIndex], items };
      return { ...data, sections };
    });
  }

  removeSection(sectionIndex: number): void {
    this.data.update(data => ({ ...data, sections: data.sections.filter((_, index) => index !== sectionIndex) }));
  }

  private emptyData(): ResumeExtractedData {
    return { contact: { name: '', email: '', phone: '', linkedIn: '', website: '' }, sections: [] };
  }

  private normalizeData(value: any): ResumeExtractedData {
    if (Array.isArray(value?.sections)) return value;
    const headings: Record<string, string> = { summary: 'Professional Summary', skills: 'Skills', experience: 'Experience', education: 'Education', projects: 'Projects', certifications: 'Certifications', languages: 'Languages', additional: 'Additional Information' };
    const sections = Object.entries(headings).flatMap(([category, heading]) => {
      const source = value?.[category];
      const items = Array.isArray(source) ? source : source ? [source] : [];
      return items.length ? [{ heading, category, items }] : [];
    });
    return { contact: value?.contact ?? this.emptyData().contact, sections };
  }
}
