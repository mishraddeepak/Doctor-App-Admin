import { useContext } from 'react'
import {createContext} from 'react'

export const AppContext = createContext()


import React from 'react'

export default function AppContextProvider(props) {
  
    const value = {}
  return (
   <AppContext.Provider value={value}>
    {props.children}
   </AppContext.Provider>
  )
}
