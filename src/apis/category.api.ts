import { Category } from 'src/types/category.type'
import { ResponseSuccessApi } from 'src/types/utils.type'
import http from 'src/utils/http'

const categoryApi = {
  getCategories: () => http.get<ResponseSuccessApi<Category[]>>('category/get-categories')
}
export default categoryApi
