import "./navbar.css";
import { NavLink } from "react-router-dom";

const Navbar = () => {
  return (
    <nav className="navWrapper">
      <div className="linksContainer">
        <li className="links">
          <NavLink to="/">Most Used</NavLink>
        </li>
        <li className="links">
          <NavLink to="/visualization">Visualization</NavLink>
        </li>
        <li className="links">
          <NavLink to="/sitelimit">Site Limit</NavLink>
        </li>
        <li className="links">
          <NavLink to="/tasktimer">Task Timer</NavLink>
        </li>
      </div>
    </nav>
  );
};

export default Navbar;
