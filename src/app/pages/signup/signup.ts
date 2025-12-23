import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, AbstractControl, ValidationErrors } from '@angular/forms';

@Component({
  selector: 'signup-page',
  standalone: true,
  imports: [CommonModule, RouterLink, ReactiveFormsModule],
  templateUrl: './signup.html',
})
export class Signup {
  title = '';
  signupForm: FormGroup;

  constructor(private fb: FormBuilder) {
    this.signupForm = this.fb.group({
      fullname: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required]],
      terms: [false, [Validators.requiredTrue]]
    }, {
      validators: this.passwordMatchValidator
    });
  }
  passwordMatchValidator(control: AbstractControl): ValidationErrors | null {
    const password = control.get('password');
    const confirmPassword = control.get('confirmPassword');

    if (!password || !confirmPassword) {
      return null;
    }

    return password.value === confirmPassword.value ? null : { passwordMismatch: true };
  }

  onSubmit() {
    if (this.signupForm.valid) {
      const signupData = {
        fullname: this.signupForm.value.fullname,
        email: this.signupForm.value.email,
        password: this.signupForm.value.password
      };
      console.log('Signup data:', signupData);
      alert('Account created successfully!');
    } else {
      Object.keys(this.signupForm.controls).forEach(key => {
        this.signupForm.get(key)?.markAsTouched();
      });
    }
  }
  get fullnameError(): string {
    const control = this.signupForm.get('fullname');
    if (control?.hasError('required') && control?.touched) {
      return 'Full name is required';
    }
    if (control?.hasError('minlength') && control?.touched) {
      return 'Full name must be at least 2 characters';
    }
    return '';
  }

  get emailError(): string {
    const control = this.signupForm.get('email');
    if (control?.hasError('required') && control?.touched) {
      return 'Email is required';
    }
    if (control?.hasError('email') && control?.touched) {
      return 'Please enter a valid email';
    }
    return '';
  }

  get passwordError(): string {
    const control = this.signupForm.get('password');
    if (control?.hasError('required') && control?.touched) {
      return 'Password is required';
    }
    if (control?.hasError('minlength') && control?.touched) {
      return 'Password must be at least 6 characters';
    }
    return '';
  }

  get confirmPasswordError(): string {
    const control = this.signupForm.get('confirmPassword');
    if (control?.hasError('required') && control?.touched) {
      return 'Please confirm your password';
    }
    if (this.signupForm.hasError('passwordMismatch') && control?.touched) {
      return 'Passwords do not match';
    }
    return '';
  }

  get termsError(): string {
    const control = this.signupForm.get('terms');
    if (control?.hasError('required') && control?.touched) {
      return 'You must agree to the terms and privacy policy';
    }
    return '';
  }
}