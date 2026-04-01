import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { hotelAPI } from '../../services/api'
import { useAuth } from '../../context/AuthContext'

export default function HomePage() {
  const [hotels, setHotels] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [query, setQuery] = useState('')
  const { user, isUser } = useAuth()

  useEffect(() => {
    fetchHotels()
  }, [query])

  const fetchHotels = async () => {
    setLoading(true)
    try {
      const res = await hotelAPI.getAll(query)
      setHotels(res.data)
    } catch {
      setHotels([])
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = (e) => {
    e.preventDefault()
    setQuery(search.trim())
  }

  return (
    <div>
      {/* Hero */}
      <div style={{
        background: 'linear-gradient(135deg, var(--charcoal) 0%, #2d2d5e 100%)',
        padding: '72px 24px 80px',
        textAlign: 'center',
        position: 'relative',
        overflow: 'hidden',
      }}>
        <div style={{
          position: 'absolute', inset: 0, opacity: 0.04,
          backgroundImage: 'radial-gradient(circle at 20% 50%, gold 1px, transparent 1px), radial-gradient(circle at 80% 20%, gold 1px, transparent 1px)',
          backgroundSize: '60px 60px',
        }} />
        <div style={{ position: 'relative' }}>
          <p style={{ color: 'var(--gold)', fontWeight: 600, letterSpacing: '0.15em', fontSize: '0.85rem', textTransform: 'uppercase', marginBottom: 16 }}>
            ✦ Premium Hotel Booking
          </p>
          <h1 style={{
            fontFamily: 'var(--font-display)', fontSize: 'clamp(2rem, 5vw, 3.5rem)',
            color: 'white', fontWeight: 700, lineHeight: 1.2, marginBottom: 16,
          }}>
            Find Your Perfect<br />
            <em style={{ color: 'var(--gold)' }}>Luxury Stay</em>
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.55)', fontSize: '1.1rem', marginBottom: 40 }}>
            Discover world-class hotels and book with confidence
          </p>

          {/* Search Bar */}
          <form onSubmit={handleSearch} style={{
            display: 'flex', gap: 0, maxWidth: 540, margin: '0 auto',
            background: 'white', borderRadius: 12, overflow: 'hidden',
            boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
          }}>
            <input
              placeholder="Search by city or location..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              style={{
                flex: 1, padding: '16px 20px', border: 'none', outline: 'none',
                fontSize: '1rem', fontFamily: 'var(--font-body)', background: 'transparent',
              }}
            />
            <button type="submit" className="btn btn-gold" style={{ borderRadius: 0, padding: '16px 28px' }}>
              🔍 Search
            </button>
          </form>

          {!user && (
            <div style={{
              marginTop: 28, display: 'inline-flex', alignItems: 'center', gap: 10,
              background: 'rgba(201,168,76,0.15)', border: '1px solid rgba(201,168,76,0.3)',
              borderRadius: 30, padding: '10px 20px',
            }}>
              <span style={{ fontSize: '1.1rem' }}>🎁</span>
              <span style={{ color: 'var(--gold-light)', fontSize: '0.9rem' }}>
                New guests get <strong>10% off</strong> their first booking!{' '}
                <Link to="/register" style={{ color: 'white', textDecoration: 'underline' }}>Register free</Link>
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Hotels Grid */}
      <div className="container" style={{ padding: '48px 24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 32 }}>
          <div>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.8rem', color: 'var(--charcoal)' }}>
              {query ? `Results for "${query}"` : 'All Hotels'}
            </h2>
            <p style={{ color: 'var(--text-secondary)', marginTop: 4 }}>
              {hotels.length} {hotels.length === 1 ? 'property' : 'properties'} available
            </p>
          </div>
          {query && (
            <button onClick={() => { setQuery(''); setSearch('') }} className="btn btn-outline btn-sm">
              ✕ Clear Search
            </button>
          )}
        </div>

        {loading ? (
          <div className="loading-center"><div className="spinner" /><span>Searching hotels...</span></div>
        ) : hotels.length === 0 ? (
          <div className="empty-state">
            <div className="icon">🏨</div>
            <h3>No hotels found</h3>
            <p>Try a different location or clear the search</p>
          </div>
        ) : (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
            gap: 24,
          }}>
            {hotels.map(hotel => <HotelCard key={hotel.id} hotel={hotel} />)}
          </div>
        )}
      </div>
    </div>
  )
}

function HotelCard({ hotel }) {
  const colors = ['#667eea', '#f093fb', '#4facfe', '#43e97b', '#fa709a', '#a18cd1']
  const color = colors[hotel.id % colors.length]

  return (
    <Link to={`/hotels/${hotel.id}`}>
      <div className="card" style={{ overflow: 'hidden', cursor: 'pointer' }}>
        {/* Image / Placeholder */}
        <div style={{
          height: 200,
          background: hotel.imageUrl
            ? `url(${hotel.imageUrl}) center/cover`
            : `linear-gradient(135deg, ${color}33, ${color}66)`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          position: 'relative',
        }}>
          {!hotel.imageUrl && (
            <span style={{ fontSize: '3.5rem', opacity: 0.6 }}>🏨</span>
          )}
          <div style={{
            position: 'absolute', top: 12, right: 12,
            background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)',
            borderRadius: 20, padding: '4px 10px',
            color: 'white', fontSize: '0.8rem',
          }}>
            📍 {hotel.location}
          </div>
        </div>

        <div style={{ padding: '20px 24px 24px' }}>
          <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.2rem', color: 'var(--charcoal)', marginBottom: 8 }}>
            {hotel.name}
          </h3>
          <p style={{
            color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: 1.5,
            display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden',
          }}>
            {hotel.description || 'A wonderful place to stay with premium amenities and services.'}
          </p>
          <div style={{ marginTop: 16, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              Managed by {hotel.managerName}
            </span>
            <span style={{ color: 'var(--gold)', fontWeight: 600, fontSize: '0.9rem' }}>
              View Rooms →
            </span>
          </div>
        </div>
      </div>
    </Link>
  )
}
