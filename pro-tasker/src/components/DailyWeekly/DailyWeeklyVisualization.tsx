import "./dailyweekly.css"

import Chart from "chart.js/auto"
import { useEffect, useRef, useState } from "react"

const DailyWeeklyVisualization = () => {
  const [btn, setBtn] = useState("daily")

  const [chartBtn, setChartBtn] = useState("pie")

  const [dailyWebsites, setDailyWebsites] = useState({}).sort()
  const [weeklyWebsites, setWeeklyWebsites] = useState({}).sort()
  const day = new Date().getDay().toString()

  const handleButtonClick = (btn: string) => {
    setBtn(btn)
  }
  const handleChartButtonClick = (btn: string) => {
    setChartBtn(btn)
  }
  const parseWebsitesDaily = async () => {
    let newDailyWebsites = { ...dailyWebsites }
    const dailyWebsitesPromise = await chrome.storage.local.get(day)
    const dailyWebsitesStringify = JSON.stringify(dailyWebsitesPromise[day])
    const dailyWebsitesParse = JSON.parse(dailyWebsitesStringify)
    for (const [key, value] of Object.entries(dailyWebsitesParse)) {
      if (!newDailyWebsites[key]) {
        newDailyWebsites[key] = value
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
  useEffect(() => {
    if (btn === "daily") {
      parseWebsitesDaily()
    }
  }, [btn])
  useEffect(() => {
    parseWebsitesWeekly()
  }, [])
  const getFaviconUrl = (domain) =>
    `https://www.google.com/s2/favicons?domain=${domain}`

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
      <div className="visualizeData">
        <div className="chartData">
          Chart Goes Here
          <section className="dailyWeeklyWrapper">
            <div className="dailyWeekly">
              <div
                onClick={() => handleChartButtonClick("pie")}
                className={
                  chartBtn === "pie" ? "dailyweeklyBtnActive" : "dailyweeklyBtn"
                }>
                Pie Chart
              </div>
              <div
                onClick={() => handleChartButtonClick("bar")}
                className={
                  chartBtn === "bar" ? "dailyweeklyBtnActive" : "dailyweeklyBtn"
                }>
                Bar Chart
              </div>
            </div>
          </section>
        </div>
        <div className="visualizeWebsiteData">
          {btn === "daily" ? (
            <div className="dataWrapper">
              {Object.entries(dailyWebsites)
                .sort(([, valueA], [, valueB]) => valueB - valueA)
                .map(([key, value], index) => (
                  <div key={index} className="websiteData">
                    <div className="websiteIcons">
                      <img
                        src={getFaviconUrl(key)}
                        alt={`${key} favicon`}
                        className="icons"
                      />
                      {key}
                    </div>
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
          ) : (
            <div className="dataWrapper">
              {Object.entries(weeklyWebsites)
                .sort(([, valueA], [, valueB]) => valueB - valueA)
                .map(([key, value], index) => (
                  <div key={index} className="websiteData">
                    <div className="websiteIcons">
                      <img
                        src={getFaviconUrl(key)}
                        alt={`${key} favicon`}
                        className="icons"
                      />
                      {key}
                    </div>
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
      </div>
    </div>
  )
}

export default DailyWeeklyVisualization
