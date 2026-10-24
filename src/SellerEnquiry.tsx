import { useState, type FormEvent } from 'react'
import { ArrowRight, CheckCircle2 } from 'lucide-react'
import { indianStates } from './indiaStates'
import './seller-onboarding.css'

export type SellerEnquiryRecord = { name: string; mobile: string; email: string; business: string; state: string; message: string; createdAt: string }
type SellerEnquiryProps = { onSubmit?: (enquiry: SellerEnquiryRecord) => void }

export default function SellerEnquiry({ onSubmit }: SellerEnquiryProps) {
  const [form, setForm] = useState({ name: '', mobile: '', email: '', business: '', state: 'Maharashtra', message: '' })
  const [sent, setSent] = useState(false)
  const update = (key: keyof typeof form, value: string) => setForm((current) => ({ ...current, [key]: value }))
  const submit = (event: FormEvent) => { event.preventDefault(); if (!form.name.trim() || !/^\d{10}$/.test(form.mobile) || !form.business.trim()) return; onSubmit?.({ ...form, createdAt: new Date().toISOString() }); setSent(true); setForm({ name: '', mobile: '', email: '', business: '', state: 'Maharashtra', message: '' }) }
  return <main className="seller-onboarding" id="main"><section className="seller-page seller-narrow"><span className="seller-kicker">INDUS TREND SELLER NETWORK</span><h1>Become a seller</h1><p>Tell us about your craft or business. Our team will contact you and help you start selling on Indus Trend.</p>{sent && <div className="seller-success"><CheckCircle2 /> Enquiry sent. Our team will contact you shortly.</div>}<form className="seller-form-card" onSubmit={submit}><label>Your name<input required value={form.name} onChange={(e) => update('name', e.target.value)} placeholder="Full name" /></label><label>Mobile number<input required inputMode="numeric" maxLength={10} value={form.mobile} onChange={(e) => update('mobile', e.target.value.replace(/\D/g, '').slice(0, 10))} placeholder="10-digit mobile number" /></label><label>Email (optional)<input type="email" value={form.email} onChange={(e) => update('email', e.target.value)} placeholder="you@example.com" /></label><label>Craft / business name<input required value={form.business} onChange={(e) => update('business', e.target.value)} placeholder="Your business or store name" /></label><label>Primary state<select value={form.state} onChange={(e) => update('state', e.target.value)}>{indianStates.map((state) => <option key={state}>{state}</option>)}</select></label><label>Tell us about your products<textarea rows={4} value={form.message} onChange={(e) => update('message', e.target.value)} placeholder="What would you like to sell?" /></label><button className="seller-primary" type="submit">Send seller enquiry <ArrowRight /></button></form></section></main>
}
