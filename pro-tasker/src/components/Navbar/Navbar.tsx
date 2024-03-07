import "./navbar.css"

import { useState } from "react"

import useFirebaseUser from "~firebase/firebaseUser"
import MostUsed from "~tabs/mostused"
import SiteLimit from "~tabs/sitelimit"
import TaskTimer from "~tabs/tasktimer"
import Visualization from "~tabs/visualization"

const Tabs = () => {
  const [activeTab, setActiveTab] = useState("mostused")
  const { user, isLoading, onLogout } = useFirebaseUser()

  const handleTabClick = (tab: string) => {
    setActiveTab(tab)
  }
  const logout = async (e: any) => {
    e.preventDefault()
    try {
      await onLogout()
    } catch (error: any) {
      console.log(error.message)
    }
  }
  return (
    <div>
      <div className="tabWrapper">
        <nav className="navWrapper">
          <div>
            <li>
              <div
                onClick={() => handleTabClick("mostused")}
                className={activeTab === "mostused" ? "onTab" : "inactive"}>
                Most Used
              </div>
            </li>
            <li>
              <div
                onClick={() => handleTabClick("visualization")}
                className={
                  activeTab === "visualization" ? "onTab" : "inactive"
                }>
                Visualization
              </div>
            </li>
            <li>
              <div
                onClick={() => handleTabClick("sitelimit")}
                className={activeTab === "sitelimit" ? "onTab" : "inactive"}>
                Site Limit
              </div>
            </li>
            <li>
              <div
                onClick={() => handleTabClick("tasktimer")}
                className={activeTab === "tasktimer" ? "onTab" : "inactive"}>
                Task Timer
              </div>
            </li>
          </div>
        </nav>
        <button type="button" onClick={onLogout} className="logoutBtn">
          Log Out
        </button>
      </div>
      {activeTab === "mostused" ? <MostUsed /> : <></>}
      {activeTab === "visualization" ? <Visualization /> : <></>}
      {activeTab === "sitelimit" ? <SiteLimit /> : <></>}
      {activeTab === "tasktimer" ? <TaskTimer /> : <></>}
    </div>
  )
}

export default Tabs
