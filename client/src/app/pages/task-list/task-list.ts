import { Component, Inject, PLATFORM_ID, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { MatCardModule } from '@angular/material/card';
import { forkJoin } from 'rxjs';
import { TaskDto, TasksService } from '../../services/tasks';
import { UserService } from '../../services/user';
import { CalendarEventVM, User } from '../../models/models';
import { ConfirmElimination } from '../../shared/services/confirm-elimination';
import { Notification } from '../../shared/services/notification';
import { TaskStatusesService } from '../../services/task-statuses';

@Component({
  selector: 'app-task-list',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatSelectModule,
    MatCardModule
  ],
  templateUrl: './task-list.html',
  styleUrls: ['./task-list.css']
})
export class TaskListComponent implements OnInit {

  isBrowser = false;

  filterForm: FormGroup;

  users: User[] = [];
  events: CalendarEventVM[] = [];
  allEvents: CalendarEventVM[] = [];

  selectedDate: Date = new Date();

  constructor(
    @Inject(PLATFORM_ID) private platformId: object,
    private fb: FormBuilder,
    private router: Router,
    private taskService: TasksService,
    private userService: UserService,
    private confirmElimination: ConfirmElimination,
    private notification: Notification,
    private cdr: ChangeDetectorRef,
    private taskStatusService: TaskStatusesService
  ) {
    this.isBrowser = isPlatformBrowser(this.platformId);

    this.filterForm = this.fb.group({
      user_id: [0]
    });
  }

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    forkJoin({
      users: this.userService.getUsers(),
      tasks: this.taskService.get(),
      statuses: this.taskStatusService.getTaskStatuses()
    }).subscribe(({ users, tasks, statuses }) => {

      this.users = users;

      this.allEvents = this.mapEvents(
        tasks,
        users,
        statuses
      );

      this.applyFilters();
    });
  }

  private mapEvents(
    tasks: TaskDto[],
    users: User[],
    statuses: any[]
  ): CalendarEventVM[] {

    return tasks.map(task => {

      const status = statuses.find(s => s.id === task.status_id);

      return {
        id: task.id,
        title: task.title,
        description: task.description ?? '',
        date: new Date(task.due_date),
        time: task.due_time ?? '--:--',

        user_id: task.user_id,
        user: users.find(u => u.id === task.user_id)?.username ?? 'Sconosciuto',

        status_id: task.status_id,
        status_name: status?.name ?? 'N/D',

        status_class: this.getStatusClass(status?.name)
      };
    });
  }

  getStatusClass(status: string): string {

    switch (status?.toLowerCase()) {

      case 'da pianificare':
        return 'status-planned';

      case 'in corso':
        return 'status-progress';

      case 'conclusa':
        return 'status-done';

      default:
        return 'status-default';
    }
  }

  applyFilters(): void {
    const userId = this.filterForm.value.user_id ?? 0;

    this.events = this.allEvents.filter(event => {
      const matchUser = userId === 0 || event.user_id === userId;
      const matchDate = event.date.toDateString() === this.selectedDate.toDateString();
      return matchUser && matchDate;
    });

    this.cdr.detectChanges();
  }


  onDateChange(date: Date): void {
    this.selectedDate = date;
    this.applyFilters();
  }

  applyFilter(): void {
    this.applyFilters();
  }

  resetFilter(): void {
    this.filterForm.setValue({ user_id: 0 });
    this.applyFilters();
  }

  addEvent(): void {
    if (!this.isBrowser) return;
    this.router.navigate(['/add-task']);
  }

  editEvent(event: CalendarEventVM): void {
    if (!this.isBrowser) return;
    this.router.navigate(['/add-task/', event.id], {
      state: { event }
    });
  }

  deleteEvent(event: CalendarEventVM): void {
    if (!this.isBrowser) return;

    this.confirmElimination.open({
      title: 'Conferma eliminazione',
      message: 'Sei sicuro di voler eliminare questo evento?'
    }).subscribe((confirmed) => {
      if (confirmed === true) {
        this.taskService.delete(event.id).subscribe(() => {
          this.loadData();
          this.notification.success('Evento eliminato con successo');
        });
      }
    });
  }
}