import React from 'react';
import { assets } from '../assets/assets';

const About = () => {
  return (
    <div>
    
      <div className='text-center text-2xl pt-10 text-gray-500'>
        <p>ABOUT <span className='text-gray-700 font-medium'>US</span></p>
      </div>

      <div className='my-10 flex flex-col md:flex-row gap-12'>

        <img className='w-full md:max-w-[360px]' src={assets.about_image} alt="" />

        <div className='flex flex-col justify-center gap-6 md:w-2/4 text-sm text-gray-600'>
          <p>Prescripto is a modern and user-friendly doctor appointment booking platform designed to make healthcare services easily accessible to everyone. It allows patients to connect with experienced and trusted doctors from the comfort of their homes.</p>
          <p>With Prescripto, users can search doctors by speciality, check availability, and book appointments in just a few simple steps. The platform ensures a smooth, secure, and time-saving experience for both patients and healthcare providers.</p>
          <h2 className='text-gray-800 font-semibold'>Our Vision</h2>
          <p>Our mission is to simplify the healthcare system by reducing waiting time and making medical services more organized and efficient. Prescripto aims to provide a reliable and convenient digital healthcare solution for all.</p>
        </div>

      </div>

      <div className='text-xl my-4'>
        <p>WHY <span className='text-gray-700 font-semibold'>CHOOSE US</span></p>
      </div>

      <div className='flex flex-col md:flex-row mb-20'>

        <div className='border px-10 md:px-16 py-8 sm:py-16 flex flex-col gap-5 text-[15px] hover:bg-blue-600 hover:text-white cursor-pointer  transition all duration-300'>
          <b>EFFICIENCY</b>
          <p>Our platform streamlines the appointment booking process, saving you time and effort.</p>
        </div>

        <div className='border px-10 md:px-16 py-8 sm:py-16 flex flex-col gap-5 text-[15px] hover:bg-blue-600 hover:text-white cursor-pointer  transition all duration-300'>
          <b>CONVENIENCE</b>
          <p>Book appointments anytime, anywhere, with our easy-to-use mobile and web interface.</p>
        </div>

        <div className='border px-10 md:px-16 py-8 sm:py-16 flex flex-col gap-5 text-[15px] hover:bg-blue-600 hover:text-white cursor-pointer  transition all duration-300'>
          <b>PERSONALIZATION</b>
          <p>We tailor our services to meet your specific healthcare needs and preferences.</p>
        </div>

      </div>
    </div>
  );
}

export default About;
