import { ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild, viewChild } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MatFormField, MatFormFieldModule, MatLabel } from "@angular/material/form-field";
import { Companies, CompaniesDto } from '../../services/companies';
import { GeneralHelper } from '../../shared/helpers/GeneralHelper';
import { Notification } from '../../shared/services/notification';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { Contacts, ContactsDto } from '../../services/contacts';
import { CommonModule } from '@angular/common';
import { MatIcon } from "@angular/material/icon";
import { TaskDto, TasksService } from '../../services/tasks';
import { stat } from 'fs';
import { FileDto, FileService } from '../../services/file';

@Component({
  selector: 'app-company-edit',
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    CommonModule,
    MatIcon
],
  templateUrl: './company-edit.html',
  styleUrl: './company-edit.css',
})
export class CompanyEditComponent implements OnInit {
  companyId: number | null = null;
  editForm: FormGroup = new FormGroup({});
  usersLst: CompaniesDto[] = [];
  contactLst: ContactsDto[] = [];
  tasksLst: TaskDto[] = [];
  filesLst: FileDto[] = [];
  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;

  constructor(
    private Router: Router,
    private route: ActivatedRoute,
    private companiesService: Companies,
    private generalHelper: GeneralHelper,
    private notification: Notification,
    private contactService: Contacts,
    private cdr: ChangeDetectorRef,
    private taskService: TasksService,
    private fileService: FileService
  ) {}

  ngOnInit(): void {

    this.companyId = Number(this.route.snapshot.paramMap.get('id'));

    this.editForm = new FormGroup({
      name: new FormControl('', Validators.required),
      vat_number: new FormControl('', Validators.required),
      email: new FormControl('', Validators.email),
      phone: new FormControl(''),
      address: new FormControl(''),
      city: new FormControl(''),
    });

    if (this.companyId) {

      this.companiesService
        .getById(this.companyId)
        .subscribe(company => {

          this.editForm.patchValue(company);

        });

      this.companiesService.getContacts(this.companyId).subscribe(contacts => {
        this.contactLst = contacts;

        this.cdr.detectChanges();
      });

      this.taskService.getByCompanyId(this.companyId).subscribe(tasks => {
        this.tasksLst = tasks;
        this.cdr.detectChanges();
      });

      this.fileService.getByCompanyId(this.companyId).subscribe(files => {
        this.filesLst = files;
        this.cdr.detectChanges();
      });
    }
  }

  cancel() {
    this.Router.navigate(['/companies']);
  }

  save() {

    if (this.editForm.invalid) {
      this.editForm.markAllAsTouched();
      return;
    }

    const payload = {
      ...this.editForm.value
    };

    if (this.companyId) {

      payload['id'] = this.companyId;

      this.companiesService.update(payload).subscribe(() => {

        this.notification.success(
          'Azienda aggiornata con successo'
        );

        this.Router.navigate(['/companies']);

      });

    } else {

      this.companiesService.save(payload).subscribe(() => {

        this.notification.success(
          'Azienda creata con successo'
        );

        this.Router.navigate(['/companies']);

      });

    }
  }

  addContact() {
    this.Router.navigate(['/contacts-edit', { companyId: this.companyId }]);
  }

  deleteContact(contactId: number) {

    if (confirm('Sei sicuro di voler eliminare questo contatto?')) {
      this.contactService.delete(contactId).subscribe(() => {
        this.notification.success('Contatto eliminato con successo');
        this.companiesService.getContacts(this.companyId || 0).subscribe(contacts => {
          this.contactLst = contacts;
        });
      });
    }
  }

  viewContact(contactId: number) {
    this.Router.navigate(['/contacts-edit', { id: contactId }]);
  }

  addTask() {
    this.Router.navigate(['/add-task', { companyId: this.companyId }]);
  }

  viewTask(event: TaskDto) {
        this.Router.navigate(['/add-task/', event.id, { company_id: this.companyId }], {
      state: { event }
    });
  }

  onFileSelected(event: Event) {

    const input = event.target as HTMLInputElement;

    if (!input.files || input.files.length === 0) {
      return;
    }

    const file = input.files[0];

    const reader = new FileReader();

    reader.onload = () => {

      const base64 = (reader.result as string).split(',')[1];

      const payload = {
        file_name: file.name,
        content: base64,
        entity_name: 'Companies',
        entity_id: this.companyId || 0,
        uploaded_by: Number(localStorage.getItem('id')) || 0
      };

      this.fileService.uploadFile(payload).subscribe(() => {

        this.notification.success(
          'File caricato con successo'
        );

        this.fileService
          .getByCompanyId(this.companyId || 0)
          .subscribe(files => {

            this.filesLst = files;

            this.cdr.detectChanges();
          });

      });

    };

    reader.readAsDataURL(file);

    input.value = '';
  }

  downloadFile(fileId: number) {

    this.fileService.downloadFile(fileId).subscribe(file => {

      const byteCharacters = atob(file.content);

      const byteNumbers = new Array(byteCharacters.length);

      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }

      const byteArray = new Uint8Array(byteNumbers);

      const blob = new Blob([byteArray]);

      const url = window.URL.createObjectURL(blob);

      const a = document.createElement('a');

      a.href = url;
      a.download = file.file_name;

      a.click();

      window.URL.revokeObjectURL(url);
    });
  }

  deleteFile(fileId: number) {
    if (confirm('Sei sicuro di voler eliminare questo file?')) {
      this.fileService.deleteFile(fileId).subscribe(() => {
        this.notification.success('File eliminato con successo');
        this.fileService.getByCompanyId(this.companyId || 0).subscribe(files => {
          this.filesLst = files;
        });
      });
    }
  }
}
