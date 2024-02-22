"use client";
import NavbarCSS from "./navbar.module.css";
import Link from "next/link";
import { usePathname } from "next/navigation";
const Navbar = () => {
  const links = [
    { name: "Most Used", path: "/mostused" },
    { name: "Visualization", path: "/visualization" },
    { name: "Site Limit", path: "/sitelimit" },
    { name: "Task Timer", path: "/tasktimer" },
  ];

  const pathname = usePathname();
  return (
    <nav className={NavbarCSS.navWrapper}>
      <ul>
        {links.map((link) => (
          <button
            type="button"
            key={link.path}
            className={
              pathname === link.path ? NavbarCSS.linksActive : NavbarCSS.links
            }
          >
            <Link
              href={link.path}
              // className={pathname === link.path ? NavbarCSS.linksActive : ""}
            >
              {link.name}
            </Link>
          </button>
        ))}
      </ul>
    </nav>
  );
};

export default Navbar;
