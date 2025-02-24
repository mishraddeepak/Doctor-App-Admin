import React from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Login from "./Pages/Login";
import { NavLink } from "react-router-dom";
import { useContext, useEffect } from "react";
import { AppContext } from "./context/AppContext";
import { AdminContext } from "./context/AdminContext";
import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";
import { Route, Routes } from "react-router-dom";
import Dashboard from "./Pages/Admin/Dashboard";
import AllAppointments from "./Pages/Admin/AllAppointments";
import AddDoctor from "./Pages/Admin/AddDoctor";
import DoctorsList from "./Pages/Admin/DoctorsList";
import UpdateDoctor from "./Pages/Admin/UpdateDoctor";
import { DoctorContext } from "./context/DoctorContext";
import DoctorAppointment from "./Pages/Doctor/DoctorAppointment";
import DoctorProfile from "./Pages/Doctor/DoctorProfile";
import { assets } from "./assets/assets";
export default function App() {
  const { aToken } = useContext(AdminContext);
  const { dToken } = useContext(DoctorContext);


  console.log(dToken);
  return aToken || dToken ? (
    <div className="bg-[#F8F9FD]">
      <ToastContainer />
      <Navbar/>
      <div className="flex items-start">
        <Sidebar />
        <Routes>
          {/* adminRoute */}
          <Route path="/" element={<></>} />
          <Route path="/admin-dashboard" element={<Dashboard />} />
          <Route path="/all-appointments" element={<AllAppointments />} />
          <Route path="/add-doctor" element={<AddDoctor />} />
          <Route path="/doctors-list" element={<DoctorsList />} />
          <Route path="/update-doctor/:doctorId" element={<UpdateDoctor />} />
          {/* doctorRoute */}
          <Route path="/doctor-appointments" element={<DoctorAppointment />} />
          <Route path="/doctor-profile" element={<DoctorProfile />} />
        </Routes>
      </div>
    </div>
  ) : (
    <>
     <div className='flex justify-between items-center px-4 sm:px-10 py-3 border-b bg-white'>
      <div className='flex items-center gap-2 text-xs'>
        {/* <img className='w-36 sm:w-40 cursor-pointer' src={assets.admin_logo} alt="" /> */}
        <div className="w-44 cursor-pointer text-3xl font-semibold text-blue-500">
    MediHome
</div>

        {/* <p className='border px-2.5 py-0.5 rounded-full border-gray-500 text-gray-600'>{aToken?"Admin":"Doctor"}</p> */}
      </div>
      <a href="http://localhost:5176/"  rel="noopener noreferrer">
    <button className="bg-primary text-white text-sm px-10 py-2 rounded-full">
      Patient
    </button>
  </a>
    </div>
      <Login />

      <ToastContainer />
    </>
  );
}
