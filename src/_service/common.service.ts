import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router, ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CommonService {
  baseurl = environment.API_ENDPOINT;

  constructor(private http: HttpClient) { }

  getInfo(endpoint: string) {
    const url = this.baseurl + endpoint;
    return this.http.get<any[]>(this.baseurl + endpoint);
  }

  postInfo(endpoint: string, postObject: Object) {
    const url = this.baseurl + endpoint;
    return this.http.post<any>(url, postObject)
      .pipe(map(resp => {
        return resp;
      }));
  }

  putInfo(endpoint: string, postObject: Object) {
    const url = this.baseurl + endpoint;
    return this.http.put<any>(url, postObject)
      .pipe(map(resp => {
        return resp;
      }));
  }

  deleteInfo(endpoint: string) {
    const url = this.baseurl + endpoint;
    return this.http.delete<any>(url)
      .pipe(map(resp => {
        return resp;
      }));
  }
}
