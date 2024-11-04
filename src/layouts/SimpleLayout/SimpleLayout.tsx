import React from 'react'
import Footer from 'src/components/Footer'
import NavHeader from 'src/components/NavHeader'

interface Props {
  children?: React.ReactNode
}
export default function SimpleLayout({ children }: Props) {
  return (
    <div>
      <div className='bg-[linear-gradient(-180deg,#f53d2d,#f63)] pb-3 pt-2 text-white'>
        <div className='container'>
          <NavHeader />
        </div>
      </div>
      {children}
      <Footer />
    </div>
  )
}
