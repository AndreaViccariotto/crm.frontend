import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MatFormField, MatFormFieldModule, MatLabel } from "@angular/material/form-field";
import { Companies, CompaniesDto } from '../../../services/companies';
import { GeneralHelper } from '../../../shared/helpers/GeneralHelper';
import { Notification } from '../../../shared/services/notification';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { Contacts } from '../../../services/contacts';
import { MatOption } from "@angular/material/core";
import { MatSelectModule } from '@angular/material/select';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-contact-edit',
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatOption,
    MatSelectModule,
    CommonModule
  ],
  templateUrl: './contact-edit.html',
  styleUrl: './contact-edit.css',
})
export class ContactEditComponent {
  contactId: number | null = null;
  companyId: number | null = null;
  editForm: FormGroup = new FormGroup({});
  usersLst: CompaniesDto[] = [];
  companiesLst: CompaniesDto[] = [];

  constructor(
    private Router: Router,
    private route: ActivatedRoute,
    private contactService: Contacts,
    private companiesService: Companies,
    private generalHelper: GeneralHelper,
    private notification: Notification,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {

    this.contactId = Number(this.route.snapshot.paramMap.get('id'));
    this.companyId = Number(this.route.snapshot.paramMap.get('companyId'));

    this.editForm = new FormGroup({
      name: new FormControl('', Validators.required),
      email: new FormControl('', Validators.email),
      phone: new FormControl(''),
      company_id: new FormControl(this.companyId, Validators.required),
    });

    if (this.contactId) {

      this.contactService
        .getById(this.contactId)
        .subscribe(contact => {

          this.editForm.patchValue(contact);

        });

    }

    this.companiesService.get().subscribe(companies => {
      this.companiesLst = companies;
      this.cdr.detectChanges();
    });
  }

  cancel() {
    this.Router.navigate(['/contacts']);
  }

  save() {

    if (this.editForm.invalid) {
      this.editForm.markAllAsTouched();
      return;
    }

    const payload = {
      ...this.editForm.value
    };

    if (this.contactId) {

      payload['id'] = this.contactId;

      this.contactService.update(payload).subscribe(() => {

        this.notification.success(
          'Contatto aggiornato con successo'
        );

        this.Router.navigate(['/contacts']);

      });

    } else {

      this.contactService.save(payload).subscribe(() => {

        this.notification.success(
          'Contatto creato con successo'
        );

        this.Router.navigate(['/contacts']);

      });

    }
  }
}
