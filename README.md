
# 💎 LuxePlan - Premium Event & Decor Management System

🔗 **Live Site:** https://luxeplan-0.web.app/  
💻 **Client Repo:** https://github.com/mehedihasanrafi205/LuxePlan  
🛠 **Server Repo:** https://github.com/mehedihasanrafi205/LuxePlan-server  

![LuxePlan Homepage](./screenshots/HomePage.png)

---

## 📖 Overview

**LuxePlan** is a sophisticated, full-stack MERN application redefining how users engage with premium event decoration services. It seamlessly blends high-end aesthetics with powerful functionality, offering a **luxury booking experience** for weddings, corporate events, and home transformations.

Built with a focus on **User Experience (UX)** and **Performance**, LuxePlan leverages advanced animations (GSAP, Lenis), secure payments (Stripe), and role-based access control to provide a complete enterprise-grade solution.

---

## ✨ Key Features

### 🌟 Immersive Frontend Experience
- **Premium Glassmorphism UI:** A modern, frosted-glass aesthetic offering a high-end feel.
- **Advanced Animations:**
    - **GSAP ScrollTrigger:** Elements elegantly fade, slide, and reveal as you scroll.
    - **Lenis Smooth Scroll:** A heavy, luxurious scrolling experience that feels app-like.
    - **Framer Motion:** Smooth micro-interactions for modals and page transitions.
- **Interactive Maps:** React Leaflet integration for visualizing service coverage areas.

### 👤 User Capabilities (Client)
- **Smart Filtering:** Find services by budget, category, and popularity instantly.
- **Seamless Booking:** 
    - Real-time slot availability check.
    - **Sticky Summary:** Booking details follow you as you scroll.
    - **Compact Modals:** Redesigned, non-intrusive booking interfaces.
- **Secure Payments:** Integrated Stripe Checkout for safe, instant transactions.
- **Dashboard:** comprehensive view of booking history and detailed receipts.

### 🛡️ Admin & Decorator Tools
- **Admin Dashboard:** Full control over users, services, and bookings with Recharts analytics.
- **Decorator Portal:** Dedicated view for assigned projects and daily schedules.
- **Role-Based Security:** Strict JWT-based route protection for different user tiers.

---

## 🧱 Tech Stack

### Frontend Engineering
- **Core:** React 19, Vite, React Router v7
- **Styling:** Tailwind CSS v4, DaisyUI v5 (Custom Gold/Dark Theme)
- **Animations:** 
  - **GSAP (GreenSock):** Complex scroll-driven animations and text reveals.
  - **Lenis:** High-performance smooth scrolling.
  - **Framer Motion:** Component-level gestures and transitions.
- **State & Data:** TanStack React Query (Server State), Context API (Auth).
- **Forms:** React Hook Form.
- **Maps:** React Leaflet.

### Backend Infrastructure
- **Server:** Node.js, Express.js
- **Database:** MongoDB Atlas (Mongoose ODM)
- **Authentication:** Firebase Admin SDK (Verify ID Tokens), JWT
- **Payments:** Stripe API

### DevOps & Deployment
- **Frontend:** Firebase Hosting
- **Backend:** Vercel / Render
- **CI/CD:** Manual triggers

---

## 🔐 Security & Auth

- **Firebase Authentication:** Robust identity management (Email/Password, Social Auth).
- **JWT Authorization:** Secure communication between client and server.
- **HttpOnly Cookies:** Protection against XSS attacks.
- **Role-Based Access Control (RBAC):** Granular permissions for Admin, Decorator, and User.

---

## 💳 Payment Integration

LuxePlan uses **Stripe** to handle real-world payments in a test environment.
- **Instant Verification:** Webhooks ensure bookings are confirmed only after successful payment.
- **Transaction History:** All payments are logged with transaction IDs for auditing.

**Test Card Credentials:**
- **Card Number:** `4242 4242 4242 4242`
- **Expiry:** Any future date
- **CVC:** Any 3 digits

---

## 🗂 Project Structure

```bash
LuxePlan/src
├── components/         # Reusable UI components (Modals, Cards, Navbar)
├── pages/              # Route-based page components
│   ├── Home/           # Hero, Stats, Testimonials
│   ├── Services/       # Service Listing, Filtering, Details
│   ├── Dashboard/      # Admin & User Dashboards
│   └── Shared/         # Layouts, Footer, Navbar
├── hooks/              # Custom Hooks (useAxiosSecure, useGSAPAnimations)
├── layouts/            # MainLayout (with Lenis), DashboardLayout
├── providers/          # AuthProvider context
└── routes/             # Router configuration (Private/Admin Routes)
```

---

## 🌱 Environment Variables

To run this project locally, create a `.env.local` file in the root directory:

```env
VITE_APIKEY=your_firebase_api_key
VITE_AUTHDOMAIN=your_firebase_auth_domain
VITE_PROJECTID=your_firebase_project_id
VITE_STORAGEBUCKET=your_firebase_storage_bucket
VITE_MESSAGINGSENDERID=your_firebase_messaging_sender_id
VITE_APPID=your_firebase_app_id
VITE_API_URL=http://localhost:5000 
VITE_STRIPE_PUBLIC_KEY=your_stripe_pk
```

---

## ⚙️ Installation & Run

1.  **Clone the Repository**
    ```bash
    git clone https://github.com/mehedihasanrafi205/LuxePlan.git
    cd LuxePlan
    ```

2.  **Install Dependencies**
    ```bash
    npm install
    ```

3.  **Start Development Server**
    ```bash
    npm run dev
    ```
    The app will be available at `http://localhost:5173`

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
- **GitHub:** [mehedihasanrafi205](https://github.com/mehedihasanrafi205)  
- **Email:** mehedihasanrafi205@gmail.com  

---

Made with 💛 using MERN Stack


