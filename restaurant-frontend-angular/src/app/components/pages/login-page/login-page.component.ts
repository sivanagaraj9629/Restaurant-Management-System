import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/services/auth.service';
import { UserService } from 'src/app/services/user.service';
import { GlobalConstants } from 'src/app/shared/global-constants';

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.scss']
})
export class LoginPageComponent implements OnInit {

  loginForm!: FormGroup;
  isSubmitted = false;
  private userService: UserService;

  constructor(private formBuilder: FormBuilder, private router: Router, private service: UserService, private authService: AuthService,
    private toastrService: ToastrService) {
    this.userService = service;
  }

  ngOnInit(): void {
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  get fc() {
    return this.loginForm.controls;
  }

  login() {
    this.isSubmitted = true;
    if (this.loginForm.invalid)
      return;

    const formData = this.loginForm.value;
    const data = {
      email: formData.email,
      password: formData.password
    };

    this.userService.login(data).subscribe((response: any) => {
      localStorage.setItem('token', response.token);
      const role = AuthService.retrieveTokenRole();
      this.authService.setRole(role);
      if(AuthService.retrieveTokenRole() === 'admin')
        this.router.navigate(['/admin/dashboard']);
      else
        this.router.navigate(['/dashboard']);
    }, (error) => {
      if (error.error?.message)
        this.toastrService.error(error.error?.message);
      else
        this.toastrService.error(GlobalConstants.genericError);
    })
  }
} 