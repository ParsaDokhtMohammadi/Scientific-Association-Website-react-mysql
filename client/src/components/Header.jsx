import { NavLink } from "react-router";
const Header = () => {
  return (
    <div className="w-full p-3 bg-[#3B82F6]">
      <nav className="flex flex-row items-center gap-3">
        <NavLink
          to="/Events"
          className={({ isActive }) =>
            `duration-200 text-[#D1D5DB] ${isActive ? "text-[#D1D5DB]" : ""} hover:text-[#06B6D4]`
          }
        >
          Events
        </NavLink>
        <NavLink
          to="/News"
          className={({ isActive }) =>
            `duration-200 text-[#D1D5DB] ${isActive ? "text-[#06B6D4]" : ""} hover:text-[#06B6D4]`
          }
        >
          News
        </NavLink>
      </nav>
    </div>
  );
};

export default Header;