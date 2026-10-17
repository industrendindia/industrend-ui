import { useState, type FormEvent } from 'react'
import { ArrowLeft, ArrowRight, CheckCircle2, Clock3, PackageCheck, ReceiptIndianRupee } from 'lucide-react'
import { formatMoney, nowLabel, type CustomQuote } from './customOrderTypes'

type MyOrdersProps = {
  quotes: CustomQuote[]
  onUpdateQuote: (quote: CustomQuote) => void
  onBackToStores: () => void
}

export default function MyOrders({ quotes, onUpdateQuote, onBackToStores }: MyOrdersProps) {
  const [activeId, setActiveId] = useState('')
  const [accepted, setAccepted] = useState(false)
  const [message, setMessage] = useState('')
  const active = quotes.find((quote) => quote.id === activeId)

  const completePayment = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!active || !active.agreedTotal || !accepted) {
      setMessage('Please complete delivery details and accept the quotation before payment.')
      return
    }
    const orderId = `ORD-${new Date().getFullYear()}-${String(Date.now()).slice(-6)}`
    onUpdateQuote({
      ...active,
      orderId,
      status: 'Order confirmed',
      paymentStatus: 'Paid (prototype)',
      history: [...active.history, { label: 'Quotation accepted and payment successful', at: nowLabel(), details: `${formatMoney(active.agreedTotal)} · ${orderId}` }],
    })
    setMessage(`Payment successful. Order ${orderId} has been created.`)
    setAccepted(false)
  }

  if (active) return <main className="quote-payment-page" id="main">
    <button className="orders-back" onClick={() => { setActiveId(''); setMessage('') }}><ArrowLeft /> Back to My Orders</button>
    <header><span>INDUS TREND · CUSTOMISED ORDER</span><h1>Review & Pay Your Quotation</h1><p>Confirm the agreed scope and final amount before completing this prototype payment.</p></header>
    <div className="quote-payment-layout">
      <form onSubmit={completePayment}><h2>Delivery Details</h2><div className="quote-delivery-grid"><label>Customer Name<input required defaultValue={active.customerName} /></label><label>Mobile Number<input required defaultValue={active.phone} /></label><label className="wide">Delivery Address<input required placeholder="House, building, street and landmark" /></label><label>City<input required defaultValue={active.city} /></label><label>State<input required /></label><label>PIN Code<input required pattern="[0-9]{6}" maxLength={6} inputMode="numeric" /></label><label>Payment Method<select><option>UPI / Cards / Net Banking</option><option>Cashfree / Razorpay Gateway</option></select></label></div><div className="quote-payment-notice"><b>Prototype payment only.</b> No money is collected. Production must create payment orders server-side and verify the payment gateway webhook.</div><label className="quote-accept"><input type="checkbox" checked={accepted} onChange={(event) => setAccepted(event.target.checked)} /><span><b>I accept the final quotation and agreed scope.</b>The amount, timeline and terms below will be recorded with my order.</span></label>{message && <p className="orders-message">{message}</p>}<button className="quote-pay-button" disabled={!!active.orderId}>{active.orderId ? 'Order Already Confirmed' : `Accept Quotation & Pay ${formatMoney(active.agreedTotal || 0)}`} <ArrowRight /></button></form>
      <aside><span>APPROVED QUOTATION</span><h2>{active.product}</h2><small>{active.storeCode} · {active.productCode} · {active.id}</small><div><small>Final agreed amount</small><strong>{formatMoney(active.agreedTotal || 0)}</strong><p>Shipping and taxes included in agreed price</p></div><dl><dt>Requested size</dt><dd>{active.size || 'As agreed'}</dd><dt>Finish</dt><dd>{active.finish || 'As agreed'}</dd><dt>Timeline</dt><dd>{active.eta}</dd><dt>Valid until</dt><dd>{active.validUntil}</dd></dl><p>{active.terms}</p></aside>
    </div>
  </main>

  return <main className="my-orders-page" id="main">
    <header><div><span>CUSTOMER ACCOUNT</span><h1>My Orders & Quotations</h1><p>Track customised enquiries, final quotations and payments alongside confirmed orders.</p></div><button onClick={onBackToStores}>Continue Shopping <ArrowRight /></button></header>
    <section className="orders-list">{quotes.length ? quotes.map((quote) => <article key={quote.id}>
      <div className="order-card-top"><div><span>{quote.storeCode}{quote.productCode ? ` · ${quote.productCode}` : ' · CUSTOM'}</span><h2>{quote.product}</h2><p>Enquiry {quote.id} · {quote.store}</p></div><b className={`order-status ${quote.status.toLowerCase().replaceAll(' ', '-')}`}>{quote.status}</b></div>
      <div className="order-timeline">{quote.history.map((item, index) => <div key={`${item.at}-${index}`}><i>{index === quote.history.length - 1 ? <CheckCircle2 /> : <Clock3 />}</i><span><b>{item.label}</b><small>{item.at}{item.details ? ` · ${item.details}` : ''}</small></span></div>)}</div>
      {quote.status === 'Quotation sent' && quote.agreedTotal && <div className="order-quote-callout"><div><small>FINAL AGREED PRICE · ALL INCLUSIVE</small><strong>{formatMoney(quote.agreedTotal)}</strong><p>{quote.eta} · Valid until {quote.validUntil}</p></div><button onClick={() => { setActiveId(quote.id); setMessage('') }}>Review, Accept & Pay <ArrowRight /></button></div>}
      {quote.orderId && <div className="confirmed-order"><PackageCheck /><div><b>Confirmed order {quote.orderId}</b><span>{quote.paymentStatus} · {quote.agreedTotal ? formatMoney(quote.agreedTotal) : ''}</span></div><ReceiptIndianRupee /></div>}
      {quote.status !== 'Quotation sent' && !quote.orderId && <p className="order-awaiting">Indus Trend will contact you to discuss the design and final price. No payment is due yet.</p>}
    </article>) : <div className="orders-empty"><PackageCheck /><h2>No customised enquiries yet</h2><p>Visit Prasad Sculpture Studio to request a personalised size, finish or design.</p><button onClick={onBackToStores}>Explore Stores</button></div>}</section>
  </main>
}

