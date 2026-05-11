import React, { useContext, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { AppContext } from '../context/AppContext';
import { assets } from '../assets/assets';
import RelatedDoctors from '../components/RelatedDoctors';
import { toast } from 'react-toastify';
import axios from 'axios';

const Appointment = () => {

  const { docId } = useParams();
  const { doctors, currencySymbol, backendUrl, token, getDoctorsData } = useContext(AppContext);

  const dayOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const navigate = useNavigate();

  const [docInfo, setDocInfo] = useState(null);
  const [docSlots, setDocSlots] = useState([]);
  const [slotIndex, setSlotIndex] = useState(0);
  const [slotTime, setSlotTime] = useState('');

  // Fetch doctor info from context
  const fetchDocInfo = async () => {
    const doc = doctors.find(doc => doc._id === docId);
    setDocInfo(doc);
  };

  // Generate available slots for 7 days
  const getAvailableSlots = async () => {
    if (!docInfo) return;
    setDocSlots([]);

    const today = new Date();

    for (let i = 0; i <= 7; i++) {
      const currentDate = new Date(today);
      currentDate.setDate(today.getDate() + i);

      const endTime = new Date(currentDate);
      endTime.setHours(21, 0, 0, 0); // 9:00 PM

      if (i === 0) {
        if (today.getHours() >= 21) continue;
        currentDate.setHours(today.getHours() + 1);
        currentDate.setMinutes(today.getMinutes() > 30 ? 30 : 0);
      } else {
        currentDate.setHours(10, 0, 0, 0); // start from 10:00 AM
      }

      const timeSlots = [];

      while (currentDate < endTime) {
        const formattedTime = currentDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

        const day = String(currentDate.getDate()).padStart(2, '0');
        const month = String(currentDate.getMonth() + 1).padStart(2, '0');
        const year = currentDate.getFullYear();

        const slotDate = `${day}_${month}_${year}`;
        const bookedSlots = docInfo.slots_booked?.[slotDate] || [];
        const isSlotAvailable = !bookedSlots.includes(formattedTime);

        // Only push available slots, no duplicates
        if (isSlotAvailable && !timeSlots.some(slot => slot.time === formattedTime)) {
          timeSlots.push({
            datetime: new Date(currentDate),
            time: formattedTime
          });
        }

        currentDate.setMinutes(currentDate.getMinutes() + 30); // increment 30 min
      }

      if (timeSlots.length) {
        setDocSlots(prev => ([...prev, timeSlots]));
      }
    }
  };

  // Book selected appointment
  const bookAppointment = async () => {
    if (!token) {
      toast.warn("Please login to book an appointment");
      return navigate('/login');
    }

    try {
      const date = docSlots[slotIndex][0].datetime;
      const day = String(date.getDate()).padStart(2, '0');
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const year = date.getFullYear();
      const slotDate = `${day}_${month}_${year}`;

      const { data } = await axios.post(
        backendUrl + '/api/user/book-appointment',
        { docId, slotDate, slotTime },
        { headers: { token } }
      );

      if (data.success) {
        toast.success(data.message);
        getDoctorsData();
        navigate('/my-appointments');
      } else {
        toast.error(data.message);
      }

    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  useEffect(() => { fetchDocInfo(); }, [doctors, docId]);
  useEffect(() => { getAvailableSlots(); }, [docInfo]);

  return docInfo && (
    <div>
      {/* Doctor Details */}
      <div className='flex flex-col sm:flex-row gap-4'>
        <div>
          <img className='bg-blue-600 w-full sm:max-w-72 rounded-lg' src={docInfo.image} alt="" />
        </div>
        <div className='flex-1 border border-gray-400 rounded-lg p-8 py-7 bg-white mx-2 sm:mx-0 mt-[-80px] sm:mt-0'>
          <p>
            {docInfo.name} <img className='w-5' src={assets.verified_icon} />
          </p>
          <div className='flex item-center gap-2 text-sm mt-1 text-gray-600'>
            <p>{docInfo.degree}-{docInfo.speciality}</p>
            <button className='py-0.5 px-2 border text-xs rounded-full'>{docInfo.experience}</button>
          </div>
          <div>
            <p className='flex items-center gap-1 text-sm font-medium text-gray-900 mt-3'>About <img src={assets.info_icon} /></p>
            <p className='text-sm text-gray-500 max-w-[700px] mt-1'>{docInfo.about}</p>
          </div>
          <p className='text-gray-500 font medium mt-4'>
            Appointment fee: <span className='text-gray-900'>{currencySymbol}{docInfo.fees}</span>
          </p>
        </div>
      </div>

      {/* Booking Slots */}
      <div className='sm:ml-72 sm:pl-4 font-medium text-gray-700 mt-3'>
        <p>Booking Slots</p>

        {/* Day selector */}
        <div className='flex gap-3 items-center w-full overflow-x-scroll no-scrollbar mt-4'>
          {docSlots.length && docSlots.map((daySlots, index) => (
            <div onClick={() => setSlotIndex(index)} key={index} className={`text-center py-6 min-w-16 rounded-full cursor-pointer ${slotIndex === index ? 'bg-blue-600 text-white' : 'border border-gray-200'}`}>
              <p>{daySlots[0] && dayOfWeek[daySlots[0].datetime.getDay()]}</p>
              <p>{daySlots[0] && daySlots[0].datetime.getDate()}</p>
            </div>
          ))}
        </div>

        {/* Time slots */}
        <div className='flex items-center gap-3 w-full overflow-x-scroll mt-4'>
          {docSlots.length && docSlots[slotIndex]?.map((slot, idx) => (
            <p onClick={() => setSlotTime(slot.time)} key={idx} className={`text-sm font-light flex-shrink-0 px-5 py-2 rounded-full cursor-pointer ${slot.time === slotTime ? 'bg-blue-600 text-white' : 'text-gray-400 border border-gray-300'}`}>
              {slot.time.toLowerCase()}
            </p>
          ))}
        </div>

        <button onClick={bookAppointment} className='bg-blue-600 text-white text-sm font-light px-14 py-3 rounded-full my-6'>
          Book an appointment
        </button>
      </div>

      {/* Related Doctors */}
      <RelatedDoctors speciality={docInfo.speciality} docId={docId} />
    </div>
  );
};

export default Appointment;