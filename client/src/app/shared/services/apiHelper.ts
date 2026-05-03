import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class ApiHelper {

  public apiUrl = 'https://localhost:7280/api';

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}

  getAuthorizationHeader(): HttpHeaders {

    if (!isPlatformBrowser(this.platformId)) {
      return new HttpHeaders();
    }

    const token = localStorage.getItem('token');

    return token ? new HttpHeaders({ Authorization: `Bearer ${token}` }) : new HttpHeaders();
  }
}