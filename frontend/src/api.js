import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL, // your API Gateway URL
  headers: { 'Content-Type': 'application/json' }
})

// Attach JWT token to every request
api.interceptors.request.use(config => {
  const token = localStorage.getItem('token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

export const getProducts = () => api.get('/products')
export const placeOrder = (order) => api.post('/orders', order)
export const login = (creds) => api.post('/auth/login', creds)
export default api  