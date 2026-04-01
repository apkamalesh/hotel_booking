import axios from 'axios'

const api = axios.create({
  baseURL: '/api',
  headers: { 'Content-Type': 'application/json' },
})

// Attach JWT token to every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Handle 401
api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      window.location.href = '/login'
    }
    return Promise.reject(err)
  }
)

// ---- Auth ----
export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login:    (data) => api.post('/auth/login', data),
}

// ---- Hotels ----
export const hotelAPI = {
  getAll:   (location) => api.get('/hotels', { params: location ? { location } : {} }),
  getById:  (id)       => api.get(`/hotels/${id}`),
  create:   (data)     => api.post('/hotels', data),
  update:   (id, data) => api.put(`/hotels/${id}`, data),
  delete:   (id)       => api.delete(`/hotels/${id}`),
  getMine:  ()         => api.get('/hotels/my'),
}

// ---- Rooms ----
export const roomAPI = {
  getByHotel: (hotelId)     => api.get(`/rooms/hotel/${hotelId}`),
  create:     (data)        => api.post('/rooms', data),
  update:     (id, data)    => api.put(`/rooms/${id}`, data),
  delete:     (id)          => api.delete(`/rooms/${id}`),
}

// ---- Bookings ----
export const bookingAPI = {
  create:       (data)    => api.post('/bookings', data),
  getMine:      ()        => api.get('/bookings/my'),
  cancel:       (id)      => api.delete(`/bookings/${id}`),
  getByHotel:   (hotelId) => api.get(`/bookings/hotel/${hotelId}`),
}

export default api
