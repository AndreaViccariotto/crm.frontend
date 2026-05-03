import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ApiHelper } from '../shared/services/apiHelper';
import { shareReplay } from 'rxjs';

export interface TaskStatusDto {
  id: number;
  name: string;
  is_default: boolean;
}


@Injectable({
  providedIn: 'root',
})
export class TaskStatusesService {

  constructor(private http: HttpClient, private apiHelper: ApiHelper) { }

  getTaskStatuses() {
    const headers = this.apiHelper.getAuthorizationHeader();
    return this.http.get<TaskStatusDto[]>(`${this.apiHelper.apiUrl}/taskStatuses/get`, {
      headers: headers ? headers : undefined
    }).pipe(shareReplay(1));
  }

}
