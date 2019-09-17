import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subscribable, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ESServiceService {

  constructor(private http: HttpClient) { }

  get(qryURL: string): Observable<any> {
    return this.http.get(qryURL);
  }

  post(qryURL: string, params: object) {
    return this.http.post(qryURL, params);
  }
}
