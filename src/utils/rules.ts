import * as yup from 'yup'

function testPriceMinMax(this: yup.TestContext<yup.AnyObject>) {
  const { price_max, price_min } = this.parent as { price_min: string; price_max: string }
  if (price_min !== '' && price_max !== '') {
    return Number(price_max) >= Number(price_min)
  }
  return price_min !== '' || price_max !== ''
}

function handlePasswordSchemaYup() {
  return yup
    .string()
    .required('Mật khẩu không được trống')
    .min(6, 'Mật khẩu phải có ít nhất 6 ký tự')
    .max(50, 'Mật khẩu không được vượt quá 50 ký tự')
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/,
      'Mật khẩu phải bao gồm chữ hoa, chữ thường, số và ký tự đặc biệt'
    )
}

export const schema = yup.object({
  full_name: yup
    .string()
    .required('Họ và tên không được trống')
    .min(2, 'Họ và tên phải có ít nhất 2 ký tự')
    .max(100, 'Họ và tên không được vượt quá 100 ký tự'),

  username: yup
    .string()
    .required('Tên đăng nhập không được trống')
    .min(3, 'Tên đăng nhập phải có ít nhất 3 ký tự')
    .max(50, 'Tên đăng nhập không được vượt quá 50 ký tự'),

  email: yup.string().required('Email không được trống').email('Email không đúng định dạng'),

  password: handlePasswordSchemaYup(),
  confirm_password: yup
    .string()
    .required('Xác nhận mật khẩu không được trống')
    .oneOf([yup.ref('password')], 'Xác nhận mật khẩu không khớp với mật khẩu'),

  phone_number: yup
    .string()
    .required('Số điện thoại không được trống')
    .matches(/^(\+?84|0)(3|5|7|8|9)[0-9]{8}$/, 'Số điện thoại không đúng định dạng'),
  price_min: yup.string().test({
    name: 'price-not-allowed',
    message: 'Giá không phù hợp',
    test: testPriceMinMax
  }),
  price_max: yup.string().test({
    name: 'price-not-allowed',
    message: 'Giá không phù hợp',
    test: testPriceMinMax
  }),
  product_name: yup.string().trim().required('Tên sản phẩm là bắt buộc')
})

export const userSchema = yup.object({
  full_name: yup.string().min(2, 'Tên tối thiểu 2 kí tự').max(100, 'Tên tối đa 100 kí tự'),
  phone_number: yup
    .string()
    .trim()
    .matches(/^(\+84|0)(3|5|7|8|9)([0-9]{8})$/, 'Số điện thoại không hợp lệ'),
  date_of_birth: yup.date().max(new Date(), 'Hãy chọn một ngày trong quá khứ'),
  address: yup.string().max(255, 'Địa chỉ tối đa 255 kí tự'),
  password: yup.string().required('Mật khẩu không được trống'),
  new_password: handlePasswordSchemaYup(),
  confirm_password: yup
    .string()
    .required('Xác nhận mật khẩu không được trống')
    .oneOf([yup.ref('new_password')], 'Xác nhận mật khẩu không khớp với mật khẩu'),
  avatar: yup.string().matches(/^https?:\/\/.*\.(jpg|jpeg|png|gif|bmp|webp)$/i, 'Hình ảnh không hợp lệ')
})
export type UserSchema = yup.InferType<typeof userSchema>
export type Schema = yup.InferType<typeof schema>
