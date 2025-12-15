import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import {
  LucideAngularModule,
  MapPin,
  Phone,
  Mail,
  Facebook,
  Instagram,
  Twitter,
  Send,
  CheckCircle2,
} from 'lucide-angular';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, LucideAngularModule],
  templateUrl: './contact.html',
})
export class Contact {
  // Lucide icons
  MapPinIcon = MapPin;
  PhoneIcon = Phone;
  MailIcon = Mail;
  FacebookIcon = Facebook;
  InstagramIcon = Instagram;
  TwitterIcon = Twitter;
  SendIcon = Send;
  CheckIcon = CheckCircle2;

  contactForm: FormGroup;
  showSuccessMessage = false;
  isSubmitting = false;

  constructor(private fb: FormBuilder) {
    this.contactForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      message: ['', [Validators.required, Validators.minLength(10)]],
      terms: [false, [Validators.requiredTrue]]
    });
  }

  onSubmit() {
    if (this.contactForm.valid) {
      this.isSubmitting = true;

      // Simulate API call
      setTimeout(() => {
        console.log('Contact form submitted:', this.contactForm.value);
        this.showSuccessMessage = true;
        this.isSubmitting = false;
        this.contactForm.reset();

        // Hide success message after 5 seconds
        setTimeout(() => {
          this.showSuccessMessage = false;
        }, 5000);
      }, 1000);
    } else {
      // Mark all fields as touched to show validation errors
      Object.keys(this.contactForm.controls).forEach(key => {
        this.contactForm.get(key)?.markAsTouched();
      });
    }
  }

  // Helper methods for validation messages
  get nameError(): string {
    const control = this.contactForm.get('name');
    if (control?.hasError('required') && control?.touched) {
      return 'Name is required';
    }
    if (control?.hasError('minlength') && control?.touched) {
      return 'Name must be at least 2 characters';
    }
    return '';
  }

  get emailError(): string {
    const control = this.contactForm.get('email');
    if (control?.hasError('required') && control?.touched) {
      return 'Email is required';
    }
    if (control?.hasError('email') && control?.touched) {
      return 'Please enter a valid email';
    }
    return '';
  }

  get messageError(): string {
    const control = this.contactForm.get('message');
    if (control?.hasError('required') && control?.touched) {
      return 'Message is required';
    }
    if (control?.hasError('minlength') && control?.touched) {
      return 'Message must be at least 10 characters';
    }
    return '';
  }

  get termsError(): string {
    const control = this.contactForm.get('terms');
    if (control?.hasError('required') && control?.touched) {
      return 'You must agree to the terms';
    }
    return '';
  }
}