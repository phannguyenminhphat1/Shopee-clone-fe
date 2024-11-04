import useQueryConfig from './useQueryConfig'
import { createSearchParams, useNavigate } from 'react-router-dom'
import { yupResolver } from '@hookform/resolvers/yup'
import { useForm } from 'react-hook-form'
import path from 'src/constant/path'
import { omit } from 'lodash'
import { schema, Schema } from 'src/utils/rules'

type FormData = Pick<Schema, 'product_name'>
const nameSchema = schema.pick(['product_name'])
export default function useSearchProducts() {
  const queryConfig = useQueryConfig()
  const navigate = useNavigate()

  const { register, handleSubmit } = useForm<FormData>({
    resolver: yupResolver(nameSchema)
  })

  // Search
  const onSubmitSearch = handleSubmit((data) => {
    const config = queryConfig.order
      ? omit(
          {
            ...queryConfig,
            product_name: data.product_name
          },
          ['order', 'sort_by']
        )
      : {
          ...queryConfig,
          product_name: data.product_name
        }
    navigate({
      pathname: path.home,
      search: createSearchParams(config).toString()
    })
  })
  return {
    onSubmitSearch,
    register
  }
}
