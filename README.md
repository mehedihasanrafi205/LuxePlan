# 🏡 LuxePlan - Smart Home & Ceremony Decoration Booking System

**Live Website:** [https://luxeplan-0.web.app/](https://luxeplan-0.web.app/)  
**Server Repository:** [https://github.com/mehedihasanrafi205/LuxePlan-server.git](https://github.com/mehedihasanrafi205/LuxePlan-server.git)  
**Client Repository:** [https://github.com/mehedihasanrafi205/LuxePlan.git](https://github.com/mehedihasanrafi205/LuxePlan.git)

---

![LuxePlan Homepage](./screenshots/HomePage.png)

---

## 📌 Project Purpose

**LuxePlan** is a comprehensive appointment and booking management system designed for a modern decoration company offering both in-studio consultations and on-site decoration services for homes, ceremonies, and events. The platform streamlines the entire customer journey from browsing decoration packages to payment, while providing powerful admin and decorator dashboards for business operations.

This project was developed as part of a recruitment assessment to demonstrate full-stack MERN development capabilities, including authentication, role-based access control, payment integration, and real-time project management.

---

## ✨ Key Features

### 🎨 For Clients (Users)
- **Browse & Search Services** - Explore decoration packages with advanced filtering (category, budget range) and search
- **Service Booking** - Book consultations and on-site decoration services with date/time selection
- **Secure Payments** - Integrated Stripe payment gateway with transaction history
- **Booking Management** - View, update, and cancel bookings from user dashboard
- **Payment Tracking** - Complete payment history with receipt details
- **Profile Management** - Update personal information and view booking statistics

### 👔 For Administrators
- **Service Management** - Full CRUD operations for decoration services and packages
- **User Management** - View and manage user accounts with role assignment
- **Decorator Management** - Approve/reject decorator applications, manage status
- **Booking Oversight** - Monitor all bookings, check payment status, assign decorators
- **Analytics Dashboard** - Visual insights with charts:
  - Service demand histogram
  - Booking status distribution (Pie chart)
  - Revenue monitoring
  - Revenue by service breakdown
- **Decorator Assignment** - Assign decorators to paid bookings for on-site services

### 🎨 For Decorators
- **Assigned Projects** - View all assigned decoration projects
- **Today's Schedule** - See today's bookings with time management
- **Project Status Updates** - Update project progress through workflow stages:
  - Assigned → Planning → Materials Prepared → On the Way → Setup in Progress → Completed
- **Earnings Dashboard** - Track completed projects and total earnings
- **Application System** - Apply to become a decorator with portfolio submission

### 🌐 Public Features
- **Animated Hero Section** - Stunning Framer Motion animations on landing
- **Top Services Showcase** - Dynamic top-rated decoration packages
- **Top Decorators** - Featured decorators with ratings and specialties
- **Service Coverage Map** - Interactive React Leaflet map showing service areas
- **Responsive Design** - Mobile-first, fully responsive UI with DaisyUI

---

## 🛠️ Technology Stack

### **Frontend Core**
- **React** 19.2.1 - Latest React with improved performance
- **React Router** 7.10.1 - Client-side routing with nested layouts
- **Vite** 7.2.4 - Lightning-fast build tool and dev server

### **State Management & Data Fetching**
- **TanStack React Query** 5.90.12 - Server state management, caching, and synchronization
- **Axios** 1.13.2 - HTTP client for API requests

### **UI & Styling**
- **Tailwind CSS** 4.1.17 - Utility-first CSS framework
- **DaisyUI** 5.5.8 - Tailwind component library with theme system
- **Framer Motion** 12.23.25 - Production-ready animation library
- **GSAP** 3.14.1 - Professional-grade animation platform
- **React Icons** 5.5.0 - Icon library (Feather Icons)

### **Authentication & Authorization**
- **Firebase** 12.6.0 - Authentication (email/password, social login ready)
- **Firebase ID Tokens** - JWT-based authorization

### **UI Components & Features**
- **React Hook Form** 7.68.0 - Performant form validation
- **React Hot Toast** 2.6.0 - Beautiful toast notifications
- **React Day Picker** 9.12.0 - Accessible date picker component
- **React Leaflet** 5.0.0-rc.2 - Interactive maps integration
- **Recharts** 3.5.1 - Composable charting library for analytics
- **Moment.js** 2.30.1 - Date manipulation and formatting

### **Development Tools**
- **ESLint** 9.39.1 - Code linting with React plugins
- **PostCSS** 8.5.6 - CSS transformations
- **Autoprefixer** 10.4.22 - Vendor prefix automation

---

## 📂 Project Structure

```
LuxePlan/
├── public/               # Static assets
├── src/
│   ├── assets/          # Images, fonts, icons
│   ├── components/      # Reusable components
│   │   ├── Home/        # Home page sections (Hero, TopServices, etc.)
│   │   ├── Shared/      # Navbar, Footer, Modals
│   │   ├── Error.jsx
│   │   ├── LoadingSpinner.jsx
│   │   └── ...
│   ├── firebase/        # Firebase configuration
│   ├── hooks/           # Custom React hooks
│   │   ├── useAuth.js
│   │   ├── useRole.js
│   │   └── useAxiosSecure.js
│   ├── layouts/         # Layout components
│   │   ├── MainLayout.jsx
│   │   └── DashboardLayout.jsx
│   ├── pages/           # Page components
│   │   ├── Home/
│   │   ├── Services/
│   │   ├── Dashboard/
│   │   │   ├── Profile/
│   │   │   ├── MyBookings/
│   │   │   ├── ManageServices/
│   │   │   ├── AssignedProjects/
│   │   │   └── ...
│   │   ├── Login/
│   │   ├── Signup/
│   │   └── ...
│   ├── providers/       # Context providers
│   │   ├── AuthProvider.jsx
│   │   └── ThemeContext.jsx
│   ├── routes/          # Route configuration
│   │   ├── Routes.jsx
│   │   ├── PrivateRoute.jsx
│   │   ├── AdminRoute.jsx
│   │   └── DecoratorRoute.jsx
│   ├── utils/           # Utility functions
│   ├── index.css        # Global styles & Tailwind config
│   └── main.jsx         # App entry point
├── .env.local           # Environment variables (gitignored)
├── firebase.json        # Firebase hosting config
├── vite.config.js       # Vite configuration
└── package.json         # Dependencies
```

---

## 🔐 Pages & Routes

### **Public Routes**
| Route | Component | Description |
|-------|-----------|-------------|
| `/` | Home | Landing page with hero, services, decorators, map |
| `/services` | Services | Browse all services with search/filter |
| `/service/:id` | ServiceDetail | Service details with booking option |
| `/about` | About | Company information |
| `/contact` | Contact | Contact form and details |
| `/login` | Login | User authentication |
| `/signup` | Signup | User registration |
| `/payment-success` | PaymentSuccess | Stripe payment confirmation |

### **Protected Routes (Authenticated Users)**
| Route | Component | Access |
|-------|-----------|--------|
| `/dashboard` | DashboardHome | All users (role-based content) |
| `/dashboard/profile` | Profile | All users |
| `/dashboard/my-bookings` | MyBookings | Clients |
| `/dashboard/payment-history` | PaymentHistory | Clients |
| `/dashboard/apply-decorator` | ApplyDecorator | Clients |

### **Admin Routes** (Role: admin)
| Route | Component | Description |
|-------|-----------|-------------|
| `/dashboard/manage-users` | ManageUsers | View all users |
| `/dashboard/add-service` | AddService | Create new service |
| `/dashboard/manage-services` | ManageServices | CRUD operations on services |
| `/dashboard/manage-decorators` | ManageDecorators | Approve decorators, manage status |
| `/dashboard/manage-bookings` | ManageBookings | Oversee all bookings, assign decorators |
| `/dashboard/analytics` | AdminAnalytics | Business analytics with charts |

### **Decorator Routes** (Role: decorator)
| Route | Component | Description |
|-------|-----------|-------------|
| `/dashboard/assigned-projects` | AssignedProjects | View and update assigned projects |
| `/dashboard/todays-schedule` | TodaysSchedule | Today's bookings |
| `/dashboard/earnings` | Earnings | Completed projects and earnings |

---

## 👥 User Roles & Permissions

### **1. Client (Default)**
- Browse and book services
- Make payments via Stripe
- Manage personal bookings (view, update, cancel)
- View payment history
- Apply to become a decorator

### **2. Admin**
- **Full service CRUD** - Create, read, update, delete decoration services
- **User management** - View users, change roles
- **Decorator approval** - Accept/reject decorator applications
- **Booking oversight** - View all bookings, assign decorators to paid bookings
- **Analytics** - Access business insights and charts

### **3. Decorator**
- View assigned projects
- Update project status (planning → materials → on the way → setup → completed)
- See today's schedule
- Track earnings from completed projects

---

## 🎨 Design & UI/UX

### **Design Philosophy**
- **Luxury Gold Aesthetic** - Premium color palette with gold accents
- **Dark/Light Themes** - Dynamic theme switching via DaisyUI
- **Glassmorphism Effects** - Modern frosted glass UI elements
- **Micro-animations** - Smooth transitions and hover effects
- **Accessibility-First** - WCAG compliant color contrasts

### **Animation Features**
- **Hero Animations** - Framer Motion staggered reveals
- **Page Transitions** - Smooth route change effects
- **Scroll Animations** - GSAP-powered scroll-triggered animations
- **Skeleton Loaders** - Premium loading states for async operations

### **Responsive Design**
- Mobile-first approach
- Breakpoints: `sm`, `md`, `lg`, `xl`, `2xl`
- Touch-optimized UI components
- Collapsible navigation for mobile

---

## 🔒 Authentication & Security

### **Authentication Flow**
1. User registers via email/password (Firebase Auth)
2. User document created in MongoDB with role: "client"
3. On login, Firebase ID Token generated
4. Token sent with API requests in Authorization header
5. Backend verifies token using Firebase Admin SDK
6. Role-based access enforced on both frontend and backend

### **Protected Features**
- **Private Routes** - Redirect to login if not authenticated
- **Role Routes** - Redirect to home if insufficient permissions
- **API Security** - All sensitive endpoints require valid JWT
- **Auto Logout** - Session expiry handling

---

## 💳 Payment Integration

**Provider:** Stripe Checkout (Test Mode)

### **Payment Flow**
1. User selects service and books (creates booking with status: unpaid)
2. User clicks "Pay Now" → redirected to Stripe Checkout
3. Payment processed by Stripe
4. On success → redirected to `/payment-success?session_id={ID}`
5. Frontend fetches session details → backend verifies payment
6. Booking status updated to "paid"
7. Payment record stored in database
8. User can now be assigned a decorator by admin

### **Payment Features**
- Secure Stripe-hosted checkout
- Transaction history in user dashboard
- Payment receipts with transaction IDs
- Duplicate payment prevention

---

## 🌍 Environment Variables

Create a `.env.local` file in the project root:

```env
# Firebase Configuration
VITE_APIKEY=your_firebase_api_key
VITE_AUTHDOMAIN=your_project_id.firebaseapp.com
VITE_PROJECTID=your_project_id
VITE_STORAGEBUCKET=your_project_id.appspot.com
VITE_MESSAGINGSENDERID=your_messaging_sender_id
VITE_APPID=your_app_id

# Backend API
VITE_API_URL=https://luxplan-server.vercel.app
```

> **Note:** All environment variables in Vite must be prefixed with `VITE_`

---

## 🚀 Installation & Setup

### **Prerequisites**
- Node.js 18+ and npm/yarn
- Firebase account
- MongoDB database
- Stripe account (test mode)

### **Installation Steps**

```bash
# Clone the repository
git clone https://github.com/mehedihasanrafi205/LuxePlan.git

# Navigate to project directory
cd LuxePlan

# Install dependencies
npm install

# Create .env.local file and add your environment variables
touch .env.local

# Start development server
npm run dev
```

The app will be available at `http://localhost:5173`

---

## 📜 Available Scripts

```bash
# Development server with hot reload
npm run dev

# Build for production
npm run build

# Preview production build locally
npm run preview

# Run ESLint
npm run lint
```

---

## 🔥 Key Technical Highlights

1. **Modern React Patterns**
   - Custom hooks for auth, role management, and secure axios
   - Context API for global state (auth, theme)
   - React Query for server state with caching

2. **Performance Optimizations**
   - Code splitting with lazy loading
   - Image optimization
   - Debounced search inputs
   - Memoized expensive computations

3. **Code Quality**
   - ESLint configured with React best practices
   - Consistent file/folder naming conventions
   - Reusable component architecture

4. **Developer Experience**
   - Vite for instant HMR
   - Clear project structure
   - Environment-based configuration

---

## 🧪 Testing Credentials

**Admin Account:**
- Email: `admin@gmail.com`
- Password: `Pa$$w0rd!`

**Test Payment:**
- Use Stripe test card: `4242 4242 4242 4242`
- Expiry: Any future date
- CVC: Any 3 digits

---

## 📦 Deployment

### **Firebase Hosting** (Current)

```bash
# Build the project
npm run build

# Deploy to Firebase
firebase deploy
```

**Live URL:** [https://luxeplan-0.web.app/](https://luxeplan-0.web.app/)

### **Alternative Deployment Options**
- **Vercel:** Auto-deploy from GitHub with build command `npm run build`
- **Netlify:** Drag & drop `dist` folder or connect GitHub repo
- **Surge:** `surge dist` after build

---

## 🐛 Known Issues & Limitations

- **Pagination UI:** Page numbers implemented but could be more prominent
- **Social Login:** Firebase social providers configured but not activated
- **Image Upload:** Cloudinary integration ready but not fully implemented in registration

---

## 👨‍💻 Developer

**Mehedi Hasan Rafi**  
- GitHub: [@mehedihasanrafi205](https://github.com/mehedihasanrafi205)
- Email: [mehedihasanrafi205@gmail.com](mailto:mehedihasanrafi205@gmail.com)

---


**Made with 💛 and ⚡ by Mehedi Hasan Rafi**
