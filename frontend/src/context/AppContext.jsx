import { createContext, useEffect, useState } from "react";
import axios from 'axios';
import { toast } from 'react-toastify';

export const AppContext = createContext();

const AppContextProvider = ({ children }) => {

  const currencySymbol = '$';
  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  const [doctors, setDoctors] = useState([]);

  const [token, setToken] = useState(
    localStorage.getItem('token') || false
  );


  const [userData, setUserData] = useState(() => {
    try {
      const storedData = localStorage.getItem('userData');
      return storedData && storedData !== "undefined"
        ? JSON.parse(storedData)
        : null;
    } catch (error) {
      console.log("JSON Parse Error:", error);
      return null;
    }
  });


  const getDoctorsData = async () => {
    try {
      const { data } = await axios.get(`${backendUrl}/api/doctor/list`);
      if (data.success) {
        setDoctors(data.doctors);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  // Load User Profile
  const loadUserProfileData = async () => {
    try {
      const { data } = await axios.get(
        `${backendUrl}/api/user/get-profile`,
        { headers: { token } }
      );

      if (data.success && data.userData) {
        setUserData(data.userData);
        localStorage.setItem('userData', JSON.stringify(data.userData));
      } else {
        toast.error(data.message);
      }

    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  useEffect(() => {
    getDoctorsData();
  }, []);

  //Token change
  useEffect(() => {
    if (token) {
      loadUserProfileData();
    } else {
      setUserData(null);
      localStorage.removeItem('userData');
    }
  }, [token]);

  const value = {
    doctors,
    getDoctorsData,
    currencySymbol,
    token,
    setToken,
    backendUrl,
    userData,
    setUserData,
    loadUserProfileData
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
};

export default AppContextProvider;