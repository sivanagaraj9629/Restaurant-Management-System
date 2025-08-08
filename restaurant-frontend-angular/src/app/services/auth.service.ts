import { Injectable } from '@angular/core';
import * as jwt_decode from "jwt-decode";
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private roleSubject: BehaviorSubject<string> = new BehaviorSubject<string>('');

  constructor() { }

  public static retrieveToken(): string {
    let token = '';
    if (localStorage.getItem('token')) {
      token = String(localStorage.getItem('token'));
    }
    return token;
  }

  public static isAuthenticated(): boolean {
    const token = localStorage.getItem('token');
    if (!token) {
      return false;
    }
    else
      return true;
  }

  public static retrieveTokenRole(): string {
    const token = localStorage.getItem('token');
    var tokenPayload: any;
    if(token) {
      tokenPayload = jwt_decode.jwtDecode(token);
    }
    return tokenPayload.role;
  }

  setRole(role: string) {
    this.roleSubject.next(role);
  }

  getRole(): BehaviorSubject<string> {
    return this.roleSubject;
  }

}