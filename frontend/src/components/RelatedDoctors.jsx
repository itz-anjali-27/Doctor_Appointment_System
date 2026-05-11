import React, { useContext, useEffect, useState } from 'react';
import { AppContext } from '../context/AppContext';
import { useNavigate } from 'react-router-dom';

const RelatedDoctors = ({ speciality, docId }) => {
    const { doctors } = useContext(AppContext)
    const navigate = useNavigate()

    useEffect(() => {
        if (doctors.length > 0 && speciality) {
            const doctorsData = doctors.filter(doc => doc.speciality === speciality && doc._id !== docId)
            setRelDocs(doctorsData)
        }
    }, [speciality, docId, doctors])

    const [relDoc, setRelDocs] = useState([])

    return (
        <div className='flex flex-col w-full gap-4 my-16 text-gray-900 md:mx-4'>

            <h1 className='text-3xl font-medium text-center '>Top Doctors to Book</h1>
            <p className='sm:w-1/3 text-center text-sm mx-auto'>Simply browse through our extensive list of trusted doctors</p>
            <div className='w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 px-3 sm:px-0'>
                {relDoc.slice(0, 10).map((doctor) => (
                    <div
                        key={doctor._id}
                        onClick={() => { navigate(`/appointment/${doctor._id}`); scrollTo(0, 0) }}
                        className='bg-white rounded-xl shadow-sm hover:shadow-md transition cursor-pointer overflow-hidden flex flex-col mt-4' >
                        {/* Image */}
                        <img
                            src={doctor.image}
                            alt={doctor.name}
                            className='w-full h-55 object-cover bg-blue-50'
                        />

                        {/* Content */}
                        <div className='p-4 flex flex-col gap-1'>
                            <div className={`flex items-center gap-2 text-sm ${doctor.available ? 'text-green-500' : 'text-gray-500'}`}>

                                {/* Dot */}
                                <span className={`w-2 h-2 rounded-full ${doctor.available ? 'bg-green-500' : 'bg-gray-500'}`}></span>

                                {/* Text */}
                                <p>{doctor.available ? 'Available' : 'Not Available'}</p>

                            </div>

                            <p className='text-gray-900 text-lg font-medium'>
                                {doctor.name}
                            </p>

                            <p className='text-gray-600 text-sm'>
                                {doctor.speciality}
                            </p>
                            
                        </div>
                    </div>
                ))}
            </div>
            <button onClick={() => navigate('/doctors')} className='bg-blue-50 text-gray-600  py-3 rounded-full mt-5 w-80 mx-auto'>more</button>
        </div>
    );
}

export default RelatedDoctors;
