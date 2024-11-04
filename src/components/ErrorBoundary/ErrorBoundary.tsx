import { ErrorBoundary } from 'react-error-boundary'
import React from 'react'

function Fallback() {
  return (
    <main className='flex h-screen w-full flex-col items-center justify-center'>
      <h1 className='text-9xl font-extrabold tracking-widest text-gray-900'>500</h1>
      <div className='absolute rotate-12 rounded bg-primaryColor px-2 text-sm text-white'>Error!</div>
      <button className='mt-5'>
        <a
          href='/'
          className='active:text-primaryColor-500 group relative inline-block text-sm font-medium text-white focus:outline-none focus:ring'
        >
          <span className='absolute inset-0 translate-x-0.5 translate-y-0.5 bg-primaryColor transition-transform group-hover:translate-y-0 group-hover:translate-x-0' />
          <span className='relative block border border-current px-8 py-3'>
            <span>Go Home</span>
          </span>
        </a>
      </button>
    </main>
  )
}

const ErrorBoundaryWrapper = ({ children }: { children: React.ReactNode }) => {
  return <ErrorBoundary FallbackComponent={Fallback}>{children}</ErrorBoundary>
}

export default ErrorBoundaryWrapper
