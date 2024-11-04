import { PurchaseList, PurchaseListStatus } from 'src/types/purchase.type'
import { ResponseSuccessApi } from 'src/types/utils.type'
import http from 'src/utils/http'

export const purchaseApi = {
  addToCart: (body: { stores_products_id: number; buy_count: number }) =>
    http.post<ResponseSuccessApi<{ stores_products_id: number; buy_count: number }>>('purchase/add-to-cart', body),
  getPurchases: (params: { status: PurchaseListStatus }) =>
    http.get<ResponseSuccessApi<PurchaseList>>('purchase/get-purchases', { params }),
  buyProducts: (body: { purchase_id: number[] }) => http.post<{ message: string }>('purchase/buy-products', body),
  deletePurchases: (body: { purchase_id: number[] }) =>
    http.delete<{ message: string }>('purchase/delete-purchases', {
      data: body
    }),
  updatePurchase: (body: { purchase_id: number; buy_count: number }) => http.put('purchase/update-purchase', body),

  // ADMIN
  confirmPurchase: (body: { purchase_id: number }) => http.post<{ message: string }>('purchase/confirm-purchase', body)
}
