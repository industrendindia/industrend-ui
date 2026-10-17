import { useEffect, useMemo, useState, type FormEvent } from 'react'
import { ArrowRight, CheckCircle2, LockKeyhole, LogOut, Phone, RefreshCw, ShieldCheck } from 'lucide-react'
import { formatMoney, nowLabel, quoteStatusLabel, type CustomQuote } from './customOrderTypes'
import './custom-orders.css'

type AdminPortalProps = {
  quotes: CustomQuote[]
  onUpdateQuote: (quote: CustomQuote) => void
}

const DEMO_ADMIN_EMAIL = 'admin@industrend.in'
const DEMO_ADMIN_PASSWORD = 'IndusDemo@2026'

export default function AdminPortal({ quotes, onUpdateQuote }: AdminPortalProps) {
  const [authenticated, setAuthenticated] = useState(() => sessionStorage.getItem('indus-admin-demo') === 'active')
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

  useEffect(() => {
    if (!selected) return
    setSelectedId(selected.id)
    setNotes(selected.notes || '')
    setAmount(selected.agreedTotal ? String(selected.agreedTotal) : '')
    setEta(selected.eta || '')
    setValidUntil(selected.validUntil || '')
    setTerms(selected.terms || '')
  }, [selected?.id])

  const login = (event: FormEvent) => {
    event.preventDefault()
    if (email.trim().toLowerCase() !== DEMO_ADMIN_EMAIL || password !== DEMO_ADMIN_PASSWORD) {
      setMessage('Incorrect admin email or password.')
      return
    }
    sessionStorage.setItem('indus-admin-demo', 'active')
    setAuthenticated(true)
    setMessage('')
  }

  const logout = () => {
    sessionStorage.removeItem('indus-admin-demo')
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
      <form onSubmit={login}><LockKeyhole /><span>ADMIN LOGIN</span><h2>Welcome back</h2><p>Use the separate administrator credentials for this prototype dashboard.</p><label>Email Address<input type="email" value={email} onChange={(event) => setEmail(event.target.value)} autoComplete="username" /></label><label>Password<input type="password" value={password} onChange={(event) => setPassword(event.target.value)} autoComplete="current-password" /></label>{message && <p className="admin-message">{message}</p>}<button>Login to Admin Dashboard <ArrowRight /></button><div className="admin-demo-credentials"><b>Prototype credentials</b><span>{DEMO_ADMIN_EMAIL}</span><span>{DEMO_ADMIN_PASSWORD}</span></div></form>
    </section>
  </main>

  return <main className="admin-dashboard" id="main">
    <header className="admin-dashboard-head"><div><span>INDUS TREND ADMIN</span><h1>Customised Enquiries</h1><p>Select an enquiry, call the customer, agree the final scope and publish the quotation.</p></div><div><button onClick={() => setMessage('Enquiry list refreshed.')}><RefreshCw /> Refresh</button><button onClick={logout}><LogOut /> Logout</button></div></header>
    <section className="admin-metrics"><article><small>Total Enquiries</small><strong>{quotes.length}</strong></article><article><small>Awaiting Follow-up</small><strong>{quotes.filter((quote) => quote.status === 'Enquiry received').length}</strong></article><article><small>Quotes Sent</small><strong>{quotes.filter((quote) => quote.status === 'Quotation sent').length}</strong></article><article><small>Orders Confirmed</small><strong>{quotes.filter((quote) => quote.status === 'Order confirmed').length}</strong></article></section>
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
    </section>
  </main>
}

