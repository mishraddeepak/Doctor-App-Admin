import React, { useContext, useEffect } from "react";
import { DoctorContext } from "../../context/DoctorContext";

export default function DoctorProfile() {
 
  const { docProfile,backendUrl,getDoctorDetails } = useContext(DoctorContext);
  useEffect(() => {
    getDoctorDetails()
  }, []);
 
  
  if (!docProfile) {
    return <div className="w-screen h-screen flex items-center justify-center">Loading profile...</div>;
  }
 
  return (
    <div className="w-screen h-screen">
      <div className="w-screen h-screen max-w-4xl mx-auto  p-6 border rounded-lg bg-white shadow-lg">
        {/* Profile Header */}
        <div className="flex items-center space-x-6 ">
          <img
            src="https://via.placeholder.com/150"
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
              <strong>Email:</strong>{" "}
              <span className="text-gray-800 font-semibold">
                {docProfile.email}
              </span>
            </p>
            <p>
              <strong>Experience:</strong>{" "}
              <span className="text-gray-800 font-semibold">
                {docProfile.experience}
              </span>
            </p>
            <p>
              <strong>Fees:</strong>{" "}
              <span className="text-gray-800 font-semibold">
                ${docProfile.fees}
              </span>
            </p>
            <p>
              <strong>Degree:</strong>{" "}
              <span className="text-gray-800 font-semibold">
                {docProfile.degree}
              </span>
            </p>
            <p>
              <strong>Address 1:</strong>{" "}
              <span className="text-gray-800 font-semibold">
                {docProfile?.address?.line1}
              </span>
            </p>
            <p>
              <strong>Address 2:</strong>{" "}
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
