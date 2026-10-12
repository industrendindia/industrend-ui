import { useMemo, useState, type FormEvent } from 'react'
import { ArrowLeft, ArrowRight, Check, CheckCircle2, Landmark, PackageCheck, ShieldCheck, UserRound } from 'lucide-react'
import './seller-onboarding.css'

type Step = 'register' | 'otp' | 'success' | 'setup' | 'individualKyc' | 'businessKyc' | 'product' | 'review' | 'submitted'
type SellerRoute = 'individual' | 'business'

const states = ['Maharashtra', 'Rajasthan', 'Gujarat', 'Uttar Pradesh', 'Karnataka', 'Other']
const productCategories = ['Paintings & Art', 'Idols & Handicrafts', 'Woodcraft', 'Textiles', 'Food Products', 'Packaged Consumer Products', 'Electrical / BIS-Regulated Product', 'Jewellery', 'Other']

export default function SellerOnboarding() {
  const [step, setStep] = useState<Step>('register')
  const [route, setRoute] = useState<SellerRoute>('individual')
  const [name, setName] = useState('')
  const [mobile, setMobile] = useState('')
  const [email, setEmail] = useState('')
  const [state, setState] = useState('Maharashtra')
  const [otp, setOtp] = useState('')
  const [kycDone, setKycDone] = useState(false)
  const [productDone, setProductDone] = useState(false)
  const [panVerified, setPanVerified] = useState(false)
  const [aadhaarVerified, setAadhaarVerified] = useState(false)
  const [bankVerified, setBankVerified] = useState(false)
  const [category, setCategory] = useState(productCategories[0])
  const [declarations, setDeclarations] = useState([false, false, false])
  const [finalDeclaration, setFinalDeclaration] = useState(false)
  const vendorReference = useMemo(() => `IT-VND-${Math.floor(1000 + Math.random() * 9000)}`, [])

  const go = (next: Step) => {
    setStep(next)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const register = (event: FormEvent) => {
    event.preventDefault()
    if (!name.trim() || !/^\d{10}$/.test(mobile) || !/^\S+@\S+\.\S+$/.test(email)) {
      alert('Please enter the contact name, a valid 10-digit mobile number and email address.')
      return
    }
    go('otp')
  }

  const verifyOtp = (event: FormEvent) => {
    event.preventDefault()
    if (otp !== '654321') {
      alert('For this prototype, enter OTP 654321.')
      return
    }
    go('success')
  }

  const completeKyc = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (route === 'individual' && (!panVerified || !aadhaarVerified || !bankVerified)) {
      alert('Please complete PAN, identity and bank verification before continuing.')
      return
    }
    setKycDone(true)
    go('setup')
  }

  const completeProduct = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!declarations.every(Boolean)) {
      alert('Please accept all product compliance declarations.')
      return
    }
    setProductDone(true)
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
            <label><span>Primary State / UT</span><select value={state} onChange={(event) => setState(event.target.value)}>{states.map((item) => <option key={item}>{item}</option>)}</select></label>
          </div>
        </div>
        <footer><small>No PAN, Aadhaar, GST or store details required yet.</small><button className="seller-primary">Verify Mobile & Register <ArrowRight /></button></footer>
      </form>
    </div>}

    {step === 'otp' && <div className="seller-page seller-narrow"><form className="seller-card" onSubmit={verifyOtp}><header><span>MOBILE VERIFICATION</span><h2>Enter OTP</h2><p>Verify +91 {mobile} before creating the seller account.</p></header><div className="seller-card-body"><label className="seller-otp"><span>6-Digit OTP</span><input value={otp} onChange={(event) => setOtp(event.target.value.replace(/\D/g, '').slice(0, 6))} inputMode="numeric" placeholder="••••••" /></label><div className="seller-note">Prototype OTP: <b>654321</b></div></div><footer><button type="button" className="seller-secondary" onClick={() => go('register')}><ArrowLeft /> Back</button><button className="seller-primary">Verify & Create Account <ArrowRight /></button></footer></form></div>}

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

    {step === 'individualKyc' && <div className="seller-page"><form className="seller-card" onSubmit={completeKyc}><header><span>INDIVIDUAL SELLER KYC</span><h2>PAN, Identity & Bank Verification</h2><p>This prototype simulates verification and does not store identity documents.</p></header><div className="seller-card-body"><div className="seller-note green"><b>Privacy-friendly design:</b> production verification must use authorised, consent-based providers and retain only necessary results.</div><div className="seller-form-grid"><label><span>Name as per PAN</span><input required placeholder="Full legal name" /></label><VerificationField label="PAN Number" placeholder="ABCDE1234F" verified={panVerified} onVerify={() => setPanVerified(true)} /><label><span>Aadhaar / VID for Verification</span><input required placeholder="Verification input" /></label><VerificationField label="Identity Consent & Verification" placeholder="Consent reference" verified={aadhaarVerified} onVerify={() => setAadhaarVerified(true)} /><label><span>Bank Account Number</span><input required /></label><VerificationField label="IFSC & Bank Verification" placeholder="SBIN0001234" verified={bankVerified} onVerify={() => setBankVerified(true)} /></div></div><footer><button type="button" className="seller-secondary" onClick={() => go('setup')}><ArrowLeft /> Setup Centre</button><button className="seller-primary">Complete Individual KYC <ArrowRight /></button></footer></form></div>}

    {step === 'businessKyc' && <div className="seller-page"><form className="seller-card" onSubmit={completeKyc}><header><span>BUSINESS / GROUP SELLER KYC</span><h2>Entity-Specific Verification</h2><p>Only documents relevant to the selected entity type are requested.</p></header><div className="seller-card-body"><div className="seller-form-grid"><label><span>Business / Group Type</span><select required><option>Proprietorship</option><option>Partnership</option><option>LLP</option><option>Private Limited Company</option><option>Bachat Gat / SHG</option></select></label><label><span>Legal / Registered Name</span><input required /></label><label><span>PAN</span><input required placeholder="ABCDE1234F" /></label><label><span>Authorised Person</span><input required /></label><label className="full"><span>Registered / Principal Address</span><input required /></label><label><span>GST Status</span><select><option>GST Registered</option><option>GST-Unregistered / applicable route</option><option>To be reviewed</option></select></label><label><span>GSTIN / Enrolment Number</span><input /></label><label><span>Bank Account Number</span><input required /></label><label><span>IFSC</span><input required /></label></div><div className="seller-upload"><b>Entity / Constitution Document</b><p>Upload the applicable registration or formation document.</p><input type="file" /></div></div><footer><button type="button" className="seller-secondary" onClick={() => go('setup')}><ArrowLeft /> Setup Centre</button><button className="seller-primary">Complete Business KYC <ArrowRight /></button></footer></form></div>}

    {step === 'product' && <div className="seller-page"><form className="seller-card" onSubmit={completeProduct}><header><span>PRODUCT COMPLIANCE</span><h2>Tell us what you will sell</h2><p>Licence details appear only when the selected category may require them.</p></header><div className="seller-card-body"><div className="seller-form-grid"><label><span>Primary Product Category</span><select value={category} onChange={(event) => setCategory(event.target.value)}>{productCategories.map((item) => <option key={item}>{item}</option>)}</select></label><label><span>Seller Role</span><select><option>Artisan / Maker</option><option>Manufacturer</option><option>Authorised Seller / Reseller</option></select></label><label><span>Country of Origin</span><input value="India" readOnly /></label><label><span>Typical Dispatch Time</span><select><option>1–2 days</option><option>3–5 days</option><option>Made to order</option></select></label>{licenceRequired && <><label><span>Applicable Licence / Registration</span><input required /></label><label><span>Expiry Date</span><input type="date" /></label></>}</div><div className="seller-declarations">{['I own or have the right to sell the listed products.', 'Product images, materials, dimensions, prices and descriptions will be accurate.', 'I will not list counterfeit, prohibited or unlawfully sourced products.'].map((text, index) => <label key={text}><input type="checkbox" checked={declarations[index]} onChange={(event) => setDeclarations((current) => current.map((value, itemIndex) => itemIndex === index ? event.target.checked : value))} /><span><b>{['Authenticity', 'Accurate listing information', 'Legal goods declaration'][index]}</b>{text}</span></label>)}</div></div><footer><button type="button" className="seller-secondary" onClick={() => go('setup')}><ArrowLeft /> Setup Centre</button><button className="seller-primary">Save Product Compliance <ArrowRight /></button></footer></form></div>}

    {step === 'review' && <div className="seller-page seller-narrow"><div className="seller-card"><header><span>FINAL REVIEW</span><h2>Submit Seller for Verification</h2><p>Indus Trend will review KYC, bank verification and product compliance before activation.</p></header><div className="seller-card-body"><dl className="seller-summary"><div><dt>Vendor Registration</dt><dd>✓ Completed</dd></div><div><dt>Seller Route</dt><dd>{route === 'individual' ? 'Individual Seller' : 'Business / Group Seller'}</dd></div><div><dt>KYC & Bank</dt><dd>✓ Completed</dd></div><div><dt>Product Compliance</dt><dd>✓ Completed</dd></div><div><dt>Activation Status</dt><dd>Pending Review</dd></div></dl><label className="seller-final-check"><input type="checkbox" checked={finalDeclaration} onChange={(event) => setFinalDeclaration(event.target.checked)} /><span><b>Final declaration</b>I confirm the submitted information is correct and accept the Indus Trend Seller Agreement.</span></label></div><footer><button className="seller-secondary" onClick={() => go('setup')}><ArrowLeft /> Setup Centre</button><button className="seller-primary" disabled={!finalDeclaration} onClick={() => go('submitted')}>Submit for Verification <ArrowRight /></button></footer></div></div>}

    {step === 'submitted' && <div className="seller-page seller-narrow"><div className="seller-card seller-success"><CheckCircle2 /><span>APPLICATION SUBMITTED</span><h2>Seller verification started.</h2><p>Your registration is complete. Indus Trend will review the submitted information before activation.</p><b>STATUS: UNDER REVIEW</b><button className="seller-secondary" onClick={() => go('setup')}>View Setup Status</button></div></div>}
  </section>
}

function VerificationField({ label, placeholder, verified, onVerify }: { label: string; placeholder: string; verified: boolean; onVerify: () => void }) {
  return <label><span>{label}</span><div className="seller-verify"><input required placeholder={placeholder} /><button type="button" onClick={onVerify}>{verified ? <><Check /> Verified</> : 'Verify'}</button></div></label>
}
