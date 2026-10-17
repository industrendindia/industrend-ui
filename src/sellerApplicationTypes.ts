export type SellerApplicationStatus = 'Draft' | 'Under Review' | 'Active'

export type SellerApplication = {
  vendorCode: string
  route: 'individual' | 'business'
  contactName: string
  mobile: string
  email: string
  state: string
  nameAsPan: string
  pan: string
  aadhaar: string
  bankAccount: string
  bankIfsc: string
  bankName: string
  panVerified: boolean
  aadhaarVerified: boolean
  bankVerified: boolean
  kycCompleted: boolean
  productCompleted: boolean
  category: string
  status: SellerApplicationStatus
  submittedAt?: string
  approvedAt?: string
}

export const SELLER_STORAGE_KEY = 'indus-seller-applications-v1'

export const loadSellerApplications = (): SellerApplication[] => {
  try { return JSON.parse(localStorage.getItem(SELLER_STORAGE_KEY) || '[]') as SellerApplication[] } catch { return [] }
}

export const createVendorCode = () => {
  const alphabet = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
  const bytes = crypto.getRandomValues(new Uint8Array(8))
  return `IT_VND_${Array.from(bytes, (byte) => alphabet[byte % alphabet.length]).join('')}`
}
