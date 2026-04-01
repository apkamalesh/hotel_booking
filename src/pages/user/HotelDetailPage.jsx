import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { hotelAPI, roomAPI } from '../../services/api'
import { useAuth } from '../../context/AuthContext'

export default function HotelDetailPage() {
  const { id } = useParams()
  const [hotel, setHotel] = useState(null)
  const [rooms, setRooms] = useState([])
  const [loading, setLoading] = useState(true)
  const { user, isUser } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    Promise.all([hotelAPI.getById(id), roomAPI.getByHotel(id)])
      .then(([h, r]) => {
        setHotel(h.data)
        setRooms(r.data)
      })
      .finally(() => setLoading(false))
  }, [id])

  if (loading) return <div className="loading-center"><div className="spinner"/></div>
  if (!hotel) return <div className="container"><p style={{padding: 40}}>Hotel not found.</p></div>

  return (
    <div>
      {/* Hero Banner */}
      <div style={{
        height: 320,
        background: hotel.imageUrl
          ? `linear-gradient(to bottom, rgba(0,0,0,0.3), rgba(0,0,0,0.7)), url(${hotel.imageUrl}) center/cover`
          : 'linear-gradient(135deg, var(--charcoal), var(--deep-navy))',
        display: 'flex', alignItems: 'flex-end',
        padding: '0 0 40px',
      }}>
        <div className="container">
          <button onClick={() => navigate(-1)} style={{
            background: 'rgba(255,255,255,0.15)', border: '1px solid rgba(255,255,255,0.3)',
            color: 'white', borderRadius: 8, padding: '8px 16px', cursor: 'pointer',
            marginBottom: 20, fontSize: '0.9rem', backdropFilter: 'blur(4px)',
          }}>← Back</button>
          <h1 style={{
            fontFamily: 'var(--font-display)', fontSize: 'clamp(1.8rem, 4vw, 2.8rem)',
            color: 'white', fontWeight: 700,
          }}>{hotel.name}</h1>
          <p style={{ color: 'rgba(255,255,255,0.75)', marginTop: 8, fontSize: '1rem' }}>
            📍 {hotel.location} &nbsp;·&nbsp; Managed by {hotel.managerName}
          </p>
        </div>
      </div>

      <div className="container" style={{ padding: '40px 24px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: 40 }}>
          {/* Left */}
          <div>
            {hotel.description && (
              <div className="card" style={{ padding: 28, marginBottom: 32 }}>
                <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.3rem', marginBottom: 12 }}>About this hotel</h2>
                <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7 }}>{hotel.description}</p>
              </div>
            )}

            {/* Rooms */}
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem', marginBottom: 20 }}>
              Available Rooms
            </h2>

            {rooms.length === 0 ? (
              <div className="empty-state">
                <div className="icon">🛏️</div>
                <h3>No rooms listed yet</h3>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                {rooms.map(room => (
                  <div key={room.id} className="card" style={{ padding: 24 }}>
                    <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 16 }}>
                      <div style={{ flex: 1 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                          <span style={{
                            background: 'var(--gold-pale)', color: '#92400e',
                            padding: '3px 10px', borderRadius: 20, fontSize: '0.8rem', fontWeight: 600,
                          }}>{room.type}</span>
                          <span style={{
                            background: room.availableRooms > 0 ? '#dcfce7' : '#fee2e2',
                            color: room.availableRooms > 0 ? '#166534' : '#991b1b',
                            padding: '3px 10px', borderRadius: 20, fontSize: '0.8rem',
                          }}>
                            {room.availableRooms > 0 ? `${room.availableRooms} available` : 'Fully booked'}
                          </span>
                        </div>
                        <div style={{ display: 'flex', gap: 20, color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                          <span>👥 Capacity: {room.capacity}</span>
                        </div>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem', color: 'var(--charcoal)', fontWeight: 700 }}>
                          ₹{room.price.toLocaleString()}
                        </div>
                        <div style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>per night</div>
                        {isUser() && room.availableRooms > 0 && (
                          <Link
                            to={`/book/${room.id}`}
                            state={{ room, hotel }}
                            className="btn btn-gold btn-sm"
                            style={{ marginTop: 12, display: 'inline-block' }}
                          >
                            Book Now
                          </Link>
                        )}
                        {!user && room.availableRooms > 0 && (
                          <Link to="/login" className="btn btn-outline btn-sm" style={{ marginTop: 12, display: 'inline-block' }}>
                            Login to Book
                          </Link>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Right Sidebar */}
          <div>
            <div className="card" style={{ padding: 24, position: 'sticky', top: 84 }}>
              <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.1rem', marginBottom: 16 }}>
                Quick Info
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                <InfoRow icon="🏨" label="Hotel" value={hotel.name} />
                <InfoRow icon="📍" label="Location" value={hotel.location} />
                <InfoRow icon="🛏️" label="Rooms" value={`${rooms.length} room types`} />
                <InfoRow icon="✅" label="Available" value={`${rooms.filter(r => r.availableRooms > 0).length} types`} />
              </div>
              {!user && (
                <div style={{ marginTop: 20 }}>
                  <Link to="/register" className="btn btn-gold" style={{ width: '100%', justifyContent: 'center' }}>
                    Register to Book
                  </Link>
                  <div style={{
                    marginTop: 12, padding: '10px 14px', borderRadius: 8,
                    background: 'var(--gold-pale)', fontSize: '0.82rem', color: '#92400e', textAlign: 'center',
                  }}>
                    🎁 Get 10% off your first booking!
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function InfoRow({ icon, label, value }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
      <span style={{ fontSize: '1.1rem', width: 24 }}>{icon}</span>
      <div>
        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{label}</div>
        <div style={{ fontWeight: 500, color: 'var(--charcoal)', fontSize: '0.9rem' }}>{value}</div>
      </div>
    </div>
  )
}
