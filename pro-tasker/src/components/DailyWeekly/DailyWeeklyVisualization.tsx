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
    let newWeeklyWebsites = { ...weeklyWebsites }
    for (let i = 0; i <= parseInt(day); i++) {
      const weeklyWebsitesPromise = await chrome.storage.local.get(i.toString())
      const weeklyWebsitesStringify = JSON.stringify(
        weeklyWebsitesPromise[i.toString()]
      )
      const dailyWebsitesParse = JSON.parse(weeklyWebsitesStringify)
      for (const [key, value] of Object.entries(dailyWebsitesParse)) {
        if (newWeeklyWebsites.hasOwnProperty(key)) {
          newWeeklyWebsites[key] += value
        } else {
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

  const data = [
    { label: "Label 1", value: 10 },
    { label: "Label 2", value: 20 }
    // Add more data objects as needed
  ]

  const DailyRingGraph = ({ dailyWebsites }) => {
    const chartRef = useRef(null)
    
    const top5Entries = Object.entries(dailyWebsites)
      .sort((a, b) => b[1] - a[1]) // Sort entries by value in descending order
      .slice(0, 5) // Take the first 5 entries
    const otherEntries = Object.entries(dailyWebsites)
      .sort((a, b) => b[1] - a[1]) // Sort entries by value in descending order
      .slice(5) // Take the rest of the entries

    let totalSum = 0;
    for (let i = 0; i < Object.entries(dailyWebsites).length; i++){
      totalSum += Object.entries(dailyWebsites)[i][1];
    }

    let otherSum = 0;
    for (let j = 0; j < otherEntries.length; j++){
      otherSum += otherEntries[j][1];
    }

    for (let k = 0; k < top5Entries.length; k++){
      top5Entries[k][1] = ((top5Entries[k][1] / totalSum) * 100).toFixed(1);
    }

    let excess = ["other", ((otherSum / totalSum) * 100).toFixed(1)]

    top5Entries.push(excess)

    useEffect(() => {
      if (chartRef && chartRef.current) {
        const ctx = chartRef.current.getContext("2d")
        new Chart(ctx, {
          type: "doughnut",
          data: {
            labels: top5Entries.map((item) => item[0]),
            datasets: [
              {
                label: "percentage",
                data: top5Entries.map((item) => item[1]),
                backgroundColor: [
                  "rgba(255, 99, 132, 0.8)",
                  "rgba(54, 162, 235, 0.8)",
                  "rgba(255, 206, 86, 0.8)",
                  "rgba(75, 192, 192, 0.8)",
                  "rgba(153, 102, 255, 0.8)",
                  "rgba(0, 0, 0, 0.8)"
                ],
                borderWidth: 1
              }
            ]
          },
          options: {
            responsive: true,
            plugins: {
              legend: {
                display: false
              }
            }
          }
        })
      }
    }, [dailyWebsites])

    return <canvas ref={chartRef} />
  }

  const WeeklyRingGraph = ({ weeklyWebsites }) => {
    const chartRef = useRef(null)

    const top5Entries = Object.entries(weeklyWebsites)
      .sort((a, b) => b[1] - a[1]) // Sort entries by value in descending order
      .slice(0, 5) // Take the first 5 entries

    const otherEntries = Object.entries(weeklyWebsites)
      .sort((a, b) => b[1] - a[1]) // Sort entries by value in descending order
      .slice(5) // Take the rest of the entries

    let totalSum = 0;
    for (let i = 0; i < Object.entries(weeklyWebsites).length; i++){
      totalSum += Object.entries(weeklyWebsites)[i][1];
    }

    let otherSum = 0;
    for (let j = 0; j < otherEntries.length; j++){
      otherSum += otherEntries[j][1];
    }

    for (let k = 0; k < top5Entries.length; k++){
      top5Entries[k][1] = ((top5Entries[k][1] / totalSum) * 100).toFixed(1);
    }

    let excess = ["other", ((otherSum / totalSum) * 100).toFixed(1)]

    top5Entries.push(excess)

    useEffect(() => {
      if (chartRef && chartRef.current) {
        const ctx = chartRef.current.getContext("2d")

        new Chart(ctx, {
          type: "doughnut",
          data: {
            labels: top5Entries.map((item) => item[0]),
            datasets: [
              {
                label: "percentage",
                data: top5Entries.map((item) => item[1]),
                backgroundColor: [
                  "rgba(255, 99, 132, 0.8)",
                  "rgba(54, 162, 235, 0.8)",
                  "rgba(255, 206, 86, 0.8)",
                  "rgba(75, 192, 192, 0.8)",
                  "rgba(153, 102, 255, 0.8)",
                  "rgba(0, 0, 0, 0.8)"
                ],
                borderWidth: 1
              }
            ]
          },
          options: {
            responsive: true,
            plugins: {
              legend: {
                display: false
              }
            }
          }
        })
      }
    }, [weeklyWebsites])

    return <canvas ref={chartRef} />
  }

  const WeeklyBarGraph = ({ weeklyWebsites }) => {
    const chartRef = useRef(null)
    const top5Entries = Object.entries(weeklyWebsites)
      .sort((a, b) => b[1] - a[1]) // Sort entries by value in descending order
      .slice(0, 5) // Take the first 5 entries
    useEffect(() => {
      if (chartRef && chartRef.current) {
        const ctx = chartRef.current.getContext("2d")
        new Chart(ctx, {
          type: "bar",
          data: {
            labels: top5Entries.map((item) => item[0]),
            datasets: [
              {
                label: "Website Visits",
                data: top5Entries.map((item) => item[1]),
                backgroundColor: [
                  "rgba(255, 99, 132, 0.6)",
                  "rgba(54, 162, 235, 0.6)",
                  "rgba(255, 206, 86, 0.6)",
                  "rgba(75, 192, 192, 0.6)",
                  "rgba(153, 102, 255, 0.6)"
                ],
                borderWidth: 1
              }
            ]
          },
          options: {
            indexAxis: "x", // Set the index axis to 'x' for vertical bars
            responsive: true,
            plugins: {
              legend: {
                display: false
              }
            },
            scales: {
              x: {
                display: false // Hide x-axis labels
              },
              y: {
                display: true // Display y-axis labels (optional)
              }
            }
          }
        })
      }
    }, [dailyWebsites])

    return <canvas ref={chartRef} />
  }
  const DailyBarGraph = ({ dailyWebsites }) => {
    const chartRef = useRef(null)
    const top5Entries = Object.entries(dailyWebsites)
      .sort((a, b) => b[1] - a[1]) // Sort entries by value in descending order
      .slice(0, 5) // Take the first 5 entries

    useEffect(() => {
      if (chartRef && chartRef.current) {
        const ctx = chartRef.current.getContext("2d")
        new Chart(ctx, {
          type: "bar",
          data: {
            labels: top5Entries.map((item) => item[0]),
            datasets: [
              {
                label: "seconds",
                data: top5Entries.map((item) => item[1]),
                backgroundColor: [
                  "rgba(255, 99, 132, 0.6)",
                  "rgba(54, 162, 235, 0.6)",
                  "rgba(255, 206, 86, 0.6)",
                  "rgba(75, 192, 192, 0.6)",
                  "rgba(153, 102, 255, 0.6)"
                ],
                borderWidth: 1
              }
            ]
          },
          options: {
            indexAxis: "x", // Set the index axis to 'x' for vertical bars
            responsive: true,
            plugins: {
              legend: {
                display: false
              }
            },
            scales: {
              x: {
                display: false // Hide x-axis labels
              },
              y: {
                display: true // Display y-axis labels (optional)
              }
            }
          }
        })
      }
    }, [dailyWebsites])

    return <canvas ref={chartRef} />
  }

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
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              width: "100%",
              height: "75%",
              marginTop: "0.25rem"
            }}>
            {btn === "daily" ? (
              chartBtn === "pie" ? (
                <DailyRingGraph dailyWebsites={dailyWebsites} />
              ) : (
                <DailyBarGraph dailyWebsites={dailyWebsites} />
              )
            ) : chartBtn === "pie" ? (
              <WeeklyRingGraph weeklyWebsites={weeklyWebsites} />
            ) : (
              <WeeklyBarGraph weeklyWebsites={weeklyWebsites} />
            )}
          </div>
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
