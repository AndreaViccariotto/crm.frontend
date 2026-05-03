import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ApiHelper } from '../shared/services/apiHelper';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http: HttpClient, private apiHelper: ApiHelper) {}

  login(username: string, password: string) {
    return this.http.post<string>(`${this.apiHelper.apiUrl}/auth/login`, {
      username,
      password
    });
  }

  saveToken(token: any) {
    localStorage.setItem('jwt', token.jwt);
    localStorage.setItem('id', token.id);
    localStorage.setItem('role', token.role);
  }

  getToken() {
    return localStorage.getItem('jwt');
  }
}