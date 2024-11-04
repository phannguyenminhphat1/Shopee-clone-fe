import { PurchaseStatus } from 'src/types/purchase.type'
import http from 'src/utils/http'

export type CanceledAndDeliveredStatus = Exclude<PurchaseStatus, -1 | 1 | 2 | 3>
export const shippingApi = {
  pickingPurchase: (body: { shipping_id: number }) => http.post<{ message: string }>('shipping/picking-purchase', body),
  CanceledAndDelivered: (body: { shipping_id: number; status: CanceledAndDeliveredStatus }) =>
    http.post<{ message: string }>('shipping/canceled-delivered', body)
}
