import axios from "axios";
import { useState } from "react";
import { createContext } from "react";
import { toast } from "react-toastify";


export const DoctorContext = createContext();

const DoctorContextProvider = ({ children }) => {

  const backendUrl = import.meta.env.VITE_BACKEND_URL

  const [dToken, setDToken] = useState(localStorage.getItem("dToken")? localStorage.getItem("dToken") : null);
  const [appointments, setAppointments] = useState([]);
  const [dashData, setDashData] = useState({});
  const [profileData, setProfileData] = useState(false)

  const getAppointments = async() => {
    try {
      const {data} = await axios.get(`${backendUrl}/api/doctor/appointments`,{
        headers:{
          dToken:dToken 
        }
      })  
      if(data.success){
        toast.success(data.message)
        setAppointments(data.appointments)
        console.log("Appointments fetched successfully:", data.appointments);
      }else{
        console.log("Error fetching appointments:", data.message);
        toast.error(data.message)
      }

    

    }
    catch(error){
      console.log("Error fetching appointments:", error);
    }
  }

  const completeAppointment = async(appointmentId) => {
    try{
      const {data} = await axios.post(`${backendUrl}/api/doctor/complete-appointment`,{appointmentId},{
        headers:{
          dToken:dToken
        }
      })

      if(data.success){
        toast.success(data.message)
        getAppointments()
      }else{
        toast.error(data.message)
      }

    }catch(error){
      console.log(error);
      toast.error(error.message)
    }
  }

  const cancelAppointment = async(appointmentId) => {
    try{
      const {data} = await axios.post(`${backendUrl}/api/doctor/cancel-appointment`,{appointmentId},{
        headers:{
          dToken:dToken
        }
      })

      if(data.success){
        toast.success(data.message)
        getAppointments()
      }else{
        toast.error(data.message)
      }

    }catch(error){
      console.log(error);
      toast.error(error.message)
    }
  }



  const getDashData = async() => {
    try{
      const {data} = await axios.get(`${backendUrl}/api/doctor/dashboard`,{ 
        headers:{
          dToken:dToken
        }
      })
      if(data.success){
        setDashData(data.dashData)
      }else{
        toast.error(data.message)
      }
    }catch(error){
      console.log(error);
      toast.error(error.message)
    } 
  }



  const getProfileData = async() => {
    try{
      const {data} = await axios.get(`${backendUrl}/api/doctor/profile`,{ 
        headers:{
          dToken:dToken
        }
      })

      console.log("PROFILE RESPONSE ", data);
      if(data.success){
        setProfileData(data.profile)
      } 
      else{
        toast.error(data.message)
      }
    }catch(error){
      console.log(error);
      toast.error(error.message)
    }
  }



  const value = {
    // state or functions
    dToken, setDToken, backendUrl,
    getAppointments, appointments,setAppointments,
    completeAppointment, cancelAppointment,
    getDashData, dashData,setDashData,profileData,getProfileData,
    setProfileData
  };

  return (
    <DoctorContext.Provider value={value}>
      {children}
    </DoctorContext.Provider>
  );
};

export default DoctorContextProvider;