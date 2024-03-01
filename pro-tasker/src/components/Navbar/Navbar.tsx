import "./navbar.css"

import { useState } from "react"

import MostUsed from "~pages/mostused"
import SiteLimit from "~pages/sitelimit"
import TaskTimer from "~pages/tasktimer"
import Visualization from "~pages/visualization"

const Tabs = () => {
  const [activeTab, setActiveTab] = useState("mostused")

  const handleTabClick = (tab: string) => {
    setActiveTab(tab)
  }
  return (
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
              className={activeTab === "visualization" ? "onTab" : "inactive"}>
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
      {activeTab === "mostused" ? <MostUsed /> : <></>}
      {activeTab === "visualization" ? <Visualization /> : <></>}
      {activeTab === "sitelimit" ? <SiteLimit /> : <></>}
      {activeTab === "tasktimer" ? <TaskTimer /> : <></>}
    </div>
  )
}

export default Tabs
