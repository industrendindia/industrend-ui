import { useEffect, useState, type FormEvent } from 'react'
import { ArrowRight, Camera, ChevronDown, ChevronLeft, ChevronRight, Globe2, Heart, KeyRound, LogOut, Mail, MapPin, Menu, Minus, Phone, Plus, Search, ShoppingBag, UserRound, X } from 'lucide-react'
import { FaWhatsapp } from 'react-icons/fa'
import Storefront from './Storefront'
import AccountPage, { type CustomerSession } from './AccountPage'
import './storefront.css'

const navItems = [
  ['Home', 'home'],
  ['Sellers Login', 'seller-login'],
  ['About Us', 'about'],
  ['Contact Us', 'contact'],
  ['Products & Services', 'services'],
] as const

const indianLanguages = [
  ['en', 'English'], ['as', 'অসমীয়া'], ['bn', 'বাংলা'], ['brx', 'बड़ो'], ['doi', 'डोगरी'],
  ['gu', 'ગુજરાતી'], ['hi', 'हिन्दी'], ['kn', 'ಕನ್ನಡ'], ['ks', 'کٲشُر'], ['kok', 'कोंकणी'], ['mai', 'मैथिली'],
  ['ml', 'മലയാളം'], ['mni-Mtei', 'ꯃꯤꯇꯩꯂꯣꯂ'], ['mr', 'मराठी'], ['ne', 'नेपाली'], ['or', 'ଓଡ଼ିଆ'], ['pa', 'ਪੰਜਾਬੀ'],
  ['sa', 'संस्कृतम्'], ['sat', 'ᱥᱟᱱᱛᱟᱲᱤ'], ['sd', 'سنڌي'], ['ta', 'தமிழ்'], ['te', 'తెలుగు'], ['ur', 'اردو'],
] as const

const stores = [
  { name: 'Rahul Sawant', place: '', craft: 'Paintings • Idols • Name Plates • Wall Art', image: 'store-pichwai' },
  { name: 'Mitti & More', place: '', craft: 'Hand-thrown Pottery', image: 'store-pottery' },
  { name: 'Silk Sarees', place: '', craft: 'Silk • Handloom • Heritage Weaves', image: 'store-silk' },
  { name: 'More Makers Soon', place: '', craft: 'A new artisan store is being curated', image: 'store-coming' },
] as const

const products = [
  { name: 'The Monsoon Pichwai', maker: 'By Rahul Sawant', price: '₹18,500', tag: 'ONE OF ONE', tone: 'painting' },
  { name: 'Kutch Earth Vase', maker: 'By Mitti & More', price: '₹2,850', tag: 'SMALL BATCH', tone: 'vase' },
  { name: 'Banarasi Table Runner', maker: 'By The Loom Story', price: '₹4,200', tag: 'HANDWOVEN', tone: 'textile' },
  { name: 'Dhokra Forest Horse', maker: 'By Bastar Foundry', price: '₹6,750', tag: 'COLLECTOR EDITION', tone: 'brass' },
] as const

const businessServices = [
  { code: '1', title: 'Billing', description: 'Fast invoices, payment records and sales reports.' },
  { code: '2', title: 'Inventory', description: 'Track stock, low-stock items and product sales.' },
  { code: '3', title: 'Customer Management', description: 'Customer details, purchase history and follow-ups.' },
  { code: '4', title: 'AI Calling', description: 'AI telecaller and 24×7 voice agent.' },
  { code: '6', title: 'CRM', description: 'Leads, sales pipeline, team activity and follow-ups.' },
  { code: '7', title: 'ERP', description: 'Sales, purchases, inventory and operations in one system.' },
] as const

const heroSlides = [
  { src: '/hero-marble-craft.jpeg', alt: 'Hand-carved marble decor crafted in India' },
  { src: '/hero-curated-crafts.jpeg', alt: 'A curated collection of Indian pottery, carving, sculpture and brass craft' },
  { src: '/hero-wood-craft.jpeg', alt: 'A collection of richly carved Indian wooden craft' },
  { src: '/hero-painting-craft.jpeg', alt: 'Indian artists creating intricate floral paintings by hand' },
] as const

declare global {
  interface Window {
    google?: { translate: { TranslateElement: new (options: object, elementId: string) => void } }
    googleTranslateElementInit?: () => void
  }
}

function App() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [activePage, setActivePage] = useState<'home' | 'services'>('home')
  const [selectedLanguage, setSelectedLanguage] = useState('en')
  const [activeHero, setActiveHero] = useState(0)
  const [heroPaused, setHeroPaused] = useState(false)
  const [activeStore, setActiveStore] = useState<number | null>(() => {
    const match = window.location.hash.match(/^#store\/(\d+)$/)
    return match ? Number(match[1]) : null
  })
  const [cartOpen, setCartOpen] = useState(false)
  const [headerSearch, setHeaderSearch] = useState("")
  const [cartItems, setCartItems] = useState<{ name: string; price: number; image: string; qty: number }[]>([])
  const [accountOpen, setAccountOpen] = useState(false)
  const [accountMenuOpen, setAccountMenuOpen] = useState(false)
  const [accountView, setAccountView] = useState<'profile' | 'pinSetup'>('profile')
  const [customer, setCustomer] = useState<CustomerSession | null>(null)
  const [csrfToken, setCsrfToken] = useState("")
  const cartCount = cartItems.reduce((total, item) => total + item.qty, 0)

  useEffect(() => {
    fetch('/api/v1/auth/session', { credentials: 'include', cache: 'no-store' }).then(async (response) => {
      if (!response.ok) return
      const current = await response.json() as CustomerSession
      setCustomer(current)
      setCsrfToken(current.csrfToken || '')
    }).catch(() => undefined)
  }, [])
  useEffect(() => {
    document.body.style.overflow = menuOpen || cartOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [menuOpen, cartOpen])

  useEffect(() => {
    setSelectedLanguage(window.localStorage.getItem('indus-language') || 'en')
    window.googleTranslateElementInit = () => {
      if (!window.google || document.querySelector('#google_translate_element select')) return
      new window.google.translate.TranslateElement({ pageLanguage: 'en', includedLanguages: indianLanguages.map(([code]) => code).filter((code) => code !== 'en').join(','), autoDisplay: false }, 'google_translate_element')
    }
    if (window.google?.translate) window.googleTranslateElementInit()
    else if (!document.getElementById('google-translate-script')) {
      const script = document.createElement('script')
      script.id = 'google-translate-script'
      script.src = 'https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit'
      script.async = true
      document.body.appendChild(script)
    }
  }, [])

  useEffect(() => {
    if (heroPaused || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const timer = window.setInterval(() => setActiveHero((slide) => (slide + 1) % heroSlides.length), 5500)
    return () => window.clearInterval(timer)
  }, [heroPaused])

  useEffect(() => {
    const syncStoreRoute = () => {
      const match = window.location.hash.match(/^#store\/(\d+)$/)
      setActiveStore(match ? Number(match[1]) : null)
      window.scrollTo({ top: 0 })
    }
    window.addEventListener('hashchange', syncStoreRoute)
    return () => window.removeEventListener('hashchange', syncStoreRoute)
  }, [])

  const goTo = (id: string) => {
    if (id === 'seller-login') { setMenuOpen(false); return }
    const nextPage = id === 'services' ? 'services' : 'home'
    setActivePage(nextPage)
    setAccountOpen(false)
    if (activeStore !== null) window.location.hash = ''
    window.setTimeout(() => {
      if (nextPage === 'services') window.scrollTo({ top: 0, behavior: 'smooth' })
      else document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
    }, 0)
    setMenuOpen(false)
  }

  const openStore = (index: number) => { window.location.hash = `store/${index}` }
  const closeStore = () => { window.location.hash = ''; window.setTimeout(() => document.getElementById('stores')?.scrollIntoView(), 0) }

  const addToCart = (product: { name: string; price: number; image: string }) => {
    setCartItems((items) => {
      const existing = items.find((item) => item.name === product.name)
      return existing ? items.map((item) => item.name === product.name ? { ...item, qty: item.qty + 1 } : item) : [...items, { ...product, qty: 1 }]
    })
    setCartOpen(true)
  }
  const changeCartQuantity = (name: string, change: number) => setCartItems((items) => items.map((item) => item.name === name ? { ...item, qty: Math.max(1, item.qty + change) } : item))
  const removeCartItem = (name: string) => setCartItems((items) => items.filter((item) => item.name !== name))
  const openAccountView = (view: 'profile' | 'pinSetup') => { setAccountView(view); setAccountOpen(true); setAccountMenuOpen(false) }
  const logoutCustomer = async () => {
    try { await fetch('/api/v1/auth/logout', { method: 'POST', credentials: 'include', headers: { 'X-CSRF-Token': csrfToken } }) }
    finally { history.replaceState(null, '', location.pathname); setCustomer(null); setCsrfToken(''); setAccountOpen(false); setAccountMenuOpen(false); setActivePage('home') }
  }
  const changeLanguage = (language: string) => {
    setSelectedLanguage(language)
    window.localStorage.setItem('indus-language', language)
    document.cookie = `googtrans=/en/${language}; path=/; max-age=31536000; SameSite=Lax`
    window.location.reload()
  }

  const submitHeaderSearch = (event: FormEvent) => {
    event.preventDefault()
    const query = headerSearch.trim().toLowerCase()
    if (!query) return
    const storeMatch = stores.some((store) => `${store.name} ${store.craft}`.toLowerCase().includes(query))
    goTo(storeMatch || query.includes('store') || query.includes('craft') ? 'stores' : query.includes('service') || query.includes('billing') || query.includes('crm') ? 'services' : 'products')
  }
  return (
    <div className="site-shell">
      <a className="skip-link" href="#main">Skip to content</a>
      <header className="header" aria-label="Main navigation">
        <div className="header-top">
          <button className="icon-btn menu-button" onClick={() => setMenuOpen(true)} aria-label="Open navigation"><Menu /></button>
          <button className="brand" onClick={() => goTo('home')} aria-label="Indus Trend home">
            <img src="/industrend-logo.jpg" alt="Indus Trend" />
            <span className="brand-copy"><strong>INDUS TREND</strong><small>SHOP THE SPIRIT OF INDIA.</small></span>
          </button>
          <form className="header-search" role="search" onSubmit={submitHeaderSearch}>
            <Search aria-hidden="true" />
            <input value={headerSearch} onChange={(event) => setHeaderSearch(event.target.value)} placeholder="Search products, stores, crafts..." aria-label="Search products, stores and crafts" />
            <button type="submit">Search</button>
          </form>          <div className="header-actions">
            <button className="header-utility" onClick={() => goTo("products")}><Heart />Wishlist</button>
            <button className="bag-btn" onClick={() => setCartOpen(true)} aria-label={`Shopping bag with ${cartCount} items`}><ShoppingBag /><span className="bag-label">Cart</span><b>{cartCount}</b></button>
            <div className="account-menu-wrap">
              <button className="login-link" onClick={() => customer ? setAccountMenuOpen((open) => !open) : openAccountView('profile')} aria-expanded={customer ? accountMenuOpen : undefined}>{customer?.firstName || 'Login'}</button>
              {customer && accountMenuOpen && <div className="account-menu" role="menu"><button role="menuitem" onClick={() => openAccountView('profile')}><UserRound /> My Profile</button><button role="menuitem" onClick={() => openAccountView('pinSetup')}><KeyRound /> Change Login PIN</button><button role="menuitem" onClick={logoutCustomer}><LogOut /> Logout</button></div>}
            </div>
          </div>
        </div>
        <nav className="desktop-nav">
          <div className="nav-inner">{navItems.map(([label, id]) => <button key={id} onClick={() => goTo(id)}>{label}</button>)}</div>
          <label className="language-picker" aria-label="Choose website language"><Globe2 /><span className="sr-only">Language</span><select value={selectedLanguage} onChange={(event) => changeLanguage(event.target.value)}>{indianLanguages.map(([code, name]) => <option key={code} value={code}>{name}</option>)}</select><ChevronDown /></label>
        </nav>
      </header>

      <div className={`mobile-drawer ${menuOpen ? 'open' : ''}`} aria-hidden={!menuOpen}>
        <button className="icon-btn drawer-close" onClick={() => setMenuOpen(false)} aria-label="Close navigation"><X /></button>
        <img src="/industrend-logo.jpg" alt="" />
        <nav>{navItems.map(([label, id]) => <button key={id} onClick={() => goTo(id)}>{label}<ChevronRight /></button>)}</nav>
        <label className="drawer-language"><Globe2 /><span>Website language</span><select value={selectedLanguage} onChange={(event) => changeLanguage(event.target.value)}>{indianLanguages.map(([code, name]) => <option key={code} value={code}>{name}</option>)}</select></label>
        {customer ? <div className="drawer-account"><strong>{customer.firstName || 'My Account'}</strong><button onClick={() => { setMenuOpen(false); openAccountView('profile') }}><UserRound /> My Profile</button><button onClick={() => { setMenuOpen(false); openAccountView('pinSetup') }}><KeyRound /> Change Login PIN</button><button className="drawer-logout" onClick={() => { setMenuOpen(false); void logoutCustomer() }}><LogOut /> Logout</button></div> : <button className="drawer-login" onClick={() => { setMenuOpen(false); openAccountView('profile') }}>Login to your account</button>}
      </div>
      {menuOpen && <button className="drawer-backdrop" onClick={() => setMenuOpen(false)} aria-label="Close navigation" />}

      <div className={`cart-backdrop ${cartOpen ? 'open' : ''}`} onClick={() => setCartOpen(false)} />
      <aside className={`cart-drawer ${cartOpen ? 'open' : ''}`} aria-hidden={!cartOpen} aria-label="Shopping cart">
        <div className="cart-drawer-head"><div><span>YOUR CART</span><h2>Beautiful things,<br />ready for you.</h2></div><button onClick={() => setCartOpen(false)} aria-label="Close cart"><X /></button></div>
        <div className="cart-drawer-items">
          {!cartItems.length && <div className="cart-empty"><ShoppingBag /><h3>Your cart is empty</h3><p>Explore artisan-made pieces and add something meaningful.</p><button onClick={() => { setCartOpen(false); goTo('products') }}>Explore products</button></div>}
          {cartItems.map((item) => <article className="cart-line" key={item.name}><img src={item.image} alt="" /><div><h3>{item.name}</h3><b>₹{item.price.toLocaleString('en-IN')}</b><div className="cart-qty"><button onClick={() => changeCartQuantity(item.name, -1)} aria-label={`Reduce ${item.name}`}><Minus /></button><span>{item.qty}</span><button onClick={() => changeCartQuantity(item.name, 1)} aria-label={`Increase ${item.name}`}><Plus /></button></div></div><button className="cart-remove" onClick={() => removeCartItem(item.name)}>Remove</button></article>)}
        </div>
        {!!cartItems.length && <div className="cart-summary"><div><span>Subtotal</span><strong>₹{cartItems.reduce((total, item) => total + item.price * item.qty, 0).toLocaleString('en-IN')}</strong></div><div><span>Shipping</span><b>FREE</b></div><p>Marketplace protection included</p><button onClick={() => alert('Checkout will be connected to the payment service soon.')}>Proceed to checkout <ArrowRight /></button></div>}
      </aside>

      {accountOpen ? <AccountPage key={accountView} user={customer} csrfToken={csrfToken} initialStep={accountView} onAuthenticated={(user, csrf) => { setCustomer(user); setCsrfToken(csrf) }} onClose={() => goTo('stores')} /> : activeStore !== null ? <Storefront storeIndex={activeStore} onBack={closeStore} onAddToCart={addToCart} /> : <main id="main">
        {activePage === 'home' && <>
        <section className="hero hero-slider" id="home" aria-roledescription="carousel" aria-label="Featured Indian craftsmanship" onMouseEnter={() => setHeroPaused(true)} onMouseLeave={() => setHeroPaused(false)} onFocus={() => setHeroPaused(true)} onBlur={(event) => { if (!event.currentTarget.contains(event.relatedTarget)) setHeroPaused(false) }}>
          <div className="hero-slides">
            {heroSlides.map((slide, index) => <img key={slide.src} className={`hero-image ${index === activeHero ? 'active' : ''}`} src={slide.src} alt={index === activeHero ? slide.alt : ''} aria-hidden={index !== activeHero} />)}
          </div>
          <div className="hero-overlay" />
          <div className="hero-content">
            <span className="hero-kicker">CURATED INDIAN MARKETPLACE</span><h1>Discover a store.<br /><em>Buy with confidence.</em></h1><p>Meet independent makers, explore their collections, and shop authentic Indian craft directly from the people behind it.</p><button className="primary-btn" onClick={() => goTo('stores')}>Visit artisan stores <ArrowRight /></button>
          </div>
          <div className="hero-controls">
            <button onClick={() => setActiveHero((activeHero - 1 + heroSlides.length) % heroSlides.length)} aria-label="Previous image"><ChevronLeft /></button>
            <div className="hero-dots">{heroSlides.map((_, index) => <button key={index} className={index === activeHero ? 'active' : ''} onClick={() => setActiveHero(index)} aria-label={`Show image ${index + 1}`} aria-current={index === activeHero ? 'true' : undefined} />)}</div>
            <button onClick={() => setActiveHero((activeHero + 1) % heroSlides.length)} aria-label="Next image"><ChevronRight /></button>
          </div>
        </section>

        <section className="trust-strip" aria-label="Our promises">
          <div><b>01</b><span><strong>Authentic by origin</strong><small>Sourced directly from makers</small></span></div>
          <div><b>02</b><span><strong>Limited by nature</strong><small>Rare pieces, never mass-produced</small></span></div>
          <div><b>03</b><span><strong>Ethical at heart</strong><small>Fair value for every artisan</small></span></div>
          <div><b>04</b><span><strong>Made to be kept</strong><small>Quality that becomes legacy</small></span></div>
        </section>

        <section className="section stores-section" id="stores">
          <div className="section-heading split-heading">
            <div><span className="kicker">THE PEOPLE BEHIND THE PIECES</span><h2>Stores with a <em>soul.</em></h2></div>
            <div><p>Independent ateliers. Generational workshops. Quiet corners of India where extraordinary things are still made by hand.</p><button className="text-btn" onClick={() => alert('The full stores directory is coming soon.')}>View all stores <ArrowRight /></button></div>
          </div>
          <div className="store-grid">
            {stores.map((store, index) => (
              <article className="store-card" key={store.name}>
                <div className={`store-art ${store.image}`}>
                  {index === 0 && <img className="store-photo" src="/store-01.jpeg" alt="Rahul Sawant standing beside a hand-painted Buddha relief artwork" />}
                  {index === 1 && <img className="store-photo" src="/store-02.jpeg" alt="Handcrafted pottery by Mitti & More" />}
                  <div className="craft-object" />
                </div>
                <div className="store-meta"><div><h3>{store.name}</h3><p className="store-categories">{store.craft}</p>{store.place && <p><MapPin /> {store.place}</p>}</div><button className="store-visit" onClick={() => openStore(index)} aria-label={`Visit ${store.name}`}>Visit store <ArrowRight /></button></div>
              </article>
            ))}
          </div>
        </section>

        <section className="popular-showcase" id="products">
          <div className="popular-head"><span className="popular-kicker">Popular Products</span><h2>Most Loved <em>Indian Finds.</em></h2><p>Discover handcrafted pieces our customers are loving most — authentic products from Indian artisans, makers and heritage stores.</p></div>
          <div className="popular-grid" aria-label="Popular products coming soon">
            {['Paintings', 'Stone Art', 'Home Décor', 'Heritage Craft'].map((category) => <article className="popular-card popular-coming" key={category}><div className="popular-image"><span>Coming soon</span></div><div className="popular-body"><small>{category}</small><h3>Product coming soon</h3></div></article>)}
          </div>
        </section>
        </>}

        {activePage === 'services' && <section className="business-solutions" id="services">
          <div className="solutions-brand-hero">
            <img src="/industrend-logo.jpg" alt="Indus Trend" />
            <div><span>INDUS TREND</span><small>SMART BUSINESS SOLUTIONS</small><i />
              <h2>Your smart digital<br /><em>business partner</em></h2>
            </div>
          </div>
          <div className="solutions-promise">From Billing to AI Sales — Everything in One Place</div>
          <div className="solutions-intro"><h3>Simplify and Organise Your Business</h3><p>Useful digital solutions for small, medium and growing businesses</p></div>
          <div className="service-grid">
            {businessServices.map((service) => <article className="service-card" key={service.title}><span>{service.code}</span><div><h4>{service.title}</h4><p>{service.description}</p></div></article>)}
          </div>
          <article className="whatsapp-solution"><div className="whatsapp-solution-title"><FaWhatsapp /><h3>WhatsApp Business API + AI</h3></div><ol><li>Marketing and transactional messages</li><li>AI WhatsApp salesperson — instant answers to customer questions</li><li>Complete flow from products and orders to payments and support</li></ol><p>24×7 customer service <b>•</b> Faster follow-ups <b>•</b> More sales</p></article>
          <div className="solutions-vision"><h3>Our Vision</h3><div><span>Promote Made in India products</span><span>Support unorganised businesses to grow</span><span>Provide an e-commerce sales platform</span><span>Grow sales and customer base</span></div></div>
          <div className="solutions-demo"><div><h3>Book a Demo Today</h3><p>Call / WhatsApp</p><a href="https://wa.me/919356419345?text=Hi%20Indus%20Trend%2C%20I%20want%20a%20demo%20of%20your%20Business%20Solutions." target="_blank" rel="noreferrer"><FaWhatsapp /> +91 93564 19345</a></div><div><small>VISIT</small><strong>www.industrend.in</strong><span>industrendindia@gmail.com</span><span>Rahatani, Pune</span></div></div>
        </section>}
{activePage === 'home' && <section className="contact-section" id="contact">
          <div className="contact-copy"><span className="kicker">WE’D LOVE TO HEAR FROM YOU</span><h2>Contact <em>Us.</em></h2><p>Questions about a piece, a maker, or your order? Our team is here to help.</p>
            <address>
              <a href="https://www.google.com/maps/search/?api=1&query=Leon+Orbit+B+Wing+Kokane+Chowk+Rahatani+Pune+411017" target="_blank" rel="noreferrer"><span><MapPin /></span><div><b>Office address</b><small>Leon Orbit, B Wing, Kokane Chowk,<br />Rahatani, Pune – 411017</small></div><ArrowRight /></a>
              <a href="tel:+919356419345"><span><Phone /></span><div><b>Call or WhatsApp</b><small>+91 93564 19345</small></div><ArrowRight /></a>
              <a href="mailto:industrendapp@gmail.com"><span><Mail /></span><div><b>Email us</b><small>industrendapp@gmail.com</small></div><ArrowRight /></a>
            </address>
          </div>
          <div className="map-wrap"><iframe title="Indus Trend location at Leon Orbit, Rahatani, Pune" src="https://www.google.com/maps?q=Leon%20Orbit%20B%20Wing%20Kokane%20Chowk%20Rahatani%20Pune%20411017&output=embed" loading="lazy" referrerPolicy="no-referrer-when-downgrade" /><a href="https://www.google.com/maps/dir/?api=1&destination=Leon+Orbit+B+Wing+Kokane+Chowk+Rahatani+Pune+411017" target="_blank" rel="noreferrer">Get directions <ArrowRight /></a></div>
        </section>}
      </main>}

      <footer>
        <div className="footer-main"><div className="footer-brand"><img src="/industrend-logo.jpg" alt="" /><div><strong>INDUS TREND</strong><p>Authentic Bharat lifestyle, thoughtfully curated for the world.</p></div></div><div><b>EXPLORE</b><button onClick={() => goTo('stores')}>Our stores</button><button onClick={() => goTo('products')}>Products</button><button onClick={() => goTo('about')}>Our story</button></div><div><b>SUPPORT</b><a href="mailto:industrendapp@gmail.com">Contact us</a><button onClick={() => alert('Shipping information is coming soon.')}>Shipping</button><button onClick={() => alert('Returns information is coming soon.')}>Returns</button></div><div><b>CONNECT</b><a href="mailto:industrendapp@gmail.com">industrendapp@gmail.com</a><a href="#" aria-label="Instagram"><Camera /> Instagram</a></div></div>
        <div className="footer-bottom"><span>© {new Date().getFullYear()} Indus Trend. All rights reserved.</span><span>Powered by Repair Hub Billing Solution</span></div>
      </footer>
      <a className="whatsapp-float" href="https://wa.me/919356419345?text=Hello%20Indus%20Trend%2C%20I%20would%20like%20to%20know%20more." target="_blank" rel="noreferrer" aria-label="Contact Indus Trend on WhatsApp"><FaWhatsapp /><span>WhatsApp</span></a>
      <div id="google_translate_element" className="google-translate-engine" aria-hidden="true" />
    </div>
  )
}

export default App
