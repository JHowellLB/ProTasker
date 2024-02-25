import SignupCSS from "./login.module.css";
import Link from "next/link";

const Login = async () => {
  return (
    <section id="signup" className={SignupCSS.signupWrapper}>
      <div className={SignupCSS.signupBox}>
        <h1 className={SignupCSS.title}>ProTasker</h1>

        <div className={SignupCSS.googleWrapper}>
          <div className={SignupCSS.errorText}>
            <div>LOGGED IN</div>
          </div>
          <Link href="/" className={SignupCSS.returnText}>
            Return to Home Page
          </Link>
        </div>
        <div className={SignupCSS.googleWrapper}>{/* <GoogleLogin /> */}</div>
      </div>
    </section>
  );
};

export default Login;
