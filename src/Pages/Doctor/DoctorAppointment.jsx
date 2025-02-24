import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { DoctorContext } from "../../context/DoctorContext";
import { toast } from "react-toastify";

export default function AllAppointmentsUI() {
  const { getDoctorDetails, docProfile, backendUrl } =
    useContext(DoctorContext);
  const [expandedIndex, setExpandedIndex] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [prescriptions, setPrescriptions] = useState({}); // Track prescriptions per appointment
  const [instructions, setInstructions] = useState({}); // Track instructions per appointment
  const [appointments, setAppointments] = useState([]);
  const [givenTreatment, setGivenTreatment] = useState([]);
  const [selectedTreatmentId, setSelectedTreatmentId] = useState("");
  const [treatmentFee, setTreatmentFee] = useState("");

  useEffect(() => {
    getDoctorDetails();
  }, []);

  useEffect(() => {
    const fetchAppointment = async () => {
      try {
        const { data } = await axios.get(
          `${backendUrl}/api/doctor/doctor-appointments/${localStorage.getItem(
            "userId"
          )}`
        );
        if (data.success) {
          setAppointments(data.data);
        }
      } catch (error) {
        console.error("Error fetching appointments:", error);
      }
    };
    fetchAppointment();
  }, [backendUrl]);

  // Function to handle medicalType
  const handleMedicalType = async (medicalType) => {
    console.log("MedicalType:", medicalType); // Log the value for testing
    const { data } = await axios.get(
      `${backendUrl}/api/doctor/search-treatments/${medicalType}`
    );
    console.log(data);
    if (data.success) {
      setGivenTreatment(data.data);
    }
  };

  // Automatically trigger the function when an appointment is expanded
  useEffect(() => {
    if (expandedIndex !== null) {
      const expandedAppointment = appointments[expandedIndex];
      if (expandedAppointment) {
        handleMedicalType(expandedAppointment.medicalType);
      }
    } else {
      // Reset treatments when collapsing
      setGivenTreatment([]);
    }
  }, [expandedIndex, appointments]);

  // Handle treatment selection
  const handleTreatmentChange = (e) => {
    const selectedId = e.target.value;
    setSelectedTreatmentId(selectedId);

    // Find the selected treatment
    const selectedTreatment = givenTreatment.find(
      (treatment) => treatment._id === selectedId
    );

    // Set the treatmentFee to the selected treatment's actualPrice
    if (selectedTreatment) {
      setTreatmentFee(selectedTreatment.actualPrice);
    } else {
      setTreatmentFee(""); // Reset if no treatment is selected
    }
  };

  const toggleView = (patientId) => {
    const filteredAppointment = docProfile?.doctor?.appointments.filter(
      (item) => item.patientId === patientId
    );
    console.log(filteredAppointment);
    setIsOpen(!isOpen);
  };

  const toggleExpand = (rowIndex) => {
    setExpandedIndex((prevIndex) => (prevIndex === rowIndex ? null : rowIndex));
  };

  const addPrescriptionRow = (appointmentId) => {
    setPrescriptions((prevPrescriptions) => ({
      ...prevPrescriptions,
      [appointmentId]: [
        ...(prevPrescriptions[appointmentId] || []),
        { medicine: "", dose: "", timing: "" },
      ],
    }));
  };

  const removePrescriptionRow = (appointmentId, index) => {
    setPrescriptions((prevPrescriptions) => ({
      ...prevPrescriptions,
      [appointmentId]: prevPrescriptions[appointmentId].filter(
        (_, i) => i !== index
      ),
    }));
  };

  const handlePrescriptionChange = (appointmentId, index, field, value) => {
    setPrescriptions((prevPrescriptions) => {
      const newPrescriptions = [...prevPrescriptions[appointmentId]];
      newPrescriptions[index] = { ...newPrescriptions[index], [field]: value };
      return { ...prevPrescriptions, [appointmentId]: newPrescriptions };
    });
  };

  const handleInstructionChange = (appointmentId, value) => {
    setInstructions((prevInstructions) => ({
      ...prevInstructions,
      [appointmentId]: value,
    }));
  };

  const handleSubmit = async (patientId, appointmentId) => {
    const prescriptionData = {
      prescriptions: prescriptions[appointmentId] || [],
      instruction: instructions[appointmentId] || "",
      appointmentId,
      treatmentTaken:givenTreatment,
      status: "Completed",
    };

    try {
      const { data } = await axios.put(
        `${backendUrl}/api/doctor/update-appoint-with-doctor/${appointmentId}`,
        prescriptionData
      );
      console.log(data)
      if (data.success) {
        toast.success(data.message);
        setPrescriptions((prev) => ({ ...prev, [appointmentId]: [] }));
        setInstructions((prev) => ({ ...prev, [appointmentId]: "" }));
      }
    } catch (error) {
      console.error("Error submitting prescription:", error);
    }
  };

  let serialNumber = 1;

  return (
    <div className="w-full max-w-6xl m-5 ">
      <p className="mb-3 text-lg font-medium">All Appointments</p>

      {/* Search Input */}
      <div className="mb-4">
        <input
          type="text"
          placeholder="Search by Name or Email"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full p-2 border rounded-md"
        />
      </div>

      <div className="bg-white border-rounded min-h-[60vh] text-sm max-h-[80vh] overflow-y-scroll">
        {/* Table Headers */}
        <div className="grid grid-cols-[0.5fr_3fr_1fr_3fr_1fr_1fr] sm:grid-cols-[0.5fr_3fr_1fr_3fr_1fr_1fr] py-3 px-6 border-b text-center sm:text-left">
          <p className="hidden sm:block">Sr. No.</p>
          <p>Patient</p>
          <p>Ap.Id</p>
          <p>Date & Time</p>
          <p>Status</p>
          <p>Actions</p>
        </div>

        {/* Filtered Table Data */}
        {appointments.map((appointment, appointmentIndex) => {
          const rowIndex = `${appointmentIndex}`;
          const patient = appointment.patient; // Assuming `patient` is nested in `appointment`

          return (
            <React.Fragment key={appointment._id}>
              <div className="grid grid-cols-[0.5fr_3fr_1fr_3fr_1fr_1fr] sm:grid-cols-[0.5fr_3fr_1fr_3fr_1fr_1fr] py-3 px-6 border-b hover:bg-gray-200 text-center sm:text-left">
                <p className="hidden sm:block">{serialNumber++}</p>

                <div className="flex items-center gap-2 justify-center sm:justify-start">
                  <p>{appointment?.patientName || "N/A"}</p>
                </div>

                <p className="text-blue-700">{appointment?.Appointment_Id}</p>

                <p>
                  {appointment.selectedDate}, {appointment.slotTime}
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
                    {expandedIndex === rowIndex ? "▲ Collapse" : "▼ Expand"}
                  </button>
                </div>
              </div>

              {/* Expanded Section */}
              {expandedIndex === rowIndex && (
                <div className="col-span-full mt-4 p-4 bg-gray-50 rounded-md text-sm text-gray-600 ">
                  <div className="mb-4">
                    <p className="font-medium">
                      Contact No:{" "}
                      <span>
                        {patient?.phone || "No additional details provided."}
                      </span>
                    </p>
                    <p className="font-medium">
                      Symptoms: <span>{appointment.symptoms}</span>
                    </p>

                    {/* Reports */}
                    <div>
                      <p className="font-medium">
                        Reports:{" "}
                        <span
                          onClick={() => toggleView(patient?._id)}
                          className="text-blue-500 cursor-pointer hover:underline"
                        >
                          View
                        </span>
                      </p>

                      {isOpen && (
                        <div className="mt-4 border p-4 rounded-md bg-gray-100 shadow-md">
                          <h3 className="text-lg font-bold mb-2">Reports</h3>
                          {appointment.patientReports?.length > 0 ? (
                            <ul className="list-disc pl-6">
                              {appointment.patientReports.map(
                                (report, index) => (
                                  <li key={index} className="mb-1">
                                    <a
                                      href={`${backendUrl}/middlewares/${report.filePath}`}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="text-blue-500 hover:underline"
                                    >
                                      {report.fileName}
                                    </a>
                                  </li>
                                )
                              )}
                            </ul>
                          ) : (
                            <p className="text-gray-500">
                              No reports available.
                            </p>
                          )}
                          {/* Close Button */}
                          <button
                            onClick={() => toggleView(patient?._id)}
                            className="mt-4 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                          >
                            Close
                          </button>
                        </div>
                      )}
                    </div>

                    {/* Already given prescription */}
                    {appointment.prescriptions?.length > 0 && (
                      <div className="mt-4">
                        <p className="font-medium text-sm">Prescription:</p>
                        <table className="mt-2 w-full table-auto text-sm border-collapse border border-gray-300">
                          <thead className="bg-gray-100">
                            <tr>
                              <th className="border-b px-4 py-2">Medicine</th>
                              <th className="border-b px-4 py-2">Dose</th>
                              <th className="border-b px-4 py-2">Timing</th>
                            </tr>
                          </thead>
                          <tbody>
                            {appointment.prescriptions.map(
                              (prescription, index) => (
                                <tr key={index} className="hover:bg-gray-100">
                                  <td className="border-b px-4 py-2">
                                    {prescription.medicine}
                                  </td>
                                  <td className="border-b px-4 py-2">
                                    {prescription.dose}
                                  </td>
                                  <td className="border-b px-4 py-2">
                                    {prescription.timing}
                                  </td>
                                </tr>
                              )
                            )}
                          </tbody>
                        </table>
                      </div>
                    )}

                    {/* Already Given Instruction */}
                    {appointment?.instruction && (
                      <p className="font-medium">
                        Instructions: <span>{appointment.instruction}</span>
                      </p>
                    )}

                    {/* MedicalType and Treatments */}
                    {(appointment.status === "Accepted" ||
                      appointment.status === "Pending") && (
                      <div className="mt-4">
                        
                        <p className="font-medium text-sm mb-2">MedicalType:</p>
                        <input
                          value={appointment.medicalType}
                          rows="4"
                          className="w-1/2 border px-3 py-2 rounded-md"
                          readOnly
                        />
                       
                        
                        <p className="font-medium text-sm mb-2">Treatments:</p>
                        <select
                          className="w-1/2 border px-3 py-2 rounded-md mb-4"
                          value={selectedTreatmentId}
                          onChange={handleTreatmentChange}
                        >
                          <option value="">Select a treatment</option>
                          {givenTreatment?.map((treatment) => (
                            <option key={treatment._id} value={treatment._id}>
                              {treatment.treatmentName}
                            </option>
                          ))}
                        </select>
                        
                        <p className="font-medium text-sm mb-2">Treatment Fee:</p>
                        <input
                          type="text"
                          value={treatmentFee}
                          onChange={(e) => setTreatmentFee(e.target.value)}
                          className="w-1/2 border px-3 py-2 rounded-md"
                          placeholder="Enter treatment fee"
                        />
                        
                      </div>
                    )}

                    {/* Prescription Table */}
                    {(appointment.status === "Accepted" ||
                      appointment.status === "Pending") && (
                      <div className="mt-4">
                        <p className="font-medium text-sm">Prescription:</p>
                        <table className="mt-2 w-full table-auto text-sm border-collapse border border-gray-300">
                          <thead className="bg-gray-100">
                            <tr>
                              <th className="border-b px-4 py-2">Medicine</th>
                              <th className="border-b px-4 py-2">Dose</th>
                              <th className="border-b px-4 py-2">Timing</th>
                              <th className="border-b px-4 py-2">Actions</th>
                            </tr>
                          </thead>
                          <tbody>
                            {(prescriptions[appointment._id] || []).map(
                              (prescription, index) => (
                                <tr key={index} className="hover:bg-gray-100">
                                  <td className="border-b px-4 py-2">
                                    <input
                                      type="text"
                                      value={prescription.medicine}
                                      onChange={(e) =>
                                        handlePrescriptionChange(
                                          appointment._id,
                                          index,
                                          "medicine",
                                          e.target.value
                                        )
                                      }
                                      className="w-full border px-2 py-1"
                                    />
                                  </td>
                                  <td className="border-b px-4 py-2">
                                    <input
                                      type="text"
                                      value={prescription.dose}
                                      onChange={(e) =>
                                        handlePrescriptionChange(
                                          appointment._id,
                                          index,
                                          "dose",
                                          e.target.value
                                        )
                                      }
                                      className="w-full border px-2 py-1"
                                    />
                                  </td>
                                  <td className="border-b px-4 py-2">
                                    <input
                                      type="text"
                                      value={prescription.timing}
                                      onChange={(e) =>
                                        handlePrescriptionChange(
                                          appointment._id,
                                          index,
                                          "timing",
                                          e.target.value
                                        )
                                      }
                                      className="w-full border px-2 py-1"
                                    />
                                  </td>
                                  <td className="border-b px-4 py-2">
                                    <button
                                      onClick={() =>
                                        removePrescriptionRow(
                                          appointment._id,
                                          index
                                        )
                                      }
                                      className="text-red-600 hover:text-red-800"
                                    >
                                      Delete
                                    </button>
                                  </td>
                                </tr>
                              )
                            )}
                          </tbody>
                        </table>
                        <button
                          onClick={() => addPrescriptionRow(appointment._id)}
                          className="text-sm text-blue-600 hover:underline mt-4"
                        >
                          + Add Medicine
                        </button>
                      </div>
                    )}

                    {/* Instruction Text Area */}
                    {(appointment.status === "Accepted" ||
                      appointment.status === "Pending") && (
                      <div className="mt-4">
                        <p className="font-medium text-sm mb-2">
                          Instructions:
                        </p>
                        <textarea
                          value={instructions[appointment._id] || ""}
                          onChange={(e) =>
                            handleInstructionChange(
                              appointment._id,
                              e.target.value
                            )
                          }
                          rows="4"
                          className="w-full border px-3 py-2 rounded-md"
                          placeholder="Add any instructions for the patient..."
                        ></textarea>
                      </div>
                    )}

                    {(appointment.status === "Accepted" ||
                      appointment.status === "Pending") && (
                      <div className="mt-4">
                        <button
                          onClick={() =>
                            handleSubmit(patient?._id, appointment._id)
                          }
                          className="bg-primary text-white p-2 rounded-md"
                        >
                          Submit Prescription
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
}