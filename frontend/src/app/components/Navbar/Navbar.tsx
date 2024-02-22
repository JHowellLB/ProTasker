"use client";
import NavbarCSS from "./navbar.module.css";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
const Navbar = () => {
  const session = useSession();
  const links = [
    { name: "Most Used", path: "/" },
    { name: "Visualization", path: "/visualization" },
    { name: "Site Limit", path: "/sitelimit" },
    { name: "Task Timer", path: "/tasktimer" },
  ];

  const pathname = usePathname();
  return (
    <nav className={NavbarCSS.navWrapper}>
      <div className={NavbarCSS.navContainer}>
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
      </div>
      <div className={NavbarCSS.navSignOut}>
        <div>{session?.data?.user?.name}</div>
        <button onClick={() => signOut()}>Logout</button>
      </div>
    </nav>
  );
};

export default Navbar;
