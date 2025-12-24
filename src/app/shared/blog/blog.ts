import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule, Calendar, User } from 'lucide-angular';

interface BlogPost {
  id: number;
  title: string;
  description: string;
  image: string;
  category: string;
}

@Component({
  selector: 'app-blog',
  standalone: true,
  imports: [CommonModule, LucideAngularModule],
  templateUrl: './blog.html',
})
export class Blog {
  posts: BlogPost[] = [
    {
      id: 1,
      title: 'Modern Furniture Trends for Contemporary Homes',
      description:
        'Explore the latest modern furniture trends that focus on clean lines, neutral tones, and functional designs. These ideas help create a comfortable and stylish living space that fits today’s lifestyle.',
      image:
        'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=800&q=80',
      category: 'Trends',
    },
    {
      id: 2,
      title: 'How to Choose the Perfect Sofa for Your Living Room',
      description:
        'Choosing the right sofa is essential for both comfort and aesthetics. This guide helps you understand materials, sizes, and styles to find a sofa that complements your interior perfectly.',
      image:
        'https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      category: 'Guide',
    },
    {
      id: 3,
      title: 'Wooden Furniture Care: Simple Tips for Long-lasting Beauty',
      description:
        'Wooden furniture adds warmth and elegance to any home. Learn simple maintenance tips to protect surfaces, prevent damage, and keep your furniture looking beautiful for years.',
      image:
        'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=800&q=80',
      category: 'Tips',
    },
    {
      id: 4,
      title: 'Minimalist Interior Design with Natural Furniture',
      description:
        'Minimalist interiors focus on simplicity and balance. Discover how natural furniture materials can enhance minimalist spaces while maintaining comfort and functionality.',
      image:
        'https://images.unsplash.com/photo-1615874959474-d609969a20ed?auto=format&fit=crop&w=800&q=80',
      category: 'Inspiration',
    },
    {
      id: 5,
      title: 'Lighting Ideas to Elevate Your Home Atmosphere',
      description:
        'Proper lighting can completely transform your living space. Learn how to choose lighting fixtures that highlight furniture and create a warm, inviting atmosphere.',
      image:
        'https://images.unsplash.com/photo-1669161661816-306b225e9157?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      category: 'Lighting',
    },
    {
      id: 6,
      title: 'Space-saving Furniture Solutions for Small Apartments',
      description:
        'Living in a small apartment doesn’t mean sacrificing style. Discover smart furniture solutions designed to maximize space while maintaining elegance and comfort.',
      image:
        'https://images.unsplash.com/photo-1598300056393-4aac492f4344?auto=format&fit=crop&w=800&q=80',
      category: 'Solutions',
    },
  ];
}
