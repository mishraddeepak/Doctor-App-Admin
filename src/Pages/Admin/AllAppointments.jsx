
import React, { useContext, useEffect, useState } from "react";
import { AdminContext } from "../../context/AdminContext";
import axios from "axios";
import { toast } from "react-toastify";

export default function AllAppointments() {
  const {
    aToken,
    doctors,
    completeData,
    getAllDoctors,
    getAllAppointments,
    backendUrl,
  } = useContext(AdminContext);

  const [expandedIndex, setExpandedIndex] = useState(null);
  const [selectedDoctors, setSelectedDoctors] = useState({}); // Stores selected doctor for each appointment
  const [medicalTypes, setMedicalTypes] = useState({}); // Stores medical type for each appointment
  const [selectedFiles, setSelectedFiles] = useState({}); // Tracks selected files for each appointment
  const [expandedDropdown, setExpandedDropdown] = useState(null); // Track which dropdown is open
  const [appointments, setAppointments] = useState([]); // State variable for appointments
  const [disabledButtons, setDisabledButtons] = useState({}); // Tracks disabled state for each "Approve" button

  const MedicalType = [
    "Not Decided",
    "Cardiology",
    "Neurology",
    "Orthopedics",
    "Pediatrics",
    "Gastroenterology",
    "Dermatology",
    "Oncology",
    "Endocrinology",
    "Psychiatry",
    "Gynecology and Obstetrics",
    "Pulmonology",
    "Urology",
    "Hematology",
    "Ophthalmology",
    "Otolaryngology",
    "Nephrology",
    "Rheumatology",
  ];

  useEffect(() => {
    if (completeData) {
      const now = new Date();
      const upcomingAppointments = completeData.filter((appointment) => {
        const appointmentDateTime = new Date(`${appointment.selectedDate} ${appointment.slotTime}`);
        return appointmentDateTime > now; 
      });
      const pastAppointments = completeData.filter((appointment) => {
        const appointmentDateTime = new Date(`${appointment.selectedDate} ${appointment.slotTime}`);
        return appointmentDateTime <= now; 
      });
        const sortedUpcomingAppointments = upcomingAppointments.sort((a, b) => {
        const dateA = new Date(`${a.selectedDate} ${a.slotTime}`);
        const dateB = new Date(`${b.selectedDate} ${b.slotTime}`);
        return dateA - dateB;
      });
      const sortedPastAppointments = pastAppointments.sort((a, b) => {
        const dateA = new Date(`${a.selectedDate} ${a.slotTime}`);
        const dateB = new Date(`${b.selectedDate} ${b.slotTime}`);
        return dateB - dateA;
      });
      const sortedAppointments = [...sortedUpcomingAppointments, ...sortedPastAppointments];
      setAppointments(sortedAppointments);
    }
  }, [completeData]);

  useEffect(() => {
    getAllDoctors();
  }, []);

  useEffect(() => {
    if (aToken) {
      getAllAppointments();
    }
  }, [aToken]);

  const toggleExpand = (index) => {
    setExpandedIndex((prevIndex) => (prevIndex === index ? null : index));
  };

  const toggleFileDropdown = (appointmentId) => {
    setExpandedDropdown((prev) =>
      prev === appointmentId ? null : appointmentId
    );
  };
  const handleFileSelection = (appointmentId, file) => {
    setSelectedFiles((prevSelectedFiles) => {
      const currentFiles = prevSelectedFiles[appointmentId] || [];
      const isFileSelected = currentFiles.some(
        (selectedFile) => selectedFile._id === file._id
      );
      const updatedFiles = isFileSelected
        ? currentFiles.filter((selectedFile) => selectedFile._id !== file._id) // Remove the file
        : [...currentFiles, file]; // Add the file

      return {
        ...prevSelectedFiles,
        [appointmentId]: updatedFiles,
      };
    });
  };

  const handleSubmit = async (appointmentId) => {
    const fee = document.getElementById(`fee-${appointmentId}`).value;
    const status = document.getElementById(`status-${appointmentId}`).value;

    const selectedDoctor = selectedDoctors[appointmentId];
    const medicalType = medicalTypes[appointmentId];

    // Ensure a doctor is selected only when the status is not 'Canceled'
    if (
      (!selectedDoctor || !selectedDoctor.name || !selectedDoctor._id) &&
      status !== "Cancelled"
    ) {
      alert("Please select a doctor.");
      return;
    }

    // Get the appointment details
    const appointment = appointments.find((app) => app._id === appointmentId);

    if (!appointment) {
      alert("Appointment not found.");
      return;
    }

    const appointmentDetails = {
      medicalType,
      appointmentId,
      status,
      docName: status === "Cancelled" ? "" : selectedDoctor?.name || "",
      doctorId:
        status === "Cancelled"
          ? "507f1f77bcf86cd799439011" // Dummy doctor ID for canceled status
          : selectedDoctor?._id,
      doctorFee: status === "Cancelled" ? 0 : fee || selectedDoctor?.fees || 0,
      details: appointment.details || "No additional details provided.",
      selectedFiles: selectedFiles[appointmentId] || [],
    };

    console.log("Appointment Details:", appointmentDetails);

    try {
      const { data } = await axios.put(
        `${backendUrl}/api/admin/operate-appointment/${appointmentId}`,
        appointmentDetails
      );
      console.log("Response from server:", data);
      setDisabledButtons((prev) => ({
        ...prev,
        [appointmentId]: true,
      }));

      toast.success("Appointment updated successfully.");
      getAllAppointments(); // Refresh the appointments list
    } catch (error) {
      console.error("Error updating appointment:", error);
      toast.error("Failed to update appointment.");
    }
  };
  const filteredDoctors = (appointmentId) => {
    const medicalType = medicalTypes[appointmentId];
    return doctors.filter((doctor) => doctor.speciality === medicalType);
  };

  let serialNumber = 1;
  console.log(appointments);
  return (
    <div className="w-full max-w-6xl m-5">
      <p className="mb-3 text-lg font-medium">All Appointments</p>
      <div className="bg-white border-rounded min-h-[60vh] text-sm max-h-[80vh] overflow-y-scroll">
        {/* Table Headers */}
        <div className="grid grid-cols-[0.5fr_3fr_1fr_3fr_1fr_1fr] sm:grid-cols-[0.5fr_3fr_1fr_3fr_1fr_1fr] py-3 px-6 border-b text-center sm:text-left">
          <p className="hidden sm:block">Sr. No.</p>
          <p>Patient</p>
          <p>Ap. Id</p>
          <p>Date & Time</p>
          <p>Status</p>
          <p>Actions</p>
        </div>

        {/* Table Data */}
        {appointments.map((appointment, index) => {
          const rowIndex = index;
          const appointmentId = appointment._id;
          const isExpanded = expandedIndex === rowIndex;

          return (
            <div
              key={appointmentId}
              className="grid grid-cols-[0.5fr_3fr_1fr_3fr_1fr_1fr] sm:grid-cols-[0.5fr_3fr_1fr_3fr_1fr_1fr] py-3 px-6 border-b hover:bg-gray-200 text-center sm:text-left"
            >
              <p className="hidden sm:block">{serialNumber++}</p>

              <div className="flex items-center gap-2 justify-center sm:justify-start">
                <p>{appointment?.patientName}</p>
              </div>

              <p className="text-blue-700 ">{appointment?.Appointment_Id}</p>

              <p>
                {new Date(appointment.selectedDate).toLocaleDateString(
                  "en-GB",
                  {
                    day: "2-digit",
                    month: "2-digit",
                    year: "numeric",
                  }
                )}
                , {appointment.slotTime}
              </p>

              <p
                className={`${
                  appointment.status === "Pending"
                    ? "text-yellow-600"
                    : appointment.status === "Accepted"
                    ? "text-green-600"
                    : appointment.status === "Completed"
                    ? "text-blue-600"
                    : appointment.status === "Canceled"
                    ? "text-red-600"
                    : ""
                }`}
              >
                {appointment.status}
              </p>

              <div className="flex items-center justify-center sm:justify-start gap-2">
                <button
                  onClick={() => toggleExpand(rowIndex)}
                  className="text-sm font-medium text-gray-500 hover:text-primary transition-all duration-300"
                >
                  {isExpanded ? "▲ Collapse" : "▼ Expand"}
                </button>
              </div>

              {isExpanded && (
                <div className="col-span-full mt-4 p-6 bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg text-sm text-gray-700 shadow-xl hover:shadow-2xl transition-shadow duration-300">
                  <div className="mb-4">
                    <p className="font-medium ">
                      Symptoms: <span>{" "}{appointment.symptoms}</span>
                    </p>
                  </div>

                  {/* Assigned Doctor And Fee */}
                  <div className="mb-4 ">
                    <p className="font-medium">
                      Assigned Doctor:{" "}
                      <span className="text-sm">
                        {appointment.docName || "Doctor Not Yet assigned"}
                      </span>
                    </p>
                    <p className="font-medium">
                      Appointment Fee:{" "}
                      <span>{appointment.docFee || "No fee provided."}</span>
                    </p>
                  </div>

                  {/* File Selection with Dropdown */}
                  <div className="mt-4">
                    <label className="block mb-2 font-medium">
                      Available Reports:
                    </label>
                    <div className="relative">
                      <button
                        type="button"
                        className="w-full sm:w-auto p-2 border rounded-md bg-white text-gray-700"
                        onClick={() => toggleFileDropdown(appointmentId)}
                      >
                        {selectedFiles[appointmentId]?.length > 0
                          ? `${selectedFiles[appointmentId].length} Report(s) selected`
                          : "Select Reports (optional)"}
                      </button>

                      {expandedDropdown === appointmentId && (
                        <div className="absolute mt-2 w-full sm:w-auto max-h-40 overflow-y-auto border rounded-md bg-white shadow-lg z-10">
                          {appointment?.patientId?.uploadedFiles &&
                          appointment?.patientId?.uploadedFiles.length > 0 ? (
                            <ul className="p-2">
                              {appointment?.patientId?.uploadedFiles.map(
                                (file) => (
                                  <li
                                    key={file._id}
                                    className="flex items-center gap-2"
                                  >
                                    <input
                                      type="checkbox"
                                      className="form-checkbox"
                                      checked={(
                                        selectedFiles[appointmentId] || []
                                      ).some(
                                        (selectedFile) =>
                                          selectedFile._id === file._id
                                      )}
                                      onChange={() =>
                                        handleFileSelection(appointmentId, file)
                                      }
                                    />
                                    <label>
                                      {file.customName}
                                      <a
                                        href={`${file.filePath}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-blue-500 text-sm hover:underline mx-3"
                                      >
                                        View
                                      </a>
                                    </label>
                                  </li>
                                )
                              )}
                            </ul>
                          ) : (
                            <p className="p-2 text-gray-500">
                              No Reports available for this appointment.
                            </p>
                          )}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* MedicalType */}
                  {appointment.status === "Pending" && (
                    <div className="mt-4">
                      <label className="block font-medium">Medical Type</label>
                      <select
                        value={medicalTypes[appointmentId] || ""}
                        onChange={(e) => {
                          setMedicalTypes((prev) => ({
                            ...prev,
                            [appointmentId]: e.target.value,
                          }));
                        }}
                        className="p-2 border rounded-md w-full sm:w-auto"
                      >
                        <option value="" disabled>
                          Medical Type
                        </option>
                        {MedicalType.map((type, index) => (
                          <option key={index} value={type}>
                            {type}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}

                  {/* Doctor Selection and Fee */}
                  <div className="mt-4">
                    <label className="block font-medium">Doctor</label>
                    <select
                      value={selectedDoctors[appointmentId]?.name || ""}
                      onChange={(e) => {
                        const doctor = doctors.find(
                          (doc) => doc.name === e.target.value
                        );
                        setSelectedDoctors((prev) => ({
                          ...prev,
                          [appointmentId]: doctor,
                        }));
                      }}
                      className="p-2 border rounded-md w-full sm:w-auto"
                    >
                      <option value="" disabled>
                        Select a doctor
                      </option>
                      {filteredDoctors(appointmentId).map((doctor) => (
                        <option key={doctor._id} value={doctor.name}>
                          {doctor.name} ({doctor.speciality})
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Status and Fee */}
                  <div className="mt-4 flex gap-4">
                    <div className="w-1/2">
                      <label className="block font-medium">Status</label>
                      <select
                        id={`status-${appointmentId}`}
                        className="p-2 border rounded-md w-full"
                      >
                        {/* <option value="Pending">Pending</option> */}
                        <option value="Accepted">Accepted</option>
                        <option value="Cancelled">Cancelled</option>
                      </select>
                    </div>

                    <div className="w-1/2">
                      <label className="block font-medium">Doctor Fee</label>
                      <input
                        id={`fee-${appointmentId}`}
                        type="number"
                        className="p-2 border rounded-md w-full"
                        defaultValue={
                          selectedDoctors[appointmentId]?.fees || ""
                        }
                      />
                    </div>
                  </div>

                  {/* Submit Button */}
                  <div className="mt-4 flex gap-4">
                  <button
  onClick={() => handleSubmit(appointmentId)}
  disabled={
    disabledButtons[appointmentId] ||
    appointment.status === "Cancelled" ||
    appointment.status === "Completed"
  }
  className={`px-4 py-2 text-white ${
    disabledButtons[appointmentId] ||
    appointment.status === "Cancelled" ||
    appointment.status === "Completed"
      ? "bg-gray-400 cursor-not-allowed"
      : "bg-green-600"
  } rounded-md`}
>
  {disabledButtons[appointmentId] ||
  appointment.status === "Cancelled" ||
  appointment.status === "Completed"
    ? "Approved"
    : "Approve"}
</button>
                    <button className="px-4 py-2 text-white bg-blue-600 rounded-md">
                      Generate Bill
                    </button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
