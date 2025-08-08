import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { UserService } from 'src/app/services/user.service';
import { GlobalConstants } from 'src/app/shared/global-constants';

@Component({
  selector: 'app-forgot-password-page',
  templateUrl: './forgot-password-page.component.html',
  styleUrls: ['./forgot-password-page.component.scss']
})
export class ForgotPasswordPageComponent {

  forgotPasswordForm!: FormGroup;
  isSubmitted = false;
  private userService: UserService;
  private responseMessage: any;

  constructor(private formBuilder: FormBuilder, private service: UserService, private toastrService: ToastrService) {
    this.userService = service;
  }

  ngOnInit(): void {
    this.forgotPasswordForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]]
    });
  }

  get fc() {
    return this.forgotPasswordForm.controls;
  }

  forgotPassword() {
    this.isSubmitted = true;
    if (this.forgotPasswordForm.invalid)
      return;

    this.userService.forgotPassword({email: this.forgotPasswordForm.value.email}).subscribe((response: any) => {
      this.toastrService.success(response?.message);
    }, (error: any) => {
      if (error.error?.message)
        this.toastrService.error(error.error?.message);
      else
        this.toastrService.error(GlobalConstants.genericError);
    })
  }

}