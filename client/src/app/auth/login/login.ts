import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css'
})

export class LoginComponent {

  form: FormGroup;

  constructor(
    private fb: FormBuilder,
    private auth: AuthService,
    private router: Router
  ) {
    this.form = this.fb.group({
      username: [''],
      password: ['']
    });
  }

  ngOnInit() {
}

  submit() {
    this.auth.login(
      this.form.value.username,
      this.form.value.password
    ).subscribe({
      next: (authResponse: any) => {
        this.auth.saveToken(authResponse);

        this.router.navigate(['/task-list']);
      },
      error: (err: any) => {
        console.error('Errore login', err);
      }
    });
  }
}