import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { authAPI } from '../../services/api'
import toast from 'react-hot-toast'

export default function RegisterPage() {
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'USER' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const { login } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const res = await authAPI.register(form)
      login(res.data)
      toast.success('Account created! Welcome to LuxeStay 🎉')
      navigate(res.data.role === 'HOTEL_MANAGER' ? '/manager/dashboard' : '/')
    } catch (err) {
      setError(err.response?.data?.error || 'Registration failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{
      minHeight: '100vh', display: 'flex', alignItems: 'center',
      justifyContent: 'center', padding: 24,
      background: 'linear-gradient(135deg, var(--charcoal) 0%, var(--deep-navy) 100%)',
    }}>
      <div style={{ width: '100%', maxWidth: 440 }}>
        <div style={{ textAlign: 'center', marginBottom: 40 }}>
          <div style={{ fontSize: '3rem', marginBottom: 12 }}>🏨</div>
          <h1 style={{
            fontFamily: 'var(--font-display)', fontSize: '2rem',
            color: 'var(--gold)', fontWeight: 700,
          }}>Create Account</h1>
          <p style={{ color: 'rgba(255,255,255,0.5)', marginTop: 6 }}>
            Join LuxeStay today
          </p>
        </div>

        <div className="card fade-up" style={{ padding: 40 }}>
          {error && <div className="error-msg" style={{ marginBottom: 20 }}>{error}</div>}

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            <div className="form-group">
              <label>Full Name</label>
              <input
                placeholder="John Doe"
                value={form.name}
                onChange={e => setForm({ ...form, name: e.target.value })}
                required
              />
            </div>
            <div className="form-group">
              <label>Email</label>
              <input
                type="email"
                placeholder="you@example.com"
                value={form.email}
                onChange={e => setForm({ ...form, email: e.target.value })}
                required
              />
            </div>
            <div className="form-group">
              <label>Password</label>
              <input
                type="password"
                placeholder="Min 6 characters"
                value={form.password}
                onChange={e => setForm({ ...form, password: e.target.value })}
                required minLength={6}
              />
            </div>
            <div className="form-group">
              <label>I am a</label>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                {[
                  { val: 'USER', label: '🧳 Guest', desc: 'Book hotels' },
                  { val: 'HOTEL_MANAGER', label: '🏨 Manager', desc: 'List hotels' },
                ].map(opt => (
                  <button
                    key={opt.val}
                    type="button"
                    onClick={() => setForm({ ...form, role: opt.val })}
                    style={{
                      padding: '14px 12px', borderRadius: 10, cursor: 'pointer',
                      border: `2px solid ${form.role === opt.val ? 'var(--gold)' : 'var(--border)'}`,
                      background: form.role === opt.val ? 'var(--gold-pale)' : 'var(--cream)',
                      textAlign: 'center', transition: 'all 0.2s',
                    }}
                  >
                    <div style={{ fontSize: '1.2rem' }}>{opt.label}</div>
                    <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginTop: 2 }}>{opt.desc}</div>
                  </button>
                ))}
              </div>
            </div>

            <button type="submit" className="btn btn-primary" disabled={loading}
              style={{ width: '100%', justifyContent: 'center', padding: '14px', fontSize: '1rem' }}>
              {loading ? 'Creating account...' : 'Create Account'}
            </button>
          </form>

          {form.role === 'USER' && (
            <div style={{
              marginTop: 20, padding: '12px 16px', borderRadius: 8,
              background: 'var(--gold-pale)', border: '1px solid var(--gold)',
              fontSize: '0.85rem', color: '#92400e',
            }}>
              🎁 <strong>First-time booking discount!</strong> New guests get 10% off their first reservation.
            </div>
          )}

          <p style={{ textAlign: 'center', marginTop: 24, color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
            Already have an account?{' '}
            <Link to="/login" style={{ color: 'var(--gold)', fontWeight: 600 }}>Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  )
}
