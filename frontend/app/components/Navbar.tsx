import React, { useState } from 'react';
import { IoMdSettings } from "react-icons/io";
import { FaUserAlt } from "react-icons/fa";
import { MdLogout } from "react-icons/md";
import { HiMenu } from "react-icons/hi";
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const router=useRouter()

  const handleClick = async(label: string) => {
    if (label === "Logout") {
      const response=await fetch('http://localhost:3000/user/removeCookie',{
        method:'GET',
        headers:{
          'Content-Type':'application/json'
        },
        credentials: 'include'
      }
      )
      const json=await response.json()
      if(json.success){
        router.push('/login')
      }
    }
    setIsMenuOpen(false);
  };

  return (
    <div className='bg-gray-900 w-full'>
      <div className='h-20 flex items-center justify-between px-4 md:px-8'>
        {/* Logo Section */}
        <div className='flex items-center space-x-2'>
          <img src="logo.png" alt="logo" className='w-6 h-6 hover:cursor-pointer' />
          <p className='text-white font-semibold text-lg hover:cursor-pointer'>eetRoom</p>
        </div>

        {/* Hamburger Icon (Mobile Only) */}
        <div className="md:hidden">
          <button onClick={() => setIsMenuOpen(!isMenuOpen)} className='text-white text-2xl'>
            <HiMenu className='hover:cursor-pointer' />
          </button>
        </div>

        {/* Menu Items (Desktop) */}
        <div className='hidden md:flex items-center gap-5'>
          <NavItem icon={<IoMdSettings />} label="Settings" handleClick={handleClick} />
          <NavItem icon={<FaUserAlt />} label="Profile" handleClick={handleClick} />
          <NavItem icon={<MdLogout />} label="Logout" handleClick={handleClick} />
        </div>
      </div>

      {/* Mobile Menu with Slide & Pop */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ x: '-100%', opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: '-100%', opacity: 0 }}
            transition={{ duration: 0.4 }}
            className='flex flex-col gap-3 p-4 md:hidden bg-gray-800'
          >
            <AnimatedNavItem icon={<IoMdSettings />} label="Settings" handleClick={handleClick} />
            <AnimatedNavItem icon={<FaUserAlt />} label="Profile" handleClick={handleClick} />
            <AnimatedNavItem icon={<MdLogout />} label="Logout" handleClick={handleClick} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// Desktop NavItem
const NavItem = ({ icon, label, handleClick }: { icon: React.ReactNode, label: string, handleClick: (label: string) => void }) => (
  <div
    className='flex items-center bg-gray-800 py-2 px-3 rounded-xl hover:cursor-pointer hover:bg-amber-900 text-white'
    onClick={() => handleClick(label)}
  >
    {icon}
    <p className='px-2'>{label}</p>
  </div>
);

// Animated NavItem for Mobile
const AnimatedNavItem = ({ icon, label, handleClick }: { icon: React.ReactNode, label: string, handleClick: (label: string) => void }) => (
  <motion.div
    initial={{ scale: 0.8, opacity: 0 }}
    animate={{ scale: 1, opacity: 1 }}
    transition={{ type: 'spring', stiffness: 200, damping: 20 }}
    className='flex items-center bg-gray-800 py-2 px-3 rounded-xl hover:cursor-pointer hover:bg-amber-900 text-white'
    onClick={() => handleClick(label)}
  >
    {icon}
    <p className='px-2'>{label}</p>
  </motion.div>
);

export default Navbar;
