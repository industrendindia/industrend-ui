import { useState, type FormEvent } from 'react'
import { CheckCircle2, X } from 'lucide-react'
import type { CustomQuote } from './customOrderTypes'

type CustomQuoteModalProps = {
  product: { code: string; name: string; image: string }
  onClose: () => void
  onSubmit: (quote: Omit<CustomQuote, 'id' | 'createdAt' | 'status' | 'notes' | 'history'>) => CustomQuote
}

export default function CustomQuoteModal({ product, onClose, onSubmit }: CustomQuoteModalProps) {
  const [submitted, setSubmitted] = useState<CustomQuote | null>(null)
  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const data = new FormData(event.currentTarget)
    const quote = onSubmit({
      storeCode: 'S000002', productCode: product.code, store: 'Prasad Sculpture Studio', product: String(data.get('product') || product.name),
      customerName: String(data.get('name') || ''), phone: String(data.get('phone') || ''), city: String(data.get('city') || ''),
      size: String(data.get('size') || ''), finish: String(data.get('finish') || ''), details: String(data.get('details') || ''),
      attachmentName: (data.get('image') as File)?.name || undefined,
    })
    setSubmitted(quote)
  }

  return <div className="custom-quote-modal" role="dialog" aria-modal="true" aria-labelledby="custom-quote-title"><button className="custom-quote-backdrop" onClick={onClose} aria-label="Close quotation form" /><section><button className="custom-quote-close" onClick={onClose} aria-label="Close"><X /></button>{submitted ? <div className="custom-quote-result"><CheckCircle2 /><span>ENQUIRY RECEIVED</span><h2>Thank you, {submitted.customerName}.</h2><p>Your customised request has been recorded as <b>{submitted.id}</b>. Our team will call you on +91 {submitted.phone} before publishing the final quotation.</p><button onClick={onClose}>Close</button></div> : <><span>CUSTOMISED SCULPTURES &amp; ART</span><h2 id="custom-quote-title">Request a Quotation</h2><p>Tell us about the sculpture or artwork you have in mind. Our team will call you to confirm the design, price and timeline.</p><form onSubmit={submit}><div className="custom-quote-grid"><label>Artwork / Product<input name="product" required defaultValue={product.name} /></label><label>Your Name<input name="name" required autoComplete="name" placeholder="Full name" /></label><label>Mobile Number<input name="phone" required pattern="[0-9]{10}" maxLength={10} inputMode="numeric" placeholder="10-digit mobile" /></label><label>Delivery City<input name="city" required placeholder="City / area" /></label><label>Preferred Size<input name="size" placeholder="e.g. 24 × 36 inches" /></label><label>Material / Finish<input name="finish" placeholder="e.g. stone-look, hand-painted" /></label><label className="wide">Requirements<textarea name="details" required rows={4} placeholder="Describe the design, quantity, colours, deadline or other requirements" /></label><label className="wide">Upload Reference Image (optional)<input type="file" name="image" accept="image/*" /><small>Only the filename is retained in this local prototype.</small></label></div><button>Submit Customised Enquiry</button></form><small className="custom-quote-disclaimer">Prototype: enquiries are stored in this browser only. Production will submit them securely to the backend.</small></>}</section></div>
}

