import { useMutation, useQuery } from '@tanstack/react-query'
import classNames from 'classnames'
import { useMemo } from 'react'
import { Helmet } from 'react-helmet-async'
import { useTranslation } from 'react-i18next'
import { createSearchParams, Link } from 'react-router-dom'
import { toast } from 'react-toastify'
import { purchaseApi } from 'src/apis/purchase.api'
import path from 'src/constant/path'
import { purchaseStatus } from 'src/constant/purchase'
import useQueryParams from 'src/hooks/useQueryParams'
import { PurchaseListStatus } from 'src/types/purchase.type'
import { formatCurrency } from 'src/utils/utils'

export default function Order() {
  const { t } = useTranslation('profile')
  const queryParams: { status?: string } = useQueryParams()
  const status = Number(queryParams.status) || purchaseStatus.waitForConfirmation

  const { data: purchasesData, refetch } = useQuery({
    queryKey: ['purchases', { status }],
    queryFn: () => purchaseApi.getPurchases({ status: status as PurchaseListStatus })
  })

  const confirmPurchaseMutation = useMutation({
    mutationFn: purchaseApi.confirmPurchase
  })

  const purchases = purchasesData?.data.data.purchases
  console.log(purchasesData)

  const purchaseTabs = useMemo(
    () => [
      { status: purchaseStatus.waitForConfirmation, name: `${t('Wait for confirmation')}` },
      { status: purchaseStatus.waitForGetting, name: `${t('Waiting for delivery')}` },
      { status: purchaseStatus.inProgress, name: `${t('Shipping')}` },
      { status: purchaseStatus.delivered, name: `${t('Delivered')}` },
      { status: purchaseStatus.cancelled, name: `${t('Canceled')}` }
    ],
    [t]
  )

  const handleConfirmPurchase = (purchase_id: number) => {
    confirmPurchaseMutation.mutate(
      { purchase_id },
      {
        onSuccess: (result) => {
          refetch()
          toast.success(result.data.message, { autoClose: 1000 })
        }
      }
    )
  }

  // Return JSX
  const purchaseTabsLink = purchaseTabs.map((tab) => {
    return (
      <Link
        key={tab.status}
        to={{
          pathname: path.adminOrder,
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
        <title>Trang order Admin | Shopee Clone</title>
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
                <div className='flex'>
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
                    <div className='mt-3'>
                      {t('Quantity')}: {purchase.buy_count}
                    </div>
                    <div className='mt-3'>
                      {t('Orderer')}: <span>{purchase.users.full_name}</span>
                    </div>
                    <div className='mt-3'>
                      {t('Username')}: <span>{purchase.users.username}</span>
                    </div>
                    <div className='mt-3'>
                      {t('Address')}: <span>{purchase.users.address}</span>
                    </div>
                    <div className='mt-3'>
                      {t('Order date')}:{' '}
                      <span>{`${new Date(purchase.created_at).getDate().toString().padStart(2, '0')}-${(new Date(purchase.created_at).getMonth() + 1).toString().padStart(2, '0')}-${new Date(purchase.created_at).getFullYear()}`}</span>
                    </div>
                  </div>
                  <div className='ml-1 flex-shrink-0'>
                    <span className='truncate text-gray-500 line-through'>
                      ₫{formatCurrency(Number(purchase.stores_products.price_before_discount))}
                    </span>
                    <span className='ml-2 truncate text-primaryColor'>
                      ₫{formatCurrency(Number(purchase.stores_products.price))}
                    </span>
                    {purchase.status === purchaseStatus.waitForConfirmation && (
                      <div className='flex justify-end'>
                        <button
                          onClick={() => handleConfirmPurchase(purchase.purchase_id)}
                          className='px-4 py-2 bg-primaryColor text-white mt-5 hover:bg-primaryColor/90 cursor-pointer'
                        >
                          {t('Confirm')}
                        </button>
                      </div>
                    )}
                  </div>
                </div>
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
