import { useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { toast } from 'react-toastify'
import { Fragment } from 'react/jsx-runtime'

interface Props {
  onChange: (file?: File) => void
}
const MAX_FILE_SIZE = 1048576
export default function InputFile({ onChange }: Props) {
  const { t } = useTranslation('profile')
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Handle upload image
  const handleUpload = () => {
    fileInputRef.current?.click()
  }

  // Handle File Change
  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const fileFromLocal = e.target.files?.[0]
    if (fileFromLocal && (fileFromLocal.size >= MAX_FILE_SIZE || !fileFromLocal.type.includes('image'))) {
      toast.error('Dụng lượng file tối đa 1 MB, Định dạng:.JPEG, .PNG', { autoClose: 1000 })
    } else {
      onChange(fileFromLocal)
    }
  }
  return (
    <Fragment>
      <input
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        onClick={(e) => ((e.target as any).value = null)}
        onChange={onFileChange}
        className='hidden'
        type='file'
        accept='.jpg,.jpeg,.png'
        ref={fileInputRef}
      />
      <button
        className='flex h-10 items-center justify-end rounded-sm border bg-white px-6 text-sm text-gray-600 shadow-sm'
        type='button'
        onClick={handleUpload}
      >
        {t('Choose image')}
      </button>
    </Fragment>
  )
}
