import { yupResolver } from '@hookform/resolvers/yup'
import { useMutation, useQuery } from '@tanstack/react-query'
import { useContext, useEffect, useMemo, useState } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { userApi } from 'src/apis/user.api'
import Button from 'src/components/Button'
import Input from 'src/components/Input'
import InputNumber from 'src/components/InputNumber'
import { AppContext } from 'src/contexts/app.context'
import { userSchema, UserSchema } from 'src/utils/rules'
import DateSelect from '../../components/DateSelect'
import { toast } from 'react-toastify'
import { setProfileToLS } from 'src/utils/auth'
import { isAxiosUnprocessableEntityError } from 'src/utils/utils'
import { ResponseErrorApi } from 'src/types/utils.type'
import InputFile from 'src/components/InputFile'
import { useTranslation } from 'react-i18next'
import { Helmet } from 'react-helmet-async'

type FormData = Pick<UserSchema, 'full_name' | 'address' | 'date_of_birth' | 'avatar' | 'phone_number'>
type FormErrorData = Omit<FormData, 'date_of_birth'> & {
  date_of_birth?: string
}
const profileSchema = userSchema.pick(['full_name', 'address', 'date_of_birth', 'avatar', 'phone_number'])

export default function Profile() {
  const { t } = useTranslation('profile')
  const { isAuthenticated, setProfile } = useContext(AppContext)
  const [file, setFile] = useState<File>()

  // Preview Image
  const previewImage = useMemo(() => {
    return file ? URL.createObjectURL(file) : ''
  }, [file])
  // Get Profile
  const { data: profileData, refetch } = useQuery({
    queryKey: ['profile'],
    queryFn: () => userApi.getProfile(),
    enabled: isAuthenticated
  })

  // Update Profile Mutation
  const updateProfileMutation = useMutation({
    mutationFn: userApi.updateProfile
  })

  // Upload Avatar Mutation
  const uploadAvatarMutation = useMutation({
    mutationFn: userApi.uploadAvatar
  })

  // Use Form
  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
    setError,
    watch,
    setValue
  } = useForm<FormData>({
    defaultValues: {
      full_name: '',
      address: '',
      avatar: '',
      date_of_birth: new Date(1990, 0, 1),
      phone_number: ''
    },
    resolver: yupResolver(profileSchema)
  })
  const profile = profileData?.data.data
  const avatar = watch('avatar')

  // UseEffect Set Value
  useEffect(() => {
    if (profile) {
      setValue('full_name', profile.full_name)
      setValue('address', profile.address)
      setValue('phone_number', profile.phone_number)
      setValue('date_of_birth', profile.date_of_birth ? new Date(profile.date_of_birth) : new Date(1990, 0, 1))
      setValue('avatar', profile.avatar)
    }
  }, [profile, setValue])

  // Handle Button Update
  const onSubmit = handleSubmit(async (data) => {
    let avatarName = avatar
    if (file) {
      const form = new FormData()
      form.append('image', file)
      const uploadRes = await uploadAvatarMutation.mutateAsync(form)
      avatarName = uploadRes.data.data
      setValue('avatar', avatarName)
    }
    const updatedData = {
      ...data,
      date_of_birth: (data.date_of_birth || new Date(1990, 0, 1)).toISOString(),
      avatar: avatarName
    } as {
      date_of_birth: string
      avatar: string
      full_name: string
      phone_number: string
      address: string
    }
    updateProfileMutation.mutate(updatedData, {
      onSuccess: (result) => {
        refetch()
        setProfile(result.data.data)
        setProfileToLS(result.data.data)
        toast.success(result.data.message, { autoClose: 1000 })
      },
      onError: (err) => {
        if (isAxiosUnprocessableEntityError<ResponseErrorApi<FormErrorData>>(err)) {
          const formError = err.response?.data.data
          if (formError) {
            Object.keys(formError).forEach((key) =>
              setError(key as keyof FormErrorData, {
                message: formError[key as keyof FormErrorData],
                type: 'Server'
              })
            )
          }
        }
      }
    })
  })

  // Handle Change File
  const handleChangeFile = (file?: File) => {
    setFile(file)
  }

  return (
    <div className='rounded-sm bg-white px-2 pb-10 shadow md:px-7 md:pb-20'>
      <Helmet>
        <title>Trang thông tin cả nhân | Shopee Clone</title>
        <meta name='description' content='Trang thông tin cả nhân dự án Shopee Clone' />
      </Helmet>
      <div className='border-b border-b-gray-200 py-6'>
        <h1 className='text-lg font-medium capitalize text-gray-900'>{t('My Profile')}</h1>
        <div className='mt-1 text-sm text-gray-700'>{t('Manage profile information for account security')}</div>
      </div>
      <form className='mt-8 flex flex-col-reverse md:flex-row md:items-start' onSubmit={onSubmit}>
        <div className='mt-6 flex-grow md:mt-0 md:pr-12'>
          <div className='flex flex-col flex-wrap sm:flex-row'>
            <div className='truncate pt-3 capitalize sm:w-[20%] sm:text-right'>Email</div>
            <div className='sm:w-[80%] sm:pl-5'>
              <div className='pt-3 text-gray-700'>{profile?.email}</div>
            </div>
          </div>
          <div className='mt-6 flex flex-col flex-wrap sm:flex-row'>
            <div className='truncate pt-3 capitalize sm:w-[20%] sm:text-right'>{t('Full Name')}</div>
            <div className='sm:w-[80%] sm:pl-5'>
              <Input
                type='text'
                classNameInput='w-full rounded-sm border border-gray-300 px-3 py-2 outline-none focus:border-gray-500 focus:shadow-sm'
                name='full_name'
                register={register}
                errorMessage={errors.full_name?.message}
                placeholder={t('Full Name')}
                classNameError='mt-1 text-red-600 min-h-[1.25rem] text-sm'
              />
            </div>
          </div>
          <div className='mt-2 flex flex-col flex-wrap sm:flex-row'>
            <div className='truncate pt-3 capitalize sm:w-[20%] sm:text-right'>{t('Phone Number')}</div>
            <div className='sm:w-[80%] sm:pl-5'>
              <Controller
                control={control}
                name='phone_number'
                render={({ field }) => {
                  return (
                    <InputNumber
                      classNameInput='w-full rounded-sm border border-gray-300 px-3 py-2 outline-none focus:border-gray-500 focus:shadow-sm'
                      classNameError='mt-1 text-red-600 min-h-[1.25rem] text-sm'
                      errorMessage={errors.phone_number?.message}
                      placeholder={t('Phone Number')}
                      value={field.value}
                      onChange={field.onChange}
                    />
                  )
                }}
              />
            </div>
          </div>
          <div className='mt-2 flex flex-col flex-wrap sm:flex-row'>
            <div className='truncate pt-3 capitalize sm:w-[20%] sm:text-right'>{t('Address')}</div>
            <div className='sm:w-[80%] sm:pl-5'>
              <Input
                type='text'
                classNameInput='w-full rounded-sm border border-gray-300 px-3 py-2 outline-none focus:border-gray-500 focus:shadow-sm'
                name='address'
                register={register}
                errorMessage={errors.address?.message}
                placeholder={t('Address')}
                classNameError='mt-1 text-red-600 min-h-[1.25rem] text-sm'
              />
            </div>
          </div>
          <Controller
            control={control}
            name='date_of_birth'
            render={({ field }) => {
              return (
                <DateSelect
                  errorMessage={errors.date_of_birth?.message}
                  value={field.value}
                  onChange={field.onChange}
                />
              )
            }}
          />
          <div className='mt-4 flex flex-col sm:flex-row'>
            <div className='truncate pt-3 capitalize sm:w-[20%] sm:text-right'></div>
            <div className='sm:w-[80%] sm:pl-5'>
              <Button
                type='submit'
                className='h-9 px-5 flex items-center bg-primaryColor text-white hover:bg-primaryColor/80 rounded-sm outline-none text-md'
                isLoading={uploadAvatarMutation.isPending}
                disabled={uploadAvatarMutation.isPending}
              >
                {t('Save')}
              </Button>
            </div>
          </div>
        </div>
        <div className='flex justify-center md:w-72 md:border-l md:border-l-gray-200'>
          <div className='flex flex-col items-center'>
            <div className='my-5 h-24 w-24'>
              <img src={previewImage || avatar} alt='' className='w-full h-full rounded-full object-cover' />
            </div>
            <InputFile onChange={handleChangeFile} />
            <div className='mt-3 text-gray-400'>
              <div>{t('Maximum file size is 1 MB')}</div>
              <div>{t('Format')}</div>
            </div>
          </div>
        </div>
      </form>
    </div>
  )
}
