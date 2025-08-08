import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/services/auth.service';
import { TokenService } from 'src/app/services/token.service';
import { UserService } from 'src/app/services/user.service';
import { GlobalConstants } from 'src/app/shared/global-constants';
import { PasswordValidator } from 'src/app/shared/password-validator';

@Component({
  selector: 'app-change-password-page',
  templateUrl: './change-password-page.component.html',
  styleUrls: ['./change-password-page.component.scss']
})
export class ChangePasswordPageComponent implements OnInit {

  changePasswordForm!: FormGroup;
  isSubmitted = false;

  role!: string;

  constructor(private userService: UserService, private formBuilder: FormBuilder, private router: Router, private toastrService: ToastrService,
    private tokenService: TokenService, private authService: AuthService) {
    this.tokenService.handleTokenValidityBeforePageLoad();
  }

  ngOnInit(): void {
    this.authService.getRole().subscribe(role => {
      this.role = role;
    });
    this.changePasswordForm = this.formBuilder.group({
      oldPassword: ['', Validators.required],
      newPassword: ['', [Validators.required, PasswordValidator.validatePassword()]],
      confirmPassword: ['', Validators.required]
    }, {
      validator: this.validatePasswordMatch
    });
  }

  validatePasswordMatch(form: FormGroup) {
    const newPassword = form.controls['newPassword'].value;
    const confirmPassword = form.controls['confirmPassword'].value;

    if (confirmPassword !== '' && newPassword !== confirmPassword)
      form.controls['confirmPassword'].setErrors({ passwordsMismatch: true });
  }

  get fc() {
    return this.changePasswordForm.controls;
  }

  changePassword() {
    this.isSubmitted = true;
    if (this.changePasswordForm.invalid)
      return;

    const formData = this.changePasswordForm.value;
    const data = {
      oldPassword: formData.oldPassword,
      newPassword: formData.newPassword,
      confirmPassword: formData.confirmPassword
    };

    this.userService.changePassword(data).subscribe((response: any) => {
      this.toastrService.success(response?.message);
      if(this.role === 'admin')
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
