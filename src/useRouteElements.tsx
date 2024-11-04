/* eslint-disable react-refresh/only-export-components */
import { Navigate, Outlet, useRoutes } from 'react-router-dom'
import { useContext, Suspense, lazy } from 'react'
import { AppContext } from './contexts/app.context'
import AuthLayout from './layouts/AuthLayout'
import MainLayout from './layouts/MainLayout'
import CartLayout from './layouts/CartLayout'
import UserLayout from './pages/User/layouts/UserLayout'
import SimpleLayout from './layouts/SimpleLayout'
import path from './constant/path'

// Lazy loading các trang
const ProductList = lazy(() => import('./pages/ProductList'))
const Register = lazy(() => import('./pages/Register'))
const ProductDetails = lazy(() => import('./pages/ProductDetails/ProductDetails'))
const Cart = lazy(() => import('./pages/Cart'))
const Profile = lazy(() => import('./pages/User/pages/Profile'))
const ChangePassword = lazy(() => import('./pages/User/pages/ChangePassword'))
const HistoryPurchase = lazy(() => import('./pages/User/pages/HistoryPurchase'))
const NotFound = lazy(() => import('./pages/NotFound'))
const Order = lazy(() => import('./pages/Admin/Order'))
const Shipping = lazy(() => import('./pages/Shipper/Shipping'))
const Login = lazy(() => import('./pages/Login'))

function LoadingComponent() {
  return (
    <div className='flex m-auto justify-center py-10'>
      <svg
        aria-hidden='true'
        className='h-16 w-16 animate-spin fill-white text-gray-200'
        viewBox='0 0 100 101'
        fill='none'
        xmlns='http://www.w3.org/2000/svg'
      >
        <path
          d='M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z'
          fill='currentColor'
        />
        <path
          d='M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z'
          fill='currentFill'
        />
      </svg>
    </div>
  )
}

function ProtectedRoute() {
  const { isAuthenticated } = useContext(AppContext)
  return isAuthenticated ? <Outlet /> : <Navigate to={path.login} />
}

function RejectedRoute() {
  const { isAuthenticated } = useContext(AppContext)
  return !isAuthenticated ? <Outlet /> : <Navigate to={'/'} />
}

function AdminRoute() {
  const { role } = useContext(AppContext)
  return role === 'Admin' ? <Outlet /> : <Navigate to={'/'} />
}

function ShipperRoute() {
  const { role } = useContext(AppContext)
  return role === 'Shipper' ? <Outlet /> : <Navigate to={'/'} />
}

function PublicRoute() {
  const { role } = useContext(AppContext)

  if (role === 'Admin') {
    return <Navigate to={path.adminOrder} />
  }
  if (role === 'Shipper') {
    return <Navigate to={path.shipperShipping} />
  }

  return <Outlet />
}

export default function useRouteElements() {
  const useRouteElement = useRoutes([
    // Public Route
    {
      path: '',
      element: <PublicRoute />,
      children: [
        {
          path: '/',
          index: true,
          element: (
            <MainLayout>
              <Suspense fallback={<LoadingComponent />}>
                <ProductList />
              </Suspense>
            </MainLayout>
          )
        },
        {
          path: path.productDetail,
          element: (
            <MainLayout>
              <Suspense fallback={<LoadingComponent />}>
                <ProductDetails />
              </Suspense>
            </MainLayout>
          )
        }
      ]
    },

    // Cart Protected Route
    {
      path: '',
      element: <ProtectedRoute />,
      children: [
        {
          path: '',
          element: <PublicRoute />,
          children: [
            {
              path: path.cart,
              element: (
                <CartLayout>
                  <Suspense fallback={<LoadingComponent />}>
                    <Cart />
                  </Suspense>
                </CartLayout>
              )
            },
            {
              path: path.user,
              element: (
                <MainLayout>
                  <UserLayout />
                </MainLayout>
              ),
              children: [
                {
                  path: path.profile,
                  element: (
                    <Suspense fallback={<LoadingComponent />}>
                      <Profile />
                    </Suspense>
                  )
                },
                {
                  path: path.changePassword,
                  element: (
                    <Suspense fallback={<LoadingComponent />}>
                      <ChangePassword />
                    </Suspense>
                  )
                },
                {
                  path: path.historyPurchase,
                  element: (
                    <Suspense fallback={<LoadingComponent />}>
                      <HistoryPurchase />
                    </Suspense>
                  )
                }
              ]
            }
          ]
        }
      ]
    },
    {
      path: '',
      element: <ProtectedRoute />,
      children: [
        {
          path: '',
          element: <AdminRoute />,
          children: [
            {
              path: path.admin,
              element: (
                <SimpleLayout>
                  <UserLayout />
                </SimpleLayout>
              ),
              children: [
                {
                  path: path.adminProfile,
                  element: (
                    <Suspense fallback={<LoadingComponent />}>
                      <Profile />
                    </Suspense>
                  )
                },
                {
                  path: path.adminChangePassword,
                  element: (
                    <Suspense fallback={<LoadingComponent />}>
                      <ChangePassword />
                    </Suspense>
                  )
                },
                {
                  path: path.adminOrder,
                  element: (
                    <Suspense fallback={<LoadingComponent />}>
                      <Order />
                    </Suspense>
                  )
                }
              ]
            }
          ]
        },

        {
          path: '',
          element: <ShipperRoute />,
          children: [
            {
              path: path.shipper,
              element: (
                <SimpleLayout>
                  <UserLayout />
                </SimpleLayout>
              ),
              children: [
                {
                  path: path.shipperProfile,
                  element: (
                    <Suspense fallback={<LoadingComponent />}>
                      <Profile />
                    </Suspense>
                  )
                },
                {
                  path: path.shipperChangePassword,
                  element: (
                    <Suspense fallback={<LoadingComponent />}>
                      <ChangePassword />
                    </Suspense>
                  )
                },
                {
                  path: path.shipperShipping,
                  element: (
                    <Suspense fallback={<LoadingComponent />}>
                      <Shipping />
                    </Suspense>
                  )
                }
              ]
            }
          ]
        }
      ]
    },

    // Not Found
    {
      path: '*',
      element: (
        <MainLayout>
          <Suspense fallback={<LoadingComponent />}>
            <NotFound />
          </Suspense>
        </MainLayout>
      )
    },

    // Login & Register
    {
      path: '',
      element: <RejectedRoute />,
      children: [
        {
          path: path.login,
          element: (
            <AuthLayout>
              <Suspense fallback={<LoadingComponent />}>
                <Login />
              </Suspense>
            </AuthLayout>
          )
        },
        {
          path: path.register,
          element: (
            <AuthLayout>
              <Suspense fallback={<LoadingComponent />}>
                <Register />
              </Suspense>
            </AuthLayout>
          )
        }
      ]
    }
  ])
  return useRouteElement
}
