export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-inner">
        <div className="footer-grid">
          {/* Brand */}
          <div>
            <div className="f-brand">✋ Khmissa Sanad</div>
            <p className="f-desc">
              Marketplace d&eacute;di&eacute;e &agrave; la valorisation des artisans
              et coop&eacute;ratives marocaines. Chaque achat soutient directement
              une famille d&rsquo;artisans.
            </p>
            <div className="f-social">
              <button className="f-soc">🏷</button>
              <button className="f-soc">📷</button>
              <button className="f-soc">📱</button>
            </div>
          </div>

          {/* Catalogue */}
          <div>
            <div className="f-col-t">Catalogue</div>
            <div className="f-links">
              <a href="#">Huiles &amp; Soins</a>
              <a href="#">&Eacute;pices &amp; Safran</a>
              <a href="#">Miels &amp; Amlou</a>
              <a href="#">Tapis Berb&egrave;res</a>
              <a href="#">Poterie &amp; D&eacute;co</a>
            </div>
          </div>

          {/* About */}
          <div>
            <div className="f-col-t">Khmissa Sanad</div>
            <div className="f-links">
              <a href="#">Notre Mission</a>
              <a href="#">Les Coop&eacute;ratives</a>
              <a href="#">Blog Terroir</a>
              <a href="#">Impact Social</a>
              <a href="#">Rejoindre la plateforme</a>
            </div>
          </div>

          {/* Help */}
          <div>
            <div className="f-col-t">Aide &amp; Contact</div>
            <div className="f-links">
              <a href="#">FAQ</a>
              <a href="#">Livraison &amp; Retours</a>
              <a href="#">Paiement s&eacute;curis&eacute;</a>
              <a href="#" style={{ color: '#25D366' }}>📱 WhatsApp Support</a>
              <a href="#">CGV</a>
            </div>
          </div>
        </div>

        <div className="f-bottom">
          <span>
            &copy; 2026 Khmissa Sanad &mdash; Artisanat Marocain.
            Tous droits r&eacute;serv&eacute;s.
          </span>
          <div className="f-bottom-links">
            <a href="#">Confidentialit&eacute;</a>
            <a href="#">CGV</a>
            <a href="#">Mentions l&eacute;gales</a>
            <span style={{ color: '#8B3A2B', fontWeight: 700 }}>
              🇲🇦 Made in Morocco
            </span>
          </div>
        </div>
      </div>
    </footer>
  )
}
