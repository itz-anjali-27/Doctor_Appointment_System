import React, { useContext, useState } from 'react';
import { assets } from '../assets/assets';
import { NavLink, useNavigate } from 'react-router-dom';
import { AppContext } from '../context/AppContext';


const Navbar = () => {
  const navigate = useNavigate();
  const { token, setToken, userData } = useContext(AppContext)

  const [showMenu, setShowMenu] = useState(false);
  const logout = () => {
    setToken(false)
    localStorage.removeItem('token')
  }

  return (
    <div className='flex items-center justify-between text-sm py-4 mb-5 border-b border-b-gray-400'>

      <img className="w-34 cursor-pointer" src={assets.logo} alt="logo" />

      <ul className='hidden md:flex items-start gap-5  font-medium'>
        <li className='py-1'>
          <NavLink to="/" className={({ isActive }) => isActive ? "text-blue-600" : "text-black"}>Home</NavLink>
        </li>

        <li className='py-1'>
          <NavLink to="/Doctors" className={({ isActive }) => isActive ? "text-blue-600" : "text-black"}>All Doctors</NavLink>
        </li>

        <li className='py-1'>
          <NavLink to="/about" className={({ isActive }) => isActive ? "text-blue-600" : "text-black"}>About</NavLink>
        </li>

        <li className='py-1'>
          <NavLink to="/contact" className={({ isActive }) => isActive ? "text-blue-600" : "text-black"}>Contact</NavLink>
        </li>
      </ul>

      <div className='flex item-center gap-4'>
        {
          token && userData
            ?
            <div className='flex items-center gap-1 cursor-pointer group relative'>

              <img className='w-8 h-8 rounded-full object-cover' src={userData.image} alt="" />
              <img className='w-2.5 ' src={assets.dropdown_icon} alt="" />
              <div className='absolute top-0 pt-14 text-base right-0 text-gray hidden group-hover:block'>
                <div className='min-w-48 bg-stone-100 rounded flex flex-col gap-4 p-4'>
                  <p onClick={() => navigate('/myprofile')} className='hover:text-black cursor-pointer'>Profile</p>
                  <p onClick={() => navigate('/my-appointments')} className='hover:text-black cursor-pointer'>Appointment</p>
                  <p onClick={logout} className='hover:text-black cursor-pointer'>Logout</p>
                </div>
              </div>

            </div>
            : <button onClick={() => navigate('/login')} className='bg-blue-600 text-white px-8 py-3 rounded-full font-light  hidden md:block'>Create account</button>
        }

        <img onClick={() => setShowMenu(true)} className='w-6 cursor-pointer md:hidden' src={assets.menu_icon} alt="" />  
        
        {/* Mobile Menu */}
        <div className={`fixed top-0 right-0 h-full w-64 bg-white z-20 transform transition-transform duration-300 md:hidden ${showMenu ? 'translate-x-0' : 'translate-x-full'}`}>

          <div className='flex items-center justify-between px-5 py-6'>
            <img className='w-36' src={assets.logo} alt="logo" />
            <img onClick={() => setShowMenu(false)} className='w-7 cursor-pointer' src={assets.cross_icon} alt="" />
          </div>

          <div>
            <ul className='flex flex-col items-center gap-2 mt-5 px-5 text-lg font-medium '>
              <NavLink to="/" className='px-4 py-2 rounded inline-block' onClick={() => setShowMenu(false)}>Home</NavLink>
              <NavLink to="/Doctors" className='px-4 py-2 rounded inline-block' onClick={() => setShowMenu(false)}>All Doctors</NavLink>
              <NavLink to="/about" className='px-4 py-2 rounded inline-block' onClick={() => setShowMenu(false)}>About</NavLink>
              <NavLink to="/contact" className='px-4 py-2 rounded inline-block' onClick={() => setShowMenu(false)}>Contact</NavLink>
            </ul>
          </div>

        </div>
      </div>
    </div>
  );
}

export default Navbar;
