import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export type ToastType = 'success' | 'error' | 'info';

export interface Toast {
  id: string;
  type: ToastType;
  title: string;
  message: string;
}

@Injectable({
  providedIn: 'root',
})
export class ToastService {
  private readonly DEFAULT_DURATION = 1000;

  private toastsSubject = new BehaviorSubject<Toast[]>([]);
  toasts$ = this.toastsSubject.asObservable();

  private generateId(): string {
    return `toast-${Date.now()}-${Math.random().toString(36).slice(2)}`;
  }

  private show(type: ToastType, title: string, message: string, duration?: number): void {
    const id = this.generateId();
    const toast: Toast = { id, type, title, message };

    this.toastsSubject.next([...this.toastsSubject.value, toast]);

    setTimeout(() => {
      this.remove(id);
    }, duration ?? this.DEFAULT_DURATION);
  }

  success(message: string, title = 'Success', duration?: number): void {
    this.show('success', title, message, duration);
  }

  error(message: string, title = 'Error', duration = 3000): void {
    this.show('error', title, message, duration);
  }

  info(message: string, title = 'Info', duration?: number): void {
    this.show('info', title, message, duration);
  }

  remove(id: string): void {
    this.toastsSubject.next(this.toastsSubject.value.filter((t) => t.id !== id));
  }
}
