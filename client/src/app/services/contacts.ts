import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiHelper } from '../shared/services/apiHelper';

export interface ContactsDto {
  id: number;
  name: string;
  email: string;
  phone: string;
  company_id: number | null;
  company_name?: string | null;
}

@Injectable({
  providedIn: 'root',
})
export class Contacts {

  constructor(private http: HttpClient, private apiHelper: ApiHelper) {}

  get(): Observable<ContactsDto[]> {
    const headers = this.apiHelper.getAuthorizationHeader();
    return this.http.get<ContactsDto[]>(`${this.apiHelper.apiUrl}/contacts/get`, {
      headers: headers ? headers : undefined
    });
  }


  getById(id: number): Observable<ContactsDto> {
    const headers = this.apiHelper.getAuthorizationHeader();
    return this.http.get<ContactsDto>(`${this.apiHelper.apiUrl}/contacts/getbyId`, {
      params: { id: id.toString() },
      headers: headers ? headers : undefined
    });
  }

  getByCompanyId(companyId: number): Observable<ContactsDto[]> {
    const headers = this.apiHelper.getAuthorizationHeader();
    return this.http.get<ContactsDto[]>(`${this.apiHelper.apiUrl}/contacts/getbyCompanyId`, {
      params: { companyId: companyId.toString() },
      headers: headers ? headers : undefined
    });
  }

  save(contact: Partial<ContactsDto>): Observable<string> {

    const headers = this.apiHelper.getAuthorizationHeader();

    return this.http.post(
      `${this.apiHelper.apiUrl}/contacts/save`,
      contact,
      {
        headers: headers ? headers : undefined,
        responseType: 'text'
      }
    );
  }

  update(contact: Partial<ContactsDto>): Observable<string> {

    const headers = this.apiHelper.getAuthorizationHeader();

    return this.http.post(
      `${this.apiHelper.apiUrl}/contacts/update`,
      contact,
      {
        headers: headers ? headers : undefined,
        responseType: 'text'
      }
    );
  }

  delete(id: number): Observable<string> {
    const headers = this.apiHelper.getAuthorizationHeader();
    return this.http.delete(`${this.apiHelper.apiUrl}/contacts/delete`, {
      headers: headers ? headers : undefined,
      params: { id: id.toString() },
      responseType: 'text'
    });
  }

}
