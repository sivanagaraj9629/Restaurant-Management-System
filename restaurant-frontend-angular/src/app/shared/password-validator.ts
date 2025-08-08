import { AbstractControl, ValidationErrors, ValidatorFn } from "@angular/forms";

export class PasswordValidator {

    /* Custom validator function for password */
    public static validatePassword(): ValidatorFn {
        return (control: AbstractControl): ValidationErrors | null => {
            const value = control.value as string;
            const errors: ValidationErrors = {};
            if (!value) {
                return null;
            }
            if (!/^[a-zA-Z0-9!.,*]+$/.test(value)) {
                errors['passwordPattern'] = true;
                return errors;
            }
            if (!/[A-Z]/.test(value)) {
                errors['uppercaseRequired'] = true;
                return errors;
            }
            if (!/\d/.test(value)) {
                errors['numberRequired'] = true;
                return errors;
            }
            if (!/[!*,.?]/.test(value)) {
                errors['specialCharRequired'] = true;
                return errors;
            }
            if (value.length < 8) {
                errors['minLengthRequired'] = true;
                return errors;
            }
            return null; // Password meets all criteria
        };
    }

}