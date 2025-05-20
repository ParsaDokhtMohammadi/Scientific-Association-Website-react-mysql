import { Link, NavLink , useNavigate } from "react-router";
import { useSelector , useDispatch} from "react-redux";
import { clearUser } from "../features/UserSlice";

const Header = () => {
  const User = useSelector(state => state.CurrentUser.CurrentUser)
  const dispatch = useDispatch()
  const navigate = useNavigate()
  console.log(User)
  return (
    <header className="w-full bg-[#3B82F6] flex justify-between items-center px-3  mb-8">
      <img src="assets/img/logo.png" className="w-[75px] " />
      <div className="flex ">
      <nav className="flex flex-row items-center gap-3">
        <NavLink
          to="/Events"
          className={({ isActive }) =>
            `duration-200 text-[#D1D5DB] ${isActive ? "text-[#D1D5DB]" : ""} hover:text-[#F87171] `
        }
        >
          Events
        </NavLink>
        <NavLink
          to="/News"
          className={({ isActive }) =>
            `duration-200 text-[#D1D5DB] ${isActive ? "text-[#06B6D4]" : ""} hover:text-[#F87171]`
        }
        >
          News
        </NavLink>
        <NavLink
          to={`${User?.role === "admin" ? "/SubmissionAdmin" :"/Submission"}`}
          className={({ isActive }) =>
            `duration-200 text-[#D1D5DB] ${isActive ? "text-[#06B6D4]" : ""} hover:text-[#F87171]`
        }
        >
          Submissions
        </NavLink>
        <NavLink 
          to="/UsersAdmin"
          className={({ isActive }) =>
            `duration-200 text-[#D1D5DB] ${isActive ? "text-[#06B6D4]" : ""} hover:text-[#F87171]
            ${User?.role!=="admin" ?"hidden":"block"}`
        }
        >
          Users
        </NavLink>
      </nav>
          </div>
          <div className="flex gap-2">
            <button className="rounded  h-10  px-2 bg-[#06B6D4] flex justify-center items-center duration-200 hover:bg-[#F87171] cursor-pointer"
            onClick={()=>{
              dispatch(clearUser())
              navigate("/")
            }} >logout</button>
          </div>
    </header>
  );
};

export default Header;