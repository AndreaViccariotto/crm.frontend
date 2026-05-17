import { Routes } from '@angular/router';
import { LoginComponent } from './auth/login/login';
import { TaskListComponent } from './pages/task-list/task-list';
import { LayoutComponent } from './layout/layout/layout';
import { TaskEditComponent } from './pages/task-edit/task-edit';
import { CompanyListComponent } from './pages/company-list/company-list';
import { CompanyEditComponent } from './pages/company-edit/company-edit';
import { ContactListComponent } from './pages/contact-list/contact-list';
import { ContactEditComponent } from './pages/contact-edit/contact-edit';
import { TaskStatusComponent } from './pages/task-status-list/task-status';
import { UserComponent } from './pages/user-list/user';
import { UserRolesComponent } from './pages/user-roles-list/user-roles';
import { UserEditComponent } from './pages/user-edit/user-edit';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },

  {
    path: '',
    component: LayoutComponent,
    children: [
      
      { path: 'task-list', component: TaskListComponent },
      { path: 'add-task', component: TaskEditComponent },
      { path: 'add-task/:id', component: TaskEditComponent },

      { path: 'task-status', component: TaskStatusComponent },
      { path: 'task-status-edit', component: TaskStatusComponent },
      { path: 'task-status-edit/:id', component: TaskStatusComponent },

      { path: 'companies', component: CompanyListComponent },
      { path: 'companies-edit', component: CompanyEditComponent },
      { path: 'companies-edit/:id', component: CompanyEditComponent },

      { path: 'contacts', component: ContactListComponent },
      { path: 'contacts-edit', component: ContactEditComponent },
      { path: 'contacts-edit/:id', component: ContactEditComponent },

      { path: 'users', component: UserComponent },
      { path: 'users-edit', component: UserEditComponent },
      { path: 'users-edit/:id', component: UserEditComponent },

      { path: 'user-roles', component: UserRolesComponent },
      { path: 'user-roles-edit', component: UserRolesComponent },
      { path: 'user-roles-edit/:id', component: UserRolesComponent }
    ]
  },

  { path: '', redirectTo: 'task-list', pathMatch: 'full' },
  { path: 'add-task', redirectTo: 'add-task', pathMatch: 'full' },

  { path: '**', redirectTo: 'login' }
];