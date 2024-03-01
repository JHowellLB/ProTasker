import { useEffect, useState } from "react"

import "../globals.css"

import Navbar from "../components/Navbar/Navbar"

function IndexPopup() {
  const [currentUrl, setCurrentUrl] = useState<string>("")
  const getCurrntUrl = async () => {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true })
    setCurrentUrl(tab.url)
  }

  useEffect(() => {
    getCurrntUrl()
  }, [currentUrl])

  return (
    <div
      style={{
        padding: 16
      }}>
      <Navbar />
    </div>
  )
}

export default IndexPopup
