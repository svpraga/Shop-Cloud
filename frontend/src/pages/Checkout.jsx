import { useState } from 'react'
import { placeOrder } from '../api'

export default function Checkout() {
  const [form, setForm] = useState({ name: '', email: '', address: '' })
  const [status, setStatus] = useState(null)  // null | 'loading' | 'success' | 'error'
  const [orderId, setOrderId] = useState(null)

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value })

  const handleSubmit = async () => {
    if (!form.name || !form.email || !form.address) {
      alert('Please fill in all fields')
      return
    }
    setStatus('loading')
    try {
      const res = await placeOrder({
        userId: 1,
        items: [{ id: 1, qty: 1 }],
        total: 149.99,
        ...form
      })
      setOrderId(res.data.orderId)
      setStatus('success')
    } catch {
      setStatus('error')
    }
  }

  if (status === 'success') return (
    <div style={{ padding: 32, maxWidth: 480, margin: '60px auto', textAlign: 'center' }}>
      <div style={{ fontSize: 56 }}>✅</div>
      <h2 style={{ fontSize: 22, fontWeight: 700, margin: '16px 0 8px' }}>Order placed!</h2>
      <p style={{ color: '#6b7280' }}>Order ID: <strong>#{orderId}</strong></p>
      <p style={{ color: '#6b7280', fontSize: 13, marginTop: 8 }}>
        Your order is being processed. You will receive a confirmation email shortly.
      </p>
    </div>
  )

  return (
    <div style={{ padding: '32px', maxWidth: 480, margin: '0 auto' }}>
      <h1 style={{ fontSize: 24, fontWeight: 700, marginBottom: 24 }}>Checkout</h1>

      {['name', 'email', 'address'].map(field => (
        <div key={field} style={{ marginBottom: 16 }}>
          <label style={{ display: 'block', fontSize: 13, fontWeight: 600,
            color: '#374151', marginBottom: 6, textTransform: 'capitalize' }}>
            {field}
          </label>
          <input
            name={field}
            value={form[field]}
            onChange={handleChange}
            placeholder={field === 'email' ? 'you@example.com' : field === 'address' ? '123 Main St, Chennai' : 'Your name'}
            style={inputStyle}
          />
        </div>
      ))}

      <div style={{ background: '#f9fafb', borderRadius: 8, padding: 16, marginBottom: 20 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 700 }}>
          <span>Order total</span>
          <span>$149.99</span>
        </div>
      </div>

      <button
        onClick={handleSubmit}
        disabled={status === 'loading'}
        style={{ ...btnStyle, opacity: status === 'loading' ? 0.7 : 1 }}
      >
        {status === 'loading' ? 'Placing order...' : 'Place Order →'}
      </button>

      {status === 'error' && (
        <p style={{ color: '#ef4444', marginTop: 12, fontSize: 13, textAlign: 'center' }}>
          Something went wrong. Is the API Gateway URL set in your .env?
        </p>
      )}
    </div>
  )
}

const inputStyle = {
  width: '100%', padding: '10px 12px', borderRadius: 8, boxSizing: 'border-box',
  border: '1px solid #d1d5db', fontSize: 14, outline: 'none'
}
const btnStyle = {
  width: '100%', padding: '13px 0', borderRadius: 8,
  background: '#111', color: '#fff', border: 'none',
  fontWeight: 600, fontSize: 15, cursor: 'pointer'
}
