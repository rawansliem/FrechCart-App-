"use client"
import Link from 'next/link'
import React, { useContext, useState } from 'react'
import { signOut, useSession } from "next-auth/react"
import { CartContext } from '@/src/context/CartContext';
import { WishlistContext } from '@/src/context/wishlistContext';

export default function Navbar() {

  const { numberOfCartItem } = useContext(CartContext)!;
  const { numberOfWishlistItem } = useContext(WishlistContext)!;
  const { data: session } = useSession()

  const [open, setOpen] = useState(false);

  function logout() {
    signOut({ callbackUrl: "/login" })
  }

  return (
    <>
      <nav className='bg-gradient-to-r from-teal-100  via-green-400 to-teal-400 text-teal-800 text-lg font-bold'>
        <div className="container w-full lg:w-[80%] mx-auto p-4 flex flex-col lg:flex-row gap-4 justify-between items-center">
          <div className="left">
            <ul className='flex gap-2 lg:gap-6 items-center '>
              <li className='text-3xl flex text-teal-800'>
                <Link href="/" >
                  <i className="fa-solid fa-cart-shopping"></i> FreshCart
                </Link>
              </li>
              <li><Link href="/">Home</Link></li>
              {session && (
                <li>
                  <Link className='relative' href="/cart">
                    Cart
                    {numberOfCartItem > 0 && (
                      <span className='absolute top-[-14px] end-[-10px] flex size-5 rounded-full justify-center items-center text-white bg-teal-800  font-bold'>
                        {numberOfCartItem}
                      </span>
                    )}
                  </Link>
                </li>
              )}
              <li><Link href="/products">Products</Link></li>
              <li><Link href="/categories">Categories</Link></li>
              <li><Link href="/brands">Brands</Link></li>
            </ul>
          </div>

          <div className="right ">
            <ul className='flex items-center gap-4'>
              {!session ? (
                <>
                  <li><Link href="/register">Register</Link></li>
                  <li><Link href="/login">Login</Link></li>
                </>
              ) : (
                <>
             
                  <li className="relative">
                    <button
                      className="flex items-center gap-1"
                      onClick={() => setOpen(!open)}
                    >
                      Hi {session.user?.name}
                      <i
                        className={`fa-solid fa-chevron-down text-sm transition-transform duration-200 ${open ? "rotate-180" : ""}`}
                      ></i>
                    </button>

                    <ul
                      className={`absolute left-0 mt-2 w-40 bg-white text-teal-500 text-lg font-bold shadow-md rounded-lg z-10 transform transition-all duration-200 origin-top 
                      ${open ? "scale-y-100 opacity-100" : "scale-y-0 opacity-0 pointer-events-none"}`}
                    >
                      <li className="px-4 py-2 hover:bg-green-200 cursor-pointer">
                        <Link href="/allorders" onClick={() => setOpen(false)}>Orders</Link>
                      </li>
                      <li className="px-4 py-2 hover:bg-green-200 cursor-pointer">
                        <Link href="/change-password" onClick={() => setOpen(false)}>Update profile</Link>
                      </li>
                      <li className="px-4 py-2 hover:bg-green-200">
                        <span className='cursor-pointer' onClick={() => { logout(); setOpen(false); }}>Signout</span>
                      </li>
                    </ul>
                  </li>

             
                  <li>
                    <Link href="/wishlist" className="relative">
                      <i className="fa-solid fa-heart text-3xl text-red-600"></i>
                      {numberOfWishlistItem > 0 && (
                        <span className="absolute top-[-22px] end-[-10px] flex size-5 rounded-full justify-center items-center text-white bg-teal-800 font-bold">
                          {numberOfWishlistItem}
                        </span>
                      )}
                    </Link>
                  </li>
                </>
              )}
            </ul>
          </div>
        </div>
      </nav>
    </>
  )
}
