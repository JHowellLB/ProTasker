"use client";
import SignupCSS from "./login.module.css";
import { signIn } from "next-auth/react";
import googleLogo from "../assets/images/Google__G__logo.svg.png";
import Image from "next/image";

const Login = () => {
  return (
    <section id="signup" className={SignupCSS.signupWrapper}>
      <div className={SignupCSS.signupBox}>
        <h1 className={SignupCSS.title}>ProTasker</h1>
        <div className={SignupCSS.googleWrapper}>
          <button
            type="button"
            onClick={() => signIn("google")}
            className={SignupCSS.googleContainer}
          >
            <div className={SignupCSS.googleFont}>
              <Image
                src={googleLogo!}
                alt="google logo"
                className={SignupCSS.googleImg}
              />
              Sign Up With Google
            </div>
          </button>
        </div>
      </div>
    </section>
  );
};

export default Login;
