import React, { useContext, useEffect, useState } from 'react';
import { DoctorContext } from '../../context/DoctorContext';
import { AppContext } from '../../context/AppContext';
import axios from 'axios';
import { toast } from 'react-toastify';

function DoctorProfile() {

  const { dToken, profileData, setProfileData, getProfileData, backendUrl } = useContext(DoctorContext);
  const { currency } = useContext(AppContext);
  const [isEdit, setIsEdit] = useState(false);

  
  useEffect(() => {
    if (dToken) {
      getProfileData();
    }
  }, [dToken]);

  //  Update profile
  const updateProfile = async () => {
    try {
      const updateData = {
        address: profileData.address,
        fees: profileData.fees,
        available: profileData.available
      };

      const { data } = await axios.put(
        backendUrl + '/api/doctor/update-profile',
        updateData,
        {
          headers: { dtoken: dToken }
        }
      );

      if (data.success) {
        toast.success(data.message);
        setIsEdit(false);
        getProfileData();
      } else {
        toast.error(data.message);
      }

    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

 
  if (!profileData) {
    return <p className='p-5'>Loading...</p>;
  }

  return (
    <div className='m-5'>
      <div className='flex flex-col gap-4'>

        {/* Image */}
        <img
          className='bg-blue-400 w-full sm:max-w-64 rounded-lg'
          src={profileData.image}
          alt=""
        />

        {/* Info Card */}
        <div className='border rounded-lg p-6 bg-white'>

          <p className='text-3xl font-medium text-gray-700'>
            {profileData.name}
          </p>

          <div className='flex items-center gap-2 mt-1 text-gray-600'>
            <p>{profileData.degree} - {profileData.speciality}</p>
            <span className='px-2 border rounded-full text-xs'>
              {profileData.experience}
            </span>
          </div>

          {/* About */}
          <div className='mt-3'>
            <p className='font-medium'>About:</p>
            <p className='text-sm text-gray-600 mt-1'>
              {profileData.about}
            </p>
          </div>

          {/* Fees */}
          <p className='mt-4 font-medium'>
            Appointment Fee: {currency}{' '}
            {isEdit ? (
              <input
                type="number"
                value={profileData.fees}
                onChange={(e) =>
                  setProfileData(prev => ({
                    ...prev,
                    fees: e.target.value
                  }))
                }
              />
            ) : (
              profileData.fees
            )}
          </p>

          {/* Address */}
          <div className='mt-3'>
            <p>Address:</p>

            {isEdit ? (
              <>
                <input
                  type="text"
                  value={profileData.address?.line1 || ''}
                  onChange={(e) =>
                    setProfileData(prev => ({
                      ...prev,
                      address: {
                        ...prev.address,
                        line1: e.target.value
                      }
                    }))
                  }
                />
                <br />
                <input
                  type="text"
                  value={profileData.address?.line2 || ''}
                  onChange={(e) =>
                    setProfileData(prev => ({
                      ...prev,
                      address: {
                        ...prev.address,
                        line2: e.target.value
                      }
                    }))
                  }
                />
              </>
            ) : (
              <p className='text-sm'>
                {profileData.address?.line1} <br />
                {profileData.address?.line2}
              </p>
            )}
          </div>

          {/* Availability */}
          <div className='flex items-center gap-2 mt-3'>
            <input
              type="checkbox"
              checked={profileData.available}
              onChange={() =>
                isEdit &&
                setProfileData(prev => ({
                  ...prev,
                  available: !prev.available
                }))
              }
            />
            <label>Available</label>
          </div>

          {/* Buttons */}
          {isEdit ? (
            <button
              onClick={updateProfile}
              className='mt-5 px-4 py-1 border border-blue-600 rounded-full'
            >
              Save
            </button>
          ) : (
            <button
              onClick={() => setIsEdit(true)}
              className='mt-5 px-4 py-1 border border-blue-600 rounded-full'
            >
              Edit
            </button>
          )}

        </div>
      </div>
    </div>
  );
}

export default DoctorProfile;