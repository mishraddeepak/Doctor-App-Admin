import React, { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AdminContext } from "../../context/AdminContext";
import { assets } from "../../assets/assets";

export default function DoctorsList() {
  const { doctors, aToken, getAllDoctors, deleteDoctor } = useContext(AdminContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (aToken) {
      getAllDoctors();
    }
  }, [aToken,]);
console.log(doctors)
  const handleDelete = (doctorId) => {
    if (window.confirm("Are you sure you want to delete this doctor?")) {
      deleteDoctor(doctorId);
    }
  };

  const handleUpdate = (doctorId) => {
    navigate(`/update-doctor/${doctorId}`);
  };

  return (
    <div className="m-5 max-h-[90vh] overflow-y-scroll">
      <h1 className="text-lg font-medium">All Doctors</h1>
      <div className="w-full flex flex-wrap gap-4 pt-5 gap-y-6">
        {doctors.map((item, index) => (
          <div className="border border-indigo-200 rounded-xl max-w-56 overflow-hidden cursor-pointer" key={index}>
            <img
              className="bg-indigo-50 group-hover:bg-primary transition-all duration-500"
              src={item.docImg}
              alt="Doctor"
            />
            <div className="p-4">
              <p className="text-neutral-800 text-lg font-medium">{item.name}</p>
              <p className="text-zinc-600 text-sm">{item.speciality}</p>
              <div className="mt-2 flex items-center gap-3 text-sm">
                <button
                  className="text-blue-500 bg-blue-50 px-3 py-1 rounded hover:bg-blue-100"
                  onClick={() => handleUpdate(item._id)}
                >
                  Update
                </button>
                <button
                  className="text-red-500 bg-red-50 px-3 py-1 rounded hover:bg-red-100"
                  onClick={() => handleDelete(item._id)}
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
