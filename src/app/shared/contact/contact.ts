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
      terms: [false, Validators.requiredTrue],
    });
  }

  // ================= SUBMIT =================
  onSubmit(): void {
    if (this.contactForm.invalid) {
      this.contactForm.markAllAsTouched();
      return;
    }

    this.isSubmitting = true;
    this.contactForm.disable();

    // Mock API submit
    setTimeout(() => {
      this.showSuccessMessage = true;
      this.isSubmitting = false;

      this.contactForm.reset({
        name: '',
        email: '',
        message: '',
        terms: false,
      });

      this.contactForm.enable();

      setTimeout(() => {
        this.showSuccessMessage = false;
      }, 5000);
    }, 1000);
  }

  // ================= VALIDATION HELPERS =================
  private isInvalid(controlName: string): boolean {
    const control = this.contactForm.get(controlName);
    return !!(control && control.invalid && (control.touched || control.dirty));
  }

  get nameError(): string {
    const c = this.contactForm.get('name');
    if (!this.isInvalid('name')) return '';
    if (c?.hasError('required')) return 'Name is required';
    if (c?.hasError('minlength')) return 'Name must be at least 2 characters';
    return '';
  }

  get emailError(): string {
    const c = this.contactForm.get('email');
    if (!this.isInvalid('email')) return '';
    if (c?.hasError('required')) return 'Email is required';
    if (c?.hasError('email')) return 'Please enter a valid email';
    return '';
  }

  get messageError(): string {
    const c = this.contactForm.get('message');
    if (!this.isInvalid('message')) return '';
    if (c?.hasError('required')) return 'Message is required';
    if (c?.hasError('minlength')) return 'Message must be at least 10 characters';
    return '';
  }

  get termsError(): string {
    if (!this.isInvalid('terms')) return '';
    return 'You must agree to the terms';
  }
}
