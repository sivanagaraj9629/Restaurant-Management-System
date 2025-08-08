import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent {

  role!: string;

  constructor(private router: Router, private authService: AuthService) {}

  ngOnInit(): void {
    this.authService.getRole().subscribe(role => {
      this.role = role;
    });
  }

  goToDashboard() {
    if(this.role === 'admin')
      this.router.navigate(['/admin/dashboard']);
    else
      this.router.navigate(['/dashboard']);
  }

}
