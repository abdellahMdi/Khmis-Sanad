import { useState } from 'react'

export default function AnnouncementBar({ onClose }) {
  const [visible, setVisible] = useState(true)

  if (!visible) return null

  const handleClose = () => {
    setVisible(false)
    onClose?.()
  }

  return (
    <div className="ann-bar">
      <span>🇲🇦 <strong>Livraison gratuite</strong> d&egrave;s 200&nbsp;DH</span>
      <span style={{ opacity: 0.35 }}>|</span>
      <span>Produits certifi&eacute;s 100% artisanaux</span>
      <span style={{ opacity: 0.35 }}>|</span>
      <span><strong>Commande WhatsApp</strong> disponible</span>
      <button className="ann-close" onClick={handleClose}>&times;</button>
    </div>
  )
}
