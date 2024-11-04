import { yupResolver } from '@hookform/resolvers/yup'
import { useMutation } from '@tanstack/react-query'
import { Helmet } from 'react-helmet-async'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { toast } from 'react-toastify'
import { userApi } from 'src/apis/user.api'
import Button from 'src/components/Button'
import Input from 'src/components/Input'
import { ResponseErrorApi } from 'src/types/utils.type'
import { userSchema, UserSchema } from 'src/utils/rules'
import { isAxiosUnprocessableEntityError } from 'src/utils/utils'

type FormData = Pick<UserSchema, 'password' | 'new_password' | 'confirm_password'>
const passwordSchema = userSchema.pick(['password', 'confirm_password', 'new_password'])

export default function ChangePassword() {
  const { t } = useTranslation('profile')

  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors }
  } = useForm<FormData>({
    defaultValues: {
      password: '',
      confirm_password: '',
      new_password: ''
    },
    resolver: yupResolver(passwordSchema)
  })

  const changePasswordMutation = useMutation({
    mutationFn: userApi.changePassword
  })
  const onSubmit = handleSubmit((data) => {
    changePasswordMutation.mutate(data, {
      onSuccess: (result) => {
        toast.success(result.data.message, { autoClose: 1000 })
        reset()
      },
      onError: (err) => {
        console.log(err)

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
    <div className='rounded-sm bg-white px-2 pb-10 shadow md:px-7 md:pb-20'>
      <Helmet>
        <title>Trang đổi mật khẩu | Shopee Clone</title>
        <meta name='description' content='Trang đổi mật khẩu dự án Shopee Clone' />
      </Helmet>
      <div className='border-b border-b-gray-200 py-6'>
        <h1 className='text-lg font-medium capitalize text-gray-900'>{t('Change Password')}</h1>
        <div className='mt-1 text-sm text-gray-700'>{t('Manage profile information for account security')}</div>
      </div>
      <form className='mt-8  mr-auto max-w-2xl' onSubmit={onSubmit}>
        <div className='mt-6 flex-grow md:mt-0 md:pr-12'>
          <div className='mt-6 flex flex-col flex-wrap sm:flex-row'>
            <div className='truncate pt-3 capitalize sm:w-[20%] sm:text-right'>{t('Password')}</div>
            <div className='sm:w-[80%] sm:pl-5'>
              <Input
                type='password'
                className='relative'
                classNameInput='w-full rounded-sm border border-gray-300 px-3 py-2 outline-none focus:border-gray-500 focus:shadow-sm'
                name='password'
                register={register}
                errorMessage={errors.password?.message}
                placeholder={t('Old Password')}
                classNameError='mt-1 text-red-600 min-h-[1.25rem] text-sm'
              />
            </div>
          </div>
          <div className='mt-2 flex flex-col flex-wrap sm:flex-row'>
            <div className='truncate pt-3 capitalize sm:w-[20%] sm:text-right'>{t('New Password')}</div>
            <div className='sm:w-[80%] sm:pl-5'>
              <Input
                type='password'
                className='relative'
                classNameInput='w-full rounded-sm border border-gray-300 px-3 py-2 outline-none focus:border-gray-500 focus:shadow-sm'
                name='new_password'
                register={register}
                errorMessage={errors.new_password?.message}
                placeholder={t('New Password')}
                classNameError='mt-1 text-red-600 min-h-[1.25rem] text-sm'
              />
            </div>
          </div>
          <div className='mt-2 flex flex-col flex-wrap sm:flex-row'>
            <div className='truncate pt-3 capitalize sm:w-[20%] sm:text-right'>{t('Confirm Password')}</div>
            <div className='sm:w-[80%] sm:pl-5'>
              <Input
                type='password'
                className='relative'
                classNameInput='w-full rounded-sm border border-gray-300 px-3 py-2 outline-none focus:border-gray-500 focus:shadow-sm'
                name='confirm_password'
                register={register}
                errorMessage={errors.confirm_password?.message}
                placeholder={t('Confirm Password')}
                classNameError='mt-1 text-red-600 min-h-[1.25rem] text-sm'
              />
            </div>
          </div>
          <div className='mt-4 flex flex-col sm:flex-row'>
            <div className='truncate pt-3 capitalize sm:w-[20%] sm:text-right'></div>
            <div className='sm:w-[80%] sm:pl-5'>
              <Button
                type='submit'
                className='h-9 px-5 flex items-center bg-primaryColor text-white hover:bg-primaryColor/80 rounded-sm outline-none text-md'
              >
                {t('Save')}
              </Button>
            </div>
          </div>
        </div>
      </form>
    </div>
  )
}
