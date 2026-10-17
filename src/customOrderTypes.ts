export type QuoteStatus = 'Enquiry received' | 'Customer contacted' | 'Quotation sent' | 'Order confirmed'

export type QuoteHistoryItem = {
  label: string
  at: string
  details?: string
}

export type CustomQuote = {
  id: string
  storeCode: string
  productCode: string
  store: string
  product: string
  customerName: string
  phone: string
  city: string
  size: string
  finish: string
  details: string
  attachmentName?: string
  status: QuoteStatus
  createdAt: string
  notes: string
  agreedTotal?: number
  eta?: string
  validUntil?: string
  terms?: string
  orderId?: string
  paymentStatus?: string
  history: QuoteHistoryItem[]
}

export const quoteStatusLabel = (quote: CustomQuote) => quote.status
export const formatMoney = (value: number) => `₹${value.toLocaleString('en-IN')}`
export const nowLabel = () => new Date().toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' })

