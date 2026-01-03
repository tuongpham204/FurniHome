# FurniHome – Furniture E-commerce Web

A frontend-focused e-commerce web application for furniture shopping, built with **Angular** and **Tailwind CSS**, using **JSON Server** as a mock REST API.  
This project is created as a **portfolio project for Frontend Intern positions**, focusing on Angular fundamentals, API integration, and responsive UI.

## 🔗 Live Demo

https://furni-home-pi.vercel.app/

## ✨ Features

- Product listing fetched from REST API
- Product detail page with images, description, and price
- Shopping cart: add, update quantity, remove products
- Cart summary and basic checkout UI
- Responsive design for desktop and mobile
- Clean UI built with Tailwind CSS

## 🛠 Tech Stack

- **Framework:** Angular 18 
- **Styling:** Tailwind CSS
- **Mock API:** JSON Server
- **Language:** TypeScript
- **Package Manager:** npm

## ⚙️ Setup & Run Locally

### 1. Clone the repository

``bash
git clone https://github.com/tuongpham204/FurniHome.git
cd FurniHome


### 2. Install dependencies

npm install

### 3. Run JSON Server (Mock API)

Make sure you have a db.json file in the root directory.

npx json-server --watch db.json --port 3000

### 4. Run Angular development server

npm start

Open your browser at:

http://localhost:4200

### 🧠 What I Learned

Building a frontend-focused e-commerce application with Angular

Working with REST APIs using HttpClient and Observables

Managing component state and data flow in Angular

Creating responsive layouts with Tailwind CSS

Separating UI components and business logic

### 🚀 Possible Improvements

Refactor the project into feature-based modules with lazy loading

Improve cart state management using BehaviorSubject or Angular Signals

Add global loading and error handling with HttpInterceptor

Implement unit tests for services and components

Improve accessibility (ARIA attributes, keyboard navigation)

📌 Author

Name: Tuong Pham

Role: Frontend Developer (Intern-level)

GitHub: https://github.com/tuongpham204
```
