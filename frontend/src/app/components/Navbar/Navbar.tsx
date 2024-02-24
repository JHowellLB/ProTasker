"use client";
import NavbarCSS from "./navbar.module.css";
import Link from "next/link";
import { usePathname } from "next/navigation";
const Navbar = () => {
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
              <Link href={link.path}>{link.name}</Link>
            </button>
          ))}
        </ul>
      </div>
      {/* <div className={NavbarCSS.navSignOut}>
        <button onClick={profileClicked(profile)}>
          <img
            src={session.data?.user?.image!}
            alt=""
            className={NavbarCSS.profile}
          />
        </button>
        <div className={profile ? NavbarCSS.logoutActive : NavbarCSS.logout}>
          <button onClick={() => signOut()}>Logout</button>
        </div>
      </div> */}
    </nav>
  );
};

export default Navbar;
