import { useState, type FormEvent } from 'react'
import { ArrowLeft, ArrowRight, Check, CheckCircle2, Landmark, PackageCheck, ShieldCheck, UserRound } from 'lucide-react'
import './seller-onboarding.css'
import { createVendorCode, type SellerApplication } from './sellerApplicationTypes'

type Step = 'register' | 'otp' | 'success' | 'setup' | 'individualKyc' | 'businessKyc' | 'product' | 'review' | 'submitted'
type SellerRoute = 'individual' | 'business'

const states = ['Maharashtra', 'Rajasthan', 'Gujarat', 'Uttar Pradesh', 'Karnataka', 'Other']
const productCategories = ['Paintings & Art', 'Idols & Handicrafts', 'Woodcraft', 'Textiles', 'Food Products', 'Packaged Consumer Products', 'Electrical / BIS-Regulated Product', 'Jewellery', 'Other']

type SellerOnboardingProps = { applications: SellerApplication[]; onSave: (application: SellerApplication) => void }

async function api<T>(url: string, options: RequestInit): Promise<T> {
  const response = await fetch(url, { ...options, credentials: 'include', headers: { 'Content-Type': 'application/json', ...(options.headers || {}) } })
  const body = await response.json().catch(() => ({}))
  if (!response.ok) throw new Error((body as { error?: string }).error || 'Unable to complete the request')
  return body as T
}

export default function SellerOnboarding({ applications, onSave }: SellerOnboardingProps) {
  const saved = applications[0]
  const [step, setStep] = useState<Step>(saved?.status === 'Under Review' || saved?.status === 'Active' ? 'submitted' : saved ? 'setup' : 'register')
  const [route, setRoute] = useState<SellerRoute>(saved?.route || 'individual')
  const [name, setName] = useState(saved?.contactName || '')
  const [mobile, setMobile] = useState(saved?.mobile || '')
  const [email, setEmail] = useState(saved?.email || '')
  const [state, setState] = useState(saved?.state || 'Maharashtra')
  const [otp, setOtp] = useState('')
  const [challengeId, setChallengeId] = useState('')
  const [devOtp, setDevOtp] = useState('')
  const [busy, setBusy] = useState(false)
  const [message, setMessage] = useState('')
  const [vendorReference, setVendorReference] = useState(saved?.vendorCode || '')
  const [kycDone, setKycDone] = useState(saved?.kycCompleted || false)
  const [productDone, setProductDone] = useState(saved?.productCompleted || false)
  const [panVerified, setPanVerified] = useState(saved?.panVerified || false)
  const [aadhaarVerified, setAadhaarVerified] = useState(saved?.aadhaarVerified || false)
  const [bankVerified, setBankVerified] = useState(saved?.bankVerified || false)
  const [nameAsPan, setNameAsPan] = useState(saved?.nameAsPan || '')
  const [pan, setPan] = useState(saved?.pan || '')
  const [aadhaar, setAadhaar] = useState(saved?.aadhaar || '')
  const [bankAccount, setBankAccount] = useState(saved?.bankAccount || '')
  const [bankIfsc, setBankIfsc] = useState(saved?.bankIfsc || '')
  const [bankName, setBankName] = useState(saved?.bankName || '')
  const [category, setCategory] = useState(saved?.category || productCategories[0])
  const [declarations, setDeclarations] = useState([false, false, false])
  const [finalDeclaration, setFinalDeclaration] = useState(false)
  const snapshot = (overrides: Partial<SellerApplication> = {}): SellerApplication => ({ vendorCode: vendorReference, route, contactName: name, mobile, email, state, nameAsPan, pan, aadhaar, bankAccount, bankIfsc, bankName, panVerified, aadhaarVerified, bankVerified, kycCompleted: kycDone, productCompleted: productDone, category, status: saved?.status || 'Draft', submittedAt: saved?.submittedAt, approvedAt: saved?.approvedAt, ...overrides })

  const go = (next: Step) => {
    setStep(next)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const register = async (event: FormEvent) => {
    event.preventDefault()
    if (!name.trim() || !/^\d{10}$/.test(mobile) || !/^\S+@\S+\.\S+$/.test(email)) {
      alert('Please enter the contact name, a valid 10-digit mobile number and email address.')
      return
    }
    setBusy(true); setMessage('')
    try {
      const result = await api<{ challengeId: string; developmentOtp?: string }>('/api/v1/auth/otp/request', { method: 'POST', body: JSON.stringify({ mobile, purpose: 'SELLER_ONBOARDING' }) })
      setChallengeId(result.challengeId); setDevOtp(result.developmentOtp || ''); go('otp')
    } catch (error) { setMessage((error as Error).message) } finally { setBusy(false) }
  }

  const verifyOtp = async (event: FormEvent) => {
    event.preventDefault()
    setBusy(true); setMessage('')
    try {
      await api('/api/v1/auth/seller-otp/verify', { method: 'POST', body: JSON.stringify({ challengeId, otp }) })
      const code = vendorReference || createVendorCode(); setVendorReference(code)
      onSave(snapshot({ vendorCode: code })); go('success')
    } catch (error) { setMessage((error as Error).message) } finally { setBusy(false) }
  }

  const completeKyc = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!panVerified || !aadhaarVerified || !bankVerified) {
      alert('Please complete PAN, identity and bank verification before continuing.')
      return
    }
    setKycDone(true)
    onSave(snapshot({ kycCompleted: true }))
    go('setup')
  }

  const completeProduct = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!declarations.every(Boolean)) {
      alert('Please accept all product compliance declarations.')
      return
    }
    setProductDone(true)
    onSave(snapshot({ productCompleted: true }))
    go('setup')
  }

  const licenceRequired = !['Paintings & Art', 'Idols & Handicrafts', 'Woodcraft', 'Textiles'].includes(category)

  return <section className="seller-onboarding" aria-label="Seller onboarding">
    {step === 'register' && <div className="seller-page seller-register-page">
      <div className="seller-hero">
        <div><span>SELL ON INDUS TREND</span><h1>Register first.<br />Complete setup after.</h1><p>Create your seller account with essential information. Complete KYC, bank verification and product compliance after registration.</p></div>
        <aside><strong>Why this flow is easier</strong><p>You can create an account first, save progress, and complete verification at your convenience.</p></aside>
      </div>
      <form className="seller-card seller-register-card" onSubmit={register}>
        <header><span>STEP 1 — BASIC REGISTRATION</span><h2>Create Seller Account</h2><p>KYC, product compliance and store details come after successful registration.</p></header>
        <div className="seller-card-body">
          <label className="seller-label">How will you sell on Indus Trend?</label>
          <div className="seller-route-options">
            <button type="button" className={route === 'individual' ? 'selected' : ''} onClick={() => setRoute('individual')}><UserRound /><span><b>Individual Seller / Artisan</b><small>Simple KYC using PAN, identity verification and bank details.</small></span></button>
            <button type="button" className={route === 'business' ? 'selected' : ''} onClick={() => setRoute('business')}><Landmark /><span><b>Business / Group Seller</b><small>For proprietorships, partnerships, LLPs, companies and SHGs.</small></span></button>
          </div>
          <div className="seller-form-grid">
            <label><span>Contact Person Name</span><input value={name} onChange={(event) => setName(event.target.value)} placeholder="Full name" /></label>
            <label><span>Mobile Number</span><div className="seller-phone"><b>+91</b><input value={mobile} onChange={(event) => setMobile(event.target.value.replace(/\D/g, '').slice(0, 10))} inputMode="numeric" placeholder="10-digit mobile" /></div></label>
            <label><span>Email Address</span><input value={email} onChange={(event) => setEmail(event.target.value)} type="email" placeholder="seller@example.com" /></label>
            <label><span>Primary State</span><select value={state} onChange={(event) => setState(event.target.value)}>{states.map((item) => <option key={item}>{item}</option>)}</select></label>
          </div>
          {message && <div className="seller-note seller-error">{message}</div>}
        </div>
        <footer><small>We will send the verification OTP to this WhatsApp number.</small><button className="seller-primary" disabled={busy}>{busy ? 'Sending OTP…' : 'Verify Mobile & Register'} <ArrowRight /></button></footer>
      </form>
    </div>}

    {step === 'otp' && <div className="seller-page seller-narrow"><form className="seller-card" onSubmit={verifyOtp}><header><span>MOBILE VERIFICATION</span><h2>Enter WhatsApp OTP</h2><p>We sent a 6-digit OTP to +91 {mobile} through the configured notification service.</p></header><div className="seller-card-body"><label className="seller-otp"><span>6-Digit OTP</span><input value={otp} onChange={(event) => setOtp(event.target.value.replace(/\D/g, '').slice(0, 6))} inputMode="numeric" maxLength={6} placeholder="••••••" /></label>{devOtp && <div className="seller-note">Development OTP: <b>{devOtp}</b></div>}{message && <div className="seller-note seller-error">{message}</div>}</div><footer><button type="button" className="seller-secondary" onClick={() => go('register')}><ArrowLeft /> Back</button><button className="seller-primary" disabled={busy || otp.length !== 6}>{busy ? 'Verifying…' : 'Verify & Create Account'} <ArrowRight /></button></footer></form></div>}

    {step === 'success' && <div className="seller-page seller-narrow"><div className="seller-card seller-success"><CheckCircle2 /><span>REGISTRATION SUCCESSFUL</span><h2>Seller account created.</h2><p>Your account is registered, but selling is not active yet. Complete KYC and product compliance next.</p><b>{vendorReference}</b><button className="seller-primary" onClick={() => go('setup')}>Continue to Seller Setup <ArrowRight /></button></div></div>}

    {step === 'setup' && <div className="seller-page">
      <div className="seller-setup-head"><div><span>AFTER REGISTRATION</span><h1>Seller Setup Centre</h1><p>Complete both required sections before submitting your application for verification.</p></div><div className="seller-progress"><i className={kycDone ? 'done' : ''} />KYC <b>→</b><i className={productDone ? 'done' : ''} />Products</div></div>
      <div className="seller-route-banner"><div><strong>{route === 'individual' ? 'Individual Seller Route' : 'Business / Group Seller Route'}</strong><p>{route === 'individual' ? 'PAN, identity and bank verification. No company or LLP fields.' : 'Entity-specific KYC, authorised-person details, tax route and bank verification.'}</p></div><button onClick={() => go('register')}>Change Seller Type</button></div>
      <div className="seller-setup-grid">
        <article className={kycDone ? 'complete' : ''}><span>1</span><small>{kycDone ? 'Completed' : 'Not Started'}</small><ShieldCheck /><h3>KYC & Bank</h3><p>{route === 'individual' ? 'Verify PAN, identity and payout bank account.' : 'Verify entity details, authorised person and payout bank account.'}</p><button className="seller-primary" onClick={() => go(route === 'individual' ? 'individualKyc' : 'businessKyc')}>{kycDone ? 'Review KYC' : 'Start KYC'} <ArrowRight /></button></article>
        <article className={productDone ? 'complete' : ''}><span>2</span><small>{productDone ? 'Completed' : 'Not Started'}</small><PackageCheck /><h3>Product Compliance</h3><p>Add product category, declarations and licences applicable to the products you sell.</p><button className="seller-primary" onClick={() => go('product')}>{productDone ? 'Review Compliance' : 'Add Product Compliance'} <ArrowRight /></button></article>
      </div>
      <div className="seller-ready"><div><h3>Ready for Indus Trend review?</h3><p>Both sections must be completed before seller verification.</p></div><button disabled={!kycDone || !productDone} onClick={() => go('review')}>Submit Seller for Review <ArrowRight /></button></div>
    </div>}

    {step === 'individualKyc' && <div className="seller-page"><form className="seller-card" onSubmit={completeKyc}><header><span>INDIVIDUAL SELLER KYC</span><h2>PAN, Aadhaar & Bank Verification</h2><p>Verified details are saved to your onboarding application and restored when you return.</p></header><div className="seller-card-body"><div className="seller-note green"><b>Secure verification:</b> PAN and Aadhaar controls are provider-ready. The prototype validates format; production activation requires authorised provider credentials and consent.</div><div className="seller-form-grid"><label><span>Name as per PAN</span><input required value={nameAsPan} onChange={(event) => setNameAsPan(event.target.value)} placeholder="Full legal name" /></label><VerificationField label="PAN Number" placeholder="ABCDE1234F" value={pan} onChange={(value) => { setPan(value.toUpperCase()); setPanVerified(false) }} verified={panVerified} onVerify={() => /^([A-Z]{5}[0-9]{4}[A-Z])$/.test(pan) ? setPanVerified(true) : alert('Enter a valid PAN number.')} /><VerificationField label="Aadhaar Number" placeholder="12-digit Aadhaar" value={aadhaar} onChange={(value) => { setAadhaar(value.replace(/\D/g, '').slice(0, 12)); setAadhaarVerified(false) }} verified={aadhaarVerified} onVerify={() => /^\d{12}$/.test(aadhaar) ? setAadhaarVerified(true) : alert('Enter a valid 12-digit Aadhaar number.')} /><label><span>Name as per Bank</span><input required value={bankName} onChange={(event) => { setBankName(event.target.value); setBankVerified(false) }} placeholder="Account holder name" /></label><label><span>Bank Account Number</span><input required value={bankAccount} onChange={(event) => { setBankAccount(event.target.value.replace(/\D/g, '').slice(0, 18)); setBankVerified(false) }} inputMode="numeric" /></label><VerificationField label="IFSC & Bank Verification" placeholder="SBIN0001234" value={bankIfsc} onChange={(value) => { setBankIfsc(value.toUpperCase()); setBankVerified(false) }} verified={bankVerified} onVerify={() => bankName.trim().length > 2 && /^([A-Z]{4}0[A-Z0-9]{6})$/.test(bankIfsc) && bankAccount.length >= 8 ? setBankVerified(true) : alert('Enter the account holder name, account number and a valid IFSC.')} /></div></div><footer><button type="button" className="seller-secondary" onClick={() => go('setup')}><ArrowLeft /> Setup Centre</button><button className="seller-primary">Complete Individual KYC <ArrowRight /></button></footer></form></div>}

    {step === 'businessKyc' && <div className="seller-page"><form className="seller-card" onSubmit={completeKyc}><header><span>BUSINESS / GROUP SELLER KYC</span><h2>Entity-Specific Verification</h2><p>Only documents relevant to the selected entity type are requested.</p></header><div className="seller-card-body"><div className="seller-form-grid"><label><span>Business / Group Type</span><select required><option>Proprietorship</option><option>Partnership</option><option>LLP</option><option>Private Limited Company</option><option>Bachat Gat / SHG</option></select></label><label><span>Legal / Registered Name</span><input required value={nameAsPan} onChange={(event) => setNameAsPan(event.target.value)} /></label><VerificationField label="PAN" placeholder="ABCDE1234F" value={pan} onChange={(value) => { setPan(value.toUpperCase()); setPanVerified(false) }} verified={panVerified} onVerify={() => /^([A-Z]{5}[0-9]{4}[A-Z])$/.test(pan) ? setPanVerified(true) : alert('Enter a valid PAN number.')} /><VerificationField label="Aadhaar Number of Authorised Person" placeholder="12-digit Aadhaar" value={aadhaar} onChange={(value) => { setAadhaar(value.replace(/\D/g, '').slice(0, 12)); setAadhaarVerified(false) }} verified={aadhaarVerified} onVerify={() => /^\d{12}$/.test(aadhaar) ? setAadhaarVerified(true) : alert('Enter a valid Aadhaar number.')} /><label className="full"><span>Registered / Principal Address</span><input required /></label><label><span>Name as per Bank</span><input required value={bankName} onChange={(event) => setBankName(event.target.value)} /></label><label><span>Bank Account Number</span><input required value={bankAccount} onChange={(event) => setBankAccount(event.target.value.replace(/\D/g, '').slice(0, 18))} /></label><VerificationField label="IFSC & Bank Verification" placeholder="SBIN0001234" value={bankIfsc} onChange={(value) => { setBankIfsc(value.toUpperCase()); setBankVerified(false) }} verified={bankVerified} onVerify={() => bankName.trim().length > 2 && /^([A-Z]{4}0[A-Z0-9]{6})$/.test(bankIfsc) && bankAccount.length >= 8 ? setBankVerified(true) : alert('Enter valid bank details.')} /></div></div><footer><button type="button" className="seller-secondary" onClick={() => go('setup')}><ArrowLeft /> Setup Centre</button><button className="seller-primary">Complete Business KYC <ArrowRight /></button></footer></form></div>}

    {step === 'product' && <div className="seller-page"><form className="seller-card" onSubmit={completeProduct}><header><span>PRODUCT COMPLIANCE</span><h2>Tell us what you will sell</h2><p>Licence details appear only when the selected category may require them.</p></header><div className="seller-card-body"><div className="seller-form-grid"><label><span>Primary Product Category</span><select value={category} onChange={(event) => setCategory(event.target.value)}>{productCategories.map((item) => <option key={item}>{item}</option>)}</select></label><label><span>Seller Role</span><select><option>Artisan / Maker</option><option>Manufacturer</option><option>Authorised Seller / Reseller</option></select></label><label><span>Country of Origin</span><input value="India" readOnly /></label><label><span>Typical Dispatch Time</span><select><option>1–2 days</option><option>3–5 days</option><option>Made to order</option></select></label>{licenceRequired && <><label><span>Applicable Licence / Registration</span><input required /></label><label><span>Expiry Date</span><input type="date" /></label></>}</div><div className="seller-declarations">{['I own or have the right to sell the listed products.', 'Product images, materials, dimensions, prices and descriptions will be accurate.', 'I will not list counterfeit, prohibited or unlawfully sourced products.'].map((text, index) => <label key={text}><input type="checkbox" checked={declarations[index]} onChange={(event) => setDeclarations((current) => current.map((value, itemIndex) => itemIndex === index ? event.target.checked : value))} /><span><b>{['Authenticity', 'Accurate listing information', 'Legal goods declaration'][index]}</b>{text}</span></label>)}</div></div><footer><button type="button" className="seller-secondary" onClick={() => go('setup')}><ArrowLeft /> Setup Centre</button><button className="seller-primary">Save Product Compliance <ArrowRight /></button></footer></form></div>}

    {step === 'review' && <div className="seller-page seller-narrow"><div className="seller-card"><header><span>FINAL REVIEW</span><h2>Submit Seller for Verification</h2><p>Indus Trend will review KYC, bank verification and product compliance before activation.</p></header><div className="seller-card-body"><dl className="seller-summary"><div><dt>Vendor Code</dt><dd>{vendorReference}</dd></div><div><dt>Vendor Registration</dt><dd>✓ Completed</dd></div><div><dt>Seller Route</dt><dd>{route === 'individual' ? 'Individual Seller' : 'Business / Group Seller'}</dd></div><div><dt>KYC & Bank</dt><dd>✓ Completed</dd></div><div><dt>Product Compliance</dt><dd>✓ Completed</dd></div><div><dt>Activation Status</dt><dd>Pending Review</dd></div></dl><label className="seller-final-check"><input type="checkbox" checked={finalDeclaration} onChange={(event) => setFinalDeclaration(event.target.checked)} /><span><b>Final declaration</b>I confirm the submitted information is correct and accept the Indus Trend Seller Agreement.</span></label></div><footer><button className="seller-secondary" onClick={() => go('setup')}><ArrowLeft /> Setup Centre</button><button className="seller-primary" disabled={!finalDeclaration} onClick={() => { onSave(snapshot({ status: 'Under Review', submittedAt: new Date().toISOString() })); go('submitted') }}>Submit for Verification <ArrowRight /></button></footer></div></div>}

    {step === 'submitted' && <div className="seller-page seller-narrow"><div className="seller-card seller-success"><CheckCircle2 /><span>{saved?.status === 'Active' ? 'STORE ACTIVATED' : 'APPLICATION SUBMITTED'}</span><h2>{saved?.status === 'Active' ? 'Your seller account is active.' : 'Seller verification started.'}</h2><p>{saved?.status === 'Active' ? 'The approved onboarding record is now listed in the admin store dashboard.' : 'Your registration is complete. Indus Trend will review the submitted information before activation.'}</p><b>{vendorReference} · STATUS: {saved?.status?.toUpperCase() || 'UNDER REVIEW'}</b><button className="seller-secondary" onClick={() => go('setup')}>View Setup Status</button></div></div>}
  </section>
}

function VerificationField({ label, placeholder, value, verified, onVerify, onChange }: { label: string; placeholder: string; value: string; verified: boolean; onVerify: () => void; onChange: (value: string) => void }) {
  return <label><span>{label}</span><div className="seller-verify"><input required placeholder={placeholder} value={value} onChange={(event) => onChange(event.target.value)} /><button type="button" onClick={onVerify}>{verified ? <><Check /> Verified</> : 'Verify Online'}</button></div></label>
}
