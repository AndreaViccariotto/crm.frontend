import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MatLabel } from "@angular/material/form-field";
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatOption, MatSelectModule } from "@angular/material/select";
import { UserDto, UserService } from '../../services/user';
import { CommonModule } from '@angular/common';
import { TaskStatusDto, TaskStatusesService } from '../../services/task-statuses';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { TasksService } from '../../services/tasks';
import { GeneralHelper } from '../../shared/helpers/GeneralHelper';
import { Notification } from '../../shared/services/notification';
import { Companies, CompaniesDto } from '../../services/companies';
import { Contacts, ContactsDto } from '../../services/contacts';

@Component({
  selector: 'app-task-edit',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatOption,
    MatSelectModule,
    MatLabel,
    MatDatepickerModule,
    MatNativeDateModule
  ],
  templateUrl: './task-edit.html',
  styleUrl: './task-edit.css',
})

export class TaskEditComponent implements OnInit {

  readonly taskId = history.state?.event?.id || null;
  readonly companyId = history.state?.companyId || null;

  eventForm: FormGroup = new FormGroup({});

  usersLst: UserDto[] = [];
  taskStatusesLst: TaskStatusDto[] = [];
  companiesLst: CompaniesDto[] = [];

  allContacts: ContactsDto[] = [];

  contactsLst: ContactsDto[] = [];

  constructor(
    private router: Router,
    private userService: UserService,
    private taskStatusesService: TaskStatusesService,
    private taskService: TasksService,
    private companiesService: Companies,
    private contactsService: Contacts,
    private generalHelper: GeneralHelper,
    private notification: Notification,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {

    this.eventForm = new FormGroup({
      Title: new FormControl('', Validators.required),
      due_date: new FormControl<Date | null>(null, Validators.required),
      due_time: new FormControl('', Validators.required),
      description: new FormControl(''),
      user_id: new FormControl('', Validators.required),
      completed: new FormControl(false),
      company_id: new FormControl(this.companyId || ''),
      contact_id: new FormControl(''),
      status_id: new FormControl('')
    });

    // TASK
    if (this.taskId) {
      this.taskService.getById(this.taskId).subscribe(task => {

        this.eventForm.patchValue({
          Title: task.title,
          description: task.description,
          due_date: new Date(task.due_date),
          due_time: task.due_time,
          user_id: task.user_id,
          status_id: task.status_id,
          company_id: task.company_id,
          contact_id: task.contact_id,
          completed: task.completed
        });

        this.filterContacts(task.company_id || 0);
      });
    }

    // USERS
    this.userService.getUsers().subscribe(users => {
      this.usersLst = users;
    });

    // COMPANIES
    this.companiesService.get().subscribe(companies => {
      this.companiesLst = companies;
    });

    // CONTACTS
    this.contactsService.get().subscribe(contacts => {

      this.allContacts = contacts;

      if (this.companyId) {
        this.filterContacts(this.companyId);
      } else {
        this.contactsLst = contacts;
      }
      this.cdr.detectChanges();
    });

    // STATUSES
    this.taskStatusesService.getTaskStatuses().subscribe(statuses => {

      this.taskStatusesLst = statuses;

      const defaultStatus = statuses.find(s => s.is_default);

      if (defaultStatus && !this.taskId) {
        this.eventForm.get('status_id')?.setValue(defaultStatus.id);
      }

      this.cdr.detectChanges();
    });

    if (this.companyId) {
      this.filterContacts(this.companyId);
    }
  }

  cancel() {
    this.router.navigate(['/task-list']);
  }

  save() {

    if (this.eventForm.valid) {

      const formValue = this.eventForm.value;

      const date: Date = formValue.due_date;
      const time: string = formValue.due_time;

      const [hours, minutes] = time.split(':').map(Number);

      const finalDate = new Date(date);
      finalDate.setHours(hours, minutes, 0);

      const payload: any = {
        ...formValue,
        due_date: this.generalHelper.formatDate(finalDate)
      };

      if (this.taskId) {
        payload.Id = this.taskId;

        this.taskService.update(payload).subscribe(() => {

          this.notification.success('Evento aggiornato con successo');

          this.router.navigate(['/task-list']);
        });

      } else {

        this.taskService.save(payload).subscribe(() => {

          this.notification.success('Evento creato con successo');

          this.router.navigate(['/task-list']);
        });
      }
    }
  }

  OnCompanySelected() {

    const companyId = this.eventForm.get('company_id')?.value || this.companyId;

    this.filterContacts(companyId);

    this.eventForm.get('contact_id')?.setValue('');
  }

  private filterContacts(companyId: number) {

    this.contactsLst = this.allContacts.filter(
      c => c.company_id === companyId
    );
    this.cdr.detectChanges();
    console.log(this.contactsLst);
  }
}