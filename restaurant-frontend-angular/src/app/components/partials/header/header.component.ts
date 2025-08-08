import { Component, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent {

  role: string = '';
  private routerSubscription: Subscription | undefined;
  menuToggle: boolean = false;

  constructor(private userService: UserService, private authService: AuthService, private router: Router) {
    /* Subscribe to router events */
    this.routerSubscription = this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        if (this.isAuth) {
          this.role = AuthService.retrieveTokenRole();
        }
      }
    });
  }

  ngOnDestroy() {
    /* Unsubscribe from router events to avoid memory leaks */
    if (this.routerSubscription) {
      this.routerSubscription.unsubscribe();
    }
  }

  get isAuth() {
    return AuthService.isAuthenticated();
  }

  logout() {
    this.userService.logout();
    this.router.navigate(['']);
  }

  goToDashboard() {
    if (this.role === 'admin')
      this.router.navigate(['/admin/dashboard']);
    else
      this.router.navigate(['/dashboard']);
  }

  toggleMenu(): void {
    this.menuToggle = !this.menuToggle;
  }

}