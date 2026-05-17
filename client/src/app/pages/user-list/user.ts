import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Router } from '@angular/router';
import { ConfirmElimination } from '../../shared/services/confirm-elimination';
import { Contacts, ContactsDto } from '../../services/contacts';
import { Companies, CompaniesDto } from '../../services/companies';
import { MatOption } from "@angular/material/core";
import { MatSelectModule } from '@angular/material/select';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { UserDto, UserService } from '../../services/user';

@Component({
  selector: 'app-user',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatOption,
    MatSelectModule,
    MatPaginatorModule
],
  templateUrl: './user.html',
  styleUrl: './user.css',
})
export class UserComponent {
  users: UserDto[] = [];
  allUsers: UserDto[] = [];
  filteredUsers: UserDto[] = [];

  pageSize = 10;
  pageIndex = 0;

  companiesLst: CompaniesDto[] = [];

  filterForm: FormGroup;

  constructor(
    private userService: UserService,
    private fb: FormBuilder,
    private router: Router,
    private confirmElimination: ConfirmElimination,
    private cdr: ChangeDetectorRef,
    private companyService: Companies
  ) {

    this.filterForm = this.fb.group({
      name: [''],
      company_id: ['']
    });

  }

  ngOnInit(): void {

    this.userService.getUsers().subscribe((users) => {

    this.allUsers = [...users];
    this.filteredUsers = [...users];

    this.updatePagedUsers();

      this.cdr.detectChanges();

    });

    this.companyService.get().subscribe((companies) => {

      this.companiesLst = [...companies];

      this.cdr.detectChanges();

    });

    this.filterForm.get('name')?.valueChanges.subscribe(() => {
      this.applyFilter();
    });

    this.filterForm.get('company_id')?.valueChanges.subscribe(() => {
      this.applyFilter();
    });

  }

  updatePagedUsers(): void {

    const startIndex =
      this.pageIndex * this.pageSize;

    const endIndex =
      startIndex + this.pageSize;

    this.users =
      this.filteredUsers.slice(startIndex, endIndex);

  }

  onPageChange(event: PageEvent): void {

    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;

    this.updatePagedUsers();

  }

  addUser(): void {
    this.router.navigate(['/users-edit']);
  }

  editUser(user: UserDto): void {
    this.router.navigate(['/users-edit', user.id]);
  }

  deleteUser(user: UserDto): void {

    this.confirmElimination.open({
      title: 'Conferma eliminazione',
      message: 'Sei sicuro di voler eliminare questo utente?'
    }).subscribe((confirmed) => {

      if (!confirmed) return;

      this.userService.delete(user.id).subscribe(() => {

        this.allUsers =
          this.allUsers.filter(c => c.id !== user.id);

        this.applyFilter();

      });

    });

  }

  applyFilter(): void {

    const nameValue =
      this.filterForm.get('name')?.value || '';

    const nameFilter =
      nameValue.toLowerCase().trim();

    this.filteredUsers = this.allUsers.filter(user =>
      user.username.toLowerCase().includes(nameFilter)
    );

    this.pageIndex = 0;

    this.updatePagedUsers();

  }

  resetFilter(): void {

    this.filterForm.reset();

    this.filteredUsers = [...this.allUsers];
    this.pageIndex = 0;
    this.updatePagedUsers();

  }

  viewUser(userId: number | null): void {

    if (!userId) return;

    this.router.navigate(['/users-edit', userId]);

  }
}
