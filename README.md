
# 🏡 LuxePlan - Smart Home & Ceremony Decoration Booking System

🔗 **Live Site:** https://luxeplan-0.web.app/  
💻 **Client Repo:** https://github.com/mehedihasanrafi205/LuxePlan  
🛠 **Server Repo:** https://github.com/mehedihasanrafi205/LuxePlan-server  

![LuxePlan Homepage](./screenshots/HomePage.png)

---

## 📖 Overview

**LuxePlan** is a full-stack MERN application designed for a modern decoration company offering **home, ceremony, and event decoration services**.

The platform enables users to browse decoration packages, book services, make secure payments, and track bookings—while providing **role-based dashboards** for **Admins** and **Decorators** to manage operations efficiently.

This project was developed to showcase advanced MERN stack capabilities, including authentication, role-based access control, Stripe payment integration, interactive dashboards, and analytics.

---

## 🚀 Core Features

### 👤 Client Features
- Browse & search decoration services (category & budget filter)
- Book consultation & on-site decoration services
- Secure Stripe payment with history & receipts
- Manage bookings (view, update, cancel)
- Profile & booking statistics dashboard
- Apply to become a decorator

### 🧑‍💼 Admin Features
- Full CRUD for services & packages
- User & role management
- Approve / reject decorator applications
- Assign decorators to paid bookings
- Analytics dashboard (revenue, bookings, service demand)

### 🎨 Decorator Features
- View assigned projects
- Daily work schedule
- Update project status (workflow-based)
- Earnings dashboard

### 🌍 Public Features
- Animated landing page (Framer Motion)
- Featured services & decorators
- Interactive service area map (React Leaflet)
- Fully responsive, mobile-first UI

---

## 🧱 Tech Stack

### Frontend
- React 19 + Vite
- React Router v7
- Tailwind CSS + DaisyUI
- TanStack React Query
- Framer Motion & GSAP
- React Hook Form
- Recharts
- React Leaflet

### Backend
- Node.js
- Express.js
- MongoDB Atlas
- Firebase Admin SDK
- JWT (Firebase ID Tokens)

### Payments & Auth
- Firebase Authentication
- Stripe Checkout (Test Mode)

### Deployment
- Client: Firebase Hosting  
- Server: Vercel  

---

## 🔐 Authentication & Authorization

- Firebase Authentication (Email/Password)
- Role-based access control (Client, Admin, Decorator)
- Protected frontend & backend routes
- Secure API requests using JWT tokens

---

## 💳 Payment System (Stripe)

- Secure Stripe Checkout
- Booking auto-updated after payment
- Transaction history stored in database
- Duplicate payment prevention

**Test Card:**  
4242 4242 4242 4242 | Any future date | Any CVC

---

## 🗂 Project Structure

```

src/
├── components/
├── pages/
│   ├── Home
│   ├── Services
│   ├── Dashboard
├── hooks/
├── routes/
├── providers/
├── firebase/
└── main.jsx

```

---

## 🌱 Environment Variables

Create a `.env.local` file:

VITE_APIKEY=
VITE_AUTHDOMAIN=
VITE_PROJECTID=
VITE_STORAGEBUCKET=
VITE_MESSAGINGSENDERID=
VITE_APPID=
VITE_API_URL=[https://luxplan-server.vercel.app](https://luxplan-server.vercel.app)

---

## ⚙️ Installation

git clone [https://github.com/mehedihasanrafi205/LuxePlan.git](https://github.com/mehedihasanrafi205/LuxePlan.git)
cd LuxePlan
npm install
npm run dev

Runs at: http://localhost:5173

---

## 🧪 Test Credentials

**Admin Account**
- Email: admin@gmail.com
- Password: Pa$$w0rd!

---

## ✨ Highlights

- Role-based dashboards
- Stripe payment integration
- Analytics & charts
- Clean architecture
- Modern UI with animations
- Production-ready MERN setup

---

## 👨‍💻 Author

**Mehedi Hasan Rafi**  
GitHub: https://github.com/mehedihasanrafi205  
Email: mehedihasanrafi205@gmail.com  

---

Made with 💛 using MERN Stack


