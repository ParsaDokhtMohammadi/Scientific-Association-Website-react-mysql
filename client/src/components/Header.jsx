import { Link, NavLink, useNavigate } from "react-router";
import { useSelector, useDispatch } from "react-redux";
import { clearUser } from "../features/UserSlice";
import { IoLogOutOutline } from "react-icons/io5";
import { FaUser } from "react-icons/fa6";
const Header = () => {
  const User = useSelector(state => state.CurrentUser.CurrentUser);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  return (
    <header className={` w-full bg-[#1A1A1A] ${User===null ?"hidden":"flex"} justify-between items-center px-4 py-3 mb-8 shadow-lg`}>
      <img src="assets/img/logo.png" className="w-[75px]" alt="Logo" />
      <nav className="flex flex-row items-center gap-6">
        <NavLink
          to="/Events"
          className={({ isActive }) =>
            `duration-200 text-[#F5F5F5] ${isActive ? "text-[#06B6D4]" : ""} hover:text-[#0891B2]`
          }
        >
          Events
        </NavLink>
        <NavLink
          to="/News"
          className={({ isActive }) =>
            `duration-200 text-[#F5F5F5] ${isActive ? "text-[#06B6D4]" : ""} hover:text-[#0891B2]`
          }
        >
          News
        </NavLink>
        <NavLink
          to={`${User?.role === "admin" ? "/SubmissionAdmin" : "/Submission"}`}
          className={({ isActive }) =>
            `duration-200 text-[#F5F5F5] ${isActive ? "text-[#06B6D4]" : ""} hover:text-[#0891B2]`
          }
        >
          Submissions
        </NavLink>
        {User?.role === "admin" && (
          <NavLink
            to="/UsersAdmin"
            className={({ isActive }) =>
              `duration-200 text-[#F5F5F5] ${isActive ? "text-[#06B6D4]" : ""} hover:text-[#0891B2]`
            }
          >
            Users
          </NavLink>
        )}
         
          <NavLink
            to="/UserRegistrations"
            className={({ isActive }) =>
              `duration-200 text-[#F5F5F5] ${isActive ? "text-[#06B6D4]" : ""} hover:text-[#0891B2]`
            }
          >
            Registrations
          </NavLink>
 
      </nav>
      <div className="flex gap-2 items-center">
        {User && (
           <>
          <NavLink
            to="/EditUserProfile"
            className={
              `duration-200 text-[#06B6D4] hover:text-[#0891B2]`
          }
          >
            <FaUser size={22}/>
          </NavLink>
     
          <button
            className="rounded h-10 px-4   text-[#06B6D4] hover:text-[#0891B2] transition-colors duration-200"
            onClick={() => {
              dispatch(clearUser());
              navigate("/");
            }}
            >
            <IoLogOutOutline size={28}/>
          </button>
            </>      
        )}
      </div>
    </header>
  );
};

export default Header;
