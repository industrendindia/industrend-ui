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
  try {
    const applications = JSON.parse(localStorage.getItem(SELLER_STORAGE_KEY) || '[]') as SellerApplication[]
    return applications.map((application) => /^IT_VND_\d+$/.test(application.vendorCode) ? application : { ...application, vendorCode: createVendorCode() })
  } catch { return [] }
}

export const createVendorCode = () => {
  const value = crypto.getRandomValues(new Uint32Array(1))[0] % 1000000000
  return `IT_VND_${String(value).padStart(9, '0')}`
}
