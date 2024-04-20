import "./dailyweekly.css"

import { useState } from "react"

const DailyWeeklyMost = () => {
  const [btn, setBtn] = useState("daily")
  const [dailyWebsites, setDailyWebsites] = useState([])
  const [weeklyWebsites, setWeeklyWebsites] = useState([])
  const day = new Date().getDay().toString()

  const handleButtonClick = (btn: string) => {
    setBtn(btn)
  }
  const parseWebsitesDaily = async () => {
    const dailyWebsitesPromise = await chrome.storage.local.get(day)
    const dailyWebsitesStringify = JSON.stringify(dailyWebsitesPromise[day])
    const dailyWebsitesParse = JSON.parse(dailyWebsitesStringify)
    for (const [key, value] of Object.entries(dailyWebsitesParse)) {
      const exists = dailyWebsites.some((site) => site.key === key)
      if (!exists) {
        dailyWebsites.push({ key, value })
        setDailyWebsites(dailyWebsites)
      }
    }
  }

  const parseWebsitesWeekly = async () => {
    for (let i = 1; i <= parseInt(day); i++) {
      // console.log("hi")
      const dailyWebsitesPromise = await chrome.storage.local.get(i.toString())
      const dailyWebsitesStringify = JSON.stringify(
        dailyWebsitesPromise[i.toString()]
      )
      const dailyWebsitesParse = JSON.parse(dailyWebsitesStringify)
      console.log(dailyWebsitesParse)
      for (const [key, value] of Object.entries(dailyWebsitesParse)) {
        const exists = weeklyWebsites.some((site) => site.key === key)
        if (!exists) {
          weeklyWebsites.push({ key, value })
          setWeeklyWebsites(weeklyWebsites)
        }
      }
    }
  }
  parseWebsitesDaily()
  parseWebsitesWeekly()
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
        <div>
          {dailyWebsites
            .sort((a, b) => b.value - a.value) // Sort the array in descending order based on value
            .map((site, index) => (
              <div key={index}>
                {site.key} {site.value}
              </div>
            ))}
        </div>
      ) : (
        <div>
          {weeklyWebsites
            .sort((a, b) => b.value - a.value) // Sort the array in descending order based on value
            .map((site, index) => (
              <div key={index}>
                {site.key} {site.value}
              </div>
            ))}
        </div>
      )}
    </div>
  )
}

export default DailyWeeklyMost
