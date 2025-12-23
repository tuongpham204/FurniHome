import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Observable } from 'rxjs';

import { ToastService, Toast } from '../../service/toast.service';

@Component({
  selector: 'app-toast',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './toast.component.html',
})
export class ToastComponent {
  toasts$: Observable<Toast[]>;

  constructor(public toastService: ToastService) {
    this.toasts$ = this.toastService.toasts$;
  }

  removeToast(id: string): void {
    this.toastService.remove(id);
  }
}
