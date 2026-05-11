import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiHelper } from '../shared/services/apiHelper';
import { HttpClient } from '@angular/common/http';
import { ContactsDto } from './contacts';

export interface CompaniesDto {
  id: number;
  name: string;
  vat_number: string;
  email: string;
  address: string;
  city: string;
  phone: string;
}

@Injectable({
  providedIn: 'root',
})
export class Companies {

  constructor(private http: HttpClient, private apiHelper: ApiHelper) {}

  get(): Observable<CompaniesDto[]> {
    const headers = this.apiHelper.getAuthorizationHeader();
    return this.http.get<CompaniesDto[]>(`${this.apiHelper.apiUrl}/companies/get`, {
      headers: headers ? headers : undefined
    });
  }


  getById(id: number): Observable<CompaniesDto> {
    const headers = this.apiHelper.getAuthorizationHeader();
    return this.http.get<CompaniesDto>(`${this.apiHelper.apiUrl}/companies/getbyId`, {
      params: { id: id.toString() },
      headers: headers ? headers : undefined
    });
  }

  getContacts(companyId: number): Observable<ContactsDto[]> {
    const headers = this.apiHelper.getAuthorizationHeader();
    return this.http.get<ContactsDto[]>(`${this.apiHelper.apiUrl}/companies/getcontacts`, {
      params: { companyId: companyId.toString() },
      headers: headers ? headers : undefined
    });
  }

  save(company: Partial<CompaniesDto>): Observable<string> {

    const headers = this.apiHelper.getAuthorizationHeader();

    return this.http.post(
      `${this.apiHelper.apiUrl}/companies/save`,
      company,
      {
        headers: headers ? headers : undefined,
        responseType: 'text'
      }
    );
  }

  update(company: Partial<CompaniesDto>): Observable<string> {

    const headers = this.apiHelper.getAuthorizationHeader();

    return this.http.put(
      `${this.apiHelper.apiUrl}/companies/update`,
      company,
      {
        headers: headers ? headers : undefined,
        responseType: 'text'
      }
    );
  }

  delete(id: number): Observable<string> {
    const headers = this.apiHelper.getAuthorizationHeader();
    return this.http.delete(`${this.apiHelper.apiUrl}/companies/delete`, {
      headers: headers ? headers : undefined,
      params: { id: id.toString() },
      responseType: 'text'
    });
  }
}
