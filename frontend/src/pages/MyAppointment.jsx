
import React, { useContext, useState, useEffect } from 'react';
import { AppContext } from '../context/AppContext';
import { toast } from 'react-toastify';
import axios from 'axios';

const MyAppointment = () => {
  const { backendUrl, token ,getDoctorsData} = useContext(AppContext);
  const [appointments, setAppointments] = useState([]);
  const months = ["","Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const slotDateFormate = (slotDate) => {
    const dateArray = slotDate.split("_");
    return dateArray[0] + " " + months[Number(dateArray[1])] + " " + dateArray[2];
  };

  const getUserAppointments = async () => {
    try {
      const { data } = await axios.get(`${backendUrl}/api/user/appointments`, {
        headers: { token },
      });

      if (data.success) {
        setAppointments(data.appointments.reverse());
        console.log('Appointments:', data.appointments);
      }

    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };


  const cancelAppointment =async (appointmentId) => {
    try {
     const {data} = await axios.post(backendUrl + '/api/user/cancel-appointment',{appointmentId},{headers:{token:token}})
     if(data.success){
      toast.success("Appointment Cancelled")
      getUserAppointments() 
      getDoctorsData()
     }else{
      toast.error("Failed to cancel appointment")
     }
    } catch (error) {
      console.log(error);
      toast.error(data.message);
    }
  }

  useEffect(() => {
    if (token) getUserAppointments();
  }, [token]);

  return (
    <div className="p-4">
      <p className="pb-3 mt-5 font-medium text-zinc-700 border-b">My Appointments</p>

      <div>
        {appointments.length ? (
          appointments.map((item, index) => (
            <div
              className="grid grid-cols-[1fr_2fr_1fr] gap-4 sm:flex sm:gap-6 py-2 border-b"
              key={item._id || index}
            >
              <div>
                <img
                  className="w-32 bg-indigo-50"
                  src={item.docData?.image || '/fallback.png'}
                  alt={item.docData?.name || 'Doctor'}
                />
              </div>

              <div className="flex-1 text-sm text-zinc-600">
                <p className="text-neutral-800 font-semibold">{item.docData?.name || 'Unknown'}</p>
                <p>{item.docData?.speciality || 'Speciality not available'}</p>
                <p className="text-zinc-700 font-medium mt-1">Address:</p>
                <p className="text-xs">{item.docData?.address?.line1 || ''}</p>
                <p className="text-xs">{item.docData?.address?.line2 || ''}</p>
                <p className="text-xs mt-1">
                  <span className="text-sm text-zinc-700 font-medium">Date & Time : </span> {slotDateFormate(item.slotDate)} | {item.slotTime}
                </p>
              </div>

              <div className="flex flex-col gap-2 justify-end">
                 {!item.cancelled &&<button className="text-sm text-stone-500 text-center sm:min-w-48 py-2 border rounded hover:bg-blue-600 hover:text-white transition-all duration-300">
                  Pay Online
                </button>}
              {!item.cancelled && <button onClick={() => cancelAppointment(item._id)} className="text-sm text-stone-500 text-center sm:min-w-48 py-2 border rounded hover:bg-red-600 hover:text-white transition-all duration-300">
                  Cancel Appointment
                </button>}
                {item.cancelled && <button className="sm:min-w-48 py-2 border rounded border-red-500 text-red-500 cursor-not-allowed">
                 Appointment Cancelled 
                </button>}
              </div>
            </div>
          ))
        ) : (
          <p className="mt-4 text-zinc-600">No appointments found.</p>
        )}
      </div>
    </div>
  );
};

export default MyAppointment;