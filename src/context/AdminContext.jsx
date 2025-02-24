import { createContext } from "react";
import { useState } from "react";
import React from "react";
import axios from "axios";
import { toast } from "react-toastify";
export const AdminContext = createContext();

export default function AdminContextProvider(props) {
  const [aToken, setAToken] = useState(
    localStorage.getItem("aToken") ? localStorage.getItem("aToken") : ""
  );
  const [doctors, setDoctors] = useState([]);
  const [completeData, setCompleteData] = useState([]);

  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  
  const getAllDoctors = async () => {
    console.log("hii")
    try {
      const { data } = await axios.get(`${backendUrl}/api/admin/all-doctors`);
      console.log(data)
      if (data.success) {
        
        setDoctors(data.data);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const getAllAppointments = async () => {
    try {
      const { data } = await axios.get(
        `${backendUrl}/api/admin/all-appointments`
      );
      console.log("data is",data)
      if (data.message==="Appointments retrieved successfully") {
       console.log("hello")
        setCompleteData(data.appointments);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };
  const deleteDoctor = async (doctorId) => {
    try {
      await axios.delete(`${backendUrl}/api/admin//remove-doctor/${doctorId}`, {
        headers: { Authorization: `Bearer ${aToken}` },
      });

      // Remove the deleted doctor from state
      setDoctors((prevDoctors) => prevDoctors.filter((doc) => doc._id !== doctorId));
      alert("Doctor deleted successfully!");
    } catch (error) {
      console.error("Error deleting doctor:", error);
      alert("Failed to delete the doctor.");
    }
  };
  const value = {
    aToken,
    setAToken,
    backendUrl,
    doctors,
    getAllDoctors,
    completeData,
    setCompleteData,
    getAllAppointments,
    deleteDoctor

  };

  return (
    <AdminContext.Provider value={value}>
      {props.children}
    </AdminContext.Provider>
  );
}
