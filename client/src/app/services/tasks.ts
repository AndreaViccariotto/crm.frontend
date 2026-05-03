import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ApiHelper } from '../shared/services/apiHelper';
import { ReplaySubject, shareReplay } from 'rxjs';

export interface TaskDto {
  id: number;
  title: string;
  description?: string;
  due_date: string;
  due_time?: string | null;
  user_id: number;
  status_id: number;
}

export interface TaskRequest {
  title: string;
  description?: string;
  due_date: string;
  user_id: number;
  company_id?: number;
  contact_id?: number;
  status_id: number;
}

@Injectable({
  providedIn: 'root',
})
export class TasksService {

  constructor(private httpClient: HttpClient, private apiHelper: ApiHelper) {}

  get() {
    const headers = this.apiHelper.getAuthorizationHeader();
    return this.httpClient.get<TaskDto[]>(`${this.apiHelper.apiUrl}/task/get`, { headers });
  }

  getById(id: number) {
    const headers = this.apiHelper.getAuthorizationHeader();
    return this.httpClient.get<TaskDto>(
      `${this.apiHelper.apiUrl}/task/getById`,
      { params: { id }, headers }
    );
  }

  getByUserId(userId: number) {
    const headers = this.apiHelper.getAuthorizationHeader();
    return this.httpClient.get<TaskDto[]>(
      `${this.apiHelper.apiUrl}/task/getByUserId`,
      { params: { userId }, headers }
    );
  }

  save(taskRequest: TaskRequest) {
    const headers = this.apiHelper.getAuthorizationHeader();

    const payload = {
      ...taskRequest,
      company_id: taskRequest.company_id || null,
      contact_id: taskRequest.contact_id || null,
    };

    return this.httpClient.post<TaskDto>(
      `${this.apiHelper.apiUrl}/task/save`,
      payload,
      { headers }
    );
  }

  update(taskRequest: TaskRequest) {
    const headers = this.apiHelper.getAuthorizationHeader();
    const payload = {
      ...taskRequest,
      company_id: taskRequest.company_id || null,
      contact_id: taskRequest.contact_id || null,
    };
    return this.httpClient.post<TaskDto>(
      `${this.apiHelper.apiUrl}/task/update`,
      payload,
      { headers }
    );
  }

  delete(id: number) {
    const headers = this.apiHelper.getAuthorizationHeader();
    return this.httpClient.delete(
      `${this.apiHelper.apiUrl}/task/delete`,
      { params: { id }, headers }
    );
  }

}
