"use client"

import { useRouter } from 'next/navigation';
import React, { useEffect } from 'react'
import Navbar from './components/Navbar';
const page = () => {
const router=useRouter()
  useEffect(() => {
    fetch("http://localhost:3000/user/valid-user", {
      method: "GET",
      credentials: "include",
    })
      .then((response) => response.json())
      .then((json) => {
        if(!json.success){
          router.push('/login')
        }
      })
      .catch((error) => {
        console.error("Error:", error);
      })
  }, []);
  return (
    <div className='grid grid-rows-[]'>
      <Navbar/>
    </div>
  )
}

export default page