# QuickLook — Full-Stack E-Commerce Store & REST API

[![Node.js](https://img.shields.io/badge/Node.js-v24+-339933?logo=node.js&logoColor=white)](https://nodejs.org/)
[![Express.js](https://img.shields.io/badge/Express.js-5.x-000000?logo=express&logoColor=white)](https://expressjs.com/)
[![JavaScript](https://img.shields.io/badge/JavaScript-ES6+-F7DF1E?logo=javascript&logoColor=black)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
[![Bootstrap](https://img.shields.io/badge/Bootstrap-5.3-7952B3?logo=bootstrap&logoColor=white)](https://getbootstrap.com/)
[![Tests](https://img.shields.io/badge/Tests-9%20Passing-2ea44f?logo=github-actions&logoColor=white)](#automated-testing)
[![License](https://img.shields.io/badge/License-ISC-blue.svg)](LICENSE)

> A modern, full-stack e-commerce web application for organic skincare and personal care essentials. Built with a clean **Node.js / Express REST API** backend, **modular JavaScript frontend**, **persistent reactive cart state**, **live debounced search/filtering**, and an **automated unit testing suite**.

---

## 📌 Architecture & System Design

```
├── client/ (Frontend UI & State)
│   ├── index.html           # Semantic HTML5 layout, Offcanvas drawers & Modals
│   ├── Assets/CSS/style.css # Custom brand design system, responsive UI, animations
│   └── Assets/JS/script.js  # Reactive client state, cart manager, DOM rendering
│
├── server/ (Backend REST API)
│   ├── server.js            # Express 5 application, middleware, route controllers
│   ├── services/
│   │   └── orderService.js  # Business logic: pricing, GST tax, coupons, validation
│   └── data/
│       ├── products.json    # Structured product catalog data store
│       └── coupons.json     # Promo discount discount policies
│
└── tests/ (Automated Testing)
    └── orderService.test.js # Unit test suite using Node.js native test runner
```

---

## ✨ Key Engineering Features

### 🛒 1. Reactive Shopping Cart & Offcanvas Drawer
- **Persistent State:** Cart items and quantities are synchronized with `localStorage` across page reloads.
- **Dynamic Badge Counter:** Real-time badge counter on navbar cart and wishlist icons.
- **Free Shipping Progress Tracker:** Dynamically computes distance to the free shipping threshold (`₹499`) with a live progress bar.
- **Quantity Stepper:** In-drawer quantity increments, decrements, and item deletion.

### 🔍 2. Live Debounced Search & Multi-criteria Filtering
- **Debounced Search:** Instant multi-field text search matching product name, botanical ingredients, description, and tags.
- **Category Filter Pills:** One-click filter pills (All, Shampoo, Face Wash, Sunscreen, Serums, Body Wash, Lotions, Face Scrub).
- **Sort Engine:** Sort by Featured, Price (Low to High / High to Low), Customer Rating, or Alphabetical (A-Z).

### 🏷️ 3. Authoritative Order Calculation & Promo Engine
- Calculates subtotal, GST (5%), shipping fees, and discount vouchers.
- Active coupon codes:
  - `WELCOME10`: 10% discount on orders above ₹299.
  - `QUICKLOOK20`: 20% discount on orders above ₹599.
  - `FREESHIP`: Waives standard delivery fee.

### 👁️ 4. Product Quick-View Modal
- Detailed product breakdown displaying botanical ingredients, bottle volume, star rating, stock status, and custom quantity selectors.

### 💳 5. End-to-End Checkout Simulation
- Customer delivery address validation (Name, Email format, 10-digit mobile, 6-digit PIN code).
- Generates official order confirmation receipt with unique `Order ID` (e.g. `QL-ORD-849201`) and tracking number.

---

## 🔌 REST API Specification

| Method | Endpoint | Description | Query / Body Params |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/health` | Service uptime and version | None |
| `GET` | `/api/products` | Fetch catalog with filtering & sorting | `category`, `search`, `sort`, `minPrice`, `maxPrice` |
| `GET` | `/api/products/:id` | Get individual product details | `id` (path param) |
| `GET` | `/api/categories` | List all categories with product counts | None |
| `POST` | `/api/cart/calculate`| Server-side authoritative price calculation | `{ items: [], couponCode: "" }` |
| `POST` | `/api/orders` | Validate checkout and place order | `{ customer: {}, items: [], paymentMethod: "" }` |
| `POST` | `/api/contact` | Validate customer support inquiries | `{ name: "", email: "", message: "" }` |

---

## 🧪 Automated Testing

The project includes unit tests for core financial logic, tax rules, discount policies, and form validation using the **Node.js Native Test Runner** (`node:test` & `node:assert`).

Run the test suite:
```bash
npm test
```

### Test Suite Output:
```
▶ Order Service - Cart Calculations
  ✔ returns zero totals and error for empty cart
  ✔ calculates subtotal and item count correctly
  ✔ applies standard shipping fee for orders below free shipping threshold
  ✔ provides free shipping when subtotal is above threshold (₹499)
  ✔ applies WELCOME10 coupon (10% off) accurately
  ✔ rejects coupon if order is below coupon minimum threshold
  ✔ handles FREESHIP coupon waiving shipping on lower value order
✔ Order Service - Cart Calculations (4ms)

▶ Order Service - Checkout Validation
  ✔ validates valid customer data successfully
  ✔ catches invalid email, short phone, and invalid pincode
✔ Order Service - Checkout Validation (1ms)

ℹ tests 9 | pass 9 | fail 0
```

---

## 🚀 Quickstart & Local Setup

### Prerequisites
- [Node.js](https://nodejs.org/) (version 18 or higher recommended)
- Git

### Installation
```bash
# 1. Clone the repository
git clone https://github.com/hetjani2102/quick_look.git

# 2. Navigate to project root
cd quick_look

# 3. Install backend dependencies
npm install

# 4. Start the server
npm start
```

Open your browser at **[http://localhost:3000](http://localhost:3000)**.

To run with automatic server restarts during development:
```bash
npm run dev
```

---

## 👨‍💻 Author

**Het Jani**  
Software Developer  
- **GitHub:** [@hetjani2102](https://github.com/hetjani2102)  
- **Repository:** [https://github.com/hetjani2102/quick_look](https://github.com/hetjani2102/quick_look)
