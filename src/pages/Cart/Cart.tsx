import { useMutation, useQuery } from '@tanstack/react-query'
import { useContext, useEffect, useMemo } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { purchaseApi } from 'src/apis/purchase.api'
import Button from 'src/components/Button'
import QuantityController from 'src/components/QuantityController'
import path from 'src/constant/path'
import { purchaseStatus } from 'src/constant/purchase'
import { AppContext } from 'src/contexts/app.context'
import { formatCurrency, generateNameId } from 'src/utils/utils'
import { produce } from 'immer'
import { keyBy } from 'lodash'
import { toast } from 'react-toastify'
import { useTranslation } from 'react-i18next'
import { Helmet } from 'react-helmet-async'

export default function Cart() {
  const { t } = useTranslation('cart')
  const { extendedPurchases, setExtendedPurchases } = useContext(AppContext)
  // const [extendedPurchases, setExtendedPurchases] = useState<ExtendedPurchases[]>([])

  const location = useLocation()

  // Get Purchases
  const { data: purchasesInCartData, refetch } = useQuery({
    queryKey: ['purchases', { status: purchaseStatus.inCart }],
    queryFn: () => purchaseApi.getPurchases({ status: purchaseStatus.inCart })
  })

  // Const Get Purchases
  const purchasesInCart = purchasesInCartData?.data.data.purchases

  // Button Checked All
  const isAllChecked = useMemo(() => extendedPurchases.every((purchase) => purchase.checked), [extendedPurchases])

  // Check Is All Checked
  const checkedPurchases = useMemo(() => extendedPurchases.filter((purchase) => purchase.checked), [extendedPurchases])

  // Count all Checked
  const checkedPurchasesCount = checkedPurchases.length

  // State Location For Buy Immediately
  const storesProductsFromLocation = (location.state as { stores_products_id: number } | null)?.stores_products_id
  console.log(location.state)

  useEffect(() => {
    setExtendedPurchases((prev) => {
      const extendedPurchaseObj = keyBy(prev, 'purchase_id')
      return (
        purchasesInCart?.map((purchase) => {
          const isChoosenPurchaseFromLocation = storesProductsFromLocation === purchase.stores_products_id
          return {
            ...purchase,
            disabled: false,
            checked: isChoosenPurchaseFromLocation || Boolean(extendedPurchaseObj[purchase.purchase_id]?.checked)
          }
        }) || []
      )
    })
  }, [purchasesInCart, storesProductsFromLocation, setExtendedPurchases])

  // Use Effect 2 When Component Destroy
  useEffect(() => {
    return () => {
      history.replaceState(null, '')
    }
  }, [])

  // Handle Check
  const handleCheck = (purchaseId: number) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setExtendedPurchases(
      produce((draft) => {
        draft[purchaseId].checked = e.target.checked
      })
    )
  }

  // Handle Checked All
  const handleCheckedAll = () => {
    setExtendedPurchases((prev) =>
      prev.map((purchase) => {
        return {
          ...purchase,
          checked: !isAllChecked
        }
      })
    )
  }

  // Update Purchase Mutation
  const updatePurchaseMutation = useMutation({
    mutationFn: purchaseApi.updatePurchase,
    onSuccess: () => {
      refetch()
    }
  })

  // Delete Purchase
  const deletePurchasesMutation = useMutation({
    mutationFn: purchaseApi.deletePurchases,
    onSuccess: (result) => {
      toast.success(result.data.message, { autoClose: 1000 })
      refetch()
    }
  })

  // Buy products
  const buyProductsMutation = useMutation({
    mutationFn: purchaseApi.buyProducts,
    onSuccess: (result) => {
      toast.success(result.data.message, { autoClose: 1000 })
      refetch()
    }
  })

  // Reduce total Checked Purchases
  const totalCheckedPurchasesPrice = useMemo(
    () =>
      checkedPurchases.reduce((result, currentChecked) => {
        return result + currentChecked.buy_count * Number(currentChecked.stores_products.price)
      }, 0),
    [checkedPurchases]
  )

  // Reduce total Saving Checked Purchases
  const totalCheckedPurchasesSavingPrice = useMemo(
    () =>
      checkedPurchases.reduce((result, currentChecked) => {
        return (
          result +
          (Number(currentChecked.stores_products.price_before_discount) -
            Number(currentChecked.stores_products.price)) *
            currentChecked.buy_count
        )
      }, 0),
    [checkedPurchases]
  )

  // Handle buy products
  const handleBuyProducts = () => {
    if (checkedPurchases.length > 0) {
      const purchaseIds = checkedPurchases.map((purchase) => purchase.purchase_id)
      buyProductsMutation.mutate({ purchase_id: purchaseIds })
    } else {
      toast.error('Hãy chọn sản phẩm để mua', { autoClose: 1000 })
    }
  }

  // Handle delete & delete many
  const handleDelete = (purchaseIndex: number) => {
    const purchaseId = extendedPurchases[purchaseIndex].purchase_id
    deletePurchasesMutation.mutate({ purchase_id: [purchaseId] })
  }

  const handleDeleteManyPurchases = () => {
    const purchaseIds = checkedPurchases.map((purchase) => purchase.purchase_id)
    deletePurchasesMutation.mutate({ purchase_id: purchaseIds })
  }

  // Handle Quantity
  const handleQuantity = (purchaseIndex: number, value: number, enable: boolean) => {
    if (enable) {
      const purchase = extendedPurchases[purchaseIndex]
      setExtendedPurchases(
        produce((draft) => {
          draft[purchaseIndex].disabled = true
        })
      )
      updatePurchaseMutation.mutate({ purchase_id: purchase.purchase_id, buy_count: value })
    }
  }

  // Handle Type Quantity
  const handleTypeQuantity = (purchaseIndex: number) => (value: number) => {
    setExtendedPurchases(
      produce((draft) => {
        draft[purchaseIndex].buy_count = value
      })
    )
  }

  if (!purchasesInCart) return null

  return (
    <div className='bg-neutral-100 py-16'>
      <Helmet>
        <title>Trang giỏ hàng | Shopee Clone</title>
        <meta name='description' content='Trang giỏ hàng dự án Shopee Clone' />
      </Helmet>
      {extendedPurchases.length > 0 ? (
        <>
          <div className='container'>
            <div className='overflow-auto'>
              <div className='min-w-[1000px]'>
                <div className='grid grid-cols-12 rounded-sm bg-white py-5 px-9 text-sm capitalize text-gray-500 shadow'>
                  <div className='col-span-6'>
                    <div className='flex items-center'>
                      <div className='flex flex-shrink-0 items-center justify-center pr-3'>
                        <input
                          type='checkbox'
                          className='h-5 w-5 accent-primaryColor'
                          checked={isAllChecked}
                          onChange={handleCheckedAll}
                        />
                      </div>
                      <div className='flex-grow text-black'>{t('Products')}</div>
                    </div>
                  </div>
                  <div className='col-span-6'>
                    <div className='grid grid-cols-5 text-center'>
                      <div className='col-span-2'>{t('Price')}</div>
                      <div className='col-span-1'>{t('Quantity')}</div>
                      <div className='col-span-1'>{t('Total Price')}</div>
                      <div className='col-span-1'>{t('Action')}</div>
                    </div>
                  </div>
                </div>
                <div className='my-3 rounded-sm bg-white p-5 shadow'>
                  {extendedPurchases.map((purchase, index) => (
                    <div
                      key={purchase.purchase_id}
                      className='mb-5 items-center grid grid-cols-12 rounded-sm border border-gray-200 bg-white py-5 px-4 text-center text-sm text-gray-500 first:mt-0'
                    >
                      <div className='col-span-6'>
                        <div className='flex'>
                          <div className='flex flex-shrink-0 items-center justify-center pr-3'>
                            <input
                              type='checkbox'
                              className='h-5 w-5 accent-primaryColor'
                              checked={purchase.checked}
                              onChange={handleCheck(index)}
                            />
                          </div>
                          <div className='flex-grow'>
                            <div className='flex items-center'>
                              <Link
                                className='h-20 w-20 flex-shrink-0'
                                to={`${path.home}${generateNameId({ name: purchase.stores_products.products.product_name, id: String(purchase.stores_products_id) })}`}
                              >
                                <img
                                  alt={purchase.stores_products.products.image_url}
                                  src={purchase.stores_products.products.image_url}
                                />
                              </Link>
                              <div className='flex-grow px-2 pt-1 pb-2 text-left ml-1'>
                                <Link
                                  to={`${path.home}${generateNameId({ name: purchase.stores_products.products.product_name, id: String(purchase.stores_products_id) })}`}
                                  className='line-clamp-2'
                                >
                                  {purchase.stores_products.products.product_name}
                                </Link>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className='col-span-6'>
                        <div className='grid grid-cols-5 items-center'>
                          <div className='col-span-2'>
                            <div className='flex items-center justify-center'>
                              <span className='text-gray-300 line-through'>
                                ₫{formatCurrency(Number(purchase.stores_products.price_before_discount))}
                              </span>
                              <span className='ml-3'>₫{formatCurrency(Number(purchase.stores_products.price))}</span>
                            </div>
                          </div>
                          <div className='col-span-1'>
                            <QuantityController
                              max={purchase.stores_products.stock_quantity}
                              value={purchase.buy_count}
                              classNameWrapper='flex items-center'
                              disabled={purchase.disabled}
                              onIncrease={(value) =>
                                handleQuantity(index, value, value <= purchase.stores_products.stock_quantity)
                              }
                              onDecrease={(value) => handleQuantity(index, value, value >= 1)}
                              onType={handleTypeQuantity(index)}
                              onFocusOut={(value) =>
                                handleQuantity(
                                  index,
                                  value,
                                  value >= 1 &&
                                    value <= purchase.stores_products.stock_quantity &&
                                    value !== purchasesInCart[index].buy_count
                                )
                              }
                            />
                          </div>
                          <div className='col-span-1'>
                            <span className='text-primaryColor'>
                              ₫{formatCurrency(Number(purchase.stores_products.price) * purchase.buy_count)}
                            </span>
                          </div>
                          <div className='col-span-1'>
                            <button
                              className='bg-none text-black transition-colors hover:text-primaryColor'
                              onClick={() => handleDelete(index)}
                            >
                              {t('Delete')}
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className='sticky bottom-0 z-10 mt-8 flex flex-col rounded-sm border border-gray-100 bg-white p-5 shadow sm:flex-row sm:items-center'>
              <div className='flex items-center'>
                <div className='flex flex-shrink-0 items-center justify-center pr-3'>
                  <input
                    type='checkbox'
                    className='h-5 w-5 accent-primaryColor'
                    checked={isAllChecked}
                    onChange={handleCheckedAll}
                  />
                </div>
                <button className='mx-3 border-none bg-none' onClick={handleCheckedAll}>
                  {t('Select all')} ({extendedPurchases.length})
                </button>
                <button className='mx-3 border-none bg-none' onClick={handleDeleteManyPurchases}>
                  {t('Delete')}
                </button>
              </div>
              <div className='mt-5 flex flex-col sm:ml-auto sm:mt-0 sm:flex-row sm:items-center'>
                <div>
                  <div className='flex items-center sm:justify-end'>
                    <div>
                      {t('Total payment')} ({checkedPurchasesCount} {t('Products')}):
                    </div>

                    <div className='ml-2 text-2xl text-primaryColor'>₫{formatCurrency(totalCheckedPurchasesPrice)}</div>
                  </div>
                  <div className='flex items-center text-sm sm:justify-end'>
                    <div className='text-gray-500'>Tiết kiệm</div>
                    <div className='ml-6 text-primaryColor'>₫{formatCurrency(totalCheckedPurchasesSavingPrice)}</div>
                  </div>
                </div>
                <Button
                  onClick={handleBuyProducts}
                  className='mt-5 flex h-10 w-52 items-center justify-center bg-red-500 text-sm uppercase text-white hover:bg-red-600 sm:ml-4 sm:mt-0'
                  disabled={buyProductsMutation.isPending}
                >
                  {t('Buy')}
                </Button>
              </div>
            </div>
          </div>
        </>
      ) : (
        <div className='text-center'>
          <img
            src={'https://deo.shopeemobile.com/shopee/shopee-pcmall-live-sg/assets/c44984f18d2d2211.png'}
            alt='no purchase'
            className='mx-auto h-40 w-40'
          />
          <div className='mt-5 text-lg font-bold text-gray-400'>{t('Your shopping cart is empty')}</div>
          <div className='mt-5 text-center'>
            <Link
              to={path.home}
              className=' rounded-sm bg-primaryColor px-10 py-2  uppercase text-white transition-all hover:bg-orange/80'
            >
              {t('Buy now')}
            </Link>
          </div>
        </div>
      )}
    </div>
  )
}
