import { order as orderConstant, sortBy } from 'src/constant/product'
import { ProductListConfig } from 'src/types/product.type'
import { createSearchParams, Link, useNavigate } from 'react-router-dom'
import classNames from 'classNames'
import path from 'src/constant/path'
import { omit } from 'lodash'
import { QueryConfig } from 'src/hooks/useQueryConfig'
import { useTranslation } from 'react-i18next'

interface Props {
  queryConfig: QueryConfig
  pageSize: number
}

export default function SortProductList({ pageSize, queryConfig }: Props) {
  const { t } = useTranslation('home')
  const { sort_by = sortBy.created_at, order } = queryConfig
  const page = Number(queryConfig.page)

  const navigate = useNavigate()
  const isActiveSortBy = (sortByValue: Exclude<ProductListConfig['sort_by'], undefined>) => {
    return sort_by === sortByValue
  }
  const handleSortProduct = (sortByValue: Exclude<ProductListConfig['sort_by'], undefined>) => {
    navigate({
      pathname: path.home,
      search: createSearchParams(
        omit(
          {
            ...queryConfig,
            sort_by: sortByValue
          },
          ['order']
        )
      ).toString()
    })
  }
  const handlePriceOrder = (orderValue: Exclude<ProductListConfig['order'], undefined>) => {
    navigate({
      pathname: path.home,
      search: createSearchParams({
        ...queryConfig,
        sort_by: sortBy.price,
        order: orderValue
      }).toString()
    })
  }
  return (
    <div className='bg-gray-300/40 py-4 px-3'>
      <div className='flex flex-wrap items-center justify-between gap-2'>
        <div className='flex items-center flex-wrap gap-2'>
          <div>{t('Sort product.Order by')}</div>
          <button
            className={classNames('h-8 px-4 capitalize text-sm text-center', {
              'bg-primaryColor text-white hover:bg-primaryColor/80': isActiveSortBy(sortBy.view),
              'bg-white text-black hover:bg-slate-100': !isActiveSortBy(sortBy.view)
            })}
            onClick={() => handleSortProduct(sortBy.view)}
          >
            {t('Sort product.Popular')}
          </button>
          <button
            className={classNames('h-8 px-4 capitalize text-sm text-center', {
              'bg-primaryColor text-white hover:bg-primaryColor/80': isActiveSortBy(sortBy.created_at),
              'bg-white text-black hover:bg-slate-100': !isActiveSortBy(sortBy.created_at)
            })}
            onClick={() => handleSortProduct(sortBy.created_at)}
          >
            {t('Sort product.Latest')}
          </button>
          <button
            className={classNames('h-8 px-4 capitalize text-sm text-center', {
              'bg-primaryColor text-white hover:bg-primaryColor/80': isActiveSortBy(sortBy.sold),
              'bg-white text-black hover:bg-slate-100': !isActiveSortBy(sortBy.sold)
            })}
            onClick={() => handleSortProduct(sortBy.sold)}
          >
            {t('Sort product.Best seller')}
          </button>
          <select
            className={classNames('h-8  px-4 text-left text-sm capitalize  outline-none ', {
              'bg-primaryColor text-white hover:bg-primaryColor/80': isActiveSortBy(sortBy.price),
              'bg-white text-black hover:bg-slate-100': !isActiveSortBy(sortBy.price)
            })}
            value={order || ''}
            onChange={(event) => handlePriceOrder(event.target.value as Exclude<ProductListConfig['order'], undefined>)}
          >
            <option value='' disabled className='bg-white text-black'>
              {t('Sort product.Price')}
            </option>
            <option value={orderConstant.asc} className='bg-white text-black'>
              {t('Sort product.Price: Low to high')}
            </option>
            <option value={orderConstant.desc} className='bg-white text-black'>
              {t('Sort product.Price: High to low')}
            </option>
          </select>
        </div>
        <div className='flex items-center'>
          <div>
            <span className='text-primaryColor'>{page}</span>
            <span>/{pageSize}</span>
          </div>
          <div className='ml-2 flex'>
            {page === 1 ? (
              <span className='flex h-8 w-9 cursor-not-allowed items-center justify-center rounded-bl-sm rounded-tl-sm bg-white/60  shadow hover:bg-slate-100'>
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  fill='none'
                  viewBox='0 0 24 24'
                  strokeWidth={1.5}
                  stroke='currentColor'
                  className='h-3 w-3'
                >
                  <path strokeLinecap='round' strokeLinejoin='round' d='M15.75 19.5L8.25 12l7.5-7.5' />
                </svg>
              </span>
            ) : (
              <Link
                to={{
                  pathname: path.home,
                  search: createSearchParams({
                    ...queryConfig,
                    page: (page - 1).toString()
                  }).toString()
                }}
                className='flex h-8 w-9  items-center justify-center rounded-bl-sm rounded-tl-sm bg-white  shadow hover:bg-slate-100'
              >
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  fill='none'
                  viewBox='0 0 24 24'
                  strokeWidth={1.5}
                  stroke='currentColor'
                  className='h-3 w-3'
                >
                  <path strokeLinecap='round' strokeLinejoin='round' d='M15.75 19.5L8.25 12l7.5-7.5' />
                </svg>
              </Link>
            )}

            {page === pageSize ? (
              <span className='flex h-8 w-9 cursor-not-allowed items-center justify-center rounded-bl-sm rounded-tl-sm bg-white/60 shadow hover:bg-slate-100'>
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  fill='none'
                  viewBox='0 0 24 24'
                  strokeWidth={1.5}
                  stroke='currentColor'
                  className='h-3 w-3'
                >
                  <path strokeLinecap='round' strokeLinejoin='round' d='M8.25 4.5l7.5 7.5-7.5 7.5' />
                </svg>
              </span>
            ) : (
              <Link
                to={{
                  pathname: path.home,
                  search: createSearchParams({
                    ...queryConfig,
                    page: (page + 1).toString()
                  }).toString()
                }}
                className='flex h-8 w-9  items-center justify-center rounded-bl-sm rounded-tl-sm bg-white shadow hover:bg-slate-100'
              >
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  fill='none'
                  viewBox='0 0 24 24'
                  strokeWidth={1.5}
                  stroke='currentColor'
                  className='h-3 w-3'
                >
                  <path strokeLinecap='round' strokeLinejoin='round' d='M8.25 4.5l7.5 7.5-7.5 7.5' />
                </svg>
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
