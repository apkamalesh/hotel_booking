import { Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import Navbar from './components/Navbar'
import ProtectedRoute from './routes/ProtectedRoute'

// Auth Pages
import LoginPage    from './pages/auth/LoginPage'
import RegisterPage from './pages/auth/RegisterPage'

// User Pages
import HomePage        from './pages/user/HomePage'
import HotelDetailPage from './pages/user/HotelDetailPage'
import BookingPage     from './pages/user/BookingPage'
import MyBookingsPage  from './pages/user/MyBookingsPage'

// Manager Pages
import ManagerDashboard  from './pages/manager/ManagerDashboard'
import ManagerHotelsPage from './pages/manager/ManagerHotelsPage'
import HotelFormPage     from './pages/manager/HotelFormPage'
import ManageRoomsPage   from './pages/manager/ManageRoomsPage'

export default function App() {
  return (
    <AuthProvider>
      <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
        <Routes>
          {/* Auth routes — no Navbar */}
          <Route path="/login"    element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          {/* All other routes — with Navbar */}
          <Route path="/*" element={
            <>
              <Navbar />
              <div style={{ flex: 1 }}>
                <Routes>
                  {/* Public */}
                  <Route path="/"           element={<HomePage />} />
                  <Route path="/hotels/:id" element={<HotelDetailPage />} />

                  {/* User Protected */}
                  <Route path="/my-bookings" element={
                    <ProtectedRoute role="USER"><MyBookingsPage /></ProtectedRoute>
                  }/>
                  <Route path="/book/:roomId" element={
                    <ProtectedRoute role="USER"><BookingPage /></ProtectedRoute>
                  }/>

                  {/* Manager Protected */}
                  <Route path="/manager/dashboard" element={
                    <ProtectedRoute role="HOTEL_MANAGER"><ManagerDashboard /></ProtectedRoute>
                  }/>
                  <Route path="/manager/hotels" element={
                    <ProtectedRoute role="HOTEL_MANAGER"><ManagerHotelsPage /></ProtectedRoute>
                  }/>
                  <Route path="/manager/hotels/add" element={
                    <ProtectedRoute role="HOTEL_MANAGER"><HotelFormPage /></ProtectedRoute>
                  }/>
                  <Route path="/manager/hotels/:id/edit" element={
                    <ProtectedRoute role="HOTEL_MANAGER"><HotelFormPage /></ProtectedRoute>
                  }/>
                  <Route path="/manager/hotels/:hotelId/rooms" element={
                    <ProtectedRoute role="HOTEL_MANAGER"><ManageRoomsPage /></ProtectedRoute>
                  }/>

                  <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
              </div>

              {/* Footer */}
              <footer style={{
                background: 'var(--charcoal)', color: 'rgba(255,255,255,0.4)',
                textAlign: 'center', padding: '24px',
                fontSize: '0.85rem', borderTop: '1px solid rgba(255,255,255,0.06)',
              }}>
                © 2025 LuxeStay · Hotel Booking System
              </footer>
            </>
          }/>
        </Routes>
      </div>
    </AuthProvider>
  )
}
