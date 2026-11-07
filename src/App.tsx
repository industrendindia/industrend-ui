import { useEffect, useState, type FormEvent } from 'react'
import { ArrowRight, Camera, ChevronDown, ChevronLeft, ChevronRight, Globe2, Heart, KeyRound, LogOut, Mail, MapPin, Menu, Minus, Phone, Plus, ReceiptIndianRupee, Search, ShoppingBag, UserRound, X } from 'lucide-react'
import { FaFacebookF, FaInstagram, FaWhatsapp } from 'react-icons/fa'
import Storefront from './Storefront'
import AccountPage, { type CustomerSession } from './AccountPage'
import SellerEnquiry from './SellerEnquiry'
import type { SellerEnquiryRecord } from './SellerEnquiry'
import AdminPortal from './AdminPortal'
import MyOrders from './MyOrders'
import CustomQuoteModal from './CustomQuoteModal'
import { nowLabel, type CustomQuote } from './customOrderTypes'
import { loadSellerApplications, SELLER_STORAGE_KEY, type SellerApplication } from './sellerApplicationTypes'
import './storefront.css'

const navItems = [
  ['Home', 'home'],
  ['Become a seller', 'seller-onboarding'],
  ['Admin Login', 'admin-login'],
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
  { name: "Rahul Sawant's Arts and Paintings", place: '', craft: 'Paintings • Idols • Name Plates • Wall Art', image: 'store-pichwai' },
  { name: 'Prasad Heritage Sculpture Studio', place: '', craft: 'Sculptures • Idols • Relief Murals • Custom Art', image: 'store-prasad' },
  { name: 'Anita’s Handmade Decor', place: '', craft: 'Handcraft Decor • Festive decor', image: 'store-anita' },
  { name: 'Mitti & More', place: '', craft: 'Hand-thrown Pottery', image: 'store-pottery' },
  { name: 'Silk Sarees', place: '', craft: 'Silk • Handloom • Heritage Weaves', image: 'store-silk' },
] as const

const products = [
  { name: 'The Monsoon Pichwai', maker: 'By Rahul Sawant', price: '₹18,500', tag: 'ONE OF ONE', tone: 'painting' },
  { name: 'Kutch Earth Vase', maker: 'By Mitti & More', price: '₹2,850', tag: 'SMALL BATCH', tone: 'vase' },
  { name: 'Banarasi Table Runner', maker: 'By The Loom Story', price: '₹4,200', tag: 'HANDWOVEN', tone: 'textile' },
  { name: 'Dhokra Forest Horse', maker: 'By Bastar Foundry', price: '₹6,750', tag: 'COLLECTOR EDITION', tone: 'brass' },
] as const

const businessServices = [
  { code: '₹', title: 'Billing & Inventory', description: 'Invoices, payments, stock and low-stock control.' },
  { code: 'CRM', title: 'Customer & CRM', description: 'Leads, purchase history, follow-ups and sales pipeline.' },
  { code: 'AI', title: 'AI Calling', description: 'AI telecalling and voice-agent workflows for enquiries and follow-ups.' },
  { code: 'WA', title: 'WhatsApp Business', description: 'Business profile, catalogue, customer enquiries and compliant messaging.' },
  { code: 'ERP', title: 'ERP', description: 'Sales, purchases, inventory and operations in one system.' },
  { code: 'SOC', title: 'Facebook & Instagram Marketing', description: 'Show your products to the right audience with standout social creatives and practical marketing campaigns.' },
  { code: 'WEB', title: 'Website Designing', description: 'Give customers a beautiful, dependable place to discover your brand, services and products.' },
  { code: 'CRM', title: 'Customer Management', description: 'Keep customer details and follow-ups in view, so busy shop hours do not push important conversations aside.' },
  { code: 'AI+', title: 'AI & WhatsApp', description: 'Explore AI for routine questions and conversations, allowing your team to focus on customers who need more help.' },
] as const

const serviceDetails = {
  Billing: { kicker: 'BILLING SOFTWARE', title: 'Every invoice. Clearly organised.', description: 'Keep invoices, payment records and sales reports easy to find, so your everyday billing stays on track.', bullets: ['Create and manage invoices', 'Keep track of payment records', 'Review your sales reports'], preview: 'Invoice overview', result: '₹24,850' },
  Inventory: { kicker: 'INVENTORY MANAGEMENT', title: 'Know what is available before you promise.', description: 'Track stock, low-stock items and product sales with a clearer view of your inventory.', bullets: ['Track available stock', 'Review low-stock items', 'Plan purchases with confidence'], preview: 'Inventory overview', result: '04 items' },
  'Customer Management': { kicker: 'CUSTOMER MANAGEMENT', title: 'Keep every customer relationship in view.', description: 'Organise customer details, purchase history and follow-ups in one practical workspace.', bullets: ['Customer details and history', 'Purchase follow-ups', 'Clear next steps for enquiries'], preview: 'Customer overview', result: '18 leads' },
  CRM: { kicker: 'CRM', title: 'Give every enquiry a next step.', description: 'Keep leads, sales pipeline and team activity organised as your business grows.', bullets: ['Leads and sales pipeline', 'Team activity and follow-ups', 'Customer relationship history'], preview: 'CRM overview', result: '6 follow-ups' },
  ERP: { kicker: 'ERP', title: 'Bring operations into one system.', description: 'Connect sales, purchases, inventory and day-to-day operations in one place.', bullets: ['Sales and purchases', 'Inventory operations', 'One view for your business'], preview: 'ERP overview', result: '12 workflows' },
  'AI Calling': { kicker: 'AI CALLING', title: 'Support routine conversations when you are busy.', description: 'Explore AI telecalling and voice-agent workflows for enquiries and follow-ups.', bullets: ['AI telecaller and voice agent', 'Customer enquiry conversations', 'Business-specific follow-up call flows'], preview: 'Call workflow', result: '24×7 support' },
  'WhatsApp Business': { kicker: 'WHATSAPP BUSINESS', title: 'Make every customer conversation count.', description: 'Help customers discover your business, view your product catalogue and contact your team using WhatsApp. Explore the right setup—from Business app basics to approved business messaging when needed.', bullets: ['Business profile and catalogue setup guidance', 'Customer enquiries, labels and quick-reply workflows', 'Consent-based updates and approved template messaging where applicable'], preview: 'Customer communication example', result: 'WhatsApp' },
  'Facebook & Instagram Marketing': { kicker: 'DIGITAL GROWTH', title: 'Show your products to the right audience.', description: 'Build standout social creatives and practical marketing campaigns for your business.', bullets: ['Facebook page and Instagram profile support', 'Posts, reels and content planning', 'Campaign setup and reporting'], preview: 'Campaign overview', result: 'More reach' },
  'Website Designing': { kicker: 'WEBSITE DESIGN & DEVELOPMENT', title: 'A professional website for your next customer.', description: 'Build a modern, mobile-friendly website that introduces your brand, explains your offerings and makes it easy for customers to contact you or shop online.', bullets: ['Responsive business websites and landing pages', 'Products, services, galleries and enquiry forms', 'E-commerce, catalogue and WhatsApp contact options'], preview: 'Example business website map', result: 'Your digital home' },
} as const

const heroSlides = [
  { src: '/hero-marble-craft.jpeg', alt: 'Hand-carved marble decor crafted in India' },
  { src: '/hero-curated-crafts.jpeg', alt: 'A curated collection of Indian pottery, carving, sculpture and brass craft' },
  { src: '/hero-wood-craft.jpeg', alt: 'A collection of richly carved Indian wooden craft' },
  { src: '/hero-painting-craft.jpeg', alt: 'Indian artists creating intricate floral paintings by hand' },
] as const

const pageFromHash = (hash: string): 'home' | 'services' | 'seller-onboarding' | 'admin-login' | 'orders' => {
  const route = hash.replace(/^#/, '').split('/')[0]
  return route === 'services' || route === 'seller-onboarding' || route === 'admin-login' || route === 'orders' ? route : 'home'
}

declare global {
  interface Window {
    google?: { translate: { TranslateElement: new (options: object, elementId: string) => void } }
    googleTranslateElementInit?: () => void
  }
}

function App() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [activePage, setActivePage] = useState<'home' | 'services' | 'seller-onboarding' | 'admin-login' | 'orders'>(() => pageFromHash(window.location.hash))
  const [selectedLanguage, setSelectedLanguage] = useState('en')
  const [activeHero, setActiveHero] = useState(0)
  const [storeSlides, setStoreSlides] = useState<Record<number, number>>({ 1: 0, 2: 0 })
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
  const [customQuotes, setCustomQuotes] = useState<CustomQuote[]>(() => {
    try { return JSON.parse(window.localStorage.getItem('indus-custom-quotes-v1') || '[]') as CustomQuote[] } catch { return [] }
  })
  const [sellerApplications, setSellerApplications] = useState<SellerApplication[]>(loadSellerApplications)
  const [sellerEnquiries, setSellerEnquiries] = useState<SellerEnquiryRecord[]>(() => { try { return JSON.parse(localStorage.getItem('indus-seller-enquiries-v1') || '[]') as SellerEnquiryRecord[] } catch { return [] } })
  const [quoteProduct, setQuoteProduct] = useState<{ code: string; name: string; image: string } | null>(null)
  const [serviceTab, setServiceTab] = useState<keyof typeof serviceDetails>('Billing')
  const selectedService = serviceDetails[serviceTab]
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
    document.body.style.overflow = menuOpen || cartOpen || quoteProduct ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [menuOpen, cartOpen, quoteProduct])

  useEffect(() => { window.localStorage.setItem('indus-custom-quotes-v1', JSON.stringify(customQuotes)) }, [customQuotes])
  useEffect(() => { window.localStorage.setItem(SELLER_STORAGE_KEY, JSON.stringify(sellerApplications)) }, [sellerApplications])
  useEffect(() => { window.localStorage.setItem('indus-seller-enquiries-v1', JSON.stringify(sellerEnquiries)) }, [sellerEnquiries])

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
    const timer = window.setInterval(() => setStoreSlides((current) => ({ ...current, 1: ((current[1] || 0) + 1) % 2, 2: ((current[2] || 0) + 1) % 3 })), 5000)
    return () => window.clearInterval(timer)
  }, [])

  useEffect(() => {
    const syncStoreRoute = () => {
      const match = window.location.hash.match(/^#store\/(\d+)$/)
      setActiveStore(match ? Number(match[1]) : null)
      setActivePage(pageFromHash(window.location.hash))
      window.scrollTo({ top: 0 })
    }
    window.addEventListener('hashchange', syncStoreRoute)
    return () => window.removeEventListener('hashchange', syncStoreRoute)
  }, [])

  const goTo = (id: string) => {
    const nextPage = id === 'services' ? 'services' : id === 'seller-onboarding' ? 'seller-onboarding' : id === 'admin-login' ? 'admin-login' : id === 'orders' ? 'orders' : 'home'
    setActivePage(nextPage)
    setAccountOpen(false)
    if (['services', 'seller-onboarding', 'admin-login', 'orders'].includes(nextPage)) window.location.hash = nextPage
    else if (activeStore !== null || window.location.hash) window.location.hash = ''
    window.setTimeout(() => {
      if (nextPage !== 'home') window.scrollTo({ top: 0, behavior: 'smooth' })
      else document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
    }, 0)
    setMenuOpen(false)
  }

  const openStore = (index: number) => { window.location.hash = `store/${index}` }
  const returnToStores = () => { setAccountOpen(false); setActiveStore(null); setActivePage('home'); window.location.hash = ''; window.setTimeout(() => document.getElementById('stores')?.scrollIntoView({ behavior: 'smooth' }), 0) }
  const closeStore = returnToStores

  const addToCart = (product: { name: string; price: number; image: string }) => {
    setCartItems((items) => {
      const existing = items.find((item) => item.name === product.name)
      return existing ? items.map((item) => item.name === product.name ? { ...item, qty: item.qty + 1 } : item) : [...items, { ...product, qty: 1 }]
    })
    setCartOpen(true)
  }
  const changeCartQuantity = (name: string, change: number) => setCartItems((items) => items.map((item) => item.name === name ? { ...item, qty: Math.max(1, item.qty + change) } : item))
  const removeCartItem = (name: string) => setCartItems((items) => items.filter((item) => item.name !== name))
  const addCustomQuote = (quote: Omit<CustomQuote, 'id' | 'createdAt' | 'status' | 'notes' | 'history'>) => {
    const createdAt = nowLabel()
    const saved: CustomQuote = { ...quote, id: `ENQ-${new Date().getFullYear()}-${String(Date.now()).slice(-6)}`, createdAt, status: 'Enquiry received', notes: '', history: [{ label: 'Customised enquiry submitted', at: createdAt, details: `${quote.storeCode} · ${quote.productCode || 'Custom product'}` }] }
    setCustomQuotes((current) => [saved, ...current])
    return saved
  }
  const updateCustomQuote = (updated: CustomQuote) => setCustomQuotes((current) => current.map((quote) => quote.id === updated.id ? updated : quote))
  const saveSellerApplication = (application: SellerApplication) => setSellerApplications((current) => {
    const exists = current.some((item) => item.vendorCode === application.vendorCode)
    return exists ? current.map((item) => item.vendorCode === application.vendorCode ? application : item) : [application, ...current]
  })
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
            <span className="brand-copy"><strong>INDUS TREND</strong><span className="brand-tagline-row"><small>SHOP THE SPIRIT OF INDIA.</small><span className="india-flag-badge" title="Proudly Indian" aria-label="Indian flag"><svg viewBox="0 0 30 20" aria-hidden="true"><rect width="30" height="6.667" fill="#FF9933"/><rect width="30" height="6.666" y="6.667" fill="#fff"/><rect width="30" height="6.667" y="13.333" fill="#138808"/><g transform="translate(15 10)" stroke="#000080" fill="none"><circle r="2.65" strokeWidth=".55"/><circle r=".42" fill="#000080" stroke="none"/><path d="M15 7.5v5M12.5 10h5M13.23 8.23l3.54 3.54M16.77 8.23l-3.54 3.54" transform="translate(-15 -10)" strokeWidth=".33"/></g></svg></span></span></span>
          </button>
          <form className="header-search" role="search" onSubmit={submitHeaderSearch}>
            <Search aria-hidden="true" />
            <input value={headerSearch} onChange={(event) => setHeaderSearch(event.target.value)} placeholder="Search products, stores, crafts..." aria-label="Search products, stores and crafts" />
            <button type="submit">Search</button>
          </form>          <div className="header-actions">
            <button className="header-utility" onClick={() => goTo("products")}><Heart />Wishlist</button>
            <button className="header-utility orders-utility" onClick={() => goTo('orders')}><ReceiptIndianRupee />My Orders</button>
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
        <button className="drawer-login" onClick={() => { setMenuOpen(false); goTo('orders') }}>My Orders &amp; Quotations</button>
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
        {!!cartItems.length && <div className="cart-summary"><div><span>Subtotal</span><strong>₹{cartItems.reduce((total, item) => total + item.price * item.qty, 0).toLocaleString('en-IN')}</strong></div><div><span>Shipping</span><b>FREE</b></div><p>Marketplace protection included</p><div className="cart-summary-actions"><button className="continue-shopping" onClick={() => { setCartOpen(false); returnToStores() }}>Continue Shopping</button><button className="proceed-checkout" onClick={() => alert('Checkout will be connected to the payment service soon.')}>Proceed to checkout <ArrowRight /></button></div></div>}
      </aside>

      {accountOpen ? <AccountPage key={accountView} user={customer} csrfToken={csrfToken} initialStep={accountView} onAuthenticated={(user, csrf) => { setCustomer(user); setCsrfToken(csrf) }} onClose={returnToStores} /> : activeStore !== null ? <Storefront storeIndex={activeStore} onBack={closeStore} onAddToCart={addToCart} onRequestCustomQuote={setQuoteProduct} /> : <main id="main">
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
            {stores.map((store, index) => {
              const slideImages = index === 1 ? ['/prasad-main-1.jpeg', '/prasad-main-2.jpeg'] : index === 2 ? ['/anita-hero-1.webp', '/anita-hero-2.webp', '/anita-hero-3.webp'] : []
              const slideIndex = storeSlides[index] || 0
              return <article className="store-card" key={store.name}>
                <div className={`store-art ${store.image}`}>
                  {index === 0 && <img className="store-photo" src="/store-01.jpeg" alt="Rahul Sawant standing beside a hand-painted Buddha relief artwork" />}
                  {slideImages.length > 0 && <img className="store-photo" src={slideImages[slideIndex]} alt={`${store.name} featured work`} />}
                  {index === 3 && <img className="store-photo" src="/store-02.jpeg" alt="Handcrafted pottery by Mitti & More" />}
                  <div className="craft-object" />
                </div>
                <div className="store-meta"><div><small className="store-business-code">S{String(index + 1).padStart(6, '0')}</small><h3>{store.name}</h3><p className="store-categories">{store.craft}</p>{store.place && <p><MapPin /> {store.place}</p>}</div><button className="store-visit" onClick={() => openStore(index)} aria-label={`Visit ${store.name}`}>Visit store <ArrowRight /></button></div>
              </article>
            })}
          </div>
        </section>

        <section className="popular-showcase" id="products">
          <div className="popular-head"><span className="popular-kicker">Popular Products</span><h2>Most Loved <em>Indian Finds.</em></h2><p>Discover handcrafted pieces our customers are loving most — authentic products from Indian artisans, makers and heritage stores.</p></div>
          <div className="popular-grid" aria-label="Most loved Indian finds">
            <article className="popular-card"><div className="popular-image"><img src="/popular-royal-garden-painting.jpeg" alt="Traditional Indian royal family garden painting" /><span>Most loved</span></div><div className="popular-body"><small>Traditional Painting</small><h3>Royal Garden Heritage Painting</h3></div></article>
            <article className="popular-card"><div className="popular-image"><img src="/popular-warli-painting.jpeg" alt="Framed Warli village life painting" /><span>Popular pick</span></div><div className="popular-body"><small>Wall Painting</small><h3>Warli Village Life Painting</h3></div></article>
            {['Stone Art', 'Heritage Craft'].map((category) => <article className="popular-card popular-coming" key={category}><div className="popular-image"><span>Coming soon</span></div><div className="popular-body"><small>{category}</small><h3>Product coming soon</h3></div></article>)}
          </div>
        </section>
        </>}

        {activePage === 'services' && <section className="business-solutions" id="services">
          <div className="solutions-reference-hero">
            <span className="solutions-reference-eyebrow">SOFTWARE • MARKETING • WEB DESIGN FOR INDIAN BUSINESSES</span>
            <h2>Manage smarter.<br />Reach further.<br /><em>Grow your business.</em></h2>
            <p>From daily billing to your next customer enquiry, Indus Trend brings together business software, WhatsApp Business, Facebook &amp; Instagram marketing, website designing and AI calling—made for Indian shops, artisans and growing businesses.</p>
            <div className="solutions-reference-actions"><a href="#services-demo">Find your solution <ArrowRight /></a><a href="#services-solutions">View product images <ChevronDown /></a></div>
            <div className="solutions-reference-trust"><span>✓ Everyday business software</span><span>✓ Digital marketing &amp; websites</span></div>
          </div>
          <div className="services-workspace" aria-label="Illustrative Indus Trend business workspace">
            <div className="services-workspace-top"><span>● ● ●</span><small>INDUS TREND / BUSINESS WORKSPACE</small><b>UI concept</b></div>
            <div className="services-workspace-body"><aside><strong>My workspace</strong><span className="active">▣ Overview</span><span>▤ Billing</span><span>▧ Inventory</span><span>◉ Customers</span><span>⌁ Sales CRM</span><span>✧ AI tools</span></aside><div className="services-dashboard"><small>BUSINESS OVERVIEW</small><h3>A clearer view of your day.</h3><div className="services-metrics"><div><small>TODAY'S SALES</small><strong>₹24,850</strong><small>12 invoices</small></div><div><small>OPEN LEADS</small><strong>18</strong><small>6 to follow up</small></div><div><small>LOW STOCK</small><strong>04</strong><small>ITEMS TO REVIEW</small></div></div><small>Sales activity · sample week</small><div className="services-chart">{[35,57,45,72,64,90,78].map((height,index)=><i key={index} style={{height:`${height}%`}} />)}</div><div className="services-notice">✧ <span><b>Your next step, made clear</b>Review 6 customer follow-ups for today.</span></div></div></div>
          </div>
          <div className="solutions-intro"><h3>Explore our solutions</h3><p>Business tools that work. Marketing that connects.</p></div>
          <div className="services-visual-grid" id="services-solutions">
            <article><img src="/services-solution-1.jpg" alt="WhatsApp Business customer conversations" /><div><h4>WhatsApp Business</h4><p>Build a professional WhatsApp presence where customers can find products and contact your business conveniently.</p><ul><li>Business profile and catalogue guidance</li><li>Quick replies and customer enquiry handling</li><li>Opt-in-based updates and approved messaging, where applicable</li></ul><b>Explore this solution ↗</b></div></article>
            <article><img src="/services-solution-2.jpg" alt="AI Calling workspace" /><div><h4>AI Calling</h4><p>Support routine customer conversations when your staff are busy serving customers.</p><ul><li>AI telecaller and voice agent</li><li>Customer enquiry conversations</li><li>Business-specific follow-up call flows</li></ul><b>Explore this solution ↗</b></div></article>
            <article><img src="/services-solution-3.jpg" alt="Business software workspace" /><div><h4>Business Software</h4><p>Spend less time searching through registers, bills and customer messages.</p><ul><li>Billing and payment records</li><li>Inventory and customer management</li><li>CRM and ERP solutions</li></ul><b>Explore this solution ↗</b></div></article>
          </div>
          <div className="services-growth-grid"><article><span>DIGITAL GROWTH</span><h3>Facebook &amp; Instagram Marketing</h3><p>Show your products to the right audience with standout social creatives and practical marketing campaigns.</p><ul><li>Facebook page and Instagram profile support</li><li>Posts, reels and content planning</li><li>Campaign setup and reporting</li></ul></article><article><span>YOUR ONLINE PRESENCE</span><h3>Website Designing</h3><p>Give customers a beautiful, dependable place to discover your brand, services and products.</p><ul><li>Business websites and landing pages</li><li>Mobile-first, responsive design</li><li>Catalogue, enquiry and e-commerce options</li></ul></article></div>
          <div className="services-start-panel"><span>NOT SURE WHERE TO START?</span><h3>One partner.<br />More ways to grow.</h3><p>Tell us what kind of business you run. We’ll discuss the software, marketing and website services that fit your needs.</p><div><b>Billing &amp; CRM</b><b>Social Marketing</b><b>Website Design</b><b>WhatsApp Business</b></div></div>
          <div className="services-benefits"><span>PRACTICAL BENEFITS FOR YOUR BUSINESS</span><h3>Less daily hassle.<br /><em>More time for your customers.</em></h3><p>हिसाब आसान। स्टॉक की जानकारी। ग्राहकों से बेहतर संपर्क।</p><div>{[['01','BILLING & PAYMENTS','Keep your hisaab organised','Find bills, review sales and track payment records more easily.'],['02','STOCK & PURCHASES','Check before you promise','Know what is available and what is running low.'],['03','CUSTOMER RELATIONSHIPS','Give enquiries a next step','Keep customer details and follow-ups in view.'],['04','AI & WHATSAPP','Make time for personal service','Explore AI for routine questions and conversations.']].map(([number,label,title,description])=><article key={number}><small>{number} / {label}</small><h4>{title}</h4><p>{description}</p></article>)}</div></div>
          <section className="services-product-detail" id="services-product-detail"><div className="services-section-label">01 / PRODUCTS &amp; SERVICES</div><div className="services-detail-heading"><h3>From running your business<br />to growing your audience.</h3><p>Nine solutions, one place. Choose a service to explore its benefits, sample workflow and a tailored enquiry.</p></div><div className="services-tabs">{Object.keys(serviceDetails).map((item) => <button key={item} className={item === serviceTab ? 'active' : ''} onClick={() => setServiceTab(item as keyof typeof serviceDetails)}>{item}</button>)}</div><div className="services-detail-card"><div><span>{selectedService.kicker}</span><h4>{selectedService.title}</h4><p>{selectedService.description}</p><ul>{selectedService.bullets.map((bullet) => <li key={bullet}>{bullet}</li>)}</ul></div><div className="services-site-preview"><b>{selectedService.preview}</b><small>Sample preview</small><div><span>WORKFLOW</span><span>BUSINESS TOOL</span><span>NEXT STEP</span><span>Customer need</span><span>{selectedService.preview}</span><span>Explore details</span><span>Daily activity</span><span>Organised workspace</span><span>Review progress</span><span>Customer follow-up</span><span>Quick reply</span><span>{selectedService.result}</span></div></div></div></section>
          <section className="services-engagement"><div><div className="services-section-label">02 / CUSTOMER ENGAGEMENT</div><h3>Keep the conversation<br />going.<br /><em>Even when you’re busy.</em></h3><p>Reach customers through AI Calling and WhatsApp Business—two separate services tailored to your communication needs.</p><div className="services-engagement-cols"><div><b>✧ AI Calling</b><span>AI telecaller and voice-agent solutions for your customer conversations.</span></div><div><b>◉ WhatsApp Business</b><span>Business profile setup, product catalogue, quick replies and customer communication.</span></div></div><a href="#services-demo" className="services-gold-btn">Explore WhatsApp Business ↗</a></div><div className="services-chat-card"><b>✧ &nbsp; Customer enquiry example</b><small>Customer conversation · illustrative example</small><p className="customer-bubble">Hi! Can you help me find the right software for my shop?</p><p>Of course, what would you like to organise first?</p><div><button>Billing &amp; payments</button><button>Stock management</button><button>Customer follow-ups</button></div><p>Choose an option above to try this example conversation.</p><small>Illustrative customer conversation • No live messaging or AI connected</small></div></section>
          <section className="services-enquiry" id="services-demo"><div><div className="services-section-label">LET’S TALK BUSINESS</div><h3>A smarter way to work<br />starts with a conversation.</h3><p>Tell us what you need. We’ll help you explore the right products and services for your business.</p><p className="services-contact-lines">Call +91 93564 19345 ↗<br />industrendindia@gmail.com ↗<br />Rahatani, Pune</p></div><form onSubmit={(event) => event.preventDefault()}><label>Your name<input placeholder="Enter your name" /></label><label>Business name<input placeholder="Your shop or company" /></label><label>I’m interested in<select defaultValue="Billing"><option>Billing</option><option>Inventory</option><option>Customer Management</option><option>CRM</option><option>ERP</option><option>AI Calling</option><option>WhatsApp Business</option><option>Facebook & Instagram Marketing</option><option>Website Designing</option></select></label><button type="submit">Enquire on WhatsApp ↗</button><small>Opens WhatsApp with your enquiry ready to review and send.</small></form></section>
        </section>}
        {activePage === 'seller-onboarding' && <SellerEnquiry onSubmit={(enquiry) => setSellerEnquiries((items) => [enquiry, ...items])} />}
        {activePage === 'admin-login' && <AdminPortal quotes={customQuotes} onUpdateQuote={updateCustomQuote} sellers={sellerApplications} onUpdateSeller={saveSellerApplication} sellerEnquiries={sellerEnquiries} />}
        {activePage === 'orders' && <MyOrders quotes={customQuotes} onUpdateQuote={updateCustomQuote} onBackToStores={returnToStores} />}
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
      {quoteProduct && <CustomQuoteModal product={quoteProduct} onClose={() => setQuoteProduct(null)} onSubmit={addCustomQuote} />}
    </div>
  )
}

export default App
