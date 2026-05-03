import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MatFormField, MatLabel } from "@angular/material/form-field";
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatOption, MatSelectModule } from "@angular/material/select";
import { UserDto, UserService } from '../../services/user';
import { CommonModule } from '@angular/common';
import { TaskStatusDto } from '../../services/task-statuses';
import { TaskStatusesService } from '../../services/task-statuses';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { TasksService } from '../../services/tasks';
import { GeneralHelper } from '../../shared/helpers/GeneralHelper';
import { Notification } from '../../shared/services/notification';

@Component({
  selector: 'app-task-edit',
  imports: [CommonModule, ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatButtonModule, MatOption, MatSelectModule, MatLabel, MatDatepickerModule, MatNativeDateModule],
  templateUrl: './task-edit.html',
  styleUrl: './task-edit.css',
})

export class TaskEditComponent implements OnInit {

  readonly taskId = history.state?.event?.id || null;
  eventForm: FormGroup = new FormGroup({});
  usersLst: UserDto[] = [];
  taskStatusesLst: TaskStatusDto[] = [];

  constructor(
    private Router: Router,
    private userService: UserService,
    private taskStatusesService: TaskStatusesService,
    private taskService: TasksService,
    private generalHelper: GeneralHelper,
    private notification: Notification
  ) {}

  ngOnInit(): void {

    this.eventForm = new FormGroup({
      Title: new FormControl('', Validators.required),
      due_date: new FormControl<Date | null>(null, Validators.required),
      due_time: new FormControl('', Validators.required),
      description: new FormControl(''),
      user_id: new FormControl('', Validators.required),
      completed: new FormControl(false),
      company_id: new FormControl(''),
      contact_id: new FormControl(''),
      status_id: new FormControl('')
    });

    if (this.taskId) {
      this.taskService.getById(this.taskId).subscribe(task => {
        this.eventForm.patchValue({
          Title: task.title,
          description: task.description,
          due_date: new Date(task.due_date),
          due_time: task.due_time,
          user_id: task.user_id,
          status_id: task.status_id
        });
      });
    }

    this.userService.getUsers().subscribe(users => {
      this.usersLst = users;
    });

    this.taskStatusesService.getTaskStatuses().subscribe(statuses => {
      this.taskStatusesLst = statuses;

      const defaultStatus = this.taskStatusesLst.find(s => s.is_default);
      if (defaultStatus && !this.taskId) {
        this.eventForm.get('status_id')?.setValue(defaultStatus.id);
      }
    });
  }

  cancel() {
    this.Router.navigate(['/dashboard']);
  }

  save() {
    if (this.taskId) {
      this.eventForm.addControl('id', new FormControl(this.taskId));
    }

    if (this.eventForm.valid) {

      const formValue = this.eventForm.value;

      const date: Date = formValue.due_date;
      const time: string = formValue.due_time;

      const [hours, minutes] = time.split(':').map(Number);

      const finalDate = new Date(date);
      finalDate.setHours(hours, minutes, 0);

      const payload = {
        ...formValue,
        due_date: this.generalHelper.formatDate(finalDate)
      };

      if (this.taskId) {
        payload['Id'] = this.taskId;
      }

      if (this.taskId) {
        this.taskService.update(payload).subscribe(() => {
          this.notification.success('Evento aggiornato con successo');
          this.Router.navigate(['/dashboard']);
        });
      } else {
        this.taskService.save(payload).subscribe(() => {
          this.notification.success('Evento creato con successo');
          this.Router.navigate(['/dashboard']);
        });
      }
    }
  }
}
