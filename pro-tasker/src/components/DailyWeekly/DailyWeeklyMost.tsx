import "./dailyweekly.css"

import { useState } from "react"

const DailyWeeklyMost = () => {
  const [btn, setBtn] = useState("daily")

  const handleButtonClick = (btn: string) => {
    setBtn(btn)
  }
  return (
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
  )
}

export default DailyWeeklyMost
