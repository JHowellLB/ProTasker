import SignupCSS from "./login.module.css";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../pages/api/auth/[...nextauth]";
import { GoogleLogin } from "./login";
import { GoogleLogout } from "./login";
import Link from "next/link";

const Login = async () => {
  const session = await getServerSession(authOptions);
  return (
    <section id="signup" className={SignupCSS.signupWrapper}>
      <div className={SignupCSS.signupBox}>
        <h1 className={SignupCSS.title}>ProTasker</h1>
        {session ? (
          <div className={SignupCSS.googleWrapper}>
            <div className={SignupCSS.errorText}>
              <div className={SignupCSS.email}> {session.user?.email} </div>
              <div>LOGGED IN</div>
            </div>
            <Link href="/" className={SignupCSS.returnText}>
              Return to Home Page
            </Link>
            <GoogleLogout />
          </div>
        ) : (
          <div className={SignupCSS.googleWrapper}>
            <GoogleLogin />
          </div>
        )}
      </div>
    </section>
  );
};

export default Login;
