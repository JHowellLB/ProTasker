"use client";
import NavbarCSS from "./navbar.module.css";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
import { useState } from "react";
const Navbar = () => {
  const session = useSession();
  const [profile, profileOpen] = useState(false);
  const profileClicked = (menu: any) => () => {
    profileOpen(!profile);
    console.log(profile);
  };

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
      <div className={NavbarCSS.navSignOut}>
        <button onClick={profileClicked(profile)}>
          <img src={session.data?.user?.image} className={NavbarCSS.profile} />
        </button>
        <div className={profile ? NavbarCSS.logoutActive : NavbarCSS.logout}>
          <button onClick={() => signOut()}>Logout</button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
