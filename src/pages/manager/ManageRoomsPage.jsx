import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { roomAPI, hotelAPI, bookingAPI } from '../../services/api'
import toast from 'react-hot-toast'

const ROOM_TYPES = ['Standard', 'Deluxe', 'Suite', 'Executive', 'Presidential']
const EMPTY_FORM = { type: 'Standard', price: '', capacity: 2, availableRooms: 1 }

export default function ManageRoomsPage() {
  const { hotelId } = useParams()
  const navigate = useNavigate()
  const [hotel, setHotel] = useState(null)
  const [rooms, setRooms] = useState([])
  const [bookings, setBookings] = useState([])
  const [form, setForm] = useState(EMPTY_FORM)
  const [editId, setEditId] = useState(null)
  const [showForm, setShowForm] = useState(false)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    Promise.all([
      hotelAPI.getById(hotelId),
      roomAPI.getByHotel(hotelId),
      bookingAPI.getByHotel(hotelId),
    ]).then(([h, r, b]) => {
      setHotel(h.data)
      setRooms(r.data)
      setBookings(b.data)
    }).finally(() => setLoading(false))
  }, [hotelId])

  const fetchRooms = async () => {
    const res = await roomAPI.getByHotel(hotelId)
    setRooms(res.data)
  }

  const startEdit = (room) => {
    setEditId(room.id)
    setForm({ type: room.type, price: room.price, capacity: room.capacity, availableRooms: room.availableRooms })
    setShowForm(true)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitting(true)
    try {
      const payload = { ...form, hotelId: parseInt(hotelId), price: parseFloat(form.price), capacity: parseInt(form.capacity), availableRooms: parseInt(form.availableRooms) }
      if (editId) {
        await roomAPI.update(editId, payload)
        toast.success('Room updated!')
      } else {
        await roomAPI.create(payload)
        toast.success('Room added!')
      }
      setForm(EMPTY_FORM)
      setEditId(null)
      setShowForm(false)
      fetchRooms()
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to save room')
    } finally {
      setSubmitting(false)
    }
  }

  const handleDelete = async (id) => {
    if (!confirm('Delete this room?')) return
    try {
      await roomAPI.delete(id)
      toast.success('Room deleted')
      fetchRooms()
    } catch { toast.error('Failed to delete room') }
  }

  if (loading) return <div className="loading-center"><div className="spinner"/></div>

  return (
    <div className="container" style={{ padding: '0 24px 64px' }}>
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
        <div>
          <button onClick={() => navigate('/manager/hotels')} style={{ background: 'none', border: 'none', color: 'var(--gold)', cursor: 'pointer', fontWeight: 600, padding: 0, marginBottom: 8 }}>
            ← My Hotels
          </button>
          <h1>{hotel?.name}</h1>
          <p>📍 {hotel?.location} · Manage Rooms</p>
        </div>
        <button onClick={() => { setShowForm(!showForm); setEditId(null); setForm(EMPTY_FORM) }} className="btn btn-gold">
          {showForm ? '✕ Cancel' : '+ Add Room'}
        </button>
      </div>

      {/* Room Form */}
      {showForm && (
        <div className="card fade-up" style={{ padding: 32, marginBottom: 32 }}>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.3rem', marginBottom: 24 }}>
            {editId ? 'Edit Room' : 'Add New Room'}
          </h2>
          <form onSubmit={handleSubmit} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
            <div className="form-group">
              <label>Room Type *</label>
              <select value={form.type} onChange={e => setForm({ ...form, type: e.target.value })}>
                {ROOM_TYPES.map(t => <option key={t}>{t}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label>Price per Night (₹) *</label>
              <input type="number" min="1" placeholder="2500" value={form.price}
                onChange={e => setForm({ ...form, price: e.target.value })} required />
            </div>
            <div className="form-group">
              <label>Capacity (Guests) *</label>
              <input type="number" min="1" max="20" value={form.capacity}
                onChange={e => setForm({ ...form, capacity: e.target.value })} required />
            </div>
            <div className="form-group">
              <label>Available Rooms *</label>
              <input type="number" min="0" value={form.availableRooms}
                onChange={e => setForm({ ...form, availableRooms: e.target.value })} required />
            </div>
            <div style={{ gridColumn: '1 / -1', display: 'flex', gap: 12 }}>
              <button type="submit" className="btn btn-gold" disabled={submitting}>
                {submitting ? 'Saving...' : editId ? 'Update Room' : 'Add Room'}
              </button>
              <button type="button" onClick={() => { setShowForm(false); setEditId(null); setForm(EMPTY_FORM) }} className="btn btn-outline">
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Rooms List */}
      <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.4rem', marginBottom: 20 }}>
        Rooms ({rooms.length})
      </h2>
      {rooms.length === 0 ? (
        <div className="empty-state">
          <div className="icon">🛏️</div>
          <h3>No rooms yet</h3>
          <p>Add your first room to start accepting bookings</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 16 }}>
          {rooms.map(room => (
            <div key={room.id} className="card" style={{ padding: 24 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
                <span style={{ background: 'var(--gold-pale)', color: '#92400e', padding: '4px 12px', borderRadius: 20, fontSize: '0.8rem', fontWeight: 600 }}>
                  {room.type}
                </span>
                <span className={`badge ${room.availableRooms > 0 ? 'badge-booked' : 'badge-cancelled'}`}>
                  {room.availableRooms > 0 ? `${room.availableRooms} available` : 'Full'}
                </span>
              </div>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.6rem', fontWeight: 700, margin: '8px 0' }}>
                ₹{room.price.toLocaleString()}
                <span style={{ fontFamily: 'var(--font-body)', fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 400 }}>/night</span>
              </div>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: 16 }}>
                👥 Up to {room.capacity} guests
              </p>
              <div style={{ display: 'flex', gap: 8 }}>
                <button onClick={() => startEdit(room)} className="btn btn-outline btn-sm" style={{ flex: 1 }}>✏️ Edit</button>
                <button onClick={() => handleDelete(room.id)} className="btn btn-danger btn-sm">🗑️</button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Bookings */}
      {bookings.length > 0 && (
        <div style={{ marginTop: 48 }}>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.4rem', marginBottom: 20 }}>
            Guest Bookings ({bookings.length})
          </h2>
          <div className="card" style={{ overflow: 'hidden' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: 'var(--cream)', borderBottom: '1px solid var(--border)' }}>
                  {['Guest', 'Room', 'Check-In', 'Check-Out', 'Nights', 'Amount', 'Status'].map(h => (
                    <th key={h} style={{ padding: '12px 16px', textAlign: 'left', fontSize: '0.78rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 600 }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {bookings.map(b => (
                  <tr key={b.id} style={{ borderBottom: '1px solid var(--border)' }}>
                    <td style={{ padding: '12px 16px', fontWeight: 500 }}>{b.userName}</td>
                    <td style={{ padding: '12px 16px', color: 'var(--text-secondary)' }}>{b.roomType}</td>
                    <td style={{ padding: '12px 16px', fontSize: '0.85rem' }}>{b.checkInDate}</td>
                    <td style={{ padding: '12px 16px', fontSize: '0.85rem' }}>{b.checkOutDate}</td>
                    <td style={{ padding: '12px 16px' }}>{b.nights}</td>
                    <td style={{ padding: '12px 16px', fontWeight: 600 }}>
                      ₹{b.finalPrice?.toLocaleString()}
                      {b.discountApplied && <span title="First-time discount" style={{ marginLeft: 4 }}>🎁</span>}
                    </td>
                    <td style={{ padding: '12px 16px' }}>
                      <span className={`badge badge-${b.status.toLowerCase()}`}>{b.status}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}
