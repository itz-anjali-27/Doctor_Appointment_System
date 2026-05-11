import { createContext, useState } from "react";
import { toast } from 'react-toastify'
import axios from 'axios'


export const AdminContext = createContext();

const AdminContextProvider = ({ children }) => {
  const [aToken, setAToken] = useState(localStorage.getItem('aToken') ? localStorage.getItem('aToken') : '');
  const [doctors, setDoctors] = useState([])
  const [appointments, setAppointments] = useState([])
  const [dashData, setDashData] = useState(false)

  // Env fallback added
  const backendUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";

  const getAllDoctors = async () => {
    try {
      const { data } = await axios.post(backendUrl + '/api/admin/all-doctors', {}, { headers: { aToken: aToken } })
      if (data.success) {
        setDoctors(data.doctors)
        console.log(data.doctors)
      }
      else {
        toast.error(data.message)
      }
    } catch (error) {
      toast.error(error.message)
    }
  }

  const changeAvailability = async (docId) => {
    try {
      const { data } = await axios.post(backendUrl + '/api/admin/change-availability', { docId }, { headers: { aToken: aToken } })
      if (data.success) {
        toast.success(data.message)
        getAllDoctors()
      }
      else {
        toast.error(data.message)
      }
    } catch (error) {
      toast.error(error.message)
    }
  }


  const getAllAppointments = async () => {
    try {
      const { data } = await axios.get(backendUrl + '/api/admin/appointments', { headers: { aToken: aToken } })
      if (data.success) {
        setAppointments(data.appointments)
        console.log(data.appointments)
      }
      else {
        toast.error(data.message)
      }
    } catch (error) {
      toast.error(error.message)
    }
  }


  const appointmentCancel = async (appointmentId) => {
    try {
      const { data } = await axios.post(backendUrl + '/api/admin/cancel-appointment', { appointmentId }, { headers: { aToken: aToken } })
      if (data.success) {
        toast.success(data.message)
        getAllAppointments()
      }
      else {
        toast.error(data.message)
      }
    } catch (error) {
      toast.error(error.message)
    }
  }

  const getDashData = async () => {
    try {
      const { data } = await axios.get(backendUrl + '/api/admin/dashboard', { headers: { aToken: aToken } })
      if (data.success) {
        setDashData(data.data)
        console.log(data)
      }
      else {
        toast.error(data.message)
      }
    } catch (error) {
      toast.error(error.message)
    }
  }

  const value = {
    aToken,
    setAToken,
    backendUrl,
    doctors,
    getAllDoctors,
    changeAvailability,
    appointments, setAppointments,
    getAllAppointments,
    appointmentCancel, dashData, getDashData
  };

  return (
    <AdminContext.Provider value={value}>{children}</AdminContext.Provider>
  )
};

export default AdminContextProvider;