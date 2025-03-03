import React, { useContext, useEffect } from "react";
import { DoctorContext } from "../../context/DoctorContext";
import { BsCurrencyRupee } from "react-icons/bs";
import { MdMarkEmailRead } from "react-icons/md";
import { CiMedicalCase } from "react-icons/ci";
import { FcGraduationCap } from "react-icons/fc";
import { FaHouse } from "react-icons/fa6";
export default function DoctorProfile() {
 
  const { docProfile,backendUrl,getDoctorDetails } = useContext(DoctorContext);
  useEffect(() => {
    getDoctorDetails()
  }, []);
 console.log(docProfile)
  
  if (!docProfile) {
    return <div className="w-screen h-screen flex items-center justify-center">Loading profile...</div>;
  }
 
  return (
    <div className="w-screen h-screen">
      <div className="w-screen h-screen max-w-4xl mx-auto  p-6 border rounded-lg bg-white shadow-lg">
        {/* Profile Header */}
        <div className="flex items-center space-x-6 ">
          <img
            src={docProfile.docImg}
            alt="Profile"
            className="w-24 h-24 rounded-full border shadow"
          />
        </div>
        <div className="mt-7">
          <h1 className="text-3xl font-bold text-gray-800">{docProfile.name}</h1>
          <p className="text-sm text-gray-500">{docProfile.speciality}</p>
        </div>

        {/* Profile Content */}
        <div className="mt-6">
          <h2 className="text-xl font-medium text-gray-700">About Me</h2>
          <p className="text-gray-600 mt-2 leading-relaxed">
            {docProfile.about || "No additional information provided."}
          </p>
        </div>

        {/* Additional Details */}
        <div className="mt-6">
          <h2 className="text-xl font-medium text-gray-700">Details</h2>
          <div className="mt-2 text-gray-600">
            <p>
              <strong>{<MdMarkEmailRead size={24} className="inline mx-1 text-blue-600 " />}Email:</strong>{" "}
              <span className="text-gray-800 font-semibold">
                {docProfile.email}
              </span>
            </p>
            <p>
              <strong>{<CiMedicalCase size={24} className="inline text-blue-600 mx-1"/>}Experience:</strong>{" "}
              <span className="text-gray-800 font-semibold">
                {docProfile.experience}
              </span>
            </p>
            <p>
              <strong>{<BsCurrencyRupee size={24} className="inline text-blue-600 mx-1"/>}Fees:</strong>{" "}
              <span className="text-gray-800 font-semibold">
              {docProfile.fees}
              </span>
            </p>
            <p>
              <strong>{<FcGraduationCap size={24} className="inline text-blue-600 mx-1"/>}Degree:</strong>{" "}
              <span className="text-gray-800 font-semibold">
                {docProfile.degree}
              </span>
            </p>
            <p>
              <strong>{<FaHouse size={24} className="inline text-blue-600 mx-1"/>}Address 1:</strong>{" "}
              <span className="text-gray-800 font-semibold">
                {docProfile?.address?.line1}
              </span>
            </p>
            <p>
              <strong>{<FaHouse size={24} className="inline text-blue-600 mx-1"/>}Address 2:</strong>{" "}
              <span className="text-gray-800 font-semibold">
                {docProfile?.address?.line2 || "N/A"}
              </span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
