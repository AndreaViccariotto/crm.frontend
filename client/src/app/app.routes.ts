import { Routes } from '@angular/router';
import { LoginComponent } from './auth/login/login';
import { TaskListComponent } from './pages/task/task-list';
import { LayoutComponent } from './layout/layout/layout';
import { TaskEditComponent } from './pages/task-edit/task-edit';
import { CompanyListComponent } from './pages/company-list/company-list/company-list';
import { CompanyEditComponent } from './pages/company-edit/company-edit/company-edit';
import { ContactListComponent } from './pages/contact-list/contact-list/contact-list';
import { ContactEditComponent } from './pages/contact-edit/contact-edit/contact-edit';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },

  {
    path: '',
    component: LayoutComponent,
    children: [
      
      { path: 'task-list', component: TaskListComponent },
      { path: 'add-task', component: TaskEditComponent },
      { path: 'add-task/:id', component: TaskEditComponent },

      { path: 'companies', component: CompanyListComponent },
      { path: 'companies-edit', component: CompanyEditComponent },
      { path: 'companies-edit/:id', component: CompanyEditComponent },

      { path: 'contacts', component: ContactListComponent },
      { path: 'contacts-edit', component: ContactEditComponent },
      { path: 'contacts-edit/:id', component: ContactEditComponent }
    ]
  },

  { path: '', redirectTo: 'task-list', pathMatch: 'full' },
  { path: 'add-task', redirectTo: 'add-task', pathMatch: 'full' },

  { path: '**', redirectTo: 'login' }
];