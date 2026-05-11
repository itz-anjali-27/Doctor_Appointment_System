import React, { useContext, useState } from 'react';
import { assets } from '../../assets/assets';
import { AdminContext } from '../../context/AdminContext'
import { toast } from 'react-toastify'
import axios from 'axios'

function AddDoctor() {
  const [docImg, setDocImg] = useState(false)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [experience, setExperience] = useState('1 Year')
  const [fees, setFees] = useState('')
  const [speciality, setSpeciality] = useState('General physician')
  const [degree, setDegree] = useState('')
  const [address1, setAddress1] = useState('')
  const [address2, setAddress2] = useState('')
  const [about, setAbout] = useState('')
  const { backendUrl, aToken } = useContext(AdminContext)

  const onSubmitHandler = async (event) => {
    event.preventDefault()

    const loadingToast = toast.loading("Adding doctor...");
    try {
      if (!docImg) {
        return toast.error("Image Not Selected")
      }

      const formData = new FormData()

      formData.append('image', docImg)
      formData.append('name', name)
      formData.append('email', email)
      formData.append('password', password)
      formData.append('experience', experience)
      formData.append('fees', Number(fees))
      formData.append('about', about)
      formData.append('speciality', speciality)
      formData.append('degree', degree)
      formData.append('address', JSON.stringify({ line1: address1, line2: address2 }))


      formData.forEach((value, key) => {
        console.log(`${key}:${value}`)

      });

      const { data } = await axios.post(backendUrl + '/api/admin/add-doctor', formData, { headers: { aToken: aToken } })

      toast.dismiss(loadingToast);
      if (data.success) {
        toast.success(data.message)
        setDocImg(false)
        setName('')
        setPassword('')
        setEmail('')
        setAddress1('')
        setAddress2('')
        setDegree('')
        setAbout('')
        setFees('')

      }
      else {
        toast.error(data.message)
      }


    } catch (err) {
      toast.error(err.message)
      console.log(err)
    }
  }

  return (
    <form onSubmit={onSubmitHandler} className='m-5 w-full'>
      <p className='mb-3 text-lg font-medium'>Add Doctor</p>

      <div className='bg-white px-8 py-8 border rounded w-full max-w-4xl max-h-[80vh] overflow-y-scroll'>

        {/* Upload Section */}
        <div className='flex items-center gap-4 mb-8 text-gray-500'>
          <label htmlFor="doc-img">
            <img
              className='w-16 h-16 bg-gray-100 rounded-full cursor-pointer object-cover'
              src={docImg ? URL.createObjectURL(docImg) : assets.upload_area}
              alt=""
            />
          </label>
          <input onChange={(e) => setDocImg(e.target.files[0])} type="file" id="doc-img" hidden />
          <p>Upload doctor <br /> picture</p>
        </div>

        {/* Form Layout */}
        <div className='flex flex-col lg:flex-row gap-10 text-gray-600'>

          {/* LEFT */}
          <div className='w-full lg:flex-1 flex flex-col gap-4'>

            <div>
              <p className='mb-1'>Doctor Name</p>
              <input
                onChange={(e) => setName(e.target.value)}
                value={name}
                type="text"
                placeholder='Name'
                className='bg-blue-50 border-none outline-none rounded px-4 py-2.5 w-full focus:ring-2 focus:ring-blue-200'
              />
            </div>

            <div>
              <p className='mb-1'>Doctor Email</p>
              <input
                onChange={(e) => setEmail(e.target.value)}
                value={email}
                type="email"
                placeholder='Email'
                className='bg-blue-50 border-none outline-none rounded px-4 py-2.5 w-full focus:ring-2 focus:ring-blue-200'
              />
            </div>

            <div>
              <p className='mb-1'>Doctor Password</p>
              <input
                onChange={(e) => setPassword(e.target.value)}
                value={password}
                type="password"
                placeholder='Password'
                className='bg-blue-50 border-none outline-none rounded px-4 py-2.5 w-full focus:ring-2 focus:ring-blue-200'
              />
            </div>

            <div>
              <p className='mb-1'>Experience</p>
              <select onChange={(e) => setExperience(e.target.value)} value={experience} className='bg-blue-50 border-none outline-none rounded px-4 py-2.5 w-full focus:ring-2 focus:ring-blue-200'>
                <option>1 Year</option>
                <option>2 Year</option>
                <option>3 Year</option>
                <option>4 Year</option>
                <option>5 Year</option>
              </select>
            </div>

            <div>
              <p className='mb-1'>Fees</p>
              <input
                onChange={(e) => setFees(e.target.value)}
                value={fees}
                type="number"
                placeholder='Fees'
                className='bg-blue-50 border-none outline-none rounded px-4 py-2.5 w-full focus:ring-2 focus:ring-blue-200'
              />
            </div>

          </div>

          {/* RIGHT */}
          <div className='w-full lg:flex-1 flex flex-col gap-4'>

            <div>
              <p className='mb-1'>Speciality</p>
              <select onChange={(e) => setSpeciality(e.target.value)} value={speciality} className='bg-blue-50 border-none outline-none rounded px-4 py-2.5 w-full focus:ring-2 focus:ring-blue-200'>
                <option>General physician</option>
                <option>Gynecologist</option>
                <option>Dermatologist</option>
                <option>Pediatricians</option>
                <option>Neurologist</option>
              </select>
            </div>

            <div>
              <p className='mb-1'>Education</p>
              <input
                onChange={(e) => setDegree(e.target.value)}
                value={degree}
                type="text"
                placeholder='Education'
                className='bg-blue-50 border-none outline-none rounded px-4 py-2.5 w-full focus:ring-2 focus:ring-blue-200'
              />
            </div>

            <div>
              <p className='mb-1'>Address</p>
              <input
                onChange={(e) => setAddress1(e.target.value)}
                value={address1}
                type="text"
                placeholder='Address 1'
                className='bg-blue-50 border-none outline-none rounded px-4 py-2.5 w-full mb-2 focus:ring-2 focus:ring-blue-200'
              />
              <input
                onChange={(e) => setAddress2(e.target.value)}
                value={address2}
                type="text"
                placeholder='Address 2'
                className='bg-blue-50 border-none outline-none rounded px-4 py-2.5 w-full focus:ring-2 focus:ring-blue-200'
              />
            </div>

          </div>
        </div>

        {/* About */}
        <div>
          <p className='mt-4 mb-2'>About Doctor</p>
          <textarea
            onChange={(e) => setAbout(e.target.value)}
            value={about}
            rows={5}
            placeholder='Write about doctor'
            className='w-full px-4 pt-2 bg-blue-50 border-none outline-none rounded focus:ring-2 focus:ring-blue-200'
          />
        </div>

        {/* Button */}
        <button type='submit' className='bg-gradient-to-r from-blue-500 to-indigo-500 px-10 py-3 mt-5 text-white rounded-full shadow-md hover:opacity-90'>
          Add Doctor
        </button>

      </div>
    </form>
  );
}

export default AddDoctor;
