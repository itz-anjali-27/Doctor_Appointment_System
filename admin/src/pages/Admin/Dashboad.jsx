import React from 'react';
import { useEffect } from 'react';

import { assets } from '../../assets/assets.js'
import { useContext } from 'react';
import { AdminContext } from '../../context/AdminContext';
import { AppContext } from '../../context/AppContext.jsx';

function Dashboard() {
  const { aToken, appointmentCancel, dashData, getDashData } = useContext(AdminContext)
  const { slotDateFormate } = useContext(AppContext)

  useEffect(() => {
    if (aToken) {
      getDashData()
    }
  }, [aToken])

  return dashData && (
    <div className='m-5'>
      <div className='flex flex-wrap gap-3'>
        <div className='flex itmes-center gap-2 bg-white p-4 min-w-52 rounded border-2 border-gray-100 cursor-pointer hover:scale-105 transition-all'>
          <img className='w-14' src={assets.doctor_icon} alt="" />
          <div>
            <p className=' text-xl font-semibold text-gray-600'>{dashData?.doctors ?? 0}</p>
            <p className=''>Doctors</p>
          </div>
        </div>


        <div className='flex itmes-center gap-2 bg-white p-4 min-w-52 rounded border-2 border-gray-100 cursor-pointer hover:scale-105 transition-all'>
          <img className='w-14' src={assets.appointments_icon} alt="" />
          <div>
            <p className=' text-xl font-semibold text-gray-600'>{dashData?.appointments ?? 0}</p>
            <p>Appointments</p>
          </div>
        </div>


        <div className='flex itmes-center gap-2 bg-white p-4 min-w-52 rounded border-2 border-gray-100 cursor-pointer hover:scale-105 transition-all'>
          <img className='w-14' src={assets.patients_icon} alt="" />
          <div>
            <p className=' text-xl font-semibold text-gray-600'>{dashData?.patients ?? 0}</p>
            <p>Patients</p>
          </div>
        </div>
      </div>


      <div className='bg-white'>
        <div className='flex items-center gap-2.5 px-4 mt-10 rounded-t border'>
          <img src={assets.list_icon} alt="" />
          <p className='font-semibold'>Latest Bookings </p>
        </div>
      </div>

      <div className='pt-4 border border-t-0'>
        {
          dashData?.latestAppointments.map((item, index) => (
            <div key={index} className='flex items-center gap-3 bg-gray-100 p-4 '>
              <img className='w-10  rounded-full' src={item.docData.image} alt="" />
              <div className='flex-1 text-sm'>
                <p className='text-gray-800'>{item.docData.name}</p>
                <p className='text-gray-500'>{slotDateFormate(item.slotDate)} at {item.slotTime}</p>
              </div>
              {
                item.cancelled ? <p className='text-red-500 text-xs font-medium'>Cancelled</p> : item.isCompleted ?
                  <p className='text-green-400 text-xs font-medium'>Completed</p> :
                  <img onClick={() => appointmentCancel(item._id)} className='w-10 cursor-pointer' src={assets.cancel_icon} />}
            </div>
          ))
        }
      </div>


    </div>
  );
}

export default Dashboard;
