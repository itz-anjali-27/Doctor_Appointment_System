import React, { useContext, useEffect } from 'react';
import { DoctorContext } from '../../context/DoctorContext';
import { AppContext } from '../../context/AppContext';
import { assets } from '../../assets/assets.js';

function DoctorDashboard() {

  const {
    dToken,
    dashData,
    setDashData,
    getDashData,
    completeAppointment,
    cancelAppointment
  } = useContext(DoctorContext);

  const { currency, slotDateFormate } = useContext(AppContext);

  // Fetch dashboard data
  useEffect(() => {
    if (dToken) {
      getDashData();
    }
  }, [dToken]);

  // Loading state
  if (!dashData) {
    return <p className="p-5">Loading...</p>;
  }

  return (
    <div className='m-5'>

      {/* Cards Section */}
      <div className='flex flex-wrap gap-3'>

        {/* Earnings */}
        <div className='flex items-center gap-2 bg-white p-4 min-w-52 rounded border-2 border-gray-100 hover:scale-105 transition-all'>
          <img className='w-14' src={assets.earning_icon} alt="" />
          <div>
            <p className='text-xl font-semibold text-gray-600'>
              {currency} {dashData?.earnings ?? 0}
            </p>
            <p>Earnings</p>
          </div>
        </div>

        {/* Appointments */}
        <div className='flex items-center gap-2 bg-white p-4 min-w-52 rounded border-2 border-gray-100 hover:scale-105 transition-all'>
          <img className='w-14' src={assets.appointments_icon} alt="" />
          <div>
            <p className='text-xl font-semibold text-gray-600'>
              {dashData?.appointments ?? 0}
            </p>
            <p>Appointments</p>
          </div>
        </div>

        {/* Patients */}
        <div className='flex items-center gap-2 bg-white p-4 min-w-52 rounded border-2 border-gray-100 hover:scale-105 transition-all'>
          <img className='w-14' src={assets.patients_icon} alt="" />
          <div>
            <p className='text-xl font-semibold text-gray-600'>
              {dashData?.patients ?? 0}
            </p>
            <p>Patients</p>
          </div>
        </div>

      </div>

      {/* Latest Bookings Header */}
      <div className='bg-white mt-10'>
        <div className='flex items-center gap-2.5 px-4 py-3 border rounded-t'>
          <img src={assets.list_icon} alt="" />
          <p className='font-semibold'>Latest Bookings</p>
        </div>
      </div>

      {/* Latest Appointments List */}
      <div className='border border-t-0'>

        {
          dashData?.latestAppointments?.length > 0 ? (

            dashData.latestAppointments.map((item, index) => (

              <div key={index} className='flex items-center gap-3 bg-gray-100 p-4 border-b'>

                <img
                  className='w-10 rounded-full'
                  src={item?.userData?.image}
                  alt=""
                />

                <div className='flex-1 text-sm'>
                  <p className='text-gray-800'>{item?.userData?.name}</p>
                  <p className='text-gray-500'>
                    {slotDateFormate(item?.slotDate)} at {item?.slotTime}
                  </p>
                </div>

                {/* Status / Actions */}
                {
                  item?.cancelled ? (
                    <p className='text-red-400 text-xs font-medium'>Cancelled</p>
                  ) : item?.isCompleted ? (
                    <p className='text-green-500 text-xs font-medium'>Completed</p>
                  ) : (
                    <div className='flex gap-2'>
                      <img
                        onClick={() => cancelAppointment(item._id)}
                        src={assets.cancel_icon}
                        alt=""
                        className='w-8 cursor-pointer'
                      />
                      <img
                        onClick={() => completeAppointment(item._id)}
                        src={assets.tick_icon}
                        alt=""
                        className='w-8 cursor-pointer'
                      />
                    </div>
                  )
                }

              </div>

            ))

          ) : (
            <p className='p-4 text-gray-500'>No Appointments Found</p>
          )
        }

      </div>

    </div>
  );
}

export default DoctorDashboard;