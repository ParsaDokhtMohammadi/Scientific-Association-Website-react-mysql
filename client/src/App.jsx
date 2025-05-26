import {createBrowserRouter, RouterProvider , Route , createRoutesFromElements} from "react-router"
import './App.css';
import Layout from "./Layout";
import Login from "./pages/Login";
import Register from "./pages/Register";
import { Provider } from "react-redux";
import { store } from "./store/store";
import UserDashboard from "./pages/UserDashboard";
import Events from "./pages/Events"
import News from "./pages/News"
import Submission from "./pages/Submission";
import UsersAdmin from "./pages/UsersAdmin";
import SubmissionAdmin from "./pages/SubmissionAdmin";
import SingleEvent from "./pages/SingleEvent";
const App = () => {
  const router = createBrowserRouter(
    createRoutesFromElements(
      <Route path="" element={<Layout></Layout>}>
        <Route path="/" element={<Login></Login>}></Route>
        <Route path="/UserDashboard" element={<UserDashboard></UserDashboard>}></Route>
        <Route path="/Register" element={<Register></Register>}></Route>
        <Route path="/Events" element={<Events></Events>}></Route>
        <Route path="/News" element={<News></News>}></Route>
        <Route path="/Submission" element={<Submission></Submission>}></Route>
        <Route path="/UsersAdmin" element={<UsersAdmin></UsersAdmin>}></Route>
        <Route path="/SubmissionAdmin" element={<SubmissionAdmin></SubmissionAdmin>}></Route>
        <Route path="/SingleEvent/:id" element={<SingleEvent></SingleEvent>}></Route>
     
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