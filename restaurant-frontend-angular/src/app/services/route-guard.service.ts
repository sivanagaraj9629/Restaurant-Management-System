import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import * as jwt_decode from "jwt-decode";
import { ToastrService } from 'ngx-toastr';
import { GlobalConstants } from '../shared/global-constants';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class RouteGuardService {

  constructor(private router: Router, private toastrService: ToastrService) { }

  /* This method checks if the user is authenticated and has the necessary role to access a particular route.
   * If not, it prevents the user from accessing the route and redirects them to the home page while displaying an error message */
  canActivate(route: ActivatedRouteSnapshot): boolean {
    let expectedRoleArray = route.data['expectedRole'];
    const token: any = localStorage.getItem('token');
    var tokenPayload: any;
    try {
      tokenPayload = jwt_decode.jwtDecode(token);
    }
    catch (error) {
      localStorage.clear();
      this.router.navigate(['']);
      return false;
    }

    let expectedRole = '';
    for (let i = 0; i < expectedRoleArray.length; i++) {
      if (tokenPayload.role == expectedRoleArray[i])
        expectedRole = tokenPayload.role;
    }

    if (tokenPayload.role == 'user' || tokenPayload.role == 'admin') {
      if (AuthService.isAuthenticated() && expectedRole == tokenPayload.role)
        return true;
      else {
        this.toastrService.error(GlobalConstants.unauthorized);
        this.router.navigate(['']);
        return false;
      }
    }
    else {
      this.toastrService.error(GlobalConstants.unauthorized);
      this.router.navigate(['']);
      localStorage.clear();
      return false;
    }

  }

}