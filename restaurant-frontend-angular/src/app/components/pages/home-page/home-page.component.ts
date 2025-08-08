import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Food } from 'src/app/models/Food';
import { AuthService } from 'src/app/services/auth.service';
import { UserService } from 'src/app/services/user.service';
import { sample_foods } from 'src/app/shared/global-constants';

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.scss']
})
export class HomePageComponent {

  foods: Food[] = [];

  constructor(private userService: UserService, private router: Router) {
    this.loadDashboardWhenAuthenticated();
    this.foods = sample_foods;
  }

  loadDashboardWhenAuthenticated() {
    if (AuthService.isAuthenticated()) {
      this.userService.checkToken().subscribe((response: any) => {
        if(AuthService.retrieveTokenRole() === 'admin')
          this.router.navigate(['/admin/dashboard']);
        else
          this.router.navigate(['/dashboard']);
      }, (error: any) => {
        console.error(error);
        localStorage.clear();
        window.location.reload();
      });
    }
  }

}
