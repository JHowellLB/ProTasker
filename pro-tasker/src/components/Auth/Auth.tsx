// src/components/AuthForm.tsx
import "./auth.css"

import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword
} from "firebase/auth"
import React, { useState } from "react"

import { auth } from "~firebase/firebase"
import useFirebaseUser from "~firebase/firebaseUser"

export default function AuthForm() {
  const [showLogin, setShowLogin] = useState(true)
  const [email, setEmail] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [password, setPassword] = useState("")
  const { isLoading, onLogin } = useFirebaseUser()

  const signIn = async (e: any) => {
    if (!email || !password)
      return console.log("Please enter email and password")

    e.preventDefault()
    try {
      await signInWithEmailAndPassword(auth, email, password)
    } catch (error: any) {
      console.log(error.message)
    } finally {
      setEmail("")
      setPassword("")
      setConfirmPassword("")
      onLogin()
    }
  }

  const signUp = async (e: any) => {
    try {
      if (!email || !password || !confirmPassword)
        return console.log("Please enter email and password")

      if (password !== confirmPassword)
        return console.log("Passwords do not match")

      e.preventDefault()

      const user = await createUserWithEmailAndPassword(auth, email, password)
      onLogin()
    } catch (error: any) {
      console.log(error.message)
    } finally {
      setEmail("")
      setPassword("")
      setConfirmPassword("")
    }
  }

  return (
    <div className="authWrapper">
      <div className="authContainer">
        <div className="loginSignup">
          {!isLoading && (
            <span>
              {showLogin ? (
                <div className="loginSignupText">
                  Login to <div className="protaskerText">ProTasker</div>
                </div>
              ) : (
                <div className="loginSignupText">
                  Sign up for<div className="protaskerText">ProTasker</div>
                </div>
              )}
            </span>
          )}
          {isLoading && <span>Loading...</span>}
        </div>

        <div className="formContainer">
          {!showLogin && !isLoading && (
            <form className="signupForm" onSubmit={signUp}>
              <div className="authFormText">
                <label htmlFor="email" className="">
                  Your email
                </label>
                <input
                  type="email"
                  name="email"
                  id="email"
                  onChange={(e) => setEmail(e.target.value)}
                  value={email}
                  placeholder="name@company.com"
                  className="textbox"
                  required
                />
              </div>
              <div className="authFormText">
                <label htmlFor="password" className="">
                  Password
                </label>
                <input
                  type="password"
                  name="password"
                  id="password"
                  onChange={(e) => setPassword(e.target.value)}
                  value={password}
                  placeholder="••••••••"
                  className="textbox"
                  required
                />
              </div>
              <div className="authFormText">
                <label htmlFor="confirm-password" className="">
                  Confirm password
                </label>
                <input
                  type="password"
                  name="confirm-password"
                  id="confirm-password"
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  value={confirmPassword}
                  placeholder="••••••••"
                  className="textbox"
                  required
                />
              </div>
              <div className="">
                <div className="termsContainer">
                  <label htmlFor="terms">
                    I accept the{" "}
                    <a className="terms" href="#">
                      Terms and Conditions
                    </a>
                  </label>
                  <input
                    id="terms"
                    aria-describedby="terms"
                    type="checkbox"
                    className="textbox"
                    required
                  />
                </div>
              </div>
              <div>
                <button type="submit" className="btn">
                  Create an account
                </button>
              </div>
              <div className="">
                Already have an account?{" "}
                <button onClick={() => setShowLogin(true)} className="btn">
                  Login here
                </button>
              </div>
            </form>
          )}
          {showLogin && !isLoading && (
            <form className="signupForm" onSubmit={signIn}>
              <div className="authFormText">
                <label htmlFor="email">Your email</label>
                <input
                  type="email"
                  name="email"
                  id="email"
                  onChange={(e) => setEmail(e.target.value)}
                  value={email}
                  placeholder="name@company.com"
                  className="textbox"
                  required
                />
              </div>
              <div className="authFormText">
                <label htmlFor="password" className="">
                  Password
                </label>
                <input
                  type="password"
                  name="password"
                  id="password"
                  onChange={(e) => setPassword(e.target.value)}
                  value={password}
                  placeholder="••••••••"
                  className="textbox"
                  required
                />
              </div>
              <div className="signInContainer">
                <label htmlFor="remember" className="rememberText">
                  <div>Remember me</div>
                  <input
                    id="remember"
                    aria-describedby="remember"
                    type="checkbox"
                    className="textbox"
                  />
                </label>

                <button type="submit" className="btn">
                  Sign in
                </button>
              </div>

              <div className="">
                Don’t have an account yet?{" "}
                <button onClick={() => setShowLogin(false)} className="btn">
                  Sign up
                </button>
              </div>
              <a href="#" className="">
                Forgot password?
              </a>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}
