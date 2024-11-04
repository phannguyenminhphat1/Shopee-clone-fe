import { ProductDetail, ProductListConfig, StoreProductList } from 'src/types/product.type'
import { ResponseSuccessApi } from 'src/types/utils.type'
import http from 'src/utils/http'

const productApi = {
  getProductsApi: (params: ProductListConfig) =>
    http.get<ResponseSuccessApi<StoreProductList>>('product/get-products', { params }),
  getProductDetailsApi: (id: number) => http.get<ResponseSuccessApi<ProductDetail>>(`product/get-product/${id}`)
}

export default productApi
