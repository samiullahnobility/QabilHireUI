import {
  ChangeDetectionStrategy,
  Component,
  inject,
  signal,
} from "@angular/core";
import {
  AbstractControl,
  FormBuilder,
  ReactiveFormsModule,
  ValidationErrors,
  Validators,
} from "@angular/forms";
import { ActivatedRoute, Router, RouterLink } from "@angular/router";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { MatButtonModule } from "@angular/material/button";
import { MatSelectModule } from "@angular/material/select";
import { finalize } from "rxjs";
import { AuthService } from "../../core/auth/auth.service";
import { NotificationService } from "../../core/services/notification.service";
import { ProfileDraftService } from "../onboarding/profile-draft.service";

type ProfileSection =
  | "personal"
  | "career"
  | "skills"
  | "interview"
  | "resume"
  | "security"
  | "privacy";

@Component({
  standalone: true,
  selector: "app-profile-section-page",
  imports: [
    ReactiveFormsModule,
    RouterLink,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
  ],
  templateUrl: "./profile-section-page.component.html",
  styleUrl: "./profile-section-page.component.css",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProfileSectionPageComponent {
  private readonly draft = inject(ProfileDraftService);
  private readonly auth = inject(AuthService);
  private readonly notifications = inject(NotificationService);
  private readonly fb = inject(FormBuilder);
  private readonly router = inject(Router);
  readonly section = inject(ActivatedRoute).snapshot.data[
    "section"
  ] as ProfileSection;
  readonly loading = signal(this.isEditable);
  readonly saving = signal(false);
  readonly preferenceOptions = [
    "Technical",
    "Behavioral",
    "Project-based",
    "Voice mode",
  ];
  readonly selected = new Set<string>();
  readonly selectedSkills = new Set<string>();
  readonly skillSearch = signal("");
  readonly skillGroups = [
    {
      label: "Web and app stacks",
      skills: [
        "ASP.NET Core",
        "C#",
        ".NET",
        ".NET Core",
        "Angular",
        "React",
        "TypeScript",
        "JavaScript",
        "HTML",
        "CSS",
        "SCSS",
        "Vue.js",
        "Next.js",
        "Nuxt.js",
        "Node.js",
        "Express.js",
        "NestJS",
        "Java",
        "Spring Boot",
        "Python",
        "Django",
        "Flask",
        "PHP",
        "Laravel",
        "Ruby on Rails",
        "Go",
        "Rust",
        "Kotlin",
        "Swift",
        "Objective-C",
        "Android",
        "iOS",
        "Flutter",
        "React Native",
        "Svelte",
        "Blazor",
        "SignalR",
        "REST APIs",
        "GraphQL",
        "gRPC",
        "Swagger / OpenAPI",
      ],
    },
    {
      label: "Data and analytics",
      skills: [
        "SQL Server",
        "PostgreSQL",
        "MySQL",
        "Oracle Database",
        "MongoDB",
        "Redis",
        "Elasticsearch",
        "Snowflake",
        "BigQuery",
        "Power BI",
        "Tableau",
        "Excel",
        "Data Analysis",
        "ETL",
        "Data Warehousing",
        "Power Query",
        "SSIS",
        "SSRS",
        "T-SQL",
        "PL/SQL",
        "LINQ",
        "Entity Framework Core",
        "Dapper",
      ],
    },
    {
      label: "Cloud and DevOps",
      skills: [
        "Azure",
        "AWS",
        "Google Cloud Platform",
        "Docker",
        "Kubernetes",
        "Helm",
        "Terraform",
        "Ansible",
        "CI/CD",
        "Jenkins",
        "Git",
        "GitHub",
        "GitLab",
        "GitHub Actions",
        "Azure DevOps",
        "Linux",
        "Networking",
        "Cloud Security",
        "Monitoring",
        "Troubleshooting",
        "Nginx",
        "Apache",
        "IIS",
        "Prometheus",
        "Grafana",
        "ELK Stack",
      ],
    },
    {
      label: "Testing and QA",
      skills: [
        "Manual Testing",
        "Functional Testing",
        "Regression Testing",
        "Smoke Testing",
        "Sanity Testing",
        "Integration Testing",
        "End-to-End Testing",
        "Exploratory Testing",
        "Cross-Browser Testing",
        "Cross-Device Testing",
        "API Testing",
        "Performance Testing",
        "Load Testing",
        "Stress Testing",
        "JMeter",
        "Postman",
        "Playwright",
        "Cypress",
        "Selenium",
        "Jest",
        "NUnit",
        "xUnit",
        "TDD",
        "BDD",
        "Test Planning",
        "Defect Management",
        "Test Case Design",
      ],
    },
    {
      label: "Healthcare and medical billing",
      skills: [
        "Medical Billing",
        "Medical Coding",
        "Revenue Cycle Management",
        "RCM",
        "ICD-10",
        "ICD-10-CM",
        "ICD-10-PCS",
        "CPT Coding",
        "HCPCS Coding",
        "Claims Submission",
        "Claims Scrubbing",
        "Eligibility Verification",
        "Insurance Verification",
        "Prior Authorization",
        "Denial Management",
        "Appeals",
        "Accounts Receivable",
        "A/R Follow-up",
        "Charge Capture",
        "Patient Scheduling",
        "Appointment Scheduling",
        "EHR",
        "EMR",
        "HIPAA Compliance",
        "Telehealth",
        "Medical Transcription",
        "Provider Enrollment",
        "Benefits Verification",
        "Collections",
        "Fee Schedule",
        "Reimbursement",
      ],
    },
    {
      label: "Finance and accounting",
      skills: [
        "Accounting",
        "Bookkeeping",
        "Accounts Payable",
        "Accounts Receivable",
        "Payroll",
        "Tax Preparation",
        "Financial Analysis",
        "Budgeting",
        "Forecasting",
        "IFRS",
        "GAAP",
        "QuickBooks",
        "SAP FI",
        "Oracle Finance",
        "Reconciliation",
        "Invoicing",
        "Audit Support",
      ],
    },
    {
      label: "Business and operations",
      skills: [
        "Sales",
        "Customer Support",
        "Customer Success",
        "CRM",
        "Salesforce",
        "HubSpot",
        "Lead Generation",
        "Digital Marketing",
        "SEO",
        "Content Writing",
        "Social Media Marketing",
        "Product Management",
        "Business Analysis",
        "HR",
        "Recruiting",
        "Talent Acquisition",
        "Procurement",
        "Inventory Management",
        "Supply Chain",
        "Logistics",
        "Warehouse Management",
        "Retail Operations",
        "Hospitality",
        "Real Estate",
        "Legal Research",
        "Education",
        "Training",
        "Project Management",
        "Risk Management",
        "Administration",
        "Executive Assistance",
        "Data Entry",
        "Customer Service",
        "Telecommunications",
        "Insurance",
        "Manufacturing",
        "Public Sector",
      ],
    },
    {
      label: "Legal and compliance",
      skills: [
        "Contract Drafting",
        "Contract Review",
        "Litigation Support",
        "Case Management",
        "Legal Research",
        "Compliance",
        "Regulatory Affairs",
        "Corporate Law",
        "Labor Law",
        "Intellectual Property",
        "Trademark",
        "Patent",
        "Paralegal",
        "Discovery",
        "Document Review",
        "E-discovery",
        "Notary",
        "Legal Writing",
        "Policy Development",
        "Risk and Compliance",
      ],
    },
    {
      label: "Construction and engineering",
      skills: [
        "Construction Management",
        "Civil Engineering",
        "Electrical Engineering",
        "Mechanical Engineering",
        "Architectural Design",
        "AutoCAD",
        "Revit",
        "BIM",
        "Quantity Surveying",
        "Site Supervision",
        "Project Scheduling",
        "Estimating",
        "Procurement Planning",
        "Health and Safety",
        "QA/QC",
        "HVAC",
        "Plumbing",
        "Structural Analysis",
        "Surveying",
        "Tender Preparation",
      ],
    },
    {
      label: "Telecom and networking",
      skills: [
        "Telecommunications",
        "VoIP",
        "5G",
        "4G LTE",
        "Network Administration",
        "Routing",
        "Switching",
        "Cisco",
        "Juniper",
        "WAN",
        "LAN",
        "Fiber Optics",
        "RF Planning",
        "NOC Operations",
        "SIP",
        "PBX",
        "Call Center Operations",
        "Field Support",
      ],
    },
    {
      label: "Manufacturing and supply chain",
      skills: [
        "Manufacturing",
        "Production Planning",
        "Lean Manufacturing",
        "Six Sigma",
        "Quality Control",
        "Quality Assurance",
        "Process Improvement",
        "Warehouse Management",
        "Inventory Control",
        "Materials Management",
        "Procurement",
        "Supply Chain Planning",
        "Demand Forecasting",
        "MRP",
        "ERP",
        "SAP MM",
        "Oracle SCM",
        "Shipping",
        "Receiving",
        "Freight",
        "Import Export",
      ],
    },
    {
      label: "Travel and hospitality",
      skills: [
        "Hotel Operations",
        "Front Desk",
        "Guest Relations",
        "Tourism",
        "Travel Planning",
        "Reservation Systems",
        "Amadeus",
        "Sabre",
        "Ticketing",
        "Airline Operations",
        "Event Management",
        "Catering",
        "Food and Beverage",
        "Housekeeping",
        "Concierge",
        "Customer Experience",
      ],
    },
    {
      label: "Pharma and life sciences",
      skills: [
        "Pharmaceutical Sales",
        "Clinical Research",
        "Clinical Trials",
        "Drug Safety",
        "Pharmacovigilance",
        "Pharmacy",
        "Bioinformatics",
        "Healthcare Compliance",
        "GxP",
        "FDA Compliance",
        "Medical Affairs",
        "Lab Operations",
        "Biotechnology",
        "Quality Assurance",
        "Regulatory Submission",
      ],
    },
  ] as const;
  readonly filteredSkillGroups = () => {
    const q = this.skillSearch().trim().toLowerCase();
    return q
      ? this.skillGroups
          .map((group) => ({
            label: group.label,
            skills: group.skills.filter((skill) =>
              skill.toLowerCase().includes(q),
            ),
          }))
          .filter((group) => group.skills.length > 0)
      : this.skillGroups.map((group) => ({
          label: group.label,
          skills: [...group.skills],
        }));
  };
  readonly skillCount = () =>
    this.filteredSkillGroups().reduce(
      (total, group) => total + group.skills.length,
      0,
    );
  readonly expandedGroups = signal<Set<string>>(new Set());
  submitAttempted = false;
  readonly form = this.fb.nonNullable.group({
    headline: ["", Validators.required],
    experienceLevel: ["", Validators.required],
    education: ["", Validators.required],
    currentRole: ["", Validators.required],
    linkedInUrl: [""],
    portfolioUrl: [""],
    targetRole: ["", Validators.required],
    industry: ["", Validators.required],
    location: ["", Validators.required],
    careerGoal: ["", Validators.required],
    qualification: ["", Validators.required],
    institution: ["", Validators.required],
    graduationYear: [""],
    company: ["", Validators.required],
    experienceDuration: [""],
    responsibilities: ["", Validators.required],
    achievement: ["", Validators.required],
    skills: ["", Validators.required],
    skillLevel: [""],
  });
  readonly passwordForm = this.fb.nonNullable.group(
    {
      currentPassword: ["", Validators.required],
      newPassword: [
        "",
        [Validators.required, Validators.minLength(8), Validators.maxLength(128)],
      ],
      confirmPassword: ["", Validators.required],
    },
    { validators: this.passwordsMatch },
  );
  passwordSubmitted = false;
  readonly securityBusy = signal(false);
  readonly exporting = signal(false);
  readonly confirmingDataDelete = signal(false);
  readonly deletingData = signal(false);
  readonly confirmingAccountDelete = signal(false);
  readonly deletingAccount = signal(false);

  constructor() {
    if (this.isEditable) {
      this.draft
        .load()
        .pipe(finalize(() => this.loading.set(false)))
        .subscribe({
          next: () => this.populate(),
          error: (error) =>
            this.notifications.error(error, "Unable to load your profile."),
        });
    }
  }

  get isEditable(): boolean {
    return ["personal", "career", "skills", "interview"].includes(this.section);
  }
  get title(): string {
    return (
      {
        personal: "Personal information",
        career: "Career preferences",
        skills: "Skills & experience",
        interview: "Interview preferences",
        resume: "Resume management",
        security: "Password & security",
        privacy: "Privacy & data",
      } as const
    )[this.section];
  }
  get subtitle(): string {
    return (
      {
        personal: "Keep your identity and professional links up to date",
        career: "Define the opportunities you want to prepare for",
        skills: "Maintain your education, work history, and expertise",
        interview: "Control how your mock interviews are personalized",
        resume: "Keep the resume used for analysis current",
        security: "Protect your account and manage access",
        privacy: "Control your personal information and account data",
      } as const
    )[this.section];
  }
  togglePreference(value: string): void {
    this.selected.has(value)
      ? this.selected.delete(value)
      : this.selected.add(value);
    this.form.markAsDirty();
  }
  toggleSkill(skill: string): void {
    this.selectedSkills.has(skill)
      ? this.selectedSkills.delete(skill)
      : this.selectedSkills.add(skill);
    this.syncSkills();
  }
  isGroupExpanded(label: string): boolean {
    return (
      this.skillSearch().trim().length > 0 || this.expandedGroups().has(label)
    );
  }
  toggleGroup(label: string): void {
    const next = new Set(this.expandedGroups());
    next.has(label) ? next.delete(label) : next.add(label);
    this.expandedGroups.set(next);
  }
  expandAllGroups(): void {
    this.expandedGroups.set(
      new Set(this.skillGroups.map((group) => group.label)),
    );
  }
  collapseAllGroups(): void {
    this.expandedGroups.set(new Set());
  }
  hasUnsavedChanges(): boolean {
    return this.isEditable && this.form.dirty;
  }
  save(): void {
    this.submitAttempted = true;
    if (!this.isEditable || this.saving()) {
      return;
    }
    const value = this.form.getRawValue();
    this.draft.update({
      ...value,
      skills: value.skills
        .split(",")
        .map((x) => x.trim())
        .filter(Boolean),
      preferences: [...this.selected],
    });
    this.saving.set(true);
    this.draft
      .save()
      .pipe(finalize(() => this.saving.set(false)))
      .subscribe({
        next: () => {
          this.form.markAsPristine();
          this.submitAttempted = false;
          this.notifications.success(`${this.title} updated.`);
        },
        error: (error) =>
          this.notifications.error(error, "Unable to update your profile."),
      });
  }
  changePassword(): void {
    this.passwordSubmitted = true;
    if (this.passwordForm.invalid || this.securityBusy()) {
      return;
    }
    this.securityBusy.set(true);
    this.auth
      .changePassword(this.passwordForm.getRawValue())
      .pipe(finalize(() => this.securityBusy.set(false)))
      .subscribe({
        next: (response) => {
          this.notifications.success(response.message);
          this.auth.clearLocalSession();
          this.router.navigate(["/auth/login"]);
        },
        error: (error) =>
          this.notifications.error(error, "Unable to change your password."),
      });
  }
  exportData(): void {
    if (this.exporting()) {
      return;
    }
    this.exporting.set(true);
    this.auth
      .exportData()
      .pipe(finalize(() => this.exporting.set(false)))
      .subscribe({
        next: (data) => {
          const blob = new Blob([JSON.stringify(data, null, 2)], {
            type: "application/json",
          });
          const url = URL.createObjectURL(blob);
          const anchor = document.createElement("a");
          anchor.href = url;
          anchor.download = "qabilhire-data-export.json";
          anchor.click();
          URL.revokeObjectURL(url);
          this.notifications.success("Your data export was downloaded.");
        },
        error: (error) =>
          this.notifications.error(error, "Unable to export your data."),
      });
  }
  deleteAllData(): void {
    if (this.deletingData()) {
      return;
    }
    this.deletingData.set(true);
    this.auth
      .deleteAllData()
      .pipe(finalize(() => this.deletingData.set(false)))
      .subscribe({
        next: () => {
          this.confirmingDataDelete.set(false);
          this.notifications.success("All of your stored data was deleted.");
        },
        error: (error) =>
          this.notifications.error(error, "Unable to delete your data."),
      });
  }
  deleteAccount(): void {
    if (this.deletingAccount()) {
      return;
    }
    this.deletingAccount.set(true);
    this.auth
      .deleteAccount()
      .pipe(finalize(() => this.deletingAccount.set(false)))
      .subscribe({
        next: () => {
          this.notifications.success("Your account was deleted.");
          this.router.navigate(["/"]);
        },
        error: (error) =>
          this.notifications.error(error, "Unable to delete your account."),
      });
  }
  private passwordsMatch(group: AbstractControl): ValidationErrors | null {
    const password = group.get("newPassword")?.value;
    const confirm = group.get("confirmPassword")?.value;
    return password && confirm && password !== confirm
      ? { mismatch: true }
      : null;
  }
  private syncSkills(): void {
    this.form.controls.skills.setValue([...this.selectedSkills].join(", "), {
      emitEvent: false,
    });
    this.form.controls.skills.markAsDirty();
  }
  private populate(): void {
    const p = this.draft.value();
    this.form.patchValue({
      ...p,
      skills: p.skills.join(", "),
      skillLevel: p.skillLevel || "",
    });
    this.selectedSkills.clear();
    p.skills.forEach((x) => this.selectedSkills.add(x));
    this.selected.clear();
    p.preferences.forEach((x) => this.selected.add(x));
    this.form.controls.skills.setValue([...this.selectedSkills].join(", "), {
      emitEvent: false,
    });
    this.form.markAsPristine();
  }
}
