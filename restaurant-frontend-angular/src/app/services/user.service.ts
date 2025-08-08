import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private url = environment.apiUrl;
  private httpOptions: any;
  private httpClient: HttpClient;

  constructor(private http: HttpClient) {
    this.httpClient = this.http;
    this.httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) };
  }

  signup(data: any): Observable<any> {
    return this.httpClient.post(this.url + "/users/signup", data, this.httpOptions);
  }

  login(data: any): Observable<any> {
    return this.httpClient.post(this.url + "/users/login", data, this.httpOptions);
  }

  forgotPassword(data: any): Observable<any> {
    return this.httpClient.post(this.url + "/users/forgotPassword", data, this.httpOptions);
  }

  resetPassword(data: any, token: any): Observable<any> {
    return this.httpClient.post(this.url + "/users/resetPassword", data,
      { headers: new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token }) });
  }

  changePassword(data: any): Observable<any> {
    this.httpOptions.headers = this.httpOptions.headers.set('Authorization', 'Bearer ' + AuthService.retrieveToken());
    return this.httpClient.post(this.url + "/users/changePassword", data, this.httpOptions);
  }

  checkToken(): Observable<any> {
    this.httpOptions.headers = this.httpOptions.headers.set('Authorization', 'Bearer ' + AuthService.retrieveToken());
    return this.httpClient.get(this.url + "/users/checkToken", this.httpOptions);
  }

  logout() {
    localStorage.removeItem('token');
    window.location.reload();
  }

  getCurrentUser(): Observable<any> {
    this.httpOptions.headers = this.httpOptions.headers.set('Authorization', 'Bearer ' + AuthService.retrieveToken());
    return this.httpClient.get(this.url + "/users/currentUser", this.httpOptions);
  }

  getAllUsers(): Observable<any> {
    this.httpOptions.headers = this.httpOptions.headers.set('Authorization', 'Bearer ' + AuthService.retrieveToken());
    return this.httpClient.get(this.url + "/users/all", this.httpOptions);
  }

  updateStatus(data: any): Observable<any> {
    this.httpOptions.headers = this.httpOptions.headers.set('Authorization', 'Bearer ' + AuthService.retrieveToken());
    return this.httpClient.post(this.url + "/users/updateStatus", data, this.httpOptions);
  }

}