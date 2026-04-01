import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import toast from 'react-hot-toast'

export default function Navbar() {
  const { user, logout, isUser, isManager } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  const handleLogout = () => {
    logout()
    toast.success('Logged out successfully')
    navigate('/')
  }

  const isActive = (path) => location.pathname === path

  return (
    <nav style={{
      background: 'var(--charcoal)',
      borderBottom: '1px solid rgba(255,255,255,0.08)',
      position: 'sticky', top: 0, zIndex: 100,
    }}>
      <div className="container" style={{
        display: 'flex', alignItems: 'center',
        justifyContent: 'space-between', height: 64,
      }}>
        {/* Logo */}
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{ fontSize: '1.5rem' }}>🏨</span>
          <span style={{
            fontFamily: 'var(--font-display)', fontSize: '1.4rem',
            color: 'var(--gold)', fontWeight: 700, letterSpacing: '-0.02em',
          }}>LuxeStay</span>
        </Link>

        {/* Nav Links */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <NavLink to="/" label="Hotels" active={isActive('/')} />

          {user && isUser() && (
            <NavLink to="/my-bookings" label="My Bookings" active={isActive('/my-bookings')} />
          )}
          {user && isManager() && (<>
            <NavLink to="/manager/dashboard" label="Dashboard" active={isActive('/manager/dashboard')} />
            <NavLink to="/manager/hotels" label="My Hotels" active={isActive('/manager/hotels')} />
          </>)}

          {user ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginLeft: 12 }}>
              <div style={{
                display: 'flex', alignItems: 'center', gap: 8,
                padding: '6px 14px', borderRadius: 8,
                background: 'rgba(255,255,255,0.07)',
              }}>
                <div style={{
                  width: 28, height: 28, borderRadius: '50%',
                  background: 'var(--gold)', display: 'flex',
                  alignItems: 'center', justifyContent: 'center',
                  fontWeight: 700, fontSize: '0.8rem', color: 'var(--charcoal)',
                }}>
                  {user.name[0].toUpperCase()}
                </div>
                <span style={{ color: 'rgba(255,255,255,0.85)', fontSize: '0.9rem' }}>
                  {user.name.split(' ')[0]}
                </span>
              </div>
              <button onClick={handleLogout} className="btn btn-sm" style={{
                background: 'rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.8)',
                border: '1px solid rgba(255,255,255,0.15)',
              }}>
                Logout
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', gap: 8, marginLeft: 12 }}>
              <Link to="/login" className="btn btn-sm btn-outline" style={{
                color: 'rgba(255,255,255,0.8)', borderColor: 'rgba(255,255,255,0.2)',
              }}>Login</Link>
              <Link to="/register" className="btn btn-sm btn-gold">Register</Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  )
}

function NavLink({ to, label, active }) {
  return (
    <Link to={to} style={{
      padding: '6px 16px', borderRadius: 8, fontSize: '0.9rem',
      color: active ? 'var(--gold)' : 'rgba(255,255,255,0.65)',
      background: active ? 'rgba(201,168,76,0.1)' : 'transparent',
      fontWeight: active ? 600 : 400,
      transition: 'all 0.15s',
    }}>
      {label}
    </Link>
  )
}
