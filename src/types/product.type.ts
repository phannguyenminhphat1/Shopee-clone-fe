export interface Product {
  product_id: number
  product_name: string
  description: null
  category_id: number
  image_url: string
  images: string[]
  created_at: string
  updated_at: string
}

export interface Store {
  store_id: number
  store_name: string
  address: string
  phone_number: string
  created_at: string
  updated_at: string
}

export interface ProductDetail {
  stores_products_id: number
  store_id: number
  product_id: number
  stock_quantity: number
  rating: string
  view: number
  sold: number
  price_before_discount: string
  price: string
  products: Product
  stores: Store
}

export interface StoreProductList {
  products: ProductDetail[]
  pagination: {
    total: number
    page: number
    limit: number
    page_size: number
  }
}

export interface ProductListConfig {
  limit?: number | string // Số sản phẩm trên mỗi trang
  page?: number | string // Trang hiện tại
  sort_by?: 'price' | 'created_at' | 'view' | 'sold' // Các trường có thể sắp xếp
  order?: 'asc' | 'desc' // Thứ tự sắp xếp
  rating_filter?: number | string // Lọc theo rating
  product_name?: string // Lọc theo tên sản phẩm
  category?: number | string // Lọc theo danh mục sản phẩm
  price_min?: number | string // Giá tối thiểu
  price_max?: number | string // Giá tối đa
}
