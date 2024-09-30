import React from 'react'
import Link from 'next/link'

const Footer = () => {
  return (
    <footer className='dark:bg-gray-800 p-4'>
      <div  className="bg-white text-gray-900 rounded-lg shadow dark:bg-gray-900">
        <div className="w-full max-w-screen-xl mx-auto p-4 md:py-8">
          <div className="md:flex md:items-center md:justify-between md:space-x-4">
            <Link href="/" className="flex items-center mb-4 md:mb-0 space-x-3 rtl:space-x-reverse">
              <img src="/images/ocdLogo.png" className="h-10" alt="Logo" />
              <span className="self-center text-2xl font-semibold whitespace-nowrap text-blue-500 dark:text-white">OCD FIGHT</span>
            </Link>
            <ul className="flex flex-wrap items-center justify-center mb-6 text-sm font-medium text-gray-500 sm:mb-0 dark:text-gray-400">
              <li>
                <Link href="/about" className="hover:underline me-4 md:me-6">About</Link>
              </li>
              <li>
                <Link href="/" className="hover:underline me-4 md:me-6">Privacy Policy</Link>
              </li>
              <li>
                <Link href="/" className="hover:underline me-4 md:me-6">Licensing</Link>
              </li>
              <li>
                <Link href="/" className="hover:underline">Contact</Link>
              </li>
            </ul>
          </div>
          <hr className="my-6 border-gray-200 sm:mx-auto dark:border-gray-700 lg:my-8" />
          <span className="block text-sm text-gray-500 sm:text-center dark:text-gray-400">© 2024 <Link href="/" className="hover:underline">OCD FIGHT</Link>. All Rights Reserved.</span>
        </div>
      </div>
    </footer>
  )
}

export default Footer
