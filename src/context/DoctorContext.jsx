import {createContext, useState} from 'react'

import axios from 'axios'
import {toast} from 'react-toastify'
export const DoctorContext = createContext()
export default function DoctorContextProvider(props) {
  const[docProfile,setDocProfile] = useState([])
  const backendUrl = import.meta.env.VITE_BACKEND_URL
const[dToken,setDToken] = useState(
  localStorage.getItem("dToken") ? localStorage.getItem("dToken") : ""
)

const getDoctorDetails = async () => {
  try {
  console.log(dToken)
    const { data } = await axios.get(
      `${backendUrl}/api/user`, {
        headers: { Authorization: `Bearer ${dToken}` },
      }
    );
    console.log(data)
    setDocProfile(data.user)
    if(data.success){
      toast.success("loaded profile")
    }
  } catch (error) {
    toast.error("Unable to load this time try again late")
  }
};

    const value = {
      dToken,
      setDToken,
      backendUrl,
      getDoctorDetails,
      docProfile
    }

  return (
   <DoctorContext.Provider value={value}>
    {props.children}
   </DoctorContext.Provider>
  )
}
