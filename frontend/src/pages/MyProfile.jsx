import React, { useContext, useState } from 'react';
import { AppContext } from '../context/AppContext';
import { assets } from '../assets/assets';
import axios from 'axios';
import { toast } from 'react-toastify';

const MyProfile = () => {

  const { userData, setUserData, token, backendUrl, loadUserProfileData } = useContext(AppContext);

  const [isEdit, setIsEdit] = useState(false);
  const [image, setImage] = useState(false);

  // UPDATE PROFILE
  const updateProfileData = async () => {
    try {
      const formData = new FormData();

      formData.append('name', userData.name);
      formData.append('phone', userData.phone);
      formData.append('gender', userData.gender);
      formData.append(
        'dob',
        userData.dob && userData.dob !== "Not Selected" ? userData.dob : ''
      );

      formData.append('address', JSON.stringify(userData.address));

      if (image) {
        formData.append('image', image);
      }

      const { data } = await axios.post(
        backendUrl + '/api/user/update-profile',
        formData,
        { headers: { token } }
      );

      if (data.success) {
        toast.success(data.message);
        await loadUserProfileData();
        setIsEdit(false);
        setImage(false);
      } else {
        toast.error(data.message);
      }

    } catch (error) {
      console.log(error);
      toast.error("Failed to update profile");
    }
  };

  if (!userData) return <p>Loading...</p>;

  return (
    <div className='max-w-lg flex flex-col gap-2 text-sm'>

      {/* IMAGE */}
      {
        isEdit ? (
          <label htmlFor="image">
            <div className='inline-block relative cursor-pointer'>
              <img
                src={
                  image
                    ? URL.createObjectURL(image)
                    : userData?.image || "https://cdn-icons-png.flaticon.com/512/149/149071.png"
                }
                alt=""
                className='w-48 h-48 rounded-full opacity-75  object-cover'
              />
              {!image && (
                <img
                  src={assets.upload_icon}
                  alt=""
                  className='w-10 absolute bottom-12 right-12'
                />
              )}
            </div>
            <input
              onChange={e => setImage(e.target.files[0])}
              type="file"
              id="image"
              hidden
            />
          </label>
        ) : (
          <img
            src={userData?.image || "https://cdn-icons-png.flaticon.com/512/149/149071.png"}
            alt="profile"
            className='w-36 rounded'
          />
        )
      }

      {/* NAME */}
      {
        isEdit ? (
          <input
            className='bg-gray-100 text-3xl font-medium max-w-60 mt-4 text-black'
            type='text'
            value={userData?.name || ''}
            onChange={e =>
              setUserData(prev => ({ ...prev, name: e.target.value }))
            }
          />
        ) : (
          <p className='font-medium text-3xl text-neutral-800 mt-4'>
            {userData?.name}
          </p>
        )
      }

      <hr className='bg-zinc-400 h-[1px] border-none' />

      {/* CONTACT INFO */}
      <div>
        <p className='text-neutral-500 underline mt-3'>CONTACT INFORMATION</p>

        <div className='grid grid-cols-[1fr_3fr] gap-y-2.5 mt-3 text-neutral-700'>

          <p className='font-medium'>Email:</p>
          <p className='text-blue-500'>{userData?.email}</p>

          <p className='font-medium'>Phone:</p>
          {
            isEdit ? (
              <input
                type='text'
                className='bg-gray-100 max-w-52 text-black'
                value={userData?.phone || ''}
                onChange={e =>
                  setUserData(prev => ({ ...prev, phone: e.target.value }))
                }
              />
            ) : (
              <p className='text-blue-400'>{userData?.phone}</p>
            )
          }

          <p className='font-medium'>Address:</p>
          {
            isEdit ? (
              <div>
                <input
                  className='bg-gray-100 text-black w-full'
                  type="text"
                  placeholder="Line 1"
                  value={userData?.address?.line1 || ''}
                  onChange={e =>
                    setUserData(prev => ({
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
                  className='bg-gray-100 text-black w-full mt-1'
                  type="text"
                
                  value={userData?.address?.line2 || ''}
                  onChange={e =>
                    setUserData(prev => ({
                      ...prev,
                      address: {
                        ...prev.address,
                        line2: e.target.value
                      }
                    }))
                  }
                />
              </div>
            ) : (
              <p className='text-gray-500'>
                {userData?.address?.line1}
                <br />
                {userData?.address?.line2}
              </p>
            )
          }

        </div>
      </div>

      {/* BASIC INFO */}
      <div>
        <p className='text-neutral-500 underline mt-3'>BASIC INFORMATION</p>

        <div className='grid grid-cols-[1fr_3fr] gap-y-2.5 mt-3 text-neutral-700'>

          <p className='font-medium'>Gender:</p>
          {
            isEdit ? (
              <select
                className='max-w-24 bg-gray-100 text-black'
                value={userData?.gender || ''}
                onChange={e =>
                  setUserData(prev => ({ ...prev, gender: e.target.value }))
                }
              >
                <option value='Male'>Male</option>
                <option value='Female'>Female</option>
              </select>
            ) : (
              <p>{userData?.gender}</p>
            )
          }

          <p className='font-medium'>Birthday:</p>
          {
            isEdit ? (
              <input
                className='max-w-32 bg-gray-100 text-black'
                type="date"
                value={
                  userData?.dob && userData.dob !== "Not Selected"
                    ? userData.dob
                    : ''
                }
                onChange={e =>
                  setUserData(prev => ({ ...prev, dob: e.target.value }))
                }
              />
            ) : (
              <p className='text-gray-400'>
                {userData?.dob && userData.dob !== "Not Selected"
                  ? userData.dob
                  : 'Not Selected'}
              </p>
            )
          }

        </div>
      </div>

      {/* BUTTON */}
      <div className='mt-10'>
        <button
          className='border border-blue-600 px-8 py-2 rounded-full hover:bg-blue-600 hover:text-white transition-all'
          onClick={isEdit ? updateProfileData : () => setIsEdit(true)}
        >
          {isEdit ? "Save Information" : "Edit"}
        </button>
      </div>

    </div>
  );
};

export default MyProfile;