import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { hotelAPI } from '../../services/api'
import toast from 'react-hot-toast'

export default function HotelFormPage() {
  const { id } = useParams()
  const isEdit = Boolean(id)
  const navigate = useNavigate()

  const [form, setForm] = useState({ name: '', location: '', description: '', imageUrl: '' })
  const [loading, setLoading] = useState(isEdit)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (isEdit) {
      hotelAPI.getById(id).then(res => {
        const h = res.data
        setForm({ name: h.name, location: h.location, description: h.description || '', imageUrl: h.imageUrl || '' })
      }).finally(() => setLoading(false))
    }
  }, [id])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSubmitting(true)
    try {
      if (isEdit) {
        await hotelAPI.update(id, form)
        toast.success('Hotel updated!')
      } else {
        await hotelAPI.create(form)
        toast.success('Hotel created!')
      }
      navigate('/manager/hotels')
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to save hotel')
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) return <div className="loading-center"><div className="spinner"/></div>

  return (
    <div className="container" style={{ padding: '40px 24px', maxWidth: 640 }}>
      <button onClick={() => navigate(-1)} className="btn btn-outline btn-sm" style={{ marginBottom: 24 }}>← Back</button>

      <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '2rem', marginBottom: 8 }}>
        {isEdit ? 'Edit Hotel' : 'Add New Hotel'}
      </h1>
      <p style={{ color: 'var(--text-secondary)', marginBottom: 32 }}>
        {isEdit ? 'Update your hotel details' : 'List your property on LuxeStay'}
      </p>

      <div className="card" style={{ padding: 36 }}>
        {error && <div className="error-msg" style={{ marginBottom: 20 }}>{error}</div>}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
          <div className="form-group">
            <label>Hotel Name *</label>
            <input placeholder="e.g. The Grand Palace" value={form.name}
              onChange={e => setForm({ ...form, name: e.target.value })} required />
          </div>
          <div className="form-group">
            <label>Location / City *</label>
            <input placeholder="e.g. Mumbai, Maharashtra" value={form.location}
              onChange={e => setForm({ ...form, location: e.target.value })} required />
          </div>
          <div className="form-group">
            <label>Description</label>
            <textarea rows={4} placeholder="Describe your hotel..." value={form.description}
              onChange={e => setForm({ ...form, description: e.target.value })}
              style={{ resize: 'vertical' }} />
          </div>
          <div className="form-group">
            <label>Image URL</label>
            <input placeholder="https://example.com/hotel.jpg" value={form.imageUrl}
              onChange={e => setForm({ ...form, imageUrl: e.target.value })} />
          </div>

          {form.imageUrl && (
            <div style={{ borderRadius: 12, overflow: 'hidden', height: 200 }}>
              <img src={form.imageUrl} alt="preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                onError={e => e.target.style.display = 'none'} />
            </div>
          )}

          <div style={{ display: 'flex', gap: 12 }}>
            <button type="submit" className="btn btn-gold" disabled={submitting} style={{ flex: 1, justifyContent: 'center' }}>
              {submitting ? 'Saving...' : isEdit ? 'Update Hotel' : 'Create Hotel'}
            </button>
            <button type="button" onClick={() => navigate(-1)} className="btn btn-outline">Cancel</button>
          </div>
        </form>
      </div>
    </div>
  )
}
