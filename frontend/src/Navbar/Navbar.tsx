import NavCSS from "./navbar.module.css";
import { NavLink } from "react-router-dom";

const Navbar = () => {
  return (
    <nav className={NavCSS.navWrapper}>
      <NavLink
        to="/"
        className={({ isActive }) =>
          isActive ? NavCSS.activeLink : NavCSS.link
        }
      >
        <div className={NavCSS.link}>Most Used</div>
      </NavLink>
      <NavLink
        to="/visualization"
        className={({ isActive }) =>
          isActive ? NavCSS.activeLink : NavCSS.link
        }
      >
        <div className={NavCSS.link}>Visualization</div>
      </NavLink>
      <NavLink
        to="/sitelimit"
        className={({ isActive }) =>
          isActive ? NavCSS.activeLink : NavCSS.link
        }
      >
        <div className={NavCSS.link}>Site Limit</div>
      </NavLink>
      <NavLink
        to="/tasktimer"
        className={({ isActive }) =>
          isActive ? NavCSS.activeLink : NavCSS.link
        }
      >
        <div className={NavCSS.link}>Task Timer</div>
      </NavLink>
    </nav>
  );
};

export default Navbar;
