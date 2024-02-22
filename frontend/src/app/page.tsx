"use client";
import Navbar from "./components/Navbar/Navbar";
import { auth } from "./services/firebase";
import { useRouter } from "next/navigation";
export default function Home() {
  const router = useRouter();
  const googleLogin = () => {
    auth.onAuthStateChanged(function (user) {
      if (user) {
        router.push("/mostused");
      } else {
        router.push("/signup");
      }
    });
  };
  return <section id="home">{googleLogin}</section>;
}
