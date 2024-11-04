import AuthHeader from 'src/components/AuthHeader'
import Footer from 'src/components/Footer'

interface Props {
  children: React.ReactNode
}

export default function AuthLayout({ children }: Props) {
  return (
    <div>
      <AuthHeader />
      {children}
      <Footer />
    </div>
  )
}
