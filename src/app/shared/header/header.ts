import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import {LucideAngularModule, ShoppingCart, Search, Heart } from 'lucide-angular';
@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterLink , LucideAngularModule],
  templateUrl: './header.html',
})
export class Header {
  ShoppingCart = ShoppingCart;
  search = Search;
  heart = Heart;

}
