import { useEffect, useState } from 'react'
import { getProducts } from '../api'

export default function Products() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    getProducts()
      .then(res => setProducts(res.data))
      .catch(() => setError('Could not load products. Is the API running?'))
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <p style={msgStyle}>Loading products...</p>
  if (error)   return <p style={{ ...msgStyle, color: '#ef4444' }}>{error}</p>

  return (
    <div style={{ padding: '32px', maxWidth: 960, margin: '0 auto' }}>
      <h1 style={{ fontSize: 24, fontWeight: 700, marginBottom: 24 }}>Products</h1>
      {products.length === 0 && (
        <p style={msgStyle}>No products found. Seed your database first.</p>
      )}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 20 }}>
        {products.map(p => (
          <div key={p.id} style={cardStyle}>
            <div style={{ fontSize: 48, marginBottom: 12 }}>📦</div>
            <h2 style={{ fontSize: 16, fontWeight: 600, marginBottom: 6 }}>{p.name}</h2>
            <p style={{ fontSize: 13, color: '#6b7280', marginBottom: 12 }}>{p.description}</p>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontWeight: 700, fontSize: 18, color: '#111' }}>${p.price}</span>
              <span style={{ fontSize: 12, color: '#9ca3af' }}>Stock: {p.stock}</span>
            </div>
            <button style={btnStyle} onClick={() => alert(`Added "${p.name}" to cart`)}>
              Add to Cart
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}

const msgStyle = { padding: 32, textAlign: 'center', color: '#6b7280', fontSize: 15 }
const cardStyle = {
  border: '1px solid #e5e7eb', borderRadius: 12, padding: 20,
  background: '#fff', display: 'flex', flexDirection: 'column'
}
const btnStyle = {
  marginTop: 14, width: '100%', padding: '10px 0', borderRadius: 8,
  background: '#111', color: '#fff', border: 'none', fontWeight: 600,
  fontSize: 14, cursor: 'pointer'
}
