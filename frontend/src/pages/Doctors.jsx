import React, { useContext, useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AppContext } from '../context/AppContext';

const Doctors = () => {

  const { speciality } = useParams();
  const navigate = useNavigate();
  const { doctors } = useContext(AppContext);
  const [filteredDoctors, setFilteredDoctors] = useState([]);
  const [showFilter, setShowFilter] = useState(false);

  const applyFilter = () => {
    if (speciality) {
      setFilteredDoctors(doctors.filter(doctor => doctor.speciality === speciality));
    } else {
      setFilteredDoctors(doctors);
    }
  }

  useEffect(() => {
    applyFilter();
  }, [speciality, doctors]);

  return (
    <div>
      <p className='text-gray-600'>Browse through the doctors specialist.</p>
      <div className='flex flex-col sm:flex-row items-start gap-5 mt-5'>
        <div className={`py-1 px-3 border rounded text-sm transition-all sm:hidden ${showFilter ? 'bg-blue-600 text-white' : ''}`} onClick={() => setShowFilter(prev => !prev)}>Filters</div>
        <div className={`flex flex-col gap-4 text-sm text-gray-600 ${showFilter ? 'flex' : 'hidden sm:flex'}`}>
          <p onClick={() => speciality === 'General physician' ? navigate('/doctors') : navigate('/doctors/General physician')} className={`w-[94vw] sm:w-auto pl-3 py-1.5 pr-16 border border-gray-300 rounded transition-all cursor-pointer ${speciality === 'General physician'
            ? 'bg-blue-100 text-gray border-blue-400' : 'border-gray-300 hover:bg-blue-100 hover:text-blue-600'}`}>General  physician</p>

          <p onClick={() => speciality === 'Gynecologist' ? navigate('/doctors') : navigate('/doctors/Gynecologist')} className={`w-[94vw] sm:w-auto pl-3 py-1.5 pr-16 border border-gray-300 rounded transition-all cursor-pointer ${speciality === 'Gynecologist'
            ? 'bg-blue-100 text-gray border-blue-400'
            : 'border-gray-300 hover:bg-blue-100 hover:text-blue-600'}`}>Gynecologist</p>

          <p onClick={() => speciality === 'Dermatologist' ? navigate('/doctors') : navigate('/doctors/Dermatologist')} className={`w-[94vw] sm:w-auto pl-3 py-1.5 pr-16 border border-gray-300 rounded transition-all cursor-pointer ${speciality === 'Dermatologist'
            ? 'bg-blue-100 text-gray border-blue-400'
            : 'border-gray-300 hover:bg-blue-100 hover:text-blue-600'}`}>Dermatologist</p>

          <p onClick={() => speciality === 'Neurologist' ? navigate('/doctors') : navigate('/doctors/Neurologist')} className={`w-[94vw] sm:w-auto pl-3 py-1.5 pr-16 border border-gray-300 rounded transition-all cursor-pointer ${speciality === 'Neurologist'
            ? 'bg-blue-100 text-gray border-blue-400'
            : 'border-gray-300 hover:bg-blue-100 hover:text-blue-600'}`}>Neurologist</p>

          <p onClick={() => speciality === 'Gastroenterologist' ? navigate('/doctors') : navigate('/doctors/Gastroenterologist')} className={`w-[94vw] sm:w-auto pl-3 py-1.5 pr-16 border border-gray-300 rounded transition-all cursor-pointer ${speciality === 'Gastroenterologist'
            ? 'bg-blue-100 text-gray border-blue-400'
            : 'border-gray-300 hover:bg-blue-100 hover:text-blue-600'}`}>Gastroenterologist</p>

          <p onClick={() => speciality === 'Pediatricians' ? navigate('/doctors') : navigate('/doctors/Pediatricians')} className={`w-[94vw] sm:w-auto pl-3 py-1.5 pr-16 border border-gray-300 rounded transition-all cursor-pointer ${speciality === 'Pediatricians'
            ? 'bg-blue-100 text-gray border-blue-400'
            : 'border-gray-300 hover:bg-blue-100 hover:text-blue-600'}`}>Pediatrician</p>
        </div>

        <div className='w-full grid grid-cols-[repeat(auto-fit,minmax(200px,1fr))] gap-4 gap-y-6 px-3 sm:px-0'>

          {filteredDoctors.map((doctor, index) => (
            <div onClick={() => navigate(`/appointment/${doctor._id}`)} className='border border-blue-200 rounded-xl overflow-hidden cursor-pointer hover:translate-y-[-10px] transition-all duration-500' key={index}>
              <img src={doctor.image} alt={doctor.name} className='bg-blue-50 w-full' />
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

      </div>


    </div>
  );
}

export default Doctors;
