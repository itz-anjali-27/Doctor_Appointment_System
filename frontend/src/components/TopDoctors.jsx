import React, { useContext } from 'react';
import { AppContext } from '../context/AppContext';
import { useNavigate } from 'react-router-dom';

const TopDoctors = () => {
    const navigate = useNavigate()
    const { doctors } = useContext(AppContext);

    return (
        <div className='flex flex-col w-full gap-4 my-16 text-gray-900 md:mx-4'>
            <h1 className='text-3xl font-medium text-center '>Top Doctors to Book</h1>
            <p className='sm:w-1/3 text-center text-sm mx-auto'>Simply browse through our extensive list of trusted doctors</p>

            <div className='w-full grid grid-cols-[repeat(auto-fit,minmax(200px,1fr))] gap-4 pt-5 gap-y-6 px-3 sm:px-0'>

                {doctors.slice(0, 10).map((doctor, index) => (
                    <div onClick={() => { navigate(`/appointment/${doctor._id}`); scrollTo(0, 0) }} className='border border-blue-200 rounded-xl overflow-hidden cursor-pointer hover:translate-y-[-10px] transition-all duration-500' key={index}>
                        <img src={doctor.image} alt={doctor.name} className='bg-blue-50' />
                        <div className='p-4'>

                            <div className={`flex items-center gap-2 text-sm ${doctor.available ? 'text-green-500' : 'text-gray-500'}`}>

                                {/* Dot */}
                                <span className={`w-2 h-2 rounded-full ${doctor.available ? 'bg-green-500' : 'bg-gray-500'}`}></span>

                                {/* Text */}
                                <p>{doctor.available ? 'Available' : 'Not Available'}</p>

                            </div>

                            <p className='text-gray-900 text-lg font-medium'>{doctor.name}</p>
                            <p className='text-gray-600 text-sm'>{doctor.speciality}</p>
                        </div>
                    </div>
                ))}

            </div>
            <button onClick={() => navigate('/doctors')} className='bg-blue-50 text-gray-600  py-3 rounded-full mt-5 w-80 mx-auto'>more</button>
        </div>
    );
}

export default TopDoctors;
