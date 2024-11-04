import { useQuery } from '@tanstack/react-query'
import classNames from 'classnames'
import { useMemo } from 'react'
import { Helmet } from 'react-helmet-async'
import { useTranslation } from 'react-i18next'
import { createSearchParams, Link } from 'react-router-dom'
import { purchaseApi } from 'src/apis/purchase.api'
import path from 'src/constant/path'
import { purchaseStatus } from 'src/constant/purchase'
import useQueryParams from 'src/hooks/useQueryParams'
import { PurchaseListStatus } from 'src/types/purchase.type'
import { formatCurrency, generateNameId } from 'src/utils/utils'

// const purchaseTabs = [
//   { status: purchaseStatus.all, name: 'Tất cả' },
//   { status: purchaseStatus.waitForConfirmation, name: 'Chờ xác nhận' },
//   { status: purchaseStatus.waitForGetting, name: 'Chờ lấy hàng' },
//   { status: purchaseStatus.inProgress, name: 'Đang giao' },
//   { status: purchaseStatus.delivered, name: 'Đã giao' },
//   { status: purchaseStatus.cancelled, name: 'Đã hủy' }
// ]
export default function HistoryPurchase() {
  const { t } = useTranslation('profile')
  const queryParams: { status?: string } = useQueryParams()
  const status = Number(queryParams.status) || purchaseStatus.all

  const { data: purchasesData } = useQuery({
    queryKey: ['purchases', { status }],
    queryFn: () => purchaseApi.getPurchases({ status: status as PurchaseListStatus })
  })
  const purchases = purchasesData?.data.data.purchases

  const purchaseTabs = useMemo(
    () => [
      { status: purchaseStatus.all, name: `${t('All')}` },
      { status: purchaseStatus.waitForConfirmation, name: `${t('Wait for confirmation')}` },
      { status: purchaseStatus.waitForGetting, name: `${t('Waiting for delivery')}` },
      { status: purchaseStatus.inProgress, name: `${t('Shipping')}` },
      { status: purchaseStatus.delivered, name: `${t('Delivered')}` },
      { status: purchaseStatus.cancelled, name: `${t('Canceled')}` }
    ],
    [t]
  )

  // Return JSX
  const purchaseTabsLink = purchaseTabs.map((tab) => {
    return (
      <Link
        key={tab.status}
        to={{
          pathname: path.historyPurchase,
          search: createSearchParams({
            status: tab.status.toString()
          }).toString()
        }}
        className={classNames('py-4 border-b-2 flex justify-center items-center flex-1', {
          'text-primaryColor border-b-primaryColor font-bold': tab.status == status,
          'text-black border-b-gray-100': tab.status !== status
        })}
      >
        {tab.name}
      </Link>
    )
  })

  // Return Main
  return (
    <div>
      <Helmet>
        <title>Trang đơn hàng | Shopee Clone</title>
        <meta name='description' content='Trang đơn hàng dự án Shopee Clone' />
      </Helmet>
      <div className='overflow-x-auto'>
        <div className='min-w-[700px]'>
          <div className='bg-white flex rounded-t-sm shadow-sm'>{purchaseTabsLink}</div>
          <div>
            {purchases?.map((purchase) => (
              <div
                key={purchase.purchase_id}
                className='border rounded-sm border-black/10 bg-white p-6 text-gray-800 shadow-sm'
              >
                <Link
                  to={`${path.home}${generateNameId({ name: purchase.stores_products.products.product_name, id: String(purchase.stores_products.stores_products_id) })}`}
                  className='flex'
                >
                  <div className='flex-shrink-0'>
                    <img
                      className='h-20 w-20 object-cover'
                      src={purchase.stores_products.products.image_url}
                      alt={purchase.stores_products.products.product_name}
                    />
                  </div>
                  <div className='ml-3 flex-grow overflow-hidden'>
                    <div className='truncate'>{purchase.stores_products.products.product_name}</div>
                    <div className='mt-2 text-gray-500'>{purchase.stores_products.stores.store_name}</div>
                    <div className='mt-3'>x{purchase.buy_count}</div>
                  </div>
                  <div className='ml-1 flex-shrink-0'>
                    <span className='truncate text-gray-500 line-through'>
                      ₫{formatCurrency(Number(purchase.stores_products.price_before_discount))}
                    </span>
                    <span className='ml-2 truncate text-primaryColor'>
                      ₫{formatCurrency(Number(purchase.stores_products.price))}
                    </span>
                    {status === purchaseStatus.all && (
                      <div className='mt-3'>
                        {t('Status')}:{' '}
                        <span className='text-primaryColor'>
                          {purchaseTabs.find((item) => item.status === purchase.status)?.name || 'Trong giỏ hàng'}
                        </span>
                      </div>
                    )}
                  </div>
                </Link>
                <div className='flex justify-end'>
                  <div>
                    <span>{t('Total amount')}</span>
                    <span className='ml-4 text-xl text-primaryColor'>
                      ₫{formatCurrency(Number(purchase.stores_products.price) * purchase.buy_count)}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
