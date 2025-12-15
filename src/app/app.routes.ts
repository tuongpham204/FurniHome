import { Routes } from '@angular/router';
import { Home } from './pages/home/home';
import { Login } from './pages/auth/login/login';
import { Signup } from './pages/auth/signup/signup';
export const routes: Routes = [
  { path: '', component: Home, pathMatch: 'full' },

  { path: 'login', component: Login },
  { path: 'signup', component: Signup },
  {
    path: 'products',
    loadComponent: () => import('./pages/products/product-page').then((m) => m.ProductPage),
  },
  {
    path: 'products/:id',
    loadComponent: () =>
      import('./pages/product-detail/product-detail').then((m) => m.ProductDetail),
  },
  { path: 'cart', loadComponent: () => import('./pages/cart/cart').then((m) => m.Cart) },
  { 
    path: 'aboutus', loadComponent: () => import('./shared/about-us/about-us').then((m) => m.AboutUs)
  },
  { 
    path: 'contactus', loadComponent: () => import('./shared/contact/contact').then((m) => m.Contact)
  },
  { 
    path: 'wishlist', loadComponent: () => import('./pages/wishlist/wishlist').then((m) => m.Wishlist)
  },
];
