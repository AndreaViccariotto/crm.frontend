import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Companies, CompaniesDto } from '../../services/companies';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Router } from '@angular/router';
import { ConfirmElimination } from '../../shared/services/confirm-elimination';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';

@Component({
  selector: 'app-company-list',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatPaginatorModule
  ],
  templateUrl: './company-list.html',
  styleUrl: './company-list.css',
})
export class CompanyListComponent implements OnInit {

  companies: CompaniesDto[] = [];
  allCompanies: CompaniesDto[] = [];
  filteredCompanies: CompaniesDto[] = [];
  
  pageSize = 10;
  pageIndex = 0;

  filterForm: FormGroup;

  constructor(
    private companiesService: Companies,
    private fb: FormBuilder,
    private router: Router,
    private confirmElimination: ConfirmElimination,
    private cdr: ChangeDetectorRef
  ) {

    this.filterForm = this.fb.group({
      name: ['']
    });

  }

  ngOnInit(): void {

    this.companiesService.get().subscribe((companies) => {

      this.allCompanies = [...companies]; 
      this.filteredCompanies = [...companies];
      this.updatePagedCompanies();

      this.applyFilter(
        this.filterForm.get('name')?.value || ''
      );

      this.cdr.detectChanges();

    });

    this.filterForm.get('name')?.valueChanges.subscribe(value => {
      this.applyFilter(value || '');
    });

  }

  updatePagedCompanies(): void {

    const startIndex =
      this.pageIndex * this.pageSize;

    const endIndex =
      startIndex + this.pageSize;

    this.companies =
      this.filteredCompanies.slice(startIndex, endIndex);

  }

  onPageChange(event: PageEvent): void {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
    this.updatePagedCompanies();
  }

  addCompany(): void {
    this.router.navigate(['/companies-edit']);
  }

  editCompany(company: CompaniesDto): void {
    this.router.navigate(['/companies-edit', company.id]);
  }

  deleteCompany(company: CompaniesDto): void {

    this.confirmElimination.open({
      title: 'Conferma eliminazione',
      message: 'Sei sicuro di voler eliminare questa azienda?'
    }).subscribe((confirmed) => {

      if (!confirmed) return;

      this.companiesService.delete(company.id).subscribe(() => {

        this.allCompanies = this.allCompanies.filter(c => c.id !== company.id);

        this.applyFilter(
          this.filterForm.get('name')?.value || ''
        );

        this.cdr.detectChanges();

      });

    });

  }

  applyFilter(value: string = ''): void {

    const nameFilter = value.toLowerCase().trim();

    this.companies = this.allCompanies.filter(company =>
      company.name.toLowerCase().includes(nameFilter)
    );

    this.filteredCompanies = [...this.companies];
    this.pageIndex = 0;
    this.updatePagedCompanies();

  }

  resetFilter(): void {

    this.filterForm.reset();

    this.companies = [...this.allCompanies];
    this.filteredCompanies = [...this.allCompanies];
    this.pageIndex = 0;
    this.updatePagedCompanies();

  }

}