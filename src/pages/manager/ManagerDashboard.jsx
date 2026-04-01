import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { hotelAPI, bookingAPI } from '../../services/api'
import { useAuth } from '../../context/AuthContext'

export default function ManagerDashboard() {
  const [hotels, setHotels] = useState([])
  const [allBookings, setAllBookings] = useState([])
  const [loading, setLoading] = useState(true)
  const { user } = useAuth()

  useEffect(() => {
    hotelAPI.getMine().then(async res => {
      const myHotels = res.data
      setHotels(myHotels)
      // Fetch bookings for all hotels
      const bookingPromises = myHotels.map(h => bookingAPI.getByHotel(h.id))
      const results = await Promise.all(bookingPromises)
      setAllBookings(results.flatMap(r => r.data))
    }).finally(() => setLoading(false))
  }, [])

  const activeBookings = allBookings.filter(b => b.status === 'BOOKED')
  const revenue = activeBookings.reduce((sum, b) => sum + (b.finalPrice || 0), 0)

  const stats = [
    { icon: '🏨', label: 'Total Hotels', value: hotels.length, color: '#667eea' },
    { icon: '📅', label: 'Active Bookings', value: activeBookings.length, color: '#43e97b' },
    { icon: '💰', label: 'Total Revenue', value: `₹${revenue.toLocaleString()}`, color: '#f093fb' },
    { icon: '🧳', label: 'Total Bookings', value: allBookings.length, color: '#fa709a' },
  ]

  return (
    <div className="container" style={{ padding: '0 24px 64px' }}>
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
        <div>
          <h1>Dashboard</h1>
          <p>Welcome back, {user?.name}! Here's your overview.</p>
        </div>
        <Link to="/manager/hotels/add" className="btn btn-gold">+ Add Hotel</Link>
      </div>

      {loading ? (
        <div className="loading-center"><div className="spinner"/></div>
      ) : (
        <>
          {/* Stats */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 20, marginBottom: 40 }}>
            {stats.map(s => (
              <div key={s.label} className="card" style={{ padding: 24 }}>
                <div style={{ fontSize: '2rem', marginBottom: 8 }}>{s.icon}</div>
                <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.8rem', fontWeight: 700, color: 'var(--charcoal)' }}>
                  {s.value}
                </div>
                <div style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginTop: 4 }}>{s.label}</div>
              </div>
            ))}
          </div>

          {/* Recent Bookings */}
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem', marginBottom: 20 }}>
            Recent Bookings
          </h2>
          {allBookings.length === 0 ? (
            <div className="empty-state">
              <div className="icon">📋</div>
              <h3>No bookings yet</h3>
              <p>Bookings from guests will appear here</p>
            </div>
          ) : (
            <div className="card" style={{ overflow: 'hidden' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ background: 'var(--cream)', borderBottom: '1px solid var(--border)' }}>
                    {['Guest', 'Hotel', 'Room', 'Dates', 'Amount', 'Status'].map(h => (
                      <th key={h} style={{ padding: '12px 20px', textAlign: 'left', fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 600 }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {allBookings.slice(0, 10).map(b => (
                    <tr key={b.id} style={{ borderBottom: '1px solid var(--border)' }}>
                      <td style={{ padding: '14px 20px', fontWeight: 500 }}>{b.userName}</td>
                      <td style={{ padding: '14px 20px', color: 'var(--text-secondary)' }}>{b.hotelName}</td>
                      <td style={{ padding: '14px 20px', color: 'var(--text-secondary)' }}>{b.roomType}</td>
                      <td style={{ padding: '14px 20px', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                        {b.checkInDate} → {b.checkOutDate}
                      </td>
                      <td style={{ padding: '14px 20px', fontWeight: 600 }}>
                        ₹{b.finalPrice?.toLocaleString()}
                        {b.discountApplied && <span style={{ fontSize: '0.7rem', color: '#92400e', marginLeft: 4 }}>🎁</span>}
                      </td>
                      <td style={{ padding: '14px 20px' }}>
                        <span className={`badge badge-${b.status.toLowerCase()}`}>{b.status}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}
    </div>
  )
}
