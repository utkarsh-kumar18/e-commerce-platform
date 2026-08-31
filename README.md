# 🛍️ E-Commerce Platform

A full-stack e-commerce platform built with **React, Vite, Node.js, Express, MySQL, and Stripe**.

The application provides a complete online shopping experience with user authentication, product browsing, search and filtering, shopping cart management, Stripe checkout, order tracking, inventory management, and an admin dashboard.

---

## 🌐 Live Demo

**Live Application:**  
https://e-commerce-platform-live.vercel.app/

**GitHub Repository:**  
https://github.com/utkarsh-kumar18/e-commerce-platform

---

## ✨ Features

### 🔐 User Authentication

- User registration
- User login
- JWT-based authentication
- Protected checkout and order functionality
- Logout functionality
- Role-based admin access

---

### 🛍️ Product Management

- Product listing
- Product name and description
- Product categories
- Product pricing
- Product search
- Category filtering
- Minimum and maximum price filtering
- Out-of-stock handling
- Automatic stock reduction after successful payment

---

### 🛒 Shopping Cart

- Add products to cart
- Add multiple quantities of the same product
- Increase/decrease product quantity
- Remove products from cart
- Automatic cart total calculation
- Stock-aware quantity controls
- Out-of-stock handling

---

### 💳 Payments

- Stripe Checkout integration
- Secure payment processing
- Stripe webhook integration
- Payment status tracking
- Payment success page
- Payment cancellation handling

---

### 📦 Orders

- Create orders during checkout
- View previous orders
- Order total
- Order status
- Payment status
- Order creation date
- Automatic order status update after successful payment

---

### 🛠️ Admin Dashboard

The platform includes a protected admin dashboard for inventory management.

- Admin-only authentication
- Inventory overview
- View all products
- Add new products
- Edit existing products
- Update product price
- Update product stock
- Update product information
- Delete products
- Real-time inventory listing
- Role-based access protection

The admin dashboard supports complete product CRUD operations:

**Create → Read → Update → Delete**

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
  
### Payments

- Stripe Checkout
- Stripe Webhooks

### Deployment

- **Frontend:** Vercel
- **Backend:** Render
- **Database:** MySQL / Railway

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
│   │   ├── AdminPage.jsx
│   │   ├── App.jsx
│   │   ├── App.css
│   │   ├── index.css
│   │   └── main.jsx
│   ├── package.json
│   ├── vite.config.js
│   └── vercel.json
│
├── .gitignore
└── README.md
