import React, { useEffect, useState } from "react"

import {
  addBlocked,
  editBlocked,
  getActivationState,
  getBlockedData,
  removeBlocked,
  retrieveBlocked
} from "../../api/blockedDB"

import "./site_styles.css"

import { FaEdit, FaRegCheckCircle, FaRegTimesCircle } from "react-icons/fa"

const SiteLimit = () => {
  const [addVisibility, setAddVisibility] = useState(false)
  const [editVisibility, setEditVisibility] = useState(false)
  const [editingIndex, setEditingIndex] = useState(null)
  const [showInputs, setShowInputs] = useState(false)
  const [schedules, setSchedules] = useState([])
  const [websites, setWebsites] = useState([])
  const [site, setSite] = useState("")
  const [timerHour, setTimerHour] = useState("")
  const [timerMinute, setTimerMinute] = useState("")
  const [addSiteName, setAddSiteName] = useState("")
  const [siteList, setWebsiteList] = useState({})
  const [selectedSite, setSelectedSite] = useState("")
  const [activationState, setActivationState] = useState("")
  const [color, setColor] = useState("")

  const handleClick = () => {
    setShowInputs(!showInputs)
  }

  async function addWebsite() {
    let url = new URL(addSiteName)
    let hostname = url.hostname

    await addBlocked(
      hostname,
      parseInt(timerHour),
      parseInt(timerMinute),
      false
    )

    await parseWebsiteList()

    setTimerHour("")
    setTimerMinute("")
    setAddVisibility(false)
  }

  const addSiteClick = () => {
    // Reset other input fields
    setSite("")
    setTimerHour("")
    setTimerMinute("")
    // Reset schedules to an empty array
    setSchedules([])
    setAddVisibility(true)
    setShowInputs(false)
    setColor("green")
    setActivationState("Activate")
  }

  const handleActivate = async (site: string) => {
    // Retrieve the current blocked website data
    const blockedData = await getBlockedData(site)
    const websiteUpdated = typeof blockedData === "object" ? blockedData : {}
    // If the website is blocked, update the activated field to true
    if (blockedData) {
      const currentState = await getActivationState(site)
      if (currentState == false) {
        await chrome.storage.local.set({
          [`blocked-${site}`]: { ...websiteUpdated, activated: true }
        })
        const nextState = await getActivationState(site)
      } else {
        await chrome.storage.local.set({
          [`blocked-${site}`]: { ...websiteUpdated, activated: false }
        })
        const nextState = await getActivationState(site)
      }
    } else {
      console.error(`Cannot find blocked data for website ${site}.`)
    }
  }

  const DTask = async (task) => {
    await removeBlocked(task)
    setEditVisibility(false)
  }

  const handleEdit = (site) => {
    setEditingIndex(site)
    setEditVisibility(site)
  }

  const handleEditSite = async (site) => {
    // Call editBlocked function with the edited values and the selected site
    await editBlocked(site, parseInt(timerHour), parseInt(timerMinute), false)

    // Reset input fields and close the edit popup window
    setTimerHour("")
    setTimerMinute("")
    setEditVisibility(false)
  }

  const parseWebsiteList = async () => {
    try {
      const retrieveData = await chrome.storage.local.get()
      const newSiteList = {}

      for (const site in retrieveData) {
        if (site.startsWith("blocked-")) {
          const siteName = site.substring(8)
          newSiteList[siteName] = retrieveData[site]
        }
      }

      setWebsiteList(newSiteList)
    } catch (error) {
      console.error("Error parsing website list:", error)
    }
  }

  useEffect(() => {
    parseWebsiteList() // Initial fetch

    const loadWebsitesInterval = setInterval(parseWebsiteList, 1000)

    return () => {
      clearInterval(loadWebsitesInterval)
    }
  }, [])

  const getFaviconUrl = (domain) =>
    `https://www.google.com/s2/favicons?domain=${domain}`


  return (
    <section>
      <div className="addSite" onClick={addSiteClick}>
        + Add Site
      </div>
      <div className="siteLimitContainer">
        <div className="siteLimitHeader">
          <div className="siteLimitWebsite">Websites</div>
          <div className="siteLimitTimer">Timer</div>
          <div className="siteLimitActivate">Activated</div>
          <div className="siteLimitEdit">Edit</div>
        </div>
        <div className="siteDataContainer">
          {Object.keys(siteList).map((site, index) => (
            <div key={index} className="siteData">
              
              <div className="siteWebsite">
                    <img
                      src={getFaviconUrl(site)}
                      alt={`${site} favicon`}
                      className="iconSite"
                    />
                    {site}
                  </div>              <div className="siteTimer">
                <div>
                  {`${Math.floor(((siteList[site].hours * 60 + siteList[site].minutes) * 60 - siteList[site].timer) / 3600)}`.padStart(
                    2,
                    "0"
                  )}
                  {":"}
                  {`${Math.floor(((siteList[site].hours * 60 + siteList[site].minutes) * 60 - siteList[site].timer) / 60) % 60}`.padStart(
                    2,
                    "0"
                  )}
                  {":"}
                  {`${((siteList[site].hours * 60 + siteList[site].minutes) * 60 - siteList[site].timer) % 60}`.padStart(
                    2,
                    "0"
                  )}
                </div>
              </div>
              <div className="siteActivate">
                {siteList[site].activated == false ? (
                  <div
                    onClick={() => {
                      handleActivate(site)
                    }}
                    style={{
                      display: "flex",
                      backgroundColor: "red",
                      alignItems: "center",
                      borderRadius: "10rem",
                      cursor: "pointer"
                    }}>
                    <FaRegTimesCircle size={28} />
                  </div>
                ) : (
                  <div
                    onClick={() => {
                      handleActivate(site)
                    }}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      borderRadius: "10rem",
                      backgroundColor: "green",
                      cursor: "pointer"
                    }}>
                    <FaRegCheckCircle size={28} />
                  </div>
                )}
              </div>
              <div
                className="siteEdit"
                onClick={() => {
                  setEditVisibility(true), handleEdit(site)
                }}>
                <div style={{ cursor: "pointer" }}>
                  <FaEdit size={28} />
                </div>
              </div>
              {editVisibility && editingIndex === site && (
                <div id="sitePopup" className="editSitePopup">
                  <div className="sitePopupHeader">
                    <h3 className="titleLabel">Edit Website</h3>
                    <div
                      className="closeBox"
                      onClick={() => setEditVisibility(false)}>
                      X
                    </div>
                  </div>
                  <div>
                    <h3>Website URL: {site}</h3>
                    <h3>Website Timer:</h3>
                    <div className="time_input">
                      <input
                        id="hour"
                        className="time"
                        type="text"
                        value={timerHour}
                        onChange={(e) => setTimerHour(e.target.value)}
                        placeholder={`${siteList[site].hours}`}></input>
                      <input
                        id="minute"
                        className="time"
                        type="text"
                        value={timerMinute}
                        onChange={(e) => setTimerMinute(e.target.value)}
                        placeholder={`${siteList[site].minutes}`}></input>
                      <input
                        className="time"
                        type="submit"
                        value="Save"
                        onClick={() => handleEditSite(site)}></input>
                      <input
                        className="time"
                        type="submit"
                        value="Delete"
                        onClick={() => DTask(site)}></input>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
      {addVisibility && (
        <div id="sitePopup" className="addSitePopup">
          <div className="sitePopupHeader">
            <h3 className="titleLabel">Add Website</h3>
            <div className="closeBox" onClick={() => setAddVisibility(false)}>
              X
            </div>
          </div>
          <div>
            <h3>Website URL:</h3>
            <input
              id="site"
              className="site_input"
              type="text"
              onChange={(e) => setAddSiteName(e.target.value)}
              placeholder="https://www.example.com/"></input>
            <h3>Website Timer:</h3>
            <div className="time_input">
              <input
                id="hour"
                className="time"
                type="text"
                value={timerHour}
                onChange={(e) => setTimerHour(e.target.value)}
                placeholder="Hours"></input>
              <input
                id="minute"
                className="time"
                type="text"
                value={timerMinute}
                onChange={(e) => setTimerMinute(e.target.value)}
                placeholder="Minutes"></input>
              <input
                className="time"
                type="submit"
                value="Save"
                onClick={() => addWebsite()}></input>
            </div>
          </div>
        </div>
      )}
    </section>
  )
}

export default SiteLimit
