import { useState, useEffect } from 'react'
import { useParams, useLocation, useNavigate } from 'react-router-dom'
import { bookingAPI, roomAPI, hotelAPI } from '../../services/api'
import { useAuth } from '../../context/AuthContext'
import toast from 'react-hot-toast'

const DISCOUNT_PERCENT = 10

export default function BookingPage() {
  const { roomId } = useParams()
  const location = useLocation()
  const navigate = useNavigate()
  const { user } = useAuth()

  // Initialize from location state, but prepare to fetch if null
  const [room, setRoom] = useState(location.state?.room || null)
  const [hotel, setHotel] = useState(location.state?.hotel || null)
  const [form, setForm] = useState({ checkInDate: '', checkOutDate: '' })
  const [loading, setLoading] = useState(!room || !hotel)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchBookingDetails = async () => {
      try {
        setLoading(true)
        // 1. Fetch Room Details
        const roomRes = await roomAPI.getById(roomId)
        const roomData = roomRes.data
        setRoom(roomData)

        // 2. Fetch Hotel Details using the hotelId from the room
        const hotelRes = await hotelAPI.getById(roomData.hotelId)
        setHotel(hotelRes.data)
      } catch (err) {
        console.error("Fetch Error:", err)
        // If 403, it means the token is missing or invalid
        if (err.response?.status === 403) {
          toast.error("Session expired. Please login again.")
          navigate('/login')
        } else {
          toast.error("Could not load room details")
          navigate('/')
        }
      } finally {
        setLoading(false)
      }
    }

    // Only fetch if we don't already have the data from navigation state
    if (!room || !hotel) {
      fetchBookingDetails()
    }
  }, [roomId, navigate])

  // Price Calculation Logic
  const nights = (() => {
    if (!form.checkInDate || !form.checkOutDate) return 0
    const start = new Date(form.checkInDate)
    const end = new Date(form.checkOutDate)
    const diff = end - start
    return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)))
  })()

  const originalPrice = room ? room.price * nights : 0
  const isFirstTimer = !localStorage.getItem('hasBooked')
  const discountAmount = isFirstTimer && nights > 0 ? (originalPrice * DISCOUNT_PERCENT) / 100 : 0
  const finalPrice = originalPrice - discountAmount

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (nights <= 0) {
      setError('Check-out date must be after check-in date')
      return
    }

    setError('')
    setSubmitting(true)

    try {
      const res = await bookingAPI.create({
        roomId: parseInt(roomId),
        checkInDate: form.checkInDate,
        checkOutDate: form.checkOutDate,
      })

      localStorage.setItem('hasBooked', 'true')
      toast.success(res.data.discountApplied
        ? `🎉 Saved ₹${(res.data.originalPrice - res.data.finalPrice).toLocaleString()}! Booking confirmed.`
        : '✅ Booking confirmed!')
      
      navigate('/my-bookings')
    } catch (err) {
      setError(err.response?.data?.error || 'Booking failed. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  const today = new Date().toISOString().split('T')[0]

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
        <div className="spinner" />
      </div>
    )
  }

  return (
    <div className="container" style={{ padding: '40px 24px', maxWidth: 900 }}>
      <button onClick={() => navigate(-1)} className="btn btn-outline btn-sm" style={{ marginBottom: 24 }}>
        ← Back
      </button>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 350px', gap: 40, alignItems: 'start' }}>
        {/* Left Column: Form */}
        <div>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '2.2rem', marginBottom: 8 }}>
            Complete Your Booking
          </h1>
          <p style={{ color: 'var(--text-secondary)', marginBottom: 32, fontSize: '1.1rem' }}>
            {hotel?.name} <span style={{ opacity: 0.5 }}>•</span> {room?.type} Room
          </p>

          {isFirstTimer && (
            <div className="discount-banner" style={{ background: '#fef3c7', padding: '16px', borderRadius: '12px', marginBottom: 24, display: 'flex', gap: 12 }}>
              <span style={{ fontSize: '1.5rem' }}>🎁</span>
              <div>
                <strong style={{ color: '#92400e' }}>First-Time Booking Discount!</strong>
                <p style={{ margin: 0, fontSize: '0.9rem', color: '#b45309' }}>We've applied a {DISCOUNT_PERCENT}% discount to your first stay.</p>
              </div>
            </div>
          )}

          {error && (
            <div style={{ background: '#fee2e2', color: '#b91c1c', padding: '12px', borderRadius: '8px', marginBottom: 20 }}>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
              <div className="form-group">
                <label style={{ fontWeight: 600, display: 'block', marginBottom: 8 }}>Check-In</label>
                <input
                  type="date"
                  min={today}
                  className="form-control"
                  value={form.checkInDate}
                  onChange={e => setForm({ ...form, checkInDate: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label style={{ fontWeight: 600, display: 'block', marginBottom: 8 }}>Check-Out</label>
                <input
                  type="date"
                  min={form.checkInDate || today}
                  className="form-control"
                  value={form.checkOutDate}
                  onChange={e => setForm({ ...form, checkOutDate: e.target.value })}
                  required
                />
              </div>
            </div>

            <div style={{ padding: 20, background: 'var(--cream)', borderRadius: 12 }}>
              <h3 style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: 12 }}>
                Guest Details
              </h3>
              <div style={{ display: 'flex', gap: 40 }}>
                <div>
                  <small style={{ color: 'var(--text-muted)' }}>NAME</small>
                  <div style={{ fontWeight: 600 }}>{user?.name}</div>
                </div>
                <div>
                  <small style={{ color: 'var(--text-muted)' }}>EMAIL</small>
                  <div style={{ fontWeight: 600 }}>{user?.email}</div>
                </div>
              </div>
            </div>

            <button 
              type="submit" 
              className="btn btn-gold" 
              disabled={submitting || nights === 0}
              style={{ padding: '18px', fontSize: '1.1rem', fontWeight: 600 }}
            >
              {submitting ? 'Processing...' : `Confirm & Pay ₹${finalPrice.toLocaleString()}`}
            </button>
          </form>
        </div>

        {/* Right Column: Sticky Summary */}
        <div className="card" style={{ padding: 24, position: 'sticky', top: 100, border: '1px solid var(--border)' }}>
          <h3 style={{ marginBottom: 20 }}>Summary</h3>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <SummaryRow 
              label={`₹${room?.price?.toLocaleString()} × ${nights} nights`} 
              value={`₹${originalPrice.toLocaleString()}`} 
            />
            
            {isFirstTimer && nights > 0 && (
              <SummaryRow
                label={`First-Booking (${DISCOUNT_PERCENT}%)`}
                value={`−₹${discountAmount.toLocaleString()}`}
                highlight
              />
            )}
            
            <hr style={{ border: 'none', borderTop: '1px solid var(--border)', margin: '8px 0' }} />
            
            <SummaryRow 
              label="Total (INR)" 
              value={`₹${finalPrice.toLocaleString()}`} 
              bold 
            />
          </div>

          <div style={{ marginTop: 24, fontSize: '0.85rem', color: 'var(--text-secondary)', background: '#f9fafb', padding: 16, borderRadius: 8 }}>
            <div style={{ fontWeight: 600, marginBottom: 8, color: 'var(--charcoal)' }}>Room Information</div>
            <div style={{ marginBottom: 4 }}>📍 {hotel?.location}</div>
            <div style={{ marginBottom: 4 }}>🛏️ {room?.type} Room</div>
            <div>👥 Max Guests: {room?.capacity}</div>
          </div>
        </div>
      </div>
    </div>
  )
}

// Small helper component for the price rows
function SummaryRow({ label, value, highlight, bold }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
      <span style={{ 
        color: highlight ? '#92400e' : 'var(--text-secondary)', 
        fontWeight: bold ? 700 : 400 
      }}>
        {label}
      </span>
      <span style={{ 
        fontWeight: bold ? 700 : 600, 
        color: highlight ? '#92400e' : 'var(--charcoal)',
        fontSize: bold ? '1.2rem' : '1rem'
      }}>
        {value}
      </span>
    </div>
  )
}