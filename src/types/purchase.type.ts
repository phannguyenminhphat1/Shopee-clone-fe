import { ProductDetail } from './product.type'
import { User } from './user.type'
export type PurchaseStatus = -1 | 1 | 2 | 3 | 4 | 5
export type PurchaseListStatus = PurchaseStatus | 0
export interface Purchase {
  purchase_id: number
  user_id: number
  stores_products_id: number
  total_price: string
  buy_count: number
  status: number
  created_at: string
  updated_at: string
  stores_products: ProductDetail
  users: User
  shippings: [Shipping]
}

export interface PurchaseList {
  purchases: Purchase[]
  pagination: {
    total: number
    page: number
    limit: number
    page_size: number
  }
}

export interface ExtendedPurchases extends Purchase {
  checked: boolean
  disabled: boolean
}

export interface Shipping {
  shipping_id: number
  purchase_id: number
  created_at: string
  updated_at: string
}
