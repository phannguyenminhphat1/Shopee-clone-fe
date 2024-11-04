const path = {
  home: '/',
  login: '/login',
  register: '/register',
  logout: '/logout',
  categories: '/categories',
  productDetail: ':nameId',
  cart: '/cart',
  user: '/user',
  profile: '/user/profile',
  changePassword: '/user/password',
  historyPurchase: '/user/purchase',
  admin: '/admin',
  adminProfile: '/admin/profile',
  adminChangePassword: '/admin/password',
  adminOrder: '/admin/order',
  shipper: '/shipper',
  shipperProfile: '/shipper/profile',
  shipperChangePassword: '/shipper/password',
  shipperShipping: '/shipper/shipping'
} as const
export default path
