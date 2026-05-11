import React from 'react';
import { useContext } from 'react';
import { AdminContext } from '../../context/AdminContext';
import { useEffect } from 'react';
import { AppContext } from '../../context/AppContext';
import { assets } from '../../assets/assets';

function AllAppointment() {

  const { aToken, appointments, getAllAppointments, appointmentCancel } = useContext(AdminContext)
  const { calculateAge, slotDateFormate, currency } = useContext(AppContext)

  useEffect(() => {
    if (aToken) {
      getAllAppointments()
    }
  }, [aToken])

  return (
    <div className='w-full max-w-6xl m-5'>
      <p className='mb-3 text-lg font-medium'>All Appointments</p>

      <div className='bg-white border rounded text-sm overflow-x-auto'>

        {/* Header */}
        <div className='grid grid-cols-[50px_200px_80px_200px_200px_80px_80px] py-3 px-6 border-b bg-gray-100 font-medium'>
          <p>#</p>
          <p>Patient</p>
          <p>Age</p>
          <p>Date & Time</p>
          <p>Doctor</p>
          <p>Fees</p>
          <p>Action</p>
        </div>

        {/* Rows */}
        {
          appointments.map((item, index) => (
            <div
              key={item._id}
              className='grid grid-cols-[50px_200px_80px_200px_200px_80px_80px] items-center py-3 px-6 border-b hover:bg-gray-50'
            >
              <p>{index + 1}</p>

              <div className="flex items-center gap-2">
                <img src={item.userData?.image} className="w-8 h-8 rounded-full" />
                <p>{item.userData?.name}</p>
              </div>

              <p>{calculateAge(item.userData?.dob)}</p>

              <p>{slotDateFormate(item.slotDate)}, {item.slotTime}</p>

              <div className="flex items-center gap-2">
                <img src={item.docData?.image} className="w-8 h-8 rounded-full" />
                <p>{item.docData?.name}</p>
              </div>

              <p>{currency}{item.amount}</p>
              {
                item.cancelled ? <p className='text-red-500 text-xs font-medium'>Cancelled</p> :item.isCompleted?
                <p className='text-green-400 text-xs font-medium'>Completed</p>:

                  <img onClick={() => appointmentCancel(item._id)} className='w-10 cursor-pointer' src={assets.cancel_icon} />}
            </div>
          ))
        }

      </div>
    </div>
  );
}

export default AllAppointment;
