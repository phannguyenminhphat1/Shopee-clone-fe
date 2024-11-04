import path from 'src/constant/path'
import classNames from 'classnames'
import { createSearchParams, Link, useNavigate } from 'react-router-dom'
import Button from 'src/components/Button'
import { Category } from 'src/types/category.type'
import InputNumber from 'src/components/InputNumber'
import { useForm, Controller } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { schema, Schema } from 'src/utils/rules'
import RatingStar from '../RatingStar'
import { omit } from 'lodash'
import { QueryConfig } from 'src/hooks/useQueryConfig'
import { useTranslation } from 'react-i18next'

interface Props {
  categories: Category[]
  queryConfig: QueryConfig
}

type FormData = Pick<Schema, 'price_min' | 'price_max'>
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function filterUndefined(obj: Record<string, any>) {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  return Object.fromEntries(Object.entries(obj).filter(([_, v]) => v !== undefined))
}
const priceSchema = schema.pick(['price_min', 'price_max'])
export default function AsideFilter({ categories, queryConfig }: Props) {
  const { t } = useTranslation('home')
  const { category } = queryConfig
  const navigate = useNavigate()
  const {
    control,
    formState: { errors },
    handleSubmit,
    trigger
  } = useForm<FormData>({
    defaultValues: {
      price_max: '',
      price_min: ''
    },
    resolver: yupResolver(priceSchema),
    shouldFocusError: false
  })
  const onSubmit = handleSubmit((data) => {
    navigate({
      pathname: path.home,
      search: createSearchParams(
        filterUndefined({
          ...queryConfig,
          price_min: data.price_min,
          price_max: data.price_max
        })
      ).toString()
    })
  })
  const handleRemoveAll = () => {
    navigate({
      pathname: path.home,
      search: createSearchParams(omit(queryConfig, ['price_min', 'price_max', 'rating_filter', 'category'])).toString()
    })
  }
  return (
    <div className='py-4'>
      <Link
        to={path.home}
        className={classNames('flex items-center font-bold', {
          'text-primaryColor': !category
        })}
      >
        <svg viewBox='0 0 12 10' className='mr-3 h-4 w-3 fill-current'>
          <g fillRule='evenodd' stroke='none' strokeWidth={1}>
            <g transform='translate(-373 -208)'>
              <g transform='translate(155 191)'>
                <g transform='translate(218 17)'>
                  <path d='m0 2h2v-2h-2zm4 0h7.1519633v-2h-7.1519633z' />
                  <path d='m0 6h2v-2h-2zm4 0h7.1519633v-2h-7.1519633z' />
                  <path d='m0 10h2v-2h-2zm4 0h7.1519633v-2h-7.1519633z' />
                </g>
              </g>
            </g>
          </g>
        </svg>
        {t('Aside filter.All categories')}
      </Link>
      <div className='my-4 h-[1px] bg-gray-300' />
      <ul>
        {categories &&
          categories.map((categoryItem) => {
            const isActive = category === categoryItem.category_id.toString()
            return (
              <li className='py-2 pl-2' key={categoryItem.category_id}>
                <Link
                  to={{
                    pathname: path.home,
                    search: createSearchParams({
                      ...queryConfig,
                      category: categoryItem.category_id.toString()
                    }).toString()
                  }}
                  className={classNames('relative px-2 font-semibold ', {
                    'text-primaryColor': isActive
                  })}
                >
                  {isActive && (
                    <svg viewBox='0 0 4 7' className='absolute left-[-10px] top-1 h-2 w-2 fill-primaryColor'>
                      <polygon points='4 3.5 0 0 0 7' />
                    </svg>
                  )}

                  {categoryItem.category_name}
                </Link>
              </li>
            )
          })}
      </ul>
      <Link to={path.home} className='mt-4 flex items-center font-bold uppercase'>
        <svg
          enableBackground='new 0 0 15 15'
          viewBox='0 0 15 15'
          x={0}
          y={0}
          className='mr-3 h-4 w-3 fill-current stroke-current'
        >
          <g>
            <polyline
              fill='none'
              points='5.5 13.2 5.5 5.8 1.5 1.2 13.5 1.2 9.5 5.8 9.5 10.2'
              strokeLinecap='round'
              strokeLinejoin='round'
              strokeMiterlimit={10}
            />
          </g>
        </svg>
        {t('Aside filter.Filter')}
      </Link>
      <div className='my-4 h-[1px] bg-gray-300' />
      <div className='my-5'>
        <div>{t('Aside filter.Price range')}</div>
        <form className='mt-2' onSubmit={onSubmit}>
          <div className='flex items-start'>
            <Controller
              control={control}
              name='price_min'
              render={({ field }) => (
                <InputNumber
                  type='text'
                  className='grow'
                  placeholder={`₫ ${t('Aside filter.From')}`}
                  classNameInput='p-1 w-full outline-none border border-gray-300 focus:border-gray-500 rounded-sm focus:shadow-sm'
                  classNameError='hidden'
                  {...field}
                  onChange={(e) => {
                    field.onChange(e)
                    trigger('price_max')
                  }}
                />
              )}
            />

            <div className='mx-2 mt-2 shrink-0'>-</div>
            <Controller
              control={control}
              name='price_max'
              render={({ field }) => (
                <InputNumber
                  type='text'
                  className='grow'
                  placeholder={`₫ ${t('Aside filter.To')}`}
                  classNameInput='p-1 w-full outline-none border border-gray-300 focus:border-gray-500 rounded-sm focus:shadow-sm'
                  classNameError='hidden'
                  {...field}
                  value={field.value}
                  onChange={(e) => {
                    field.onChange(e)
                    trigger('price_min')
                  }}
                />
              )}
            />
          </div>
          <div className='mt-1 min-h-[1.25rem] text-center text-sm text-red-600'>{errors.price_min?.message}</div>
          <Button className='flex w-full mt-5 items-center justify-center bg-primaryColor p-2 text-sm uppercase text-white hover:bg-primaryColor/80'>
            {t('Aside filter.Apply')}
          </Button>
        </form>
      </div>
      <div className='bg-gray-300 h-[1px] my-4' />
      <div className='text-sm'>{t('Aside filter.Rating')}</div>
      <RatingStar queryConfig={queryConfig} />
      <div className='my-4 h-[1px] bg-gray-300' />
      <Button
        onClick={handleRemoveAll}
        className='flex w-full items-center justify-center bg-primaryColor p-2 text-sm uppercase text-white hover:bg-primaryColor/80'
      >
        {t('Aside filter.Reset all')}
      </Button>
    </div>
  )
}
