import { Link } from 'react-router-dom'
import { ProductDetail } from 'src/types/product.type'
import { formatCurrency, formatNumberToSocialStyle, generateNameId } from 'src/utils/utils'
import ProductRating from '../ProductRating'
import path from 'src/constant/path'
import { useTranslation } from 'react-i18next'

interface Props {
  product: ProductDetail
}

export default function Product({ product }: Props) {
  const { t } = useTranslation('product')
  return (
    <Link
      to={`${path.home}${generateNameId({ name: product.products.product_name, id: String(product.stores_products_id) })}`}
    >
      <div className='overflow-hidden rounded-sm bg-white shadow transition-transform duration-100 hover:translate-y-[-0.04rem] hover:shadow-md'>
        <div className='relative w-full pt-[100%]'>
          <img
            src={product.products.image_url}
            alt=''
            className='absolute left-0 top-0 h-full w-full bg-white object-cover'
          />
        </div>
        <div className='overflow-hidden p-2'>
          <div className='line-clamp-2 min-h-[2rem] text-xs'>{product.products.product_name}</div>
          <div className='mt-1 text-xs  text-gray-500 truncate'>{product.stores.store_name}</div>
          <div className='mt-3 flex items-center'>
            <div className='max-w-[50%] truncate text-gray-500 line-through'>
              <span className='text-xs'>₫</span>
              <span className='text-sm'>{formatCurrency(Number(product.price_before_discount))}</span>
            </div>
            <div className='ml-1 truncate text-primaryColor'>
              <span className='text-xs'>₫</span>
              <span className='text-sm'>{formatCurrency(Number(product.price))}</span>
            </div>
          </div>
          <div className='mt-3 flex items-center justify-end'>
            <ProductRating rating={Number(product.rating)} />
            <div className='ml-2 text-sm'>
              <span>{formatNumberToSocialStyle(product.sold)}</span>
              <span className='ml-1'>{t('Sold')}</span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  )
}
