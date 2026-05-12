import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ApiHelper } from '../shared/services/apiHelper';

export interface FileDto {
  id: number,
  file_name: string;
  content: string;
  uploaded_by: number;
  created_at: Date;
}

export interface FileRequest {
  content: string;
  file_name: string;
  entity_name: string;
  entity_id: number;
  uploaded_by: number;
}

@Injectable({
  providedIn: 'root',
})
export class FileService {
  
  constructor(private httpClient: HttpClient, private apiHelper: ApiHelper) { }

  downloadFile(fileId: number) {
    const headers = this.apiHelper.getAuthorizationHeader();
    return this.httpClient.get<FileDto>(
      `${this.apiHelper.apiUrl}/file/download`,
      { params: { fileId }, headers }
    );
  }

  uploadFile(fileRequest: FileRequest) {
    const headers = this.apiHelper.getAuthorizationHeader();
    return this.httpClient.post<FileDto>(
      `${this.apiHelper.apiUrl}/file/upload`,
      fileRequest,
      { 
        headers, 
        responseType: 'text' as 'json' 
      }
    );
  }

  deleteFile(fileId: number) {
    const headers = this.apiHelper.getAuthorizationHeader();
    return this.httpClient.delete(
      `${this.apiHelper.apiUrl}/file/delete`,
      { 
        params: { fileId }, 
        headers,
        responseType: 'text' as 'json'
      }
    );
  }

  getByCompanyId(companyId: number) {
    const headers = this.apiHelper.getAuthorizationHeader();
    return this.httpClient.get<FileDto[]>(
      `${this.apiHelper.apiUrl}/file/getByCompanyId`,
      { params: { companyId }, headers }
    );
  }

  getBytaskId(taskId: number) {
    const headers = this.apiHelper.getAuthorizationHeader();
    return this.httpClient.get<FileDto[]>(
      `${this.apiHelper.apiUrl}/file/getByTaskId`,
      { params: { taskId }, headers }
    );
  }

  updateFileName(filerequest: FileRequest) {
    const headers = this.apiHelper.getAuthorizationHeader();
    return this.httpClient.post<FileDto>(
      `${this.apiHelper.apiUrl}/file/updateFileName`,
      filerequest,
      { 
        headers, 
        responseType: 'text' as 'json' 
      }
    );
  }
}
