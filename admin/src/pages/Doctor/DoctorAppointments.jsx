import React, { useContext, useEffect } from 'react';
import { DoctorContext } from '../../context/DoctorContext';
import { AppContext } from '../../context/AppContext';
import { assets } from '../../assets/assets';

function DoctorAppointments() {

  const {
    dToken,
    appointments,
    getAppointments,
    completeAppointment,
    cancelAppointment
  } = useContext(DoctorContext);

  const { calculateAge, slotDateFormate, currency } = useContext(AppContext);

  useEffect(() => {
    if (dToken) {
      getAppointments();
    }
  }, [dToken]);


  const appointmentList = Array.isArray(appointments)
    ? appointments
    : appointments?.appointments || appointments?.data || [];

  return (
    <div className='w-full max-w-6xl m-5'>
      <p className='mb-3 text-lg font-medium'>All Appointments</p>

      <div className='bg-white border rounded text-sm max-h-[80vh] min-h-[50vh] overflow-y-scroll'>

        {/* HEADER */}
        <div className='max-sm:hidden grid grid-cols-[0.5fr_2fr_1fr_1fr_3fr_1fr_1fr] gap-1 py-3 px-6 border-b'>
          <p>#</p>
          <p>Patient</p>
          <p>Payment</p>
          <p>Age</p>
          <p>Date & Time</p>
          <p>Fees</p>
          <p>Action</p>
        </div>

        {/* LIST */}
        {
          appointmentList.length > 0 ? (
            appointmentList.slice().reverse().map((item, index) => (

                <div
                  key={index}
                  className='flex flex-wrap justify-between max-sm:gap-5 max-sm:text-base sm:grid grid-cols-[0.5fr_2fr_1fr_1fr_3fr_1fr_1fr] gap-1 items-center text-gray-500 py-3 px-6 border-b hover:bg-gray-50'
                >

                  <p className='max-sm:hidden'>{index + 1}</p>

                  {/* PATIENT */}
                  <div className='flex items-center gap-2'>
                    <img
                      src={item?.userData?.image}
                      alt=''
                      className='w-8 h-8 rounded-full object-cover'
                    />
                    <p>{item?.userData?.name}</p>
                  </div>

                  {/* PAYMENT */}
                  <div>
                    <p className='text-xs inline border border-blue-600 px-2 rounded-full'>
                      {item?.payment ? 'online' : 'cash'}
                    </p>
                  </div>

                  {/* AGE */}
                  <p className='max-sm:hidden'>
                    {item?.userData?.dob && calculateAge(item.userData.dob)}
                  </p>

                  {/* DATE */}
                  <p>
                    {slotDateFormate(item?.slotDate)}, {item?.slotTime}
                  </p>

                  {/* FEES */}
                  <p>{currency}{item?.amount}</p>

                  {/* ACTION */}
                  {
                    item?.cancelled ? (
                      <p className='text-red-400 text-xs font-medium'>cancelled</p>
                    ) : item?.isCompleted ? (
                      <p className='text-green-500 text-xs font-medium'>completed</p>
                    ) : (
                      <div className='flex'>
                        <img
                          onClick={() => cancelAppointment(item._id)}
                          src={assets.cancel_icon}
                          alt=''
                          className='w-10 cursor-pointer'
                        />

                        <img
                          onClick={() => completeAppointment(item._id)}
                          src={assets.tick_icon}
                          alt=''
                          className='w-10 cursor-pointer'
                        />
                      </div>
                    )
                  }

                </div>
              ))
          ) : (
            <p className='p-5 text-gray-500'>No Appointments Found</p>
          )
        }

      </div>
    </div>
  );
}

export default DoctorAppointments;