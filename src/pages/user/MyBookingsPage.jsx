import { useState, useEffect } from 'react'
import { bookingAPI } from '../../services/api'
import toast from 'react-hot-toast'

export default function MyBookingsPage() {
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => { fetchBookings() }, [])

  const fetchBookings = async () => {
    try {
      const res = await bookingAPI.getMine()
      setBookings(res.data)
    } finally {
      setLoading(false)
    }
  }

  const handleCancel = async (id) => {
    if (!confirm('Cancel this booking?')) return
    try {
      await bookingAPI.cancel(id)
      toast.success('Booking cancelled')
      fetchBookings()
    } catch (err) {
      toast.error(err.response?.data?.error || 'Could not cancel booking')
    }
  }

  const active    = bookings.filter(b => b.status === 'BOOKED')
  const cancelled = bookings.filter(b => b.status === 'CANCELLED')

  return (
    <div className="container" style={{ padding: '0 24px 64px' }}>
      <div className="page-header">
        <h1>My Bookings</h1>
        <p>Manage your hotel reservations</p>
      </div>

      {loading ? (
        <div className="loading-center"><div className="spinner"/></div>
      ) : bookings.length === 0 ? (
        <div className="empty-state">
          <div className="icon">🛎️</div>
          <h3>No bookings yet</h3>
          <p>Start exploring hotels and make your first reservation!</p>
          <a href="/" className="btn btn-gold" style={{ marginTop: 20 }}>Browse Hotels</a>
        </div>
      ) : (
        <div>
          {active.length > 0 && (
            <Section title="Active Bookings" count={active.length}>
              {active.map(b => <BookingCard key={b.id} booking={b} onCancel={handleCancel} />)}
            </Section>
          )}
          {cancelled.length > 0 && (
            <Section title="Cancelled" count={cancelled.length} style={{ marginTop: 40 }}>
              {cancelled.map(b => <BookingCard key={b.id} booking={b} onCancel={handleCancel} />)}
            </Section>
          )}
        </div>
      )}
    </div>
  )
}

function Section({ title, count, children, style }) {
  return (
    <div style={style}>
      <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.4rem', marginBottom: 20, color: 'var(--charcoal)' }}>
        {title} <span style={{ fontSize: '1rem', color: 'var(--text-muted)', fontFamily: 'var(--font-body)' }}>({count})</span>
      </h2>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>{children}</div>
    </div>
  )
}

function BookingCard({ booking: b, onCancel }) {
  const saved = b.discountApplied ? b.originalPrice - b.finalPrice : 0

  return (
    <div className="card fade-up" style={{ padding: 24 }}>
      <div style={{ display: 'flex', gap: 20, alignItems: 'flex-start' }}>
        {/* Color Block */}
        <div style={{
          width: 80, height: 80, borderRadius: 12, flexShrink: 0,
          background: 'linear-gradient(135deg, var(--gold-pale), var(--gold))',
          display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem',
        }}>🏨</div>

        {/* Info */}
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12, marginBottom: 6 }}>
            <div>
              <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.2rem', color: 'var(--charcoal)' }}>
                {b.hotelName}
              </h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                {b.roomType} · 📍 {b.hotelLocation}
              </p>
            </div>
            <span className={`badge badge-${b.status.toLowerCase()}`}>{b.status}</span>
          </div>

          <div style={{ display: 'flex', gap: 24, margin: '12px 0', flexWrap: 'wrap' }}>
            <DateChip label="Check-in" date={b.checkInDate} />
            <DateChip label="Check-out" date={b.checkOutDate} />
            <div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Duration</div>
              <div style={{ fontWeight: 600 }}>{b.nights} night{b.nights !== 1 ? 's' : ''}</div>
            </div>
          </div>

          {/* Pricing */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap' }}>
            <div>
              {b.discountApplied && (
                <span style={{ textDecoration: 'line-through', color: 'var(--text-muted)', fontSize: '0.85rem', marginRight: 8 }}>
                  ₹{b.originalPrice?.toLocaleString()}
                </span>
              )}
              <span style={{ fontFamily: 'var(--font-display)', fontSize: '1.3rem', fontWeight: 700, color: 'var(--charcoal)' }}>
                ₹{b.finalPrice?.toLocaleString()}
              </span>
            </div>
            {b.discountApplied && (
              <span className="badge badge-discount">
                🎁 {b.discountPercent}% first-booking discount · Saved ₹{saved.toLocaleString()}
              </span>
            )}
          </div>
        </div>

        {/* Actions */}
        {b.status === 'BOOKED' && (
          <button onClick={() => onCancel(b.id)} className="btn btn-danger btn-sm" style={{ flexShrink: 0 }}>
            Cancel
          </button>
        )}
      </div>
    </div>
  )
}

function DateChip({ label, date }) {
  return (
    <div>
      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{label}</div>
      <div style={{ fontWeight: 600 }}>{new Date(date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</div>
    </div>
  )
}
