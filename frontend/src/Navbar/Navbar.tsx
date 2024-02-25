import "./navbar.css";
import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <nav className="navWrapper">
      <Link to="/">Most Used</Link>
      <Link to="/visualization">Visualization</Link>
      <Link to="/sitelimit">Site Limit</Link>
      <Link to="/tasktimer">Task Timer</Link>
    </nav>
  );
};

export default Navbar;
