import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { DoctorContext } from "../../context/DoctorContext";
import { toast } from "react-toastify";

export default function AllAppointmentsUI() {
  const { getDoctorDetails, docProfile, backendUrl } =
    useContext(DoctorContext);
  const [expandedIndex, setExpandedIndex] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  // const [searchQuery, setSearchQuery] = useState("");
  const [prescriptions, setPrescriptions] = useState({}); // Track prescriptions per appointment
  const [instructions, setInstructions] = useState({}); // Track instructions per appointment
  const [appointments, setAppointments] = useState([]);
  const [givenTreatment, setGivenTreatment] = useState([]);
  const [selectedTreatmentId, setSelectedTreatmentId] = useState("");
  const [treatmentFee, setTreatmentFee] = useState("");
  const [fetchedTreatments, setFetchedTreatments] = useState({});

  const [searchQuery, setSearchQuery] = useState("");
  const [filteredTreatments, setFilteredTreatments] = useState([]);
  const [selectedTreatments, setSelectedTreatments] = useState([]);
  const [billingPrice, setBillingPrice] = useState("");
  const [treatmentDataForBackend, setTreatmentDataForBackend] = useState([]);

  const handleSearchChange = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    if (query.trim() === "") {
      setFilteredTreatments([]);
      return;
    }
    const filtered = fetchedTreatments.filter((treatment) =>
      treatment.treatmentName.toLowerCase().includes(query.toLowerCase())
    );
    console.log(filtered);
    setFilteredTreatments(filtered);
  };

  const handleSelectTreatment = (treatment) => {
    const newTreatment = {
      ...treatment,
      billingPrice: treatment.actualPrice,
    };
    setSelectedTreatments((prev) => [...prev, newTreatment]);
    setTreatmentDataForBackend((prev) => [
      ...prev,
      {
        treatment: treatment._id,
        billingPrice: treatment.actualPrice,
      },
    ]);
    setSearchQuery("");
    setFilteredTreatments([]);
  };
  console.log(selectedTreatments);
  console.log(billingPrice);

  const handleRemoveTreatment = (index) => {
    setSelectedTreatments((prev) => prev.filter((_, i) => i !== index));
    setTreatmentDataForBackend((prev) => prev.filter((_, i) => i !== index));
  };
  const handleBillingPriceChange = (index, value) => {
    setSelectedTreatments((prev) =>
      prev.map((treatment, i) =>
        i === index ? { ...treatment, billingPrice: value } : treatment
      )
    );
    setTreatmentDataForBackend((prev) =>
      prev.map((item, i) =>
        i === index ? { ...item, billingPrice: value } : item
      )
    );
  };
  console.log(selectedTreatments);

  useEffect(() => {
    getDoctorDetails();
  }, []);

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
  useEffect(() => {
    fetchAppointment();
  }, [backendUrl]);
//  fetching all treatment
  useEffect(() => {
    const allTreatments = async () => {
      try {
        const { data } = await axios.get(
          `${backendUrl}/api/admin/all-treatment`
        );
        console.log(data);
        if (data.success) {
          setFetchedTreatments(data.data);
        } else {
          console.error("Failed to fetch treatments:", data.message);
        }
      } catch (error) {
        console.error("Error fetching treatments:", error.message);
      }
    };
    allTreatments();
  }, []);

  const handleMedicalType = async (medicalType) => {
    console.log("MedicalType:", medicalType);
    if (data.success) {
      setGivenTreatment(data.data);
    }
  };
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
      selectedTreatments: treatmentDataForBackend,
      status: "Completed",
    };
    console.log(prescriptionData);
    try {
      const { data } = await axios.put(
        `${backendUrl}/api/doctor/update-appoint-with-doctor/${appointmentId}`,
        prescriptionData
      );
      console.log(data);
      if (data.message === "Appointment status updated successfully") {
        toast.success(data.message);
        fetchAppointment();
        getDoctorDetails();
        setPrescriptions((prev) => ({ ...prev, [appointmentId]: [] }));
        setInstructions((prev) => ({ ...prev, [appointmentId]: "" }));
      }
    } catch (error) {
      console.error("Error submitting prescription:", error);
    }
  };
  console.log(treatmentDataForBackend);
  let serialNumber = 1;
  console.log(appointments);
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
                    {expandedIndex === rowIndex ? "▲ Collapse" : "▼ Expand"}
                  </button>
                </div>
              </div>
              {/* Expanded Section */}
              {expandedIndex === rowIndex && (
                <div className="col-span-full mt-4 p-6 bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg text-sm text-gray-700 shadow-2xl">
                  <div className="mb-4">
                    <p className="font-medium text-gray-700 mb-3">
                      Contact No:{" "}
                      <span>
                        {appointment?.patientId?.phone || "No additional details provided."}
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
                          {appointment.uploadedFiles?.length > 0 ? (
                            <ul className="list-disc pl-6">
                              {appointment.uploadedFiles.map(
                                (report, index) => (
                                  <li key={index} className="mb-1">
                                    <a
                                      href={`${report.filePath}`}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="text-blue-500 hover:underline"
                                    >
                                      {report.customName}
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
                    {/* Medical type */}
                    {appointment.medicalType && (
                      <p className="font-medium">
                        Medical Type: <span>{appointment.medicalType}</span>
                      </p>
                    )}
                    {/* doctor fee */}
                    {appointment.docFee && (
                      <p className="font-medium">
                        Doctor Fee:{" "}
                        <span className="text-green-600">
                          {appointment.docFee}
                        </span>
                      </p>
                    )}
                    {/* Already given Treatments  */}
                    {appointment.treatmentsTaken &&
                      appointment.treatmentsTaken.length > 0 && (
                        <table className="w-full border-collapse border border-gray-300 mt-4">
                          <thead>
                            <tr className="bg-gray-200">
                              <th className="border border-gray-300 px-4 py-2">
                                #
                              </th>
                              <th className="border border-gray-300 px-4 py-2">
                                Treatment Name
                              </th>
                              <th className="border border-gray-300 px-4 py-2">
                                Billing Price
                              </th>
                              <th className="border border-gray-300 px-4 py-2">
                                Actual Price
                              </th>
                            </tr>
                          </thead>
                          <tbody>
                            {appointment?.treatmentsTaken?.map(
                              (treatment, index) => (
                                <tr key={index} className="text-center">
                                  <td className="border border-gray-300 px-4 py-2">
                                    {index + 1}
                                  </td>
                                  <td className="border border-gray-300 px-4 py-2">
                                    {treatment.treatment.treatmentName}
                                  </td>
                                  <td className="border border-gray-300 px-4 py-2 text-green-600">
                                    {treatment.billingPrice}
                                  </td>
                                  <td className="border border-gray-300 px-4 py-2 text-green-600">
                                    {treatment.treatment.actualPrice}
                                  </td>
                                </tr>
                              )
                            )}
                          </tbody>
                        </table>
                      )}
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
                    {(appointment.status === "Accepted" ||
                      appointment.status === "Pending") && (
                      <>
                        {/* MedicalType and Treatments */}
                        <div className="w-full">
                          {/* Searchable Input */}
                          <div className="relative w-1/2">
                            <p className="font-medium">Search For Treatment:</p>
                            <input
                              type="text"
                              className="w-full border px-3 py-2 rounded-md mb-2"
                              placeholder="Search for a treatment..."
                              value={searchQuery}
                              onChange={handleSearchChange}
                            />
                            {filteredTreatments.length > 0 && (
                              <ul className="absolute left-0 border border-gray-300 rounded-md w-full bg-white z-10 max-h-40 overflow-y-auto shadow-lg">
                                {filteredTreatments.map((treatment) => (
                                  <li
                                    key={treatment._id}
                                    className="px-3 py-2 cursor-pointer hover:bg-gray-200"
                                    onClick={() =>
                                      handleSelectTreatment(treatment)
                                    }
                                  >
                                    {treatment.treatmentName}
                                  </li>
                                ))}
                              </ul>
                            )}
                          </div>
                          {/* Selected Treatments Table */}
                          {selectedTreatments.length > 0 && (
                            <table className="mt-4 w-full border-collapse border border-gray-300">
                              <thead>
                                <tr className="bg-gray-200">
                                  <th className="border border-gray-300 px-4 py-2">
                                    Treatment Name
                                  </th>
                                  <th className="border border-gray-300 px-4 py-2">
                                    Actual Price
                                  </th>
                                  <th className="border border-gray-300 px-4 py-2">
                                    Billing Price
                                  </th>
                                  <th className="border border-gray-300 px-4 py-2">
                                    Remove
                                  </th>
                                </tr>
                              </thead>
                              <tbody>
                                {selectedTreatments.map((treatment, index) => (
                                  <tr key={index} className="text-center">
                                    <td className="border border-gray-300 px-4 py-2">
                                      {treatment.treatmentName}
                                    </td>
                                    <td className="border border-gray-300 px-4 py-2 text-green-600">
                                      {treatment.actualPrice}
                                    </td>
                                    <td className="border border-gray-300 px-4 py-2 text-green-600">
                                      <input
                                        type="text"
                                        value={treatment.billingPrice}
                                        onChange={(e) =>
                                          handleBillingPriceChange(
                                            index,
                                            e.target.value
                                          )
                                        }
                                        className="w-full border px-2 py-1 rounded-md text-center"
                                      />
                                    </td>
                                    <td className="border border-gray-300 px-4 py-2">
                                      <button
                                        className="bg-red-500 text-white px-3 py-1 rounded"
                                        onClick={() =>
                                          handleRemoveTreatment(index)
                                        }
                                      >
                                        Remove
                                      </button>
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          )}
                        </div>
                        {/* Prescription Table */}
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
                        {/* Instruction Text Area */}
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
                      </>
                    )}
                    {/* Complete Appointmnent Button */}
                    <div className="mt-4 flex justify-evenly">
                      {(appointment.status === "Accepted" ||
                        appointment.status === "Pending") && (
                        <button
                          onClick={() =>
                            handleSubmit(patient?._id, appointment._id)
                          }
                          className="bg-primary text-white p-2 rounded-md"
                        >
                          Complete Appointment
                        </button>
                      )}
                      {/* Close Button */}
                      <button
                        onClick={() => toggleExpand(rowIndex)}
                        className={`bg-primary text-white p-2 rounded-md ${
                          appointment.status === "Completed" ||
                          appointment.status === "Cancelled"
                            ? "mx-auto" 
                            : ""
                        }`}
                      >
                        Close
                      </button>
                    </div>
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
