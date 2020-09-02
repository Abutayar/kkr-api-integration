import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';

import { throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ApiServiceService {
  private REST_API_SERVER = environment.apiUrl;

  constructor(private httpClient: HttpClient) {}

  handleError(error: HttpErrorResponse) {
    let errorMessage = 'Unknown error!';
    if (error.error instanceof ErrorEvent) {
      // Client-side errors
      errorMessage = `Error: ${error.error.message}`;
    } else {
      // Server-side errors
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    return throwError(errorMessage);
  }

  public getRegions() {
    return this.httpClient
      .post(this.REST_API_SERVER + '/getRegion', null)
      .pipe(catchError(this.handleError));
  }

  public registration(data: any) {
    return this.httpClient
      .post(this.REST_API_SERVER + '/registration', this.convertFormData(data))
      .pipe(catchError(this.handleError));
  }

  convertFormData(body) {
    var formData: any = new FormData();
    Object.keys(body).forEach((eachKey) => {
      formData.append(eachKey.toString(), body[eachKey]);
    });
    return formData;
  }
}
