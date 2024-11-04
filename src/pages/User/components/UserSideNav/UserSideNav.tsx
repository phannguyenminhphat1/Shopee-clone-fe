import classNames from 'classnames'
import { useContext } from 'react'
import { useTranslation } from 'react-i18next'
import { Link, NavLink } from 'react-router-dom'
import path from 'src/constant/path'
import { AppContext } from 'src/contexts/app.context'

export default function UserSideNav() {
  const { t } = useTranslation('profile')
  const { profile, role } = useContext(AppContext)

  return (
    <div>
      <div className='flex items-center border-b border-b-gray-200 py-4'>
        <Link
          to={(role && `/${role.toLowerCase()}/profile`) as string}
          className='h-12 w-12 flex-shrink-0 overflow-hidden rounded-full border border-black/10'
        >
          <img
            src={profile ? profile.avatar : 'https://cf.shopee.vn/file/d04ea22afab6e6d250a370d7ccc2e675_tn'}
            alt=''
            className='h-full w-full object-cover'
          />
        </Link>
        <div className='flex-grow pl-4'>
          <div className='mb-1 truncate font-semibold text-gray-600'>{profile?.username}</div>
          <Link
            to={(role && `/${role.toLowerCase()}/profile`) as string}
            className='flex items-center capitalize text-gray-500'
          >
            <svg
              width={12}
              height={12}
              viewBox='0 0 12 12'
              xmlns='http://www.w3.org/2000/svg'
              style={{ marginRight: 4 }}
            >
              <path
                d='M8.54 0L6.987 1.56l3.46 3.48L12 3.48M0 8.52l.073 3.428L3.46 12l6.21-6.18-3.46-3.48'
                fill='#9B9B9B'
                fillRule='evenodd'
              />
            </svg>
            {t('Edit Profile')}
          </Link>
        </div>
      </div>
      <div className='mt-7'>
        <NavLink
          to={(role && `/${role.toLowerCase()}/profile`) as string}
          className={({ isActive }) =>
            classNames('flex items-center capitalize transition-colors', {
              'text-primaryColor': isActive,
              'text-gray-600': !isActive
            })
          }
        >
          <div className='mr-3 h-[22px] w-[22px] '>
            <img src='https://cf.shopee.vn/file/ba61750a46794d8847c3f463c5e71cc4' alt='' className='h-full w-full' />
          </div>
          {t('My Profile')}
        </NavLink>
        <NavLink
          to={(role && `/${role.toLowerCase()}/password`) as string}
          className={({ isActive }) =>
            classNames('mt-4 flex items-center capitalize transition-colors', {
              'text-primaryColor': isActive,
              'text-gray-600': !isActive
            })
          }
        >
          <div className='mr-3 h-[22px] w-[22px]'>
            <img src='https://cf.shopee.vn/file/ba61750a46794d8847c3f463c5e71cc4' alt='' className='h-full w-full' />
          </div>
          {t('Change Password')}
        </NavLink>
        {role && role === 'User' && (
          <NavLink
            to={path.historyPurchase}
            className={({ isActive }) =>
              classNames('mt-4 flex items-center capitalize transition-colors', {
                'text-primaryColor': isActive,
                'text-gray-600': !isActive
              })
            }
          >
            <div className='mr-3 h-[22px] w-[22px]'>
              <img src='https://cf.shopee.vn/file/f0049e9df4e536bc3e7f140d071e9078' alt='' className='h-full w-full' />
            </div>
            {t('My Order')}
          </NavLink>
        )}
        {role && role === 'Admin' && (
          <NavLink
            to={path.adminOrder}
            className={({ isActive }) =>
              classNames('mt-4 flex items-center capitalize transition-colors', {
                'text-primaryColor': isActive,
                'text-gray-600': !isActive
              })
            }
          >
            <div className='mr-3 h-[22px] w-[22px]'>
              <img src='https://cf.shopee.vn/file/f0049e9df4e536bc3e7f140d071e9078' alt='' className='h-full w-full' />
            </div>
            {t('My Order')}
          </NavLink>
        )}
        {role && role === 'Shipper' && (
          <NavLink
            to={path.shipperShipping}
            className={({ isActive }) =>
              classNames('mt-4 flex items-center capitalize transition-colors', {
                'text-primaryColor': isActive,
                'text-gray-600': !isActive
              })
            }
          >
            <div className='mr-3 h-[22px] w-[22px]'>
              <img src='https://cf.shopee.vn/file/f0049e9df4e536bc3e7f140d071e9078' alt='' className='h-full w-full' />
            </div>
            {t('My Order')}
          </NavLink>
        )}
      </div>
    </div>
  )
}
