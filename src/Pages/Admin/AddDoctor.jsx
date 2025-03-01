import React, { useState, useEffect, useContext } from "react";
import { assets } from "../../assets/assets";
import axios from "axios";
import { AdminContext } from "../../context/AdminContext";
import { toast } from "react-toastify";

export default function AddDoctor() {
  const [docImg, setDocImg] = useState(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [experience, setExperience] = useState("1 Year");
  const [fees, setFees] = useState("");
  const [about, setAbout] = useState("");
  const [speciality, setSpeciality] = useState("General Physician");
  const [degree, setDegree] = useState("");
  const [address1, setAddress1] = useState("");
  const [address2, setAddress2] = useState("");
  const [isHeadDoctor, setIsHeadDoctor] = useState(false);
  const [add, setAdd] = useState(false);
  const [medicalType, setMedicalType] = useState("");
  const [treatmentName, setTreatmentName] = useState("");
  const [actualPrice, setActualPrice] = useState("");
  const [seeTreatMent, setSeeTreatment] = useState(false);
  const [fetchedMedicalType, setFetchedMedicalType] = useState([]);
  const [loading, setLoading] = useState(false); // Loading state
  const { backendUrl, aToken } = useContext(AdminContext);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    setDocImg(file);
  };
  useEffect(() => {
    if (seeTreatMent) {
      const fetchMedicalType = async () => {
        setLoading(true);
        try {
          const { data } = await axios.get(
            `${backendUrl}/api/admin/all-treatment`
          );
          if (data.success) {
            setFetchedMedicalType(data.data);
          }
        } catch (error) {
          console.log(error.message);
          toast.error("Failed to fetch treatments.");
        } finally {
          setLoading(false);
        }
      };
      fetchMedicalType();
    }
  }, [seeTreatMent]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (
      !name ||
      !email ||
      !password ||
      !experience ||
      !fees ||
      !speciality ||
      !degree ||
      !docImg
    ) {
      return toast.error("Fill all the fields");
    }
    try {
      console.log("hii");
      const formData = new FormData();
      formData.append("name", name);
      formData.append("email", email);
      formData.append("password", password);
      formData.append("experience", experience);
      formData.append("fees", fees);
      formData.append("about", about);
      formData.append("speciality", speciality);
      formData.append("degree", degree);
     

      formData.append("address[line1]", address1);
      formData.append("address[line2]", address2);
      formData.append("isHeadDoctor", isHeadDoctor);
      console.log(docImg);
      if(docImg){
        formData.append("docImg", docImg);
      }
      
      formData.forEach((value, key) => {
        console.log(key, value);
      });

      const { data } = await axios.post(
        `${backendUrl}/api/admin/add-doctor`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${aToken}`,
          },
        }
      );
      console.log(data)
      if (data.message === "Doctor added successfully") {
        toast.success(data.message);
        // Reset form fields
        setDocImg(null);
        setName("");
        setEmail("");
        setPassword("");
        setExperience("1 Year");
        setFees("");
        setAbout("");
        setSpeciality("General Physician");
        setDegree("");
        setAddress1("");
        setAddress2("");
        setIsHeadDoctor(false);
      } else {
        toast.error(data.error);
      }
    } catch (error) {
      toast.error("Failed to add doctor.");
    }
  };
  const handleAddMedicalType = async (e) => {
    e.preventDefault();
    console.log(medicalType);
    if (!medicalType || !treatmentName || !actualPrice) {
      return toast.error(
        "Please fill all fields: Medical Type, Treatment Name, and Actual Price."
      );
    }
    const formData = {
      medicalType,
      treatmentName,
      actualPrice: parseFloat(actualPrice),
    };
    try {
      const { data } = await axios.post(
        `${backendUrl}/api/admin/add-treatment`,
        formData
      );
      if (data.message === "Treatment added successfully.") {
        toast.success(data.message);
        setActualPrice("");
        setMedicalType("");
        setTreatmentName("");
        setAdd(false);
      }
    } catch (error) {
      console.log(error);
      toast.error("Failed to add medical type.");
    }
  };
  if (seeTreatMent) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
        <div className="relative p-6 bg-white rounded-lg shadow-md w-full max-w-md max-h-[90vh] overflow-hidden">
          <button
            onClick={() => setSeeTreatment(false)}
            className="absolute top-2 right-2 p-1 text-gray-500 hover:text-gray-700 focus:outline-none"
          >
            ×
          </button>
          <h2 className="text-xl font-semibold mb-4">Treatment Details</h2>
          <div className="overflow-y-auto max-h-[70vh] py-4">
            {loading ? (
              <p>Loading treatments...</p>
            ) : (
              <div className="space-y-4">
                {fetchedMedicalType.map((treatment) => (
                  <div key={treatment._id} className="border p-4 rounded-lg">
                    <h3 className="text-lg font-medium">
                      {treatment.medicalType}
                    </h3>
                    <p className="text-sm text-gray-600">
                      <span className="font-semibold">Treatment Name:</span>{" "}
                      {treatment.treatmentName}
                    </p>
                    <p className="text-sm text-gray-600">
                      <span className="font-semibold">Actual Price:</span>{" "}
                      {treatment.actualPrice}
                    </p>
                    <p className="text-sm text-gray-600">
                      <span className="font-semibold">Created At:</span>{" "}
                      {new Date(treatment.createdAt).toLocaleDateString(
                        "en-GB",
                        {
                          day: "2-digit",
                          month: "2-digit",
                          year: "numeric",
                        }
                      )}
                    </p>
                    {/* <p className="text-sm text-gray-600">
                      <span className="font-semibold">Updated At:</span>{" "}
                      {new Date(treatment.createdAt).toLocaleDateString(
                        "en-GB",
                        {
                          day: "2-digit",
                          month: "2-digit",
                          year: "numeric",
                        }
                      )}
                    </p> */}
                    <p className="text-sm text-gray-600">
                      <span className="font-semibold">Treatment ID:</span>{" "}
                      {treatment.Treatment_Id}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  if (add) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
        <div className="relative p-6 bg-white rounded-lg shadow-md w-full max-w-md">
          <button
            onClick={() => setAdd(false)}
            className="absolute top-2 right-2 p-1 text-gray-500 hover:text-gray-700 focus:outline-none"
          >
            ×
          </button>

          <h2 className="text-xl font-semibold mb-4">Add Medical Type</h2>

          <form onSubmit={handleAddMedicalType}>
            <div className="mb-4">
              <label
                htmlFor="medicalType"
                className="block text-sm font-medium text-gray-700"
              >
                Medical Type
              </label>
              <select
                value={medicalType}
                onChange={(e) => setMedicalType(e.target.value)}
                id="medicalType"
                name="medicalType"
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="" disabled>
                  Select a medical type
                </option>
                {[
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
                ].map((option, index) => (
                  <option key={index} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>

            <div className="mb-4">
              <label
                htmlFor="treatmentName"
                className="block text-sm font-medium text-gray-700"
              >
                Treatment Name
              </label>
              <input
                type="text"
                value={treatmentName}
                onChange={(e) => setTreatmentName(e.target.value)}
                id="treatmentName"
                name="treatmentName"
                placeholder="Enter treatment name"
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div className="mb-4">
              <label
                htmlFor="actualPrice"
                className="block text-sm font-medium text-gray-700"
              >
                Actual Price
              </label>
              <input
                value={actualPrice}
                onChange={(e) => setActualPrice(e.target.value)}
                type="number"
                id="actualPrice"
                name="actualPrice"
                placeholder="Enter actual price"
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div className="flex justify-center">
              <button
                type="submit"
                className="w-full px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                Save
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }
  const specialities = [
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
  return (
    <form className="m-5 w-full" onSubmit={handleSubmit}>
      <p className="mb-3 text-lg font-medium flex justify-between items-center">
        Add Doctor
        <h5
          onClick={() => setAdd(!add)}
          className="text-blue-500 hover:underline px-4"
        >
          Add Medical Type+
        </h5>
        <h5
          onClick={() => setSeeTreatment(!seeTreatMent)}
          className="text-blue-500 hover:underline px-4"
        >
          See All Treatments
        </h5>
      </p>
      <div className="bg-white px-8 py-8 border rounded w-full max-w-4xl max-h-[80vh] overflow-scroll">
        <div>
          <label htmlFor="doc-img" className="cursor-pointer">
            <img
              className="w-20 bg-gray-100 rounded-full"
              src={docImg ? URL.createObjectURL(docImg) : assets.upload_area}
              alt="Doctor"
            />
          </label>
          <input
            type="file"
            id="doc-img"
            className="hidden"
            onChange={handleFileChange}
          />
          {/* Paragraph is outside the label */}
          <p>
            Upload doctor
            <br /> picture
          </p>
        </div>
        <div className="flex flex-col lg:flex-row items-start gap-10 text-gray-600">
          <div className="w-full lg:flex-1 flex flex-col gap-4">
            <div className="flex-1 flex flex-col gap-1">
              <p>Doctor Name</p>
              <input
                className="border rounded px-3 py-2"
                type="text"
                placeholder="Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
            <div className="flex-1 flex flex-col gap-1">
              <p>Doctor Email</p>
              <input
                className="border rounded px-3 py-2"
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="flex-1 flex flex-col gap-1">
              <p>Doctor Password</p>
              <input
                className="border rounded px-3 py-2"
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <div className="flex-1 flex flex-col gap-1">
              <p>Experience</p>
              <select
                className="border rounded px-3 py-2"
                value={experience}
                onChange={(e) => setExperience(e.target.value)}
              >
                {[...Array(15).keys()].map((i) => (
                  <option key={i} value={`${i + 1} Year`}>
                    {i + 1} Year
                  </option>
                ))}
                <option value=""> {">15 Year's"} </option>
              </select>
            </div>
            <div className="flex-1 flex flex-col gap-1">
              <p>Fees:</p>
              <div className="relative">
                <input
                  className="border rounded px-3 py-2"
                  type="number"
                  placeholder="Fees"
                  value={fees}
                  onChange={(e) => setFees(e.target.value)}
                  required
                />
              </div>
            </div>
          </div>
          <div className="w-full lg:flex-1 flex flex-col gap-4">
            <div className="flex-1 flex flex-col gap-1">
              <p>Speciality</p>
              <select
                className="border rounded px-3 py-2"
                value={speciality}
                onChange={(e) => setSpeciality(e.target.value)}
              >
                {specialities.map((speciality, index) => (
                  <option key={index} value={speciality}>
                    {speciality}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex-1 flex flex-col gap-1">
              <p>Education</p>
              <input
                className="border rounded px-3 py-2"
                type="text"
                placeholder="Education"
                value={degree}
                onChange={(e) => setDegree(e.target.value)}
                required
              />
            </div>
            <div className="flex-1 flex flex-col gap-1">
              <p>Address</p>
              <input
                className="border rounded px-3 py-2"
                type="text"
                placeholder="Address1"
                value={address1}
                onChange={(e) => setAddress1(e.target.value)}
                required
              />
              <input
                className="border rounded px-3 py-2"
                type="text"
                placeholder="Address2"
                value={address2}
                onChange={(e) => setAddress2(e.target.value)}
              />
            </div>
          </div>
        </div>
        <div>
          <p className="mt-4 mb-2">About</p>
          <textarea
            className="w-full px-4 pt-2 border rounded"
            placeholder="Write about the doctor"
            rows={5}
            value={about}
            onChange={(e) => setAbout(e.target.value)}
          />
        </div>
        <div className="mt-4 flex items-center gap-2">
          <input
            type="checkbox"
            id="is-head-doctor"
            checked={isHeadDoctor}
            onChange={(e) => setIsHeadDoctor(e.target.checked)}
          />
          <label htmlFor="is-head-doctor" className="text-sm">
            Make Head Doctor
          </label>
        </div>
        <button
          type="submit"
          className="bg-primary px-10 py-3 mt-4 text-white rounded-full"
        >
          Add Doctor
        </button>
      </div>
    </form>
  );
}
