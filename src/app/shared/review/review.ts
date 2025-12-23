import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule, Star } from 'lucide-angular';
@Component({
  selector: 'app-review',
  standalone: true,
  imports: [CommonModule, LucideAngularModule],
  templateUrl: './review.html',
})
export class Review {
  title = 'my-ecommerce';

  Star = Star;
}
