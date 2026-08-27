# 🛍️ E-Commerce Platform

A full-stack e-commerce platform built with **React, Vite, Node.js, Express, MySQL, and Stripe**.

The project provides a complete shopping experience including user authentication, product browsing, cart management, quantity controls, checkout, Stripe payments, order tracking, and automatic inventory updates.

---

## ✨ Features

### 🔐 Authentication
- User registration
- User login
- JWT-based authentication
- Protected checkout and order functionality
- Logout functionality

### 🛒 Shopping Cart
- Add products to cart
- Add multiple quantities of the same product
- Increase/decrease product quantity
- Remove products from cart
- Automatic cart total calculation
- Stock-aware quantity controls
- Out-of-stock handling

### 📦 Products
- Product listing
- Product name and description
- Product pricing
- Real-time stock display
- Automatic stock reduction after successful payment
- Out-of-stock state

### 💳 Payments
- Stripe Checkout integration
- Secure payment processing
- Stripe webhook integration
- Payment status tracking
- Payment success page
- Payment cancellation handling

### 📋 Orders
- Create orders during checkout
- View previous orders
- Order total
- Order status
- Payment status
- Order creation date
- Automatic order status update after successful Stripe payment

### 📱 Responsive Design
- Desktop storefront
- Tablet-friendly layout
- Mobile-friendly product grid
- Responsive cart
- Responsive navigation
- No horizontal product overflow on mobile

---

## 🧰 Tech Stack

### Frontend

- React
- Vite
- JavaScript
- CSS
- Fetch API

### Backend

- Node.js
- Express.js
- JWT Authentication
- REST API

### Database

- MySQL
- Relational database design
- Foreign-key relationships between users, orders, products, and order items

### Payments

- Stripe Checkout
- Stripe Webhooks

### Deployment

- Frontend: Vercel
- Backend: Render
- Database: MySQL / Railway

---

## 🏗️ Project Structure

```text
E-Commerce Platform/
│
├── backend/
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── routes/
│   ├── .env
│   ├── package.json
│   └── server.js
│
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── assets/
│   │   ├── App.jsx
│   │   ├── App.css
│   │   ├── index.css
│   │   └── main.jsx
│   ├── package.json
│   ├── vite.config.js
│   └── vercel.json
│
└── README.md
