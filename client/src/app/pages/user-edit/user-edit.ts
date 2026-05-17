import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MatFormField, MatFormFieldModule, MatLabel } from "@angular/material/form-field";
import { Companies, CompaniesDto } from '../../services/companies';
import { GeneralHelper } from '../../shared/helpers/GeneralHelper';
import { Notification } from '../../shared/services/notification';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { Contacts } from '../../services/contacts';
import { MatOption } from "@angular/material/core";
import { MatSelectModule } from '@angular/material/select';
import { CommonModule } from '@angular/common';
import { UserDto, UserService } from '../../services/user';
import { RoleService } from '../../services/role';

@Component({
  selector: 'app-user-edit',
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatOption,
    MatSelectModule,
    CommonModule
  ],
  templateUrl: './user-edit.html',
  styleUrl: './user-edit.css',
})
export class UserEditComponent {
  userId: number | null = null;
  editForm: FormGroup = new FormGroup({});
  rolesLst: any[] = [];

  constructor(
    private Router: Router,
    private route: ActivatedRoute,
    private userService: UserService,
    private rolesService: RoleService,
    private notification: Notification
  ) {}

  ngOnInit(): void {

    this.userId = Number(this.route.snapshot.paramMap.get('id'));

    this.editForm = new FormGroup({
      username: new FormControl('', Validators.required),
      password: new FormControl('', Validators.required),
      password_confirmation: new FormControl('', Validators.required),
      email: new FormControl(''),
      role: new FormControl(2, Validators.required),
    });

    this.userService.getById(this.userId!).subscribe(user => {

      this.editForm.patchValue({
        username: user.username,
        email: user.email,
        role: Number(user.roleId) == 1 ? 1 : 2
      });

    });

    this.rolesService.getRoles().subscribe(roles => {
      this.rolesLst = roles;
    });
  }

  cancel() {
    this.Router.navigate(['/users']);
  }

  save() {

    if (this.editForm.invalid || this.editForm.value.password !== this.editForm.value.password_confirmation) {
      this.editForm.markAllAsTouched();
      return;
    }

    const payload = {
      ...this.editForm.value
    };

    if (this.userId) {

      payload['id'] = this.userId;

      this.userService.update(payload).subscribe(() => {

        this.notification.success(
          'Utente aggiornato con successo'
        );

        this.Router.navigate(['/users']);

      });

    } else {

      const createPayload: UserDto = {
        id: 0,
        username: this.editForm.value.username,
        password: this.editForm.value.password,
        email: this.editForm.value.email,
        roleId: this.editForm.value.role,
        role: ''
      };

      this.userService.save(createPayload).subscribe(() => {

        this.notification.success(
          'Utente creato con successo'
        );

        this.Router.navigate(['/users']);

      });

    }
  }
}
