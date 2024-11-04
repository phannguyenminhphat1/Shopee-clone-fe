import classNames from 'classNames'
import { useTranslation } from 'react-i18next'
import { createSearchParams, Link } from 'react-router-dom'
import path from 'src/constant/path'
import { QueryConfig } from 'src/hooks/useQueryConfig'
interface Props {
  queryConfig: QueryConfig
  pageSize: number
}

const RANGE = 2
export default function Pagination({ queryConfig, pageSize }: Props) {
  const { t } = useTranslation('home')
  const page = Number(queryConfig.page)
  const renderPagination = () => {
    let dotAfter = false
    let dotBefore = false
    const renderDotBefore = (index: number) => {
      if (!dotBefore) {
        dotBefore = true
        return (
          <span key={index} className='mx-2 rounded border bg-white px-3 py-2 shadow-sm'>
            ...
          </span>
        )
      }
      return null
    }
    const renderDotAfter = (index: number) => {
      if (!dotAfter) {
        dotAfter = true
        return (
          <span key={index} className='mx-2 rounded border bg-white px-3 py-2 shadow-sm'>
            ...
          </span>
        )
      }
      return null
    }
    return Array(pageSize)
      .fill(0)
      .map((_, index) => {
        const pageNumber = index + 1
        if (page <= RANGE * 2 + 1 && pageNumber > page + RANGE && pageNumber < pageSize - RANGE + 1) {
          return renderDotAfter(index)
        } else if (page > RANGE * 2 + 1 && page < pageSize - RANGE * 2) {
          if (pageNumber < page - RANGE && pageNumber > RANGE) {
            return renderDotBefore(index)
          } else if (pageNumber > page + RANGE && pageNumber < pageSize - RANGE + 1) {
            return renderDotAfter(index)
          }
        } else if (page >= pageSize - RANGE * 2 && pageNumber > RANGE && pageNumber < page - RANGE) {
          return renderDotBefore(index)
        }
        return (
          <Link
            to={{
              pathname: path.home,
              search: createSearchParams({
                ...queryConfig,
                page: pageNumber.toString()
              }).toString()
            }}
            key={index}
            className={classNames('mx-2 rounded border bg-white p-2 px-3 py-2 text-black shadow-sm hover:opacity-85', {
              'border-2 border-primaryColor': pageNumber === page,
              'border-transparent': pageNumber !== page
            })}
          >
            {pageNumber}
          </Link>
        )
      })
  }

  return (
    <div className='mt-5 flex flex-wrap items-center justify-center text-sm'>
      {page == 1 ? (
        <span className='mx-2 cursor-not-allowed rounded border bg-white/60 p-2 px-3 py-2 text-black shadow-sm hover:opacity-85'>
          {t('Pagination.Prev')}
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
          className='mx-2 rounded border bg-white p-2 px-3 py-2 text-black shadow-sm hover:opacity-85'
        >
          {t('Pagination.Prev')}
        </Link>
      )}
      {renderPagination()}
      {page == pageSize ? (
        <span className='mx-2 cursor-not-allowed rounded border bg-white/60 p-2 px-3 py-2 text-black shadow-sm hover:opacity-85'>
          {t('Pagination.Next')}
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
          className='mx-2 rounded border bg-white p-2 px-3 py-2 text-black shadow-sm hover:opacity-85'
        >
          {t('Pagination.Next')}
        </Link>
      )}
    </div>
  )
}
