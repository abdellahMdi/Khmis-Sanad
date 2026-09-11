import { useState } from 'react'
import HomePage from './pages/HomePage.jsx'
import Toast from './components/Toast.jsx'

export default function App() {
  const [cartCount, setCartCount] = useState(2)
  const [toast, setToast] = useState(null)

  const addToCart = (name) => {
    setCartCount(c => c + 1)
    setToast('\u2713 "' + name + '" ajout\u00e9 au panier!')
    setTimeout(() => setToast(null), 3000)
  }

  const whatsappOrder = (name, price, seller) => {
    const msg = encodeURIComponent(
      'Bonjour, je souhaite commander: ' + name + ' (' + price + ') de ' + seller
    )
    window.open('https://wa.me/212600000000?text=' + msg, '_blank')
  }

  return (
    <>
      <HomePage
        cartCount={cartCount}
        onAddToCart={addToCart}
        onWhatsappOrder={whatsappOrder}
      />
      <Toast message={toast} />
    </>
  )
}
