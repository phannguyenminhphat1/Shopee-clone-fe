import { Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import Input from 'src/components/Input'
import { yupResolver } from '@hookform/resolvers/yup'
import { schema, Schema } from 'src/utils/rules'
import { useMutation } from '@tanstack/react-query'
import authApi from 'src/apis/auth.api'
import { AuthRequestBody } from 'src/types/auth.type'
import { toast } from 'react-toastify'
import { isAxiosUnprocessableEntityError } from 'src/utils/utils'
import { ResponseErrorApi } from 'src/types/utils.type'
import Button from 'src/components/Button'
import { Omit } from 'lodash'
import { Helmet } from 'react-helmet-async'

type FormData = Omit<Schema, 'price_min' | 'price_max' | 'product_name'>
const registerSchema = schema.omit(['price_min', 'price_max', 'product_name'])
export default function Register() {
  const {
    register,
    handleSubmit,
    setError,
    reset,
    formState: { errors }
  } = useForm<FormData>({
    resolver: yupResolver(registerSchema)
  })

  const registerMutation = useMutation({
    mutationFn: (body: AuthRequestBody) => authApi.registerApi(body)
  })

  const onSubmit = handleSubmit((data) => {
    registerMutation.mutate(data, {
      onSuccess: (result) => {
        toast.success(result.data.message, {
          autoClose: 1000
        })
        reset()
      },
      onError: (err) => {
        if (isAxiosUnprocessableEntityError<ResponseErrorApi<FormData>>(err)) {
          const formError = err.response?.data.data
          if (formError) {
            Object.keys(formError).forEach((key) =>
              setError(key as keyof FormData, {
                message: formError[key as keyof FormData],
                type: 'Server'
              })
            )
          }
        }
      }
    })
  })

  return (
    <div className='bg-primaryColor'>
      <Helmet>
        <title>Đăng ký | Shopee Clone</title>
        <meta name='description' content='Đăng ký tài khoản vào dự án Shopee Clone' />
      </Helmet>
      <div className='container'>
        <div className='grid grid-cols-1 py-12 lg:grid-cols-5 lg:py-32 lg:pr-10'>
          <div className='lg:col-span-2 lg:col-start-4'>
            <form className='rounded bg-white p-10 shadow-sm' onSubmit={onSubmit}>
              <div className='text-2xl'>Đăng ký</div>
              <Input
                type='text'
                className='mt-3'
                classNameInput='p-3 w-full outline-none border border-gray-300 focus:border-gray-500 rounded-sm focus:shadow-sm'
                classNameError='mt-1 text-red-600 min-h-[1.25rem] text-sm'
                name='full_name'
                register={register}
                errorMessage={errors.full_name?.message}
                placeholder='Nhập họ tên'
              />
              <Input
                type='text'
                className='mt-3'
                classNameInput='p-3 w-full outline-none border border-gray-300 focus:border-gray-500 rounded-sm focus:shadow-sm'
                classNameError='mt-1 text-red-600 min-h-[1.25rem] text-sm'
                name='username'
                register={register}
                errorMessage={errors.username?.message}
                placeholder='Nhập tên đăng nhập'
              />
              <Input
                type='text'
                className='mt-3'
                classNameInput='p-3 w-full outline-none border border-gray-300 focus:border-gray-500 rounded-sm focus:shadow-sm'
                classNameError='mt-1 text-red-600 min-h-[1.25rem] text-sm'
                name='email'
                register={register}
                errorMessage={errors.email?.message}
                placeholder='Nhập email'
              />
              <Input
                type='password'
                autoComplete='on'
                className='mt-3'
                classNameInput='p-3 w-full outline-none border border-gray-300 focus:border-gray-500 rounded-sm focus:shadow-sm'
                classNameError='mt-1 text-red-600 min-h-[1.25rem] text-sm'
                classNameEye='absolute top-[15px] right-[8px] w-4 h-4 cursor-pointer'
                name='password'
                register={register}
                errorMessage={errors.password?.message}
                placeholder='Nhập mật khẩu'
              />
              <Input
                type='password'
                autoComplete='on'
                className='mt-3'
                classNameInput='p-3 w-full outline-none border border-gray-300 focus:border-gray-500 rounded-sm focus:shadow-sm'
                classNameError='mt-1 text-red-600 min-h-[1.25rem] text-sm'
                classNameEye='absolute top-[15px] right-[8px] w-4 h-4 cursor-pointer'
                name='confirm_password'
                register={register}
                errorMessage={errors.confirm_password?.message}
                placeholder='Xác nhận lại mật khẩu'
              />
              <Input
                className='mt-3'
                classNameInput='p-3 w-full outline-none border border-gray-300 focus:border-gray-500 rounded-sm focus:shadow-sm'
                classNameError='mt-1 text-red-600 min-h-[1.25rem] text-sm'
                name='phone_number'
                register={register}
                errorMessage={errors.phone_number?.message}
                placeholder='Nhập số điện thoại'
              />
              <div className='mt-3'>
                <Button
                  type='submit'
                  className='flex w-full items-center justify-center bg-red-500 px-2 py-4 text-sm uppercase text-white outline-none transition-all hover:bg-red-600'
                  isLoading={registerMutation.isPending}
                  disabled={registerMutation.isPending}
                >
                  Đăng ký
                </Button>
              </div>
              <div className='mt-8 flex items-center justify-center'>
                <span className='text-gray-400'>Bạn đã có tài khoản?</span>
                <Link className='ml-1 text-red-400' to='/login'>
                  Đăng nhập
                </Link>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
