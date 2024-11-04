import { range } from 'lodash'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'

interface Props {
  onChange?: (value: Date) => void
  value?: Date
  errorMessage?: string
}

export default function DateSelect({ errorMessage, onChange, value }: Props) {
  const { t } = useTranslation('profile')
  const [date, setDate] = useState({
    date: value?.getUTCDate() || 1,
    month: value ? value.getUTCMonth() + 1 : 1, // Thêm 1 vì getUTCMonth trả về 0-11
    year: value?.getUTCFullYear() || 1990
  })

  useEffect(() => {
    if (value) {
      setDate({
        date: value.getUTCDate(),
        month: value.getUTCMonth() + 1, // Hiển thị tháng từ 1-12
        year: value.getUTCFullYear()
      })
    }
  }, [value])

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { value: valueFromSelect, name } = e.target
    const newDate = {
      date: name === 'date' ? Number(valueFromSelect) : date.date,
      month: name === 'month' ? Number(valueFromSelect) : date.month,
      year: name === 'year' ? Number(valueFromSelect) : date.year
    }

    setDate(newDate)
    if (onChange) {
      // Sử dụng Date.UTC để tránh lỗi múi giờ và trừ 1 cho month vì Date sử dụng month từ 0-11
      onChange(new Date(Date.UTC(newDate.year, newDate.month - 1, newDate.date)))
    }
  }

  return (
    <div className='mt-2 flex flex-col flex-wrap sm:flex-row'>
      <div className='truncate pt-3 capitalize sm:w-[20%] sm:text-right'>{t('Date Of Birth')}</div>
      <div className='sm:w-[80%] sm:pl-5'>
        <div className='flex justify-between'>
          <select
            name='date'
            onChange={handleChange}
            className='h-10 w-[32%] rounded-sm border border-black/10 px-3 hover:border-primaryColor cursor-pointer'
            value={date.date}
          >
            {range(1, 32).map((item) => (
              <option key={item}>{item}</option>
            ))}
          </select>
          <select
            name='month'
            onChange={handleChange}
            className='h-10 w-[32%] rounded-sm border border-black/10 px-3 hover:border-primaryColor cursor-pointer'
            value={date.month}
          >
            {range(1, 13).map((item) => (
              <option key={item}>{item}</option>
            ))}
          </select>
          <select
            name='year'
            onChange={handleChange}
            className='h-10 w-[32%] rounded-sm border border-black/10 px-3 hover:border-primaryColor cursor-pointer'
            value={date.year}
          >
            {range(1990, 2025).map((item) => (
              <option key={item}>{item}</option>
            ))}
          </select>
        </div>
        <div className="mt-1 text-red-600 min-h-[1.25rem] text-sm'">{errorMessage}</div>
      </div>
    </div>
  )
}
