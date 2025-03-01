import React from "react";
import { assets } from "../assets/assets";
import { useState } from "react";
import { useContext } from "react";
import { toast } from "react-toastify";
import { AdminContext } from "../context/AdminContext";
import axios from "axios";
import { DoctorContext } from "../context/DoctorContext";
export default function Login() {
  const [state, setState] = useState("Admin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { aToken, setAToken, backendUrl } = useContext(AdminContext);
  const { dToken,setDToken } = useContext(DoctorContext);

  // const submitHandler = async (event) => {
  //   event.preventDefault();

  //   try {
  //     if (state === "Admin") {
  //       console.log("hii");
  //       const { data } = await axios.post(`${backendUrl}/api/login`, {
  //         email,
  //         password,
  //       });
  //       if (data.user.role==="ADMIN") {
  //         localStorage.setItem("aToken", data.accessToken);
  //         setAToken(data.accessToken);
  //       } else {
  //         toast.error(data.message);
  //       }
  //     } else {
  //       const { data } = await axios.post(`${backendUrl}/api/login`, {
  //         email,
  //         password,
  //       });
  //       console.log(data)
  //       console.log(data.accessToken)
  //       if (data.success) {
  //         localStorage.setItem("dToken", data.
  //           accessToken
  //           );
  //           localStorage.setItem("userId",data.user._id)
  //         setDToken(data.accessToken);
  //       } else {
  //         toast.error(data.message);
  //       }
  //     }
  //   } catch (error) {}
  // };

  const submitHandler = async (event) => {
    event.preventDefault();
    try {
      if (state === "Admin") {
        console.log("Admin login attempt");
        const { data } = await axios.post(`${backendUrl}/api/login`, {
          email,
          password,
        });
        if (data.user.role === "ADMIN") {
          localStorage.setItem("aToken", data.accessToken); 
          setAToken(data.accessToken); 
          toast.success("Admin login successful");
        } else {
          toast.error("You are not authorized as an admin.");
        }
      } else {
        console.log("Doctor login attempt");
        const { data } = await axios.post(`${backendUrl}/api/login`, {
          email,
          password,
        });
        if (data.success && data.user.role==="DOCTOR") {
          localStorage.setItem("dToken", data.accessToken);
          localStorage.setItem("userId", data.user._id); 
          setDToken(data.accessToken);
          console.log("hiii")
          toast.success("Doctor login successful");
        } else {
          toast.error("You are not authorised as doctor."); 
        }
      }
    } catch (error) {
      if (error.response) {
        console.log(error)
        console.log("Error response:", error.response.data);
        toast.error(error.response.data.message);
      } else if (error.request) {
        console.log("No response received:", error.request);
        toast.error("No response received from the server.");
      } else {
        console.log("Error:", error.message);
        toast.error("An unexpected error occurred."); 
      }
    }
  };

  return (
    <form
      onSubmit={submitHandler}
      action=""
      className="min-h-[80vh] flex items-center "
    >
      <div className="flex flex-col gap-3 m-auto items-start p-8 min-w-[340px] sm:min-w-96 border rounded-xl text-[#5E5E5E] text-sm shadow-lg ">
        <p className="text-2xl font-semibold m-auto">
          <span className="text-primary">{state}</span>Login
        </p>
        <div className="w-full">
          <p>Email</p>
          <input
            onChange={(e) => setEmail(e.target.value)}
            value={email}
            className="border border-[#DADADA] rounded w-full p-2 mt-1"
            type="email"
            required
          />
        </div>
        <div className="w-full">
          <p> Password</p>
          <input
            onChange={(e) => setPassword(e.target.value)}
            value={password}
            className="border border-[#DADADA] rounded w-full p-2 mt-1"
            type="password"
            required
          />
        </div>

        <button className="bg-primary text-white w-full py-2 rouunded-md text-base ">
          LogIn
        </button>
        {state === "Admin" ? (
          <p>
            Doctor Login{" "}
            <span
              className="text-primary underline cursor-pointer"
              onClick={() => setState("Doctor")}
            >
              Click Here
            </span>
          </p>
        ) : (
          <p>
            Admin Login{" "}
            <span
              className="text-primary underline cursor-pointer"
              onClick={() => setState("Admin")}
            >
              Click Here
            </span>
          </p>
        )}
      </div>
    </form>
  );
}
