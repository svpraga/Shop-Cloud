import { Link } from 'react-router-dom'

const sampleItems = [
  { id: 1, name: 'Wireless Headphones', price: 149.99, qty: 1 },
  { id: 2, name: 'Mechanical Keyboard',  price: 89.99,  qty: 2 },
]

export default function Cart() {
  const total = sampleItems.reduce((sum, i) => sum + i.price * i.qty, 0)

  return (
    <div style={{ padding: '32px', maxWidth: 640, margin: '0 auto' }}>
      <h1 style={{ fontSize: 24, fontWeight: 700, marginBottom: 24 }}>Your Cart</h1>

      {sampleItems.length === 0 ? (
        <p style={{ color: '#6b7280' }}>Your cart is empty. <Link to="/">Shop now</Link></p>
      ) : (
        <>
          {sampleItems.map(item => (
            <div key={item.id} style={rowStyle}>
              <div>
                <p style={{ fontWeight: 600, margin: 0 }}>{item.name}</p>
                <p style={{ color: '#6b7280', margin: '4px 0 0', fontSize: 13 }}>Qty: {item.qty}</p>
              </div>
              <span style={{ fontWeight: 700 }}>${(item.price * item.qty).toFixed(2)}</span>
            </div>
          ))}

          <div style={{ borderTop: '1px solid #e5e7eb', marginTop: 16, paddingTop: 16,
            display: 'flex', justifyContent: 'space-between', fontWeight: 700, fontSize: 18 }}>
            <span>Total</span>
            <span>${total.toFixed(2)}</span>
          </div>

          <Link to="/checkout">
            <button style={{ ...btnStyle, marginTop: 24 }}>Proceed to Checkout →</button>
          </Link>
        </>
      )}
    </div>
  )
}

const rowStyle = {
  display: 'flex', justifyContent: 'space-between', alignItems: 'center',
  padding: '14px 0', borderBottom: '1px solid #e5e7eb'
}
const btnStyle = {
  width: '100%', padding: '12px 0', borderRadius: 8,
  background: '#111', color: '#fff', border: 'none',
  fontWeight: 600, fontSize: 15, cursor: 'pointer'
}
