import { useEffect, useState } from "react"

import "../globals.css"

import Navbar from "../components/Navbar/Navbar"

function IndexPopup() {
  const [user, setUserInfo] = useState(false)

  useEffect(() => {
    chrome.identity.getProfileUserInfo((userInfo) => {
      if (chrome.runtime.lastError) {
        console.error(chrome.runtime.lastError)
        return
      }
      if (userInfo.email != "") {
        setUserInfo(true)
      }
    })
  }, [])
  console.log("userInfo", user)
  return (
    <div>
      {user ? (
        <div>
          <Navbar />
        </div>
      ) : (
        <div>Log in to Google Account</div>
      )}
    </div>
  )
}

export default IndexPopup
