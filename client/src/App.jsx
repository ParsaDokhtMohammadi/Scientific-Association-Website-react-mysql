import {createBrowserRouter, RouterProvider , Route , createRoutesFromElements} from "react-router"
import React from 'react'
import './App.css';
import Layout from "./Layout";
import Login from "./pages/Login";
import Register from "./pages/Register";
import { Provider } from "react-redux";
import { store } from "./store/store";
import UserDashboard from "./pages/UserDashboard";
const App = () => {
  const router = createBrowserRouter(
    createRoutesFromElements(
      <Route path="" element={<Layout></Layout>}>
        <Route path="/" element={<Login></Login>}></Route>
        <Route path="/UserDashboard" element={<UserDashboard></UserDashboard>}></Route>
        <Route path="/Register" element={<Register></Register>}></Route>
     
      </Route>
    )
  )
  return (
    
    <Provider store={store}>
      <RouterProvider router={router}>

      </RouterProvider>
    </Provider>
    
    
  )
}
export default App