// "use client";
// import SignupCSS from "./login.module.css";
// import googleLogo from "../assets/images/Google__G__logo.svg.png";
// import { signIn, signOut } from "next-auth/react";

// export const GoogleLogin = () => {
//   return (
//     <button
//       type="button"
//       onClick={() => signIn("google")}
//       className={SignupCSS.googleContainer}
//     >
//       <div className={SignupCSS.googleFont}>
//         <img
//           src={googleLogo.src}
//           alt="google logo"
//           height={300}
//           width={300}
//           className={SignupCSS.googleImg}
//         />
//         Sign Up With Google
//       </div>
//     </button>
//   );
// };

// export const GoogleLogout = () => {
//   return (
//     <div className={SignupCSS.logoutContainer}>
//       Not you?
//       <button
//         type="button"
//         onClick={() => signOut()}
//         className={SignupCSS.logout}
//       >
//         Logout
//       </button>
//     </div>
//   );
// };
