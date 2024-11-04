import { forwardRef, InputHTMLAttributes } from 'react'

export interface InputNumberProps extends InputHTMLAttributes<HTMLInputElement> {
  className?: string
  classNameInput?: string
  classNameError?: string
  errorMessage?: string
}

const InputNumber = forwardRef<HTMLInputElement, InputNumberProps>(function InputNumberInner(
  { className, classNameError, errorMessage, classNameInput, onChange, ...rest },
  ref
) {
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target
    if ((/^\d+$/.test(value) || value === '') && onChange) {
      onChange(event)
    }
  }
  return (
    <div className={className}>
      <input className={classNameInput} onChange={handleChange} {...rest} ref={ref} />
      <div className={classNameError}>{errorMessage}</div>
    </div>
  )
})

export default InputNumber
