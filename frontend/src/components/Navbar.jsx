import { Link } from 'react-router-dom'
import { useState } from 'react'

export default function Navbar() {
  const [cartCount] = useState(0)

  return (
    <nav style={{
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '14px 32px', background: '#fff',
      borderBottom: '1px solid #e5e7eb', position: 'sticky', top: 0, zIndex: 100
    }}>
      <Link to="/" style={{ fontWeight: 700, fontSize: 20, color: '#111', textDecoration: 'none' }}>
        🛍 ShopCloud
      </Link>
      <div style={{ display: 'flex', gap: 24 }}>
        <Link to="/" style={linkStyle}>Products</Link>
        <Link to="/cart" style={linkStyle}>Cart {cartCount > 0 && `(${cartCount})`}</Link>
        <Link to="/checkout" style={linkStyle}>Checkout</Link>
      </div>
    </nav>
  )
}

const linkStyle = {
  color: '#374151', textDecoration: 'none', fontSize: 15, fontWeight: 500
}
