import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { UserService } from 'src/app/services/user.service';
import { GlobalConstants } from 'src/app/shared/global-constants';
import { PasswordValidator } from 'src/app/shared/password-validator';

@Component({
  selector: 'app-signup-page',
  templateUrl: './signup-page.component.html',
  styleUrls: ['./signup-page.component.scss']
})
export class SignupPageComponent implements OnInit {

  signUpForm!: FormGroup;
  isSubmitted = false;
  returnUrl = '';
  private userService: UserService;

  constructor(private formBuilder: FormBuilder, private activatedRoute: ActivatedRoute, private router: Router, private service: UserService,
    private toastrService: ToastrService) {
    this.userService = service;
  }

  ngOnInit(): void {
    this.signUpForm = this.formBuilder.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      contactNumber: ['', Validators.required],
      password: ['', [Validators.required, PasswordValidator.validatePassword()]],
      confirmPassword: ['', Validators.required]
    }, {
      validator: this.validateForm
    });
    this.returnUrl = this.activatedRoute.snapshot.queryParams['returnUrl'];
  }

  validateForm(form: FormGroup) {
    const name = form.controls['name'].value;
    const password = form.controls['password'].value;
    const confirmPassword = form.controls['confirmPassword'].value;
    const contactNumber = form.controls['contactNumber'].value;

    if (name !== '' && !/^[a-zA-Z\s]+$/.test(name))
      form.controls['name'].setErrors({ namePattern: true });
    if (confirmPassword !== '' && password !== confirmPassword)
      form.controls['confirmPassword'].setErrors({ passwordsMismatch: true });
    if (contactNumber !== '' && !/^\d+$/.test(contactNumber))
      form.controls['contactNumber'].setErrors({ contactNumberPattern: true });
  }

  get fc() {
    return this.signUpForm.controls;
  }

  signup() {
    this.isSubmitted = true;
    if (this.signUpForm.invalid)
      return;

    const formData = this.signUpForm.value;
    const data = {
      name: formData.name,
      email: formData.email,
      contactNumber: formData.contactNumber,
      password: formData.password,
      confirmPassword: formData.confirmPassword
    };

    this.userService.signup(data).subscribe((response: any) => {
      this.toastrService.success(response?.message);
      this.router.navigateByUrl(this.returnUrl);
    }, (error) => {
      if (error.error?.message)
        this.toastrService.error(error.error?.message);
      else
        this.toastrService.error(GlobalConstants.genericError);
    });
  }
} 