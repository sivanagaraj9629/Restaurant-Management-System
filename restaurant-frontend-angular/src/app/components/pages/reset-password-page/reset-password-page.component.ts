import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { UserService } from 'src/app/services/user.service';
import { GlobalConstants } from 'src/app/shared/global-constants';
import { PasswordValidator } from 'src/app/shared/password-validator';

@Component({
  selector: 'app-reset-password-page',
  templateUrl: './reset-password-page.component.html',
  styleUrls: ['./reset-password-page.component.scss']
})
export class ResetPasswordPageComponent implements OnInit {

  token: string = '';
  resetForm!: FormGroup;
  isSubmitted = false;

  constructor(private route: ActivatedRoute, private userService: UserService, private formBuilder: FormBuilder, private router: Router,
    private toastrService: ToastrService) { }

  ngOnInit(): void {
    /* Access the token value from the route parameters */
    this.route.queryParams.subscribe(params => {
      this.token = params['token'];
    });

    this.resetForm = this.formBuilder.group({
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
    return this.resetForm.controls;
  }

  resetPassword() {
    this.isSubmitted = true;
    if (this.resetForm.invalid)
      return;

    const formData = this.resetForm.value;
    const data = {
      newPassword: formData.newPassword,
      confirmPassword: formData.confirmPassword
    };

    this.userService.resetPassword(data, this.token).subscribe((response: any) => {
      this.toastrService.success(response?.message);
      this.router.navigate(['/login']);
    }, (error) => {
      if (error.error?.message)
        this.toastrService.error(error.error?.message);
      else
        this.toastrService.error(GlobalConstants.genericError);
    })
  }

}