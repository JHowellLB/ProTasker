"use client";
import SignupCSS from "./signup.module.css";
import googleLogo from "../assets/images/Google__G__logo.svg.png";
import { signInWithPopup } from "firebase/auth";
import { auth, provider } from "../services/firebase";
import { useRouter } from "next/navigation";

const Signup = () => {
  const router = useRouter();

  const googleLogin = () => {
    signInWithPopup(auth, provider).then((data) => {
      console.log(data.user.emailVerified);
      if (data.user.emailVerified) {
        router.push("/mostused");
      }
    });
  };
  return (
    <section id="signup" className={SignupCSS.signupWrapper}>
      <div className={SignupCSS.signupBox}>
        <h1 className={SignupCSS.title}>ProTasker</h1>
        <div className={SignupCSS.googleWrapper}>
          <button
            type="button"
            onClick={googleLogin}
            className={SignupCSS.googleContainer}
          >
            <div className={SignupCSS.googleFont}>
              <img
                src={googleLogo.src}
                alt="google logo"
                className={SignupCSS.googleImg}
              />
              Sign Up With Google
            </div>
          </button>
          <div className={SignupCSS.login}>
            Already have an account?
            <a href="/login" className={SignupCSS.loginLink}>
              Login
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Signup;
