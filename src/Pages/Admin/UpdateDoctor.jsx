import React, { useState, useEffect, useContext } from "react";
import { useParams } from "react-router-dom"; // To extract doctorId from URL
import { AdminContext } from "../../context/AdminContext";
import { toast } from "react-toastify";
import axios from "axios";
import { assets } from "../../assets/assets";

export default function UpdateDoctor() {
  const { doctorId } = useParams(); // Extract doctorId from the URL
  const { backendUrl } = useContext(AdminContext);

  const [docImg, setDocImg] = useState(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState(""); // Optional for update
  const [experience, setExperience] = useState("1 Year");
  const [fees, setFees] = useState("");
  const [about, setAbout] = useState("");
  const [speciality, setSpeciality] = useState("General Physician");
  const [degree, setDegree] = useState("");
  const [address1, setAddress1] = useState("");
  const [address2, setAddress2] = useState("");

  // Fetching the doctor's details on component mount
  useEffect(() => {
    const fetchDoctorDetails = async () => {
      try {
        const { data } = await axios.get(`${backendUrl}/api/admin/doctor/${doctorId}`);
        if (data.success) {
          const doctor = data.doctor;
          setName(doctor.name || "");
          setEmail(doctor.email || "");
          setExperience(doctor.experience || "1 Year");
          setFees(doctor.fees || "");
          setAbout(doctor.about || "");
          setSpeciality(doctor.speciality || "General Physician");
          setDegree(doctor.degree || "");
          setAddress1(doctor.address1 || "");
          setAddress2(doctor.address2 || "");
          setDocImg(doctor.profileImage || null); // If URL is provided
        } else {
          toast.error("Failed to fetch doctor details");
        }
      } catch (error) {
        toast.error("An error occurred while fetching doctor details");
      }
    };

    fetchDoctorDetails();
  }, [backendUrl, doctorId]);

  // Handling file input
  const handleFileChange = (event) => {
    const file = event.target.files[0];
    setDocImg(file);
  };

  // Handling form submission to update doctor details
  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
        console.log(doctorId)
      const formData = new FormData();
      if (docImg) formData.append("docImg", docImg);
      formData.append("name", name);
      formData.append("email", email);
      if (password) formData.append("password", password); // Optional for updates
      formData.append("experience", experience);
      formData.append("fees", fees);
      formData.append("about", about);
      formData.append("speciality", speciality);
      formData.append("degree", degree);
      formData.append("address1", address1);
      formData.append("address2", address2);

      // Sending PUT request to update doctor details
      console.log("hellohiii",formData)
      const { data } = await axios.put(
        `${backendUrl}/api/admin/update-doctor/${doctorId}`,
        formData
      );

      if (data.success) {
        toast.success("Doctor details updated successfully");
      } else {
        toast.error(data.error);
      }
    } catch (error) {
      toast.error("An error occurred while updating doctor details");
    }
  };

  return (
    <form className="m-5 w-full" onSubmit={handleSubmit}>
      <p className="mb-3 text-lg font-medium">Update Doctor</p>
      <div className="bg-white px-8 py-8 border rounded w-full max-w-4xl max-h-[80vh] overflow-scroll">
        {/* Doctor Image */}
        <div>
          <label htmlFor="doc-img">
            <img
              className="w-16 bg-gray-100 rounded-full cursor-pointer"
              src={docImg ? (typeof docImg === "string" ? docImg : URL.createObjectURL(docImg)) : assets.upload_area}
              alt="Doctor"
            />
          </label>
          <input
            className="border rounded px-3 py-2"
            type="file"
            id="doc-img"
            hidden
            onChange={handleFileChange}
          />
          <p>
            Upload doctor
            <br /> picture
          </p>
        </div>

        {/* Form Fields */}
        <div className="mb-4">
          <label htmlFor="name" className="text-sm">Name</label>
          <input
            id="name"
            type="text"
            className="border rounded-md p-3 w-full"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        <div className="mb-4">
          <label htmlFor="email" className="text-sm">Email</label>
          <input
            id="email"
            type="email"
            className="border rounded-md p-3 w-full"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div className="mb-4">
          <label htmlFor="password" className="text-sm">Password (optional)</label>
          <input
            id="password"
            type="password"
            className="border rounded-md p-3 w-full"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <div className="mb-4">
          <label htmlFor="experience" className="text-sm">Experience</label>
          <input
            id="experience"
            type="text"
            className="border rounded-md p-3 w-full"
            value={experience}
            onChange={(e) => setExperience(e.target.value)}
          />
        </div>

        <div className="mb-4">
          <label htmlFor="fees" className="text-sm">Fees</label>
          <input
            id="fees"
            type="number"
            className="border rounded-md p-3 w-full"
            value={fees}
            onChange={(e) => setFees(e.target.value)}
          />
        </div>

        

        <div className="mb-4">
          <label htmlFor="speciality" className="text-sm">Speciality</label>
          <select
            id="speciality"
            className="border rounded-md p-3 w-full"
            value={speciality}
            onChange={(e) => setSpeciality(e.target.value)}
          >
          <option value="General Physician">General Physician</option>
<option value="Gynecologist">Gynecologist</option>
<option value="Pediatrician">Pediatrician</option>
<option value="Cardiologist">Cardiologist</option>
<option value="Dermatologist">Dermatologist</option>
<option value="Endocrinologist">Endocrinologist</option>
<option value="Gastroenterologist">Gastroenterologist</option>
<option value="Neurologist">Neurologist</option>
<option value="Oncologist">Oncologist</option>
<option value="Orthopedic Surgeon">Orthopedic Surgeon</option>
<option value="Ophthalmologist">Ophthalmologist</option>
<option value="Psychiatrist">Psychiatrist</option>
<option value="Pulmonologist">Pulmonologist</option>
<option value="Radiologist">Radiologist</option>
<option value="Urologist">Urologist</option>
<option value="Anesthesiologist">Anesthesiologist</option>
<option value="Rheumatologist">Rheumatologist</option>
<option value="Nephrologist">Nephrologist</option>
<option value="Pathologist">Pathologist</option>
<option value="Hematologist">Hematologist</option>
<option value="ENT Specialist">ENT Specialist</option>
<option value="Plastic Surgeon">Plastic Surgeon</option>
<option value="General Surgeon">General Surgeon</option>
<option value="Dentist">Dentist</option>
<option value="Chiropractor">Chiropractor</option>
<option value="Physiotherapist">Physiotherapist</option>
<option value="Dietitian/Nutritionist">Dietitian/Nutritionist</option>
<option value="Speech Therapist">Speech Therapist</option>
<option value="Occupational Therapist">Occupational Therapist</option>
<option value="Psychologist">Psychologist</option>
<option value="Obstetrician">Obstetrician</option></select>
        </div>

        <div className="mb-4">
          <label htmlFor="degree" className="text-sm">Degree</label>
          <input
            id="degree"
            type="text"
            className="border rounded-md p-3 w-full"
            value={degree}
            onChange={(e) => setDegree(e.target.value)}
          />
        </div>

        <div className="mb-4">
          <label htmlFor="address1" className="text-sm">Address 1</label>
          <input
            id="address1"
            type="text"
            className="border rounded-md p-3 w-full"
            value={address1}
            onChange={(e) => setAddress1(e.target.value)}
          />
        </div>

        <div className="mb-4">
          <label htmlFor="address2" className="text-sm">Address 2</label>
          <input
            id="address2"
            type="text"
            className="border rounded-md p-3 w-full"
            value={address2}
            onChange={(e) => setAddress2(e.target.value)}
          />
        </div>
        <div className="mb-4">
          <label htmlFor="about" className="text-sm">About</label>
          <textarea
            id="about"
            className="border rounded-md p-3 w-full"
            value={about}
            onChange={(e) => setAbout(e.target.value)}
            rows="4"
          />
        </div>

        <button
          type="submit"
          className="bg-primary px-10 py-3 mt-4 text-white rounded-full"
        >
          Update Doctor
        </button>
      </div>
    </form>
  );
}
