import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { hotelAPI } from '../../services/api'
import toast from 'react-hot-toast'

export default function ManagerHotelsPage() {
  const [hotels, setHotels] = useState([])
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => { fetchHotels() }, [])

  const fetchHotels = async () => {
    try {
      const res = await hotelAPI.getMine()
      setHotels(res.data)
    } finally { setLoading(false) }
  }

  const handleDelete = async (id) => {
    if (!confirm('Delete this hotel? This cannot be undone.')) return
    try {
      await hotelAPI.delete(id)
      toast.success('Hotel deleted')
      fetchHotels()
    } catch { toast.error('Failed to delete hotel') }
  }

  return (
    <div className="container" style={{ padding: '0 24px 64px' }}>
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
        <div>
          <h1>My Hotels</h1>
          <p>Manage your hotel listings</p>
        </div>
        <Link to="/manager/hotels/add" className="btn btn-gold">+ Add Hotel</Link>
      </div>

      {loading ? (
        <div className="loading-center"><div className="spinner"/></div>
      ) : hotels.length === 0 ? (
        <div className="empty-state">
          <div className="icon">🏨</div>
          <h3>No hotels yet</h3>
          <p>Add your first hotel to start receiving bookings</p>
          <Link to="/manager/hotels/add" className="btn btn-gold" style={{ marginTop: 20 }}>Add First Hotel</Link>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: 24 }}>
          {hotels.map(hotel => (
            <div key={hotel.id} className="card" style={{ overflow: 'hidden' }}>
              <div style={{
                height: 160,
                background: hotel.imageUrl
                  ? `url(${hotel.imageUrl}) center/cover`
                  : 'linear-gradient(135deg, var(--charcoal), var(--deep-navy))',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                {!hotel.imageUrl && <span style={{ fontSize: '3rem', opacity: 0.5 }}>🏨</span>}
              </div>
              <div style={{ padding: '20px 24px' }}>
                <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.2rem', marginBottom: 4 }}>{hotel.name}</h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: 16 }}>📍 {hotel.location}</p>
                <div style={{ display: 'flex', gap: 8 }}>
                  <Link to={`/manager/hotels/${hotel.id}/rooms`} className="btn btn-outline btn-sm" style={{ flex: 1, justifyContent: 'center' }}>
                    🛏️ Rooms
                  </Link>
                  <Link to={`/manager/hotels/${hotel.id}/edit`} className="btn btn-outline btn-sm">✏️</Link>
                  <button onClick={() => handleDelete(hotel.id)} className="btn btn-danger btn-sm">🗑️</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
