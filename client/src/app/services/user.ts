import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, shareReplay } from 'rxjs';
import { ApiHelper } from '../shared/services/apiHelper';

export interface UserDto {
  id: number;
  username: string;
  role: string;
}

@Injectable({
  providedIn: 'root',
})
export class UserService {

  private users$: Observable<UserDto[]> | null = null;

  constructor(
    private http: HttpClient,
    private apiHelper: ApiHelper
  ) {}

  getUsers(): Observable<UserDto[]> {
    if (!this.users$) {
      const headers = this.apiHelper.getAuthorizationHeader();
      this.users$ = this.http
        .get<UserDto[]>(`${this.apiHelper.apiUrl}/users/get`, {
          headers: headers ? headers : undefined
        })
        .pipe(
          shareReplay(1)
        );
    }

    return this.users$;
  }
}