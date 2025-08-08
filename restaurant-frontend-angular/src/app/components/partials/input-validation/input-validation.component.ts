import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { AbstractControl } from '@angular/forms';

const VALIDATORS_MESSAGES: any = {
  required: 'Should not be empty',
  email: 'Email is not valid',
  namePattern: 'Name is not valid',
  contactNumberPattern: 'Contact number is not valid',
  addressPattern: 'Address is not valid',
  passwordPattern: 'Password is not valid',
  uppercaseRequired: 'Include an uppercase letter',
  numberRequired: 'Include a number',
  specialCharRequired: 'Include a special character (!*,.?)',
  minLengthRequired: 'Must be at least 8 characters long',
  passwordsMismatch: 'Passwords do not match'
}

@Component({
  selector: 'input-validation',
  templateUrl: './input-validation.component.html',
  styleUrls: ['./input-validation.component.scss']
})
export class InputValidationComponent implements OnInit, OnChanges {

  @Input()
  control!: AbstractControl;
  @Input()
  showErrors: boolean = true;
  errorMessages: string[] = [];

  constructor() { }

  /* This method is used to set up two listeners for the statusChanges and valueChanges events on the input control.
   * When you create a form control using Angular Reactive Forms, it comes with a set of properties and methods to manage its
   * state and behavior. One of these properties is statusChanges, which is an Observable that emits whenever the validation
   * statusof the form control changes */
  ngOnInit(): void {
    this.control.statusChanges.subscribe(() => {
      this.checkValidation();
    });
    this.control.valueChanges.subscribe(() => {
      this.checkValidation();
    });
  }

  checkValidation(): void {
    const errors = this.control.errors;
    /* Using if(!errors) checks if the value of errors is falsy, which includes null, undefined, 0, an empty string, etc */
    if (!errors) {
      this.errorMessages = [];
      return;
    }
    const errorKeys = Object.keys(errors); // retrieves an array of the property names (keys) of the errors object
    /* For each key in errorKeys, it accesses the corresponding value in the VALIDATORS_MESSAGES object using the key.
     * The resulting array contains the error messages corresponding to the keys found in the errors object */
    this.errorMessages = errorKeys.map(key => VALIDATORS_MESSAGES[key]);
  }

  /* This method is used to call the checkValidation function whenever there are changes in the values of the input properties.
   * In Angular, input properties are properties of a component that are intended to receive values from its parent component.
  * These input properties are declared using the @Input() decorator */
  ngOnChanges(changes: SimpleChanges): void {
    this.checkValidation();
  }

}
