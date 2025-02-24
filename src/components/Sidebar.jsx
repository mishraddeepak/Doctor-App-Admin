// import React from "react";
// import { useContext } from "react";
// import { AdminContext } from "../context/AdminContext";
// import { NavLink } from "react-router-dom";
// import { assets } from "../assets/assets";
// export default function Sidebar() {
//   const { aToken } = useContext(AdminContext);

//   return (
//     <div className="min-h-screen bg-white border-r">
//       {aToken && (
//         <ul className="text-[#515151] mt-5">
//           <NavLink className={({isActive})=>`flex items-center gap-3 py-3.5 px-3 md  ;px-9 md ;min-w-72 cursor-pointer ${isActive?'bg-[#F2F3FF] border-r-4 border-primary':''}`} to={"/admin-dashboard"}>
//             <img src={assets.home_icon} alt="" />
//             <p>Dashboard</p>
//           </NavLink>
//           <NavLink className={({isActive})=>`flex items-center gap-3 py-3.5 px-3 md  ;px-9 md ;min-w-72 cursor-pointer ${isActive?'bg-[#F2F3FF] border-r-4 border-primary':''}`} to={"/all-appointments"}>
//             <img src={assets.appointment_icon} alt="" />
//             <p>Appointments</p>
//           </NavLink>
//           <NavLink className={({isActive})=>`flex items-center gap-3 py-3.5 px-3 md  ;px-9 md ;min-w-72 cursor-pointer ${isActive?'bg-[#F2F3FF] border-r-4 border-primary':''}`} to={"/add-doctor"}>
//             <img src={assets.add_icon} alt="" />
//             <p>Add Doctor</p>
//           </NavLink>
//           <NavLink className={({isActive})=>`flex items-center gap-3 py-3.5 px-3 md  ;px-9 md ;min-w-72 cursor-pointer ${isActive?'bg-[#F2F3FF] border-r-4 border-primary':''}`} to={"/doctors-list"}>
//             <img src={assets.people_icon} alt="" />
//             <p>Doctors List</p>
//           </NavLink>
//         </ul>
//       )}
//     </div>
//   );
// }



// import React, { useContext } from "react";
// import { AdminContext } from "../context/AdminContext";
// import { NavLink } from "react-router-dom";
// import { assets } from "../assets/assets";

// export default function Sidebar() {
//   const { aToken } = useContext(AdminContext);

//   return (
//     <div className="min-h-screen bg-white border-r md:w-72 sm:w-56">
//       {aToken && (
//         <ul className="text-[#515151] mt-5">
//           <NavLink
//             className={({ isActive }) =>
//               `flex items-center gap-3 py-3.5 px-3 md:px-9 sm:px-5 md:min-w-72 sm:min-w-56 cursor-pointer ${
//                 isActive
//                   ? "bg-[#F2F3FF] border-r-4 border-primary"
//                   : ""
//               }`
//             }
//             to={"/admin-dashboard"}
//           >
//             <img src={assets.home_icon} alt="" />
//             <p>Dashboard</p>
//           </NavLink>

//           <NavLink
//             className={({ isActive }) =>
//               `flex items-center gap-3 py-3.5 px-3 md:px-9 sm:px-5 md:min-w-72 sm:min-w-56 cursor-pointer ${
//                 isActive
//                   ? "bg-[#F2F3FF] border-r-4 border-primary"
//                   : ""
//               }`
//             }
//             to={"/all-appointments"}
//           >
//             <img src={assets.appointment_icon} alt="" />
//             <p>Appointments</p>
//           </NavLink>

//           <NavLink
//             className={({ isActive }) =>
//               `flex items-center gap-3 py-3.5 px-3 md:px-9 sm:px-5 md:min-w-72 sm:min-w-56 cursor-pointer ${
//                 isActive
//                   ? "bg-[#F2F3FF] border-r-4 border-primary"
//                   : ""
//               }`
//             }
//             to={"/add-doctor"}
//           >
//             <img src={assets.add_icon} alt="" />
//             <p>Add Doctor</p>
//           </NavLink>

//           <NavLink
//             className={({ isActive }) =>
//               `flex items-center gap-3 py-3.5 px-3 md:px-9 sm:px-5 md:min-w-72 sm:min-w-56 cursor-pointer ${
//                 isActive
//                   ? "bg-[#F2F3FF] border-r-4 border-primary"
//                   : ""
//               }`
//             }
//             to={"/doctors-list"}
//           >
//             <img src={assets.people_icon} alt="" />
//             <p>Doctors List</p>
//           </NavLink>
//         </ul>
//       )}
//     </div>
//   );
// }



import React, { useContext } from "react";
import { AdminContext } from "../context/AdminContext";
import { NavLink } from "react-router-dom";
import { assets } from "../assets/assets";
import { DoctorContext } from "../context/DoctorContext";

export default function Sidebar() {
  const { aToken } = useContext(AdminContext);
const {dToken}=useContext(DoctorContext)
  return (
    <div className="min-h-screen bg-white border-r sm:w-40 md:w-64">
      {aToken && (
        <ul className="text-[#515151] mt-5">
          <NavLink
            className={({ isActive }) =>
              `flex items-center gap-3 py-3.5 px-3 sm:px-4 md:px-6 cursor-pointer ${
                isActive
                  ? "bg-[#F2F3FF] border-r-4 border-primary"
                  : ""
              }`
            }
            to={"/admin-dashboard"}
          >
            <img src={assets.home_icon} alt="" className="w-5 h-5" />
            <p className="hidden sm:block">Dashboard</p>
          </NavLink>

          <NavLink
            className={({ isActive }) =>
              `flex items-center gap-3 py-3.5 px-3 sm:px-4 md:px-6 cursor-pointer ${
                isActive
                  ? "bg-[#F2F3FF] border-r-4 border-primary"
                  : ""
              }`
            }
            to={"/all-appointments"}
          >
            <img src={assets.appointment_icon} alt="" className="w-5 h-5" />
            <p className="hidden sm:block">Appointments</p>
          </NavLink>

          <NavLink
            className={({ isActive }) =>
              `flex items-center gap-3 py-3.5 px-3 sm:px-4 md:px-6 cursor-pointer ${
                isActive
                  ? "bg-[#F2F3FF] border-r-4 border-primary"
                  : ""
              }`
            }
            to={"/add-doctor"}
          >
            <img src={assets.add_icon} alt="" className="w-5 h-5" />
            <p className="hidden sm:block">Add Doctor</p>
          </NavLink>

          <NavLink
            className={({ isActive }) =>
              `flex items-center gap-3 py-3.5 px-3 sm:px-4 md:px-6 cursor-pointer ${
                isActive
                  ? "bg-[#F2F3FF] border-r-4 border-primary"
                  : ""
              }`
            }
            to={"/doctors-list"}
          >
            <img src={assets.people_icon} alt="" className="w-5 h-5" />
            <p className="hidden sm:block">Doctors List</p>
          </NavLink>
        </ul>
      )}


{dToken && (
        <ul className="text-[#515151] mt-5">
       

          <NavLink
            className={({ isActive }) =>
              `flex items-center gap-3 py-3.5 px-3 sm:px-4 md:px-6 cursor-pointer ${
                isActive
                  ? "bg-[#F2F3FF] border-r-4 border-primary"
                  : ""
              }`
            }
            to={"/doctor-appointments"}
          >
            <img src={assets.appointment_icon} alt="" className="w-5 h-5" />
            <p className="hidden sm:block">Appointments</p>
          </NavLink>

          <NavLink
            className={({ isActive }) =>
              `flex items-center gap-3 py-3.5 px-3 sm:px-4 md:px-6 cursor-pointer ${
                isActive
                  ? "bg-[#F2F3FF] border-r-4 border-primary"
                  : ""
              }`
            }
            to={"/doctor-profile"}
          >
            <img src={assets.people_icon} alt="" className="w-5 h-5" />
            <p className="hidden sm:block">Profile</p>
          </NavLink>

          
        </ul>
      )}
    </div>
  );
}
