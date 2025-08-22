import Link from 'next/link'
import React from 'react'

function Footer() {
  return (
    <div className='h-40 bg-gray-100 mt-12 flex justify-between items-center'>
        <div className='container mx-auto flex justify-between items-center'>
            <div>FileDrive</div>
            <Link className='text-blue-400 hover:text-blue-500' href="/privacy">Privacy Policy</Link>
            <Link className='text-blue-400 hover:text-blue-500'  href="/terms-of-service">Terms Of Service</Link>
            <Link className='text-blue-400 hover:text-blue-500' href="/about">About</Link>
        </div>
    </div>
  )
}

export default Footer