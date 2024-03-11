import "../globals.css"

import AuthForm from "~components/Auth/Auth"
import useFirebaseUser from "~firebase/firebaseUser"

import Navbar from "../components/Navbar/Navbar"

function IndexPopup() {
  const { user, isLoading, onLogin } = useFirebaseUser()

  return (
    <div>
      {user ? (
        <div>
          <Navbar />
        </div>
      ) : (
        <AuthForm />
      )}
    </div>
  )
}

export default IndexPopup
