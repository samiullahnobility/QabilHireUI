import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { ProfileDraftService } from './profile-draft.service';

@Component({standalone:true,selector:'app-profile-education-page',imports:[MatButtonModule],templateUrl:'./profile-education-page.component.html',styleUrl:'./profile-setup.shared.css',changeDetection:ChangeDetectionStrategy.OnPush})
export class ProfileEducationPageComponent{
 private readonly draft=inject(ProfileDraftService);private readonly router=inject(Router);
 readonly search=signal('');
 readonly levels=['Learning','Working knowledge','Proficient','Expert'];
 readonly skillGroups=[
   {label:'Web and app stacks',skills:['ASP.NET Core','C#','.NET','.NET Core','Angular','React','TypeScript','JavaScript','HTML','CSS','SCSS','Vue.js','Next.js','Nuxt.js','Node.js','Express.js','NestJS','Java','Spring Boot','Python','Django','Flask','PHP','Laravel','Ruby on Rails','Go','Rust','Kotlin','Swift','Objective-C','Android','iOS','Flutter','React Native','Svelte','Blazor','SignalR','REST APIs','GraphQL','gRPC','Swagger / OpenAPI']},
   {label:'Data and analytics',skills:['SQL Server','PostgreSQL','MySQL','Oracle Database','MongoDB','Redis','Elasticsearch','Snowflake','BigQuery','Power BI','Tableau','Excel','Data Analysis','ETL','Data Warehousing','Power Query','SSIS','SSRS','T-SQL','PL/SQL','LINQ','Entity Framework Core','Dapper']},
   {label:'Cloud and DevOps',skills:['Azure','AWS','Google Cloud Platform','Docker','Kubernetes','Helm','Terraform','Ansible','CI/CD','Jenkins','Git','GitHub','GitLab','GitHub Actions','Azure DevOps','Linux','Networking','Cloud Security','Monitoring','Troubleshooting','Nginx','Apache','IIS','Prometheus','Grafana','ELK Stack']},
   {label:'Testing and QA',skills:['Manual Testing','Functional Testing','Regression Testing','Smoke Testing','Sanity Testing','Integration Testing','End-to-End Testing','Exploratory Testing','Cross-Browser Testing','Cross-Device Testing','API Testing','Performance Testing','Load Testing','Stress Testing','JMeter','Postman','Playwright','Cypress','Selenium','Jest','NUnit','xUnit','TDD','BDD','Test Planning','Defect Management','Test Case Design']},
   {label:'Security and architecture',skills:['OAuth 2.0','JWT Authentication','SSO','IAM','OWASP','Penetration Testing','Threat Modeling','App Security','Debugging','Problem Solving','Communication','Agile Scrum','Jira','Confluence','Figma','System Design','Design Patterns','Clean Architecture','Microservices','Observability']},
   {label:'Healthcare and medical billing',skills:['Medical Billing','Medical Coding','Revenue Cycle Management','RCM','ICD-10','ICD-10-CM','ICD-10-PCS','CPT Coding','HCPCS Coding','Claims Submission','Claims Scrubbing','Eligibility Verification','Insurance Verification','Prior Authorization','Denial Management','Appeals','Accounts Receivable','A/R Follow-up','Charge Capture','Patient Scheduling','Appointment Scheduling','EHR','EMR','HIPAA Compliance','Telehealth','Medical Transcription','Provider Enrollment','Benefits Verification','Collections','Fee Schedule','Reimbursement']},
   {label:'Finance and accounting',skills:['Accounting','Bookkeeping','Accounts Payable','Accounts Receivable','Payroll','Tax Preparation','Financial Analysis','Budgeting','Forecasting','IFRS','GAAP','QuickBooks','SAP FI','Oracle Finance','Reconciliation','Invoicing','Audit Support']},
   {label:'Business and operations',skills:['Sales','Customer Support','Customer Success','CRM','Salesforce','HubSpot','Lead Generation','Digital Marketing','SEO','Content Writing','Social Media Marketing','Product Management','Business Analysis','HR','Recruiting','Talent Acquisition','Procurement','Inventory Management','Supply Chain','Logistics','Warehouse Management','Retail Operations','Hospitality','Real Estate','Legal Research','Education','Training','Project Management','Risk Management','Administration','Executive Assistance','Data Entry','Customer Service','Telecommunications','Insurance','Manufacturing','Public Sector']},
   {label:'Legal and compliance',skills:['Contract Drafting','Contract Review','Litigation Support','Case Management','Legal Research','Compliance','Regulatory Affairs','Corporate Law','Labor Law','Intellectual Property','Trademark','Patent','Paralegal','Discovery','Document Review','E-discovery','Notary','Legal Writing','Policy Development','Risk and Compliance']},
   {label:'Education and learning',skills:['Curriculum Development','Instructional Design','Classroom Management','Lesson Planning','Assessment Design','EdTech','Student Counseling','Academic Advising','LMS Administration','Moodle','Google Classroom','Blackboard','Zoom Teaching','Teacher Training','Special Education','Child Development','Research Methods']},
   {label:'Construction and engineering',skills:['Construction Management','Civil Engineering','Electrical Engineering','Mechanical Engineering','Architectural Design','AutoCAD','Revit','BIM','Quantity Surveying','Site Supervision','Project Scheduling','Estimating','Procurement Planning','Health and Safety','QA/QC','HVAC','Plumbing','Structural Analysis','Surveying','Tender Preparation']},
   {label:'Telecom and networking',skills:['Telecommunications','VoIP','5G','4G LTE','Network Administration','Routing','Switching','Cisco','Juniper','WAN','LAN','Fiber Optics','RF Planning','NOC Operations','SIP','PBX','Call Center Operations','Field Support']},
   {label:'Manufacturing and supply chain',skills:['Manufacturing','Production Planning','Lean Manufacturing','Six Sigma','Quality Control','Quality Assurance','Process Improvement','Warehouse Management','Inventory Control','Materials Management','Procurement','Supply Chain Planning','Demand Forecasting','MRP','ERP','SAP MM','Oracle SCM','Shipping','Receiving','Freight','Import Export']},
   {label:'Travel and hospitality',skills:['Hotel Operations','Front Desk','Guest Relations','Tourism','Travel Planning','Reservation Systems','Amadeus','Sabre','Ticketing','Airline Operations','Event Management','Catering','Food and Beverage','Housekeeping','Concierge','Customer Experience']},
   {label:'Pharma and life sciences',skills:['Pharmaceutical Sales','Clinical Research','Clinical Trials','Drug Safety','Pharmacovigilance','Pharmacy','Bioinformatics','Healthcare Compliance','GxP','FDA Compliance','Medical Affairs','Lab Operations','Biotechnology','Quality Assurance','Regulatory Submission']},
 ] as const;
 readonly skills=this.skillGroups.flatMap(group=>group.skills);
 readonly suggested=['Entity Framework Core','JWT Authentication','Third-party integrations'];
 readonly selected=new Set(this.draft.value().skills);
 readonly expandedGroups=signal<Set<string>>(new Set());
 readonly level=signal(this.draft.value().skillLevel||'Proficient');
 readonly dirty=signal(false);
 filteredGroups():{label:string;skills:string[]}[]{const q=this.search().trim().toLowerCase();return q?this.skillGroups.map(group=>({label:group.label,skills:group.skills.filter(skill=>skill.toLowerCase().includes(q))})).filter(group=>group.skills.length>0):this.skillGroups.map(group=>({label:group.label,skills:[...group.skills]}));}
 filteredSkillCount():number{return this.filteredGroups().reduce((total,group)=>total+group.skills.length,0);}
 isGroupExpanded(label:string):boolean{return this.search().trim().length>0||this.expandedGroups().has(label);}
 toggleGroup(label:string):void{const next=new Set(this.expandedGroups());next.has(label)?next.delete(label):next.add(label);this.expandedGroups.set(next);}
 expandAllGroups():void{this.expandedGroups.set(new Set(this.skillGroups.map(group=>group.label)));}
 collapseAllGroups():void{this.expandedGroups.set(new Set());}
 toggle(skill:string):void{this.selected.has(skill)?this.selected.delete(skill):this.selected.add(skill);this.dirty.set(true);}
 chooseLevel(level:string):void{this.level.set(level);this.dirty.set(true);}
 hasUnsavedChanges():boolean{return this.dirty();}
 back():void{this.persist();void this.router.navigateByUrl('/onboarding/profile/experience');}
 submit():void{this.persist();void this.router.navigateByUrl('/onboarding/profile/career-goals');}
 private persist():void{this.draft.update({skills:[...this.selected],skillLevel:this.level()});this.dirty.set(false);}
}
