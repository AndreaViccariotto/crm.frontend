import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, shareReplay } from 'rxjs';
import { ApiHelper } from '../shared/services/apiHelper';
import { UserDto } from './user';

export interface RoleDto {
    id: number;
    name: string;
    description: string;
}

@Injectable({
  providedIn: 'root',
})
export class RoleService {

  private roles$: Observable<RoleDto[]> | null = null;

    constructor(
    private http: HttpClient,
    private apiHelper: ApiHelper
  ) {}

  getRoles(): Observable<RoleDto[]> {
    if (!this.roles$) {
      const headers = this.apiHelper.getAuthorizationHeader();
      this.roles$ = this.http
        .get<RoleDto[]>(`${this.apiHelper.apiUrl}/roles/get`, {
          headers: headers ? headers : undefined
        })
        .pipe(
          shareReplay(1)
        );
    }

    return this.roles$;
  }

  getById(id: number): Observable<RoleDto> {
    const headers = this.apiHelper.getAuthorizationHeader();
    return this.http.get<RoleDto>(`${this.apiHelper.apiUrl}/roles/getbyId`, {
      params: { id: id.toString() },
      headers: headers ? headers : undefined
    });
  }
  
  save(user: Partial<RoleDto>): Observable<string> {

    const headers = this.apiHelper.getAuthorizationHeader();

    return this.http.post(
      `${this.apiHelper.apiUrl}/roles/save`,
      user,
      {
        headers: headers ? headers : undefined,
        responseType: 'text'
      }
    );
  }
  
  update(user: Partial<RoleDto>): Observable<string> {

    const headers = this.apiHelper.getAuthorizationHeader();

    return this.http.post(
      `${this.apiHelper.apiUrl}/roles/update`,
      user,
      {
        headers: headers ? headers : undefined,
        responseType: 'text'
      }
    );
  }
  
  delete(id: number): Observable<string> {
    const headers = this.apiHelper.getAuthorizationHeader();
    return this.http.delete(`${this.apiHelper.apiUrl}/roles/delete`, {
      headers: headers ? headers : undefined,
      params: { id: id.toString() },
      responseType: 'text'
    });
  }
}
