import "./navbar.css";
import { NavLink } from "react-router-dom";

const Navbar = () => {
  return (
    <nav className="navWrapper">
      <div>
        <li>
          <NavLink to="/">Most Used</NavLink>
        </li>
        <li>
          <NavLink to="/visualization">Visualization</NavLink>
        </li>
        <li>
          <NavLink to="/sitelimit">Site Limit</NavLink>
        </li>
        <li>
          <NavLink to="/tasktimer">Task Timer</NavLink>
        </li>
      </div>
    </nav>
  );
};

export default Navbar;
