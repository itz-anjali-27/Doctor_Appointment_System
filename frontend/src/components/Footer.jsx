import React from 'react';
import { assets } from '../assets/assets';

const Footer = () => {
    return (
        <div className='md:mx-10'>

            <div className='grid grid-cols-1 sm:grid-cols-[3fr_1fr_1fr] gap-14 my-10 mt-40 text-sm'>

                {/*----Left Section----*/}
                <div>
                    <img className="w-40 mb-5" src={assets.logo} alt="logo" />
                    <p className='w-full md:w-2/3 text-gray-600 leading-6'>Your health is our priority. Book appointments with top doctors anytime, anywhere</p>
                </div>

                {/*----Center Section----*/}
                <div>
                    <p className='text-xl font-medium mb-5'>Company</p>
                    <ul className='flex flex-col gap-2 text-gray-600'>
                        <li>About Us</li>
                        <li>Contact Us</li>
                        <li>Careers</li>
                        <li>Privacy Policy</li>
                    </ul>
                </div>

                {/*----Right Section----*/}
                <div>
                    <p className='text-xl font-medium mb-5'>Get In Touch</p>
                    <ul className='flex flex-col gap-2 text-gray-600'>
                        <li>+1-211-233-1233</li>
                        <li>hospital@gmail.com</li>
                    </ul>
                </div>

            </div>

            <div>
                <hr />
                <p className='py-5 text-sm text-center'>Copyright@Prescripto-All Right Reserved</p>
            </div>

        </div>
    );
}

export default Footer;
