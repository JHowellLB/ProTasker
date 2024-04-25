import "./dailyweekly.css"

import { useEffect, useState } from "react"

const DailyWeeklyMost = () => {
  const [btn, setBtn] = useState("daily")
  const [dailyWebsites, setDailyWebsites] = useState([]) // address 125: [{chrome:0}]
  const [weeklyWebsites, setWeeklyWebsites] = useState({})
  const day = new Date().getDay().toString()

  const handleButtonClick = (btn: string) => {
    setBtn(btn)
  }
  const parseWebsitesDaily = async () => {
    let newDailyWebsites = [...dailyWebsites]
    const dailyWebsitesPromise = await chrome.storage.local.get(day)
    const dailyWebsitesStringify = JSON.stringify(dailyWebsitesPromise[day])
    const dailyWebsitesParse = JSON.parse(dailyWebsitesStringify)
    for (const [key, value] of Object.entries(dailyWebsitesParse)) {
      const exists = newDailyWebsites.some((site) => site.key === key)
      if (!exists) {
        newDailyWebsites.push({ key, value })
      }
    }
    setDailyWebsites(newDailyWebsites)
  }

  const parseWebsitesWeekly = async () => {
    // Create a copy of the current state
    let newWeeklyWebsites = { ...weeklyWebsites }

    // Loop through each day
    for (let i = 0; i <= parseInt(day); i++) {
      // Retrieve websites data for the current day from storage
      const weeklyWebsitesPromise = await chrome.storage.local.get(i.toString())
      const weeklyWebsitesStringify = JSON.stringify(
        weeklyWebsitesPromise[i.toString()]
      )
      const dailyWebsitesParse = JSON.parse(weeklyWebsitesStringify)

      // Loop through the websites data for the current day
      for (const [key, value] of Object.entries(dailyWebsitesParse)) {
        // Check if the key already exists in the state
        if (newWeeklyWebsites.hasOwnProperty(key)) {
          // If the key exists, update its value by adding the new value
          newWeeklyWebsites[key] += value
        } else {
          // If the key does not exist, add it to the state with the new value
          newWeeklyWebsites[key] = value
        }
      }
    }
    setWeeklyWebsites(newWeeklyWebsites)
  }
  useEffect(() => {
    if (btn === "daily") {
      parseWebsitesDaily()
    }
  }, [btn])
  useEffect(() => {
    parseWebsitesWeekly()
  }, [])
  console.log(weeklyWebsites)

  return (
    <div>
      <section className="dailyWeeklyWrapper">
        <div className="dailyWeekly">
          <div
            onClick={() => handleButtonClick("daily")}
            className={
              btn === "daily" ? "dailyweeklyBtnActive" : "dailyweeklyBtn"
            }>
            Daily
          </div>

          <div
            onClick={() => handleButtonClick("weekly")}
            className={
              btn === "weekly" ? "dailyweeklyBtnActive" : "dailyweeklyBtn"
            }>
            Weekly
          </div>
        </div>
      </section>
      {btn === "daily" ? (
        <div className="dataWrapper">
          {dailyWebsites
            .sort((a, b) => b.value - a.value) // Sort the array in descending order based on value
            .map((site, index) => (
              <div key={index} className="websiteData">
                {site.key}
                <div>
                  {`${Math.floor(site.value / 3600)}`.padStart(2, "0")}h{" "}
                  {`${Math.floor(site.value / 60) % 60}`.padStart(2, "0")}m{" "}
                  {`${site.value % 60}`.padStart(2, "0")}s
                </div>
              </div>
            ))}
        </div>
      ) : (
        <div className="dataWrapper">
          {Object.entries(weeklyWebsites)
            .sort(([, valueA], [, valueB]) => valueB - valueA) // Sort the entries in descending order based on value
            .map(([key, value], index) => (
              <div key={index} className="websiteData">
                {key}
                <div>
                  <div>
                    {`${Math.floor(value / 3600)}`.padStart(2, "0")}h{" "}
                    {`${Math.floor(value / 60) % 60}`.padStart(2, "0")}m{" "}
                    {`${value % 60}`.padStart(2, "0")}s
                  </div>
                </div>
              </div>
            ))}
        </div>
      )}
    </div>
  )
}

export default DailyWeeklyMost
