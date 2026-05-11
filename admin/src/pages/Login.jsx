import { assets } from '../assets/assets'
import React, { useContext, useState } from "react";
import { AdminContext } from "../context/AdminContext";
import axios from "axios";
import { toast } from 'react-toastify'
import { DoctorContext } from '../context/DoctorContext';
import { useNavigate } from 'react-router-dom';
const Login = () => {
  const [state, setState] = useState("Admin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const { setAToken, backendUrl } = useContext(AdminContext);
  const { setDToken } = useContext(DoctorContext);

  const onSubmitHandler = async (e) => {
    e.preventDefault();

    try {
      if (state === "Admin") {
        const { data } = await axios.post(`${backendUrl}/api/admin/login`, { email, password });

        if (data.success) {
          setAToken(data.token);
          localStorage.setItem("aToken", data.token);
          console.log("Login successful", data.token);
          navigate('/doctor-dashboard');
          toast.success("Login Successful ");
        } else {
          toast.error(data.message);
        }

      } else {
        const { data } = await axios.post(`${backendUrl}/api/doctor/login`, { email, password });

        if (data.success) {
          setDToken(data.token);
          localStorage.setItem("dToken", data.token);
          console.log("Login successful", data.token);
          navigate('/doctor-dashboard');
          toast.success("Login Successful ");

        } else {
          toast.error(data.message);
        }
      }

    }

    catch (error) {
      console.log("Login error:", error.response?.data || error.message);

      toast.error(error.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <form onSubmit={onSubmitHandler} className="min-h-[80vh] flex items-center">
      <div className="flex flex-col gap-3 m-auto items-start p-8 min-w-[340px] sm:min-w-96 border rounded-xl text-[#5E5E5E] text-sm shadow-lg">
        <p className="text-2xl font-semibold m-auto">
          <span className="text-blue-600">{state}</span> Login
        </p>

        <div className="w-full">
          <p>Email</p>
          <input
            onChange={(e) => setEmail(e.target.value)}
            value={email}
            className="border border-[#DADADA] rounded w-full p-2 mt-1"
            type="email"
            required
          />
        </div>

        <div className="w-full">
          <p>Password</p>
          <input
            onChange={(e) => setPassword(e.target.value)}
            value={password}
            className="border border-[#DADADA] rounded w-full p-2 mt-1"
            type="password"
            required
          />
        </div>

        <button className="bg-blue-600 text-white w-full py-2 rounded-md text-base">Login</button>

        {state === "Admin" ? (
          <p>
            Doctor Login?
            <span onClick={() => setState("Doctor")} className="text-blue-600 underline cursor-pointer">
              {" "}Click here
            </span>
          </p>
        ) : (
          <p>
            Admin Login?
            <span onClick={() => setState("Admin")} className="text-blue-600 underline cursor-pointer">
              {" "}Click here
            </span>
          </p>
        )}
      </div>
    </form>
  );
};

export default Login;