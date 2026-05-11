import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Router } from '@angular/router';
import { ConfirmElimination } from '../../../shared/services/confirm-elimination';
import { Contacts, ContactsDto } from '../../../services/contacts';
import { Companies, CompaniesDto } from '../../../services/companies';
import { MatOption } from "@angular/material/core";
import { MatSelectModule } from '@angular/material/select';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';

@Component({
  selector: 'app-contact-list',
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
  templateUrl: './contact-list.html',
  styleUrl: './contact-list.css',
})
export class ContactListComponent {

  contacts: ContactsDto[] = [];
  allContacts: ContactsDto[] = [];
  filteredContacts: ContactsDto[] = [];

  pageSize = 10;
  pageIndex = 0;

  companiesLst: CompaniesDto[] = [];

  filterForm: FormGroup;

  constructor(
    private contactService: Contacts,
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

    this.contactService.get().subscribe((contacts) => {

    this.allContacts = [...contacts];
    this.filteredContacts = [...contacts];

    this.updatePagedContacts();

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

  updatePagedContacts(): void {

    const startIndex =
      this.pageIndex * this.pageSize;

    const endIndex =
      startIndex + this.pageSize;

    this.contacts =
      this.filteredContacts.slice(startIndex, endIndex);

  }

  onPageChange(event: PageEvent): void {

    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;

    this.updatePagedContacts();

  }

  addContact(): void {
    this.router.navigate(['/contacts-edit']);
  }

  editContact(contact: ContactsDto): void {
    this.router.navigate(['/contacts-edit', contact.id]);
  }

  deleteContact(contact: ContactsDto): void {

    this.confirmElimination.open({
      title: 'Conferma eliminazione',
      message: 'Sei sicuro di voler eliminare questo contatto?'
    }).subscribe((confirmed) => {

      if (!confirmed) return;

      this.contactService.delete(contact.id).subscribe(() => {

        this.allContacts =
          this.allContacts.filter(c => c.id !== contact.id);

        this.applyFilter();

      });

    });

  }

  applyFilter(): void {

    const nameValue =
      this.filterForm.get('name')?.value || '';

    const companyValue =
      this.filterForm.get('company_id')?.value;

    const nameFilter =
      nameValue.toLowerCase().trim();

    const companyFilter =
      companyValue === '' ||
      companyValue === null ||
      companyValue === undefined
        ? null
        : Number(companyValue);

    this.filteredContacts = this.allContacts.filter(contact =>
      contact.name.toLowerCase().includes(nameFilter) &&
      (companyFilter !== null
        ? contact.company_id === companyFilter
        : true)
    );

    this.pageIndex = 0;

    this.updatePagedContacts();

  }

  resetFilter(): void {

    this.filterForm.reset();

    this.filteredContacts = [...this.allContacts];
    this.pageIndex = 0;
    this.updatePagedContacts();

  }

  viewCompany(companyId: number | null): void {

    if (!companyId) return;

    this.router.navigate(['/companies-edit', companyId]);

  }

}
