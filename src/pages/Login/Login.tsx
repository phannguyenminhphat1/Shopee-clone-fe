import { Link, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import Input from 'src/components/Input'
import { yupResolver } from '@hookform/resolvers/yup'
import { schema, Schema } from 'src/utils/rules'
import { useMutation } from '@tanstack/react-query'
import authApi from 'src/apis/auth.api'
import { toast } from 'react-toastify'
import { isAxiosUnprocessableEntityError } from 'src/utils/utils'
import { ResponseErrorApi } from 'src/types/utils.type'
import { useContext } from 'react'
import { AppContext } from 'src/contexts/app.context'
import Button from 'src/components/Button'
import { Helmet } from 'react-helmet-async'
import path from 'src/constant/path'

type FormData = Pick<Schema, 'username' | 'password'>
const loginSchema = schema.pick(['username', 'password'])
export default function Login() {
  const navigate = useNavigate()
  const { setIsAuthenticated, setProfile, setRole } = useContext(AppContext)
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors }
  } = useForm<FormData>({
    resolver: yupResolver(loginSchema)
  })
  const loginMutation = useMutation({
    mutationFn: (body: { username: string; password: string }) => authApi.loginApi(body)
  })

  const onSubmit = handleSubmit((data) => {
    loginMutation.mutate(data, {
      onSuccess: (result) => {
        setIsAuthenticated(true)
        setProfile(result.data.data.user)
        setRole(result.data.data.user.role)
        toast.success(result.data.message, {
          autoClose: 500
        })

        if (result.data.data.user.role === 'Admin') {
          navigate(path.adminOrder)
        }
        if (result.data.data.user.role === 'User') {
          navigate('/')
        }
        if (result.data.data.user.role === 'Shipper') {
          navigate(path.shipperShipping)
        }
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
        <title>Đăng nhập | Shopee Clone</title>
        <meta name='description' content='Đăng nhập vào dự án Shopee Clone' />
      </Helmet>
      <div className='container'>
        <div className='grid grid-cols-1 py-12 lg:grid-cols-5 lg:py-32 lg:pr-10'>
          <div className='lg:col-span-2 lg:col-start-4'>
            <form onSubmit={onSubmit} className='rounded bg-white p-10 shadow-sm'>
              <div className='text-2xl'>Đăng nhập</div>
              <Input
                className='mt-3'
                classNameInput='p-3 w-full outline-none border border-gray-300 focus:border-gray-500 rounded-sm focus:shadow-sm'
                classNameError='mt-1 text-red-600 min-h-[1.25rem] text-sm'
                name='username'
                register={register}
                errorMessage={errors.username?.message}
                placeholder='Nhập tên đăng nhập'
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
              <div className='mt-3'>
                <Button
                  type='submit'
                  className='flex  w-full items-center justify-center bg-red-500 px-2 py-4 text-sm uppercase text-white outline-none transition-all hover:bg-red-600'
                  isLoading={loginMutation.isPending}
                  disabled={loginMutation.isPending}
                >
                  Đăng nhập
                </Button>
              </div>
              <div className='mt-8 flex items-center justify-center'>
                <span className='text-gray-400'>Bạn chưa có tài khoản?</span>
                <Link className='ml-1 text-red-400' to='/register'>
                  Đăng ký
                </Link>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
