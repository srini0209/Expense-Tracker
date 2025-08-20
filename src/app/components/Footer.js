import React from 'react'
import Link from 'next/link'

const Footer = () => {
  return (
     <footer className="flex justify-center  bg-[#f5f5f5]">
          <div className="flex max-w-[960px] flex-1 flex-col">
            <footer className="flex flex-col gap-6 px-5 py-10 text-center @container">
              <div className="flex flex-wrap items-center justify-center gap-6 @[480px]:flex-row @[480px]:justify-around">
                <Link className="text-[#757575] text-base font-normal leading-normal min-w-40" href="#">Privacy Policy</Link>
                <Link className="text-[#757575] text-base font-normal leading-normal min-w-40" href="#">Terms of Service</Link>
                <Link className="text-[#757575] text-base font-normal leading-normal min-w-40" href="#">Contact Us</Link>
              </div>
              <p className="text-[#757575] text-base font-normal leading-normal">© 2024 KEP - Expense Tracker. All rights reserved.</p>
            </footer>
          </div>
        </footer>
  )
}

export default Footer