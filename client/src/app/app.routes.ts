import { Routes } from '@angular/router';
import { LoginComponent } from './auth/login/login';
import { TaskListComponent } from './pages/task/task-list';
import { LayoutComponent } from './layout/layout/layout';
import { TaskEditComponent } from './pages/event-edit/task-edit';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },

  {
    path: '',
    component: LayoutComponent,
    children: [
      { path: 'task-list', component: TaskListComponent },
      { path: 'add-task', component: TaskEditComponent },
      { path: 'add-task/:id', component: TaskEditComponent }
    ]
  },

  { path: '', redirectTo: 'task-list', pathMatch: 'full' },
  { path: 'add-task', redirectTo: 'add-task', pathMatch: 'full' },

  { path: '**', redirectTo: 'login' }
];