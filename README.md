# 🏨 LuxeStay — Hotel Booking Frontend (React + Vite)

## Tech Stack
- **React 18** + **Vite**
- **React Router v6** — client-side routing with protected routes
- **Axios** — HTTP client with JWT interceptor
- **React Hot Toast** — notifications

---

## Setup & Run

### Prerequisites
- Node.js 18+

### Install & Start
```bash
npm install
npm run dev
```
App runs at: **http://localhost:5173**

> Vite proxies `/api` → `http://localhost:8080` automatically (see `vite.config.js`).

---

## Folder Structure

```
src/
├── components/
│   └── Navbar.jsx              # Sticky navigation bar
├── context/
│   └── AuthContext.jsx         # Global auth state (user, token, login, logout)
├── pages/
│   ├── auth/
│   │   ├── LoginPage.jsx
│   │   └── RegisterPage.jsx
│   ├── user/
│   │   ├── HomePage.jsx        # Hotel search & listing
│   │   ├── HotelDetailPage.jsx # Hotel info + rooms
│   │   ├── BookingPage.jsx     # Booking form with discount preview
│   │   └── MyBookingsPage.jsx  # User booking history + cancel
│   └── manager/
│       ├── ManagerDashboard.jsx   # Stats overview
│       ├── ManagerHotelsPage.jsx  # Hotel CRUD list
│       ├── HotelFormPage.jsx      # Add/Edit hotel form
│       └── ManageRoomsPage.jsx    # Room CRUD + bookings table
├── routes/
│   └── ProtectedRoute.jsx      # Role-aware route guard
├── services/
│   └── api.js                  # Axios instance + all API calls
├── App.jsx                     # Route definitions
├── main.jsx                    # Entry point
└── index.css                   # Global design tokens + utility classes
```

---

## Routes

| Path | Page | Access |
|------|------|--------|
| `/` | Hotel Search (Home) | Public |
| `/hotels/:id` | Hotel Detail & Rooms | Public |
| `/login` | Login | Public |
| `/register` | Register | Public |
| `/my-bookings` | My Bookings | USER only |
| `/book/:roomId` | Book a Room | USER only |
| `/manager/dashboard` | Dashboard | MANAGER only |
| `/manager/hotels` | My Hotels | MANAGER only |
| `/manager/hotels/add` | Add Hotel | MANAGER only |
| `/manager/hotels/:id/edit` | Edit Hotel | MANAGER only |
| `/manager/hotels/:hotelId/rooms` | Manage Rooms + Bookings | MANAGER only |

---

## 🎁 First-Time Discount UI

- **Register Page**: shows promo badge for USER role
- **Hero (Home)**: banner advertising 10% off first booking
- **Hotel Detail**: sidebar reminder for guests not logged in
- **Booking Page**: `discount-banner` component shown to first-timers
- **Price Summary**: shows original price strikethrough + discount line
- **My Bookings**: displays savings badge on discounted bookings

---

## Authentication Flow

1. User logs in → JWT stored in `localStorage`
2. `AuthContext` provides `user`, `token`, `isUser()`, `isManager()`
3. Axios interceptor attaches `Authorization: Bearer <token>` to all requests
4. `ProtectedRoute` checks token presence + role before rendering
5. On 401 response → clears storage + redirects to `/login`
