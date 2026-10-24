import { useEffect, useMemo, useState, type FormEvent } from 'react'
import { ArrowRight, CheckCircle2, LockKeyhole, LogOut, Phone, RefreshCw, ShieldCheck, Store } from 'lucide-react'
import { FaFacebookF } from 'react-icons/fa'
import { formatMoney, nowLabel, quoteStatusLabel, type CustomQuote } from './customOrderTypes'
import type { SellerApplication } from './sellerApplicationTypes'
import SellerOnboarding from './SellerOnboarding'
import type { SellerEnquiryRecord } from './SellerEnquiry'
import SocialMediaPanel from './SocialMediaPanel'
import './custom-orders.css'

type AdminPortalProps = {
  quotes: CustomQuote[]
  onUpdateQuote: (quote: CustomQuote) => void
  sellers: SellerApplication[]
  onUpdateSeller: (seller: SellerApplication) => void
  sellerEnquiries?: SellerEnquiryRecord[]
}

export default function AdminPortal({ quotes, onUpdateQuote, sellers, onUpdateSeller, sellerEnquiries = [] }: AdminPortalProps) {
  const [authenticated, setAuthenticated] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [message, setMessage] = useState('')
  const [selectedId, setSelectedId] = useState(quotes[0]?.id ?? '')
  const selected = useMemo(() => quotes.find((quote) => quote.id === selectedId) ?? quotes[0], [quotes, selectedId])
  const [notes, setNotes] = useState('')
  const [amount, setAmount] = useState('')
  const [eta, setEta] = useState('')
  const [validUntil, setValidUntil] = useState('')
  const [terms, setTerms] = useState('')
  const [adminSection, setAdminSection] = useState<'enquiries'|'sellers'|'social'>('enquiries')
  const [selectedVendor, setSelectedVendor] = useState(sellers[0]?.vendorCode || '')
  const [sellerView, setSellerView] = useState<'records'|'onboarding'>('records')
  const selectedSeller = sellers.find((seller) => seller.vendorCode === selectedVendor) || sellers[0]

  useEffect(()=>{fetch('/api/v1/admin-auth/session',{credentials:'include',cache:'no-store'}).then((response)=>setAuthenticated(response.ok)).catch(()=>setAuthenticated(false))},[])

  useEffect(() => {
    if (!selected) return
    setSelectedId(selected.id)
    setNotes(selected.notes || '')
    setAmount(selected.agreedTotal ? String(selected.agreedTotal) : '')
    setEta(selected.eta || '')
    setValidUntil(selected.validUntil || '')
    setTerms(selected.terms || '')
  }, [selected?.id])

  const login = async (event: FormEvent) => {
    event.preventDefault()
    setMessage('')
    try{const response=await fetch('/api/v1/admin-auth/login',{method:'POST',credentials:'include',headers:{'Content-Type':'application/json'},body:JSON.stringify({email,password})});const body=await response.json().catch(()=>({}));if(!response.ok)throw new Error(body.error||'Incorrect admin email or password.');setAuthenticated(true)}catch(error){setMessage((error as Error).message)}
  }

  const logout = () => {
    void fetch('/api/v1/admin-auth/logout',{method:'POST',credentials:'include'})
    setAuthenticated(false)
    setPassword('')
  }

  const recordCall = () => {
    if (!selected || !notes.trim()) { setMessage('Add the customer call notes first.'); return }
    const updated: CustomQuote = { ...selected, notes: notes.trim(), status: 'Customer contacted', history: [...selected.history, { label: 'Customer call recorded', at: nowLabel(), details: notes.trim() }] }
    onUpdateQuote(updated)
    setMessage('Customer discussion saved in the enquiry history.')
  }

  const sendQuote = () => {
    if (!selected) return
    const total = Math.round(Number(amount))
    if (!total || total < 1 || !eta.trim() || !validUntil || !terms.trim()) {
      setMessage('Enter the final amount, completion timeline, validity and quotation terms.')
      return
    }
    if (validUntil < new Date().toISOString().slice(0, 10)) {
      setMessage('Quotation validity cannot be in the past.')
      return
    }
    const updated: CustomQuote = {
      ...selected,
      notes: notes.trim(),
      agreedTotal: total,
      eta: eta.trim(),
      validUntil,
      terms: terms.trim(),
      status: 'Quotation sent',
      paymentStatus: 'Awaiting customer payment',
      history: [...selected.history, { label: 'Final quotation sent', at: nowLabel(), details: `${formatMoney(total)} · ${eta.trim()}` }],
    }
    onUpdateQuote(updated)
    setMessage('Quotation published to the customer’s My Orders page.')
  }

  if (!authenticated) return <main className="admin-login-page" id="main">
    <section className="admin-login-card">
      <aside><img src="/industrend-logo.jpg" alt="Indus Trend" /><span>INDUS TREND ADMINISTRATION</span><h1>Secure access for marketplace operations.</h1><p>Review customised enquiries, record customer discussions and publish agreed quotations.</p><ul><li><ShieldCheck /> Separate administrator access</li><li><Phone /> Customer enquiry follow-up</li><li><CheckCircle2 /> Controlled quotation publishing</li></ul></aside>
      <form onSubmit={login}><LockKeyhole /><span>ADMIN LOGIN</span><h2>Welcome back</h2><p>Enter your administrator credentials to access marketplace operations.</p><label>Email Address<input type="email" value={email} onChange={(event) => setEmail(event.target.value)} autoComplete="username" /></label><label>Password<input type="password" value={password} onChange={(event) => setPassword(event.target.value)} autoComplete="current-password" /></label>{message && <p className="admin-message">{message}</p>}<button>Login to Admin Dashboard <ArrowRight /></button></form>
    </section>
  </main>

  return <main className="admin-dashboard" id="main">
    <header className="admin-dashboard-head"><div><span>INDUS TREND ADMIN</span><h1>{adminSection==='sellers'?'Seller Onboarding':adminSection==='social'?'Social Media Studio':'Customised Enquiries'}</h1><p>{adminSection==='sellers'?'Review, correct, approve and activate seller applications.':adminSection==='social'?'Generate, review and publish Facebook content from one secure workspace.':'Select an enquiry, call the customer, agree the final scope and publish the quotation.'}</p></div><div><button onClick={()=>setAdminSection('enquiries')}><RefreshCw/> Enquiries</button><button onClick={()=>{setAdminSection('sellers');setSellerView('records')}}><Store/> Sellers</button><button onClick={()=>setSellerView('onboarding')}><Store/> Open onboarding flow</button><button onClick={()=>setAdminSection('social')}><FaFacebookF/> Social Media</button><button onClick={logout}><LogOut /> Logout</button></div></header>
    <section className="admin-metrics"><article><small>Total Enquiries</small><strong>{quotes.length}</strong></article><article><small>Seller Enquiries</small><strong>{sellerEnquiries.length}</strong></article><article><small>Onboarding Stores</small><strong>{sellers.length}</strong></article><article><small>Active Stores</small><strong>{sellers.filter((seller) => seller.status === 'Active').length}</strong></article></section>
    {adminSection==='social'?<SocialMediaPanel/>:adminSection==='sellers' && sellerView==='onboarding' ? <SellerOnboarding applications={sellers} onSave={onUpdateSeller} />:adminSection==='sellers' ? <section className="admin-quote-layout admin-seller-layout">
      <aside className="admin-enquiry-list"><h2>All Onboarding Stores <b>{sellers.length}</b></h2>{sellers.length ? sellers.map((seller) => <button key={seller.vendorCode} className={selectedSeller?.vendorCode === seller.vendorCode ? 'selected' : ''} onClick={() => setSelectedVendor(seller.vendorCode)}><strong>{seller.contactName}</strong><span>{seller.vendorCode} · {seller.route}</span><small>+91 {seller.mobile} · {seller.state}</small><em>{seller.status}</em></button>) : <div className="admin-empty"><h3>No seller applications yet</h3><p>Submitted onboarding applications will appear here.</p></div>}</aside>
      <article className="admin-quote-editor">{selectedSeller ? <><div className="admin-customer"><div><strong>{selectedSeller.contactName}</strong><span>{selectedSeller.vendorCode} · {selectedSeller.status}</span></div><a href={`tel:+91${selectedSeller.mobile}`}><Phone /> +91 {selectedSeller.mobile}</a></div><div className="admin-editor-grid seller-admin-fields">
        <label>Contact Name<input value={selectedSeller.contactName} onChange={(event) => onUpdateSeller({ ...selectedSeller, contactName: event.target.value })} /></label><label>Email<input type="email" value={selectedSeller.email} onChange={(event) => onUpdateSeller({ ...selectedSeller, email: event.target.value })} /></label><label>Primary State<input value={selectedSeller.state} onChange={(event) => onUpdateSeller({ ...selectedSeller, state: event.target.value })} /></label><label>Name as per PAN<input value={selectedSeller.nameAsPan} onChange={(event) => onUpdateSeller({ ...selectedSeller, nameAsPan: event.target.value })} /></label><label>PAN<input value={selectedSeller.pan} onChange={(event) => onUpdateSeller({ ...selectedSeller, pan: event.target.value.toUpperCase() })} /></label><label>Aadhaar<input value={selectedSeller.aadhaar} onChange={(event) => onUpdateSeller({ ...selectedSeller, aadhaar: event.target.value.replace(/\D/g, '').slice(0, 12) })} /></label><label>Name as per Bank<input value={selectedSeller.bankName} onChange={(event) => onUpdateSeller({ ...selectedSeller, bankName: event.target.value })} /></label><label>Bank Account<input value={selectedSeller.bankAccount} onChange={(event) => onUpdateSeller({ ...selectedSeller, bankAccount: event.target.value.replace(/\D/g, '') })} /></label><label>IFSC<input value={selectedSeller.bankIfsc} onChange={(event) => onUpdateSeller({ ...selectedSeller, bankIfsc: event.target.value.toUpperCase() })} /></label><label>Category<input value={selectedSeller.category} onChange={(event) => onUpdateSeller({ ...selectedSeller, category: event.target.value })} /></label>
      </div><div className="admin-verification-summary"><span className={selectedSeller.panVerified ? 'ok' : ''}>PAN {selectedSeller.panVerified ? 'Verified' : 'Pending'}</span><span className={selectedSeller.aadhaarVerified ? 'ok' : ''}>Aadhaar {selectedSeller.aadhaarVerified ? 'Verified' : 'Pending'}</span><span className={selectedSeller.bankVerified ? 'ok' : ''}>Bank {selectedSeller.bankVerified ? 'Verified' : 'Pending'}</span></div>{message && <p className="admin-message">{message}</p>}<div className="admin-seller-actions"><button className="admin-request-change" onClick={() => setMessage('Request Change will be enabled when seller notifications are connected.')}>Request Change</button><button className="admin-send-quote" disabled={selectedSeller.status === 'Active' || !selectedSeller.kycCompleted} onClick={() => { onUpdateSeller({ ...selectedSeller, status: 'Active', approvedAt: new Date().toISOString() }); setMessage(`${selectedSeller.vendorCode} approved and activated.`) }}>{selectedSeller.status === 'Active' ? 'Store Active' : 'Approve & Activate Store'} <ArrowRight /></button></div></> : <div className="admin-empty"><h3>Select a seller</h3></div>}</article>
    </section> : <>
    <section className="admin-quote-layout">
      <aside className="admin-enquiry-list"><h2>Enquiry Inbox <b>{quotes.length}</b></h2>{quotes.length ? quotes.map((quote) => <button key={quote.id} className={selected?.id === quote.id ? 'selected' : ''} onClick={() => setSelectedId(quote.id)}><strong>{quote.product}</strong><span>{quote.id} · {quote.customerName}</span><small>+91 {quote.phone} · {quote.city}</small><em>{quoteStatusLabel(quote)}</em></button>) : <div className="admin-empty"><h3>No enquiries yet</h3><p>A customer can submit one from Prasad Sculpture Studio.</p></div>}</aside>
      <article className="admin-quote-editor">{selected ? <>
        <div className="admin-customer"><div><strong>{selected.customerName}</strong><span>Enquiry {selected.id} · {selected.status}</span></div><a href={`tel:+91${selected.phone}`}><Phone /> +91 {selected.phone}</a></div>
        <div className="admin-enquiry-facts"><div><small>Store / Product Code</small><b>{selected.storeCode} · {selected.productCode || 'Custom product pending'}</b></div><div><small>Product</small><b>{selected.product}</b></div><div><small>Requested Size</small><b>{selected.size || 'To discuss'}</b></div><div><small>Material / Finish</small><b>{selected.finish || 'To discuss'}</b></div></div>
        <p className="admin-requirements">{selected.details}</p>
        {selected.attachmentName && <p className="admin-attachment">Reference image: <b>{selected.attachmentName}</b></p>}
        <label>Call Notes / Discussion Summary<textarea value={notes} onChange={(event) => setNotes(event.target.value)} rows={3} placeholder="Final size, material, design scope and customer discussion..." /></label><button className="admin-record-call" onClick={recordCall} disabled={!!selected.orderId}>Record Customer Call</button>
        <div className="admin-editor-grid"><label>Final All-Inclusive Amount (₹)<input type="number" min="1" value={amount} onChange={(event) => setAmount(event.target.value)} /></label><label>Estimated Completion / Dispatch<input value={eta} onChange={(event) => setEta(event.target.value)} placeholder="e.g. 15–20 days" /></label><label>Quotation Valid Until<input type="date" value={validUntil} onChange={(event) => setValidUntil(event.target.value)} /></label><label>Terms / What’s Included<textarea rows={3} value={terms} onChange={(event) => setTerms(event.target.value)} placeholder="Scope, packing, taxes, delivery and exclusions" /></label></div>
        <div className="admin-warning">The final amount should include everything agreed with the customer. Once published, the customer can accept and pay this exact amount.</div>
        {message && <p className="admin-message">{message}</p>}
        <button className="admin-send-quote" onClick={sendQuote} disabled={!!selected.orderId}>{selected.orderId ? 'Order Already Confirmed' : 'Save & Send Final Quotation'} <ArrowRight /></button>
        <div className="admin-history"><h3>Enquiry History</h3>{[...selected.history].reverse().map((item, index) => <div key={`${item.at}-${index}`}><b>{item.label}</b><small>{item.at}{item.details ? ` · ${item.details}` : ''}</small></div>)}</div>
      </> : <div className="admin-empty"><h3>Select an enquiry</h3><p>Customer requirements and quotation tools will appear here.</p></div>}</article>
    </section></>}
  </main>
}

