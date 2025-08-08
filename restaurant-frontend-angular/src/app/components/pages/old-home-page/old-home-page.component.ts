import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Food } from 'src/app/models/Food';
import { AuthService } from 'src/app/services/auth.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-old-home-page',
  templateUrl: './old-home-page.component.html',
  styleUrls: ['./old-home-page.component.scss']
})
export class OldHomePageComponent {

  foods: Food[] = [];

  constructor(private userService: UserService, private router: Router) {
    this.loadDashboardWhenAuthenticated();
    //this.foods = this.foodService.getAll();
  }

  loadDashboardWhenAuthenticated() {
    if (AuthService.isAuthenticated()) {
      this.userService.checkToken().subscribe((response: any) => {
        this.router.navigate(['/dashboard']);
      }, (error: any) => {
        console.log(error);
      });
    }
  }

}