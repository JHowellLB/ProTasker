import "./dailyweekly.css"

import { useState } from "react"

const visualizationChart = () => {
  const [btn, setBtn] = useState("pie")

  const handleButtonClick = (btn: string) => {
    setBtn(btn)
  }
  return (
    <section className="dailyWeeklyWrapper">
      <div className="dailyWeekly">
        <div
          onClick={() => handleButtonClick("pie")}
          className={btn === "pie" ? "dailyweeklyBtnActive" : "dailyweeklyBtn"}>
          Pie Chart
        </div>
        <div
          onClick={() => handleButtonClick("bar")}
          className={btn === "bar" ? "dailyweeklyBtnActive" : "dailyweeklyBtn"}>
          Bar Chart
        </div>
      </div>
    </section>
  )
}

export default visualizationChart
