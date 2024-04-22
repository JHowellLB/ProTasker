import { retrieveTask } from "~api/taskDB"

export {}
console.log("background")
var domain = "inactive"
var day = new Date().getDay().toString()
const hour = new Date().getHours()
const min = new Date().getMinutes()
chrome.alarms.create("taskTimer", {
  periodInMinutes: 1 / 60
})
chrome.alarms.create("mostUsedTimer", {
  periodInMinutes: 1 / 60
})

// Listen for the onInstalled event
chrome.runtime.onInstalled.addListener(function (details) {
  // Check if the reason is 'install' or 'update'
  if (details.reason === "install" || details.reason === "update") {
    // Initialize data for numbers 1-7 in Chrome's local storage
    const initialData = {}
    for (let i = 0; i <= parseInt(day); i++) {
      initialData[i.toString()] = {}
    }
    chrome.storage.local.set(initialData, function () {
      if (chrome.runtime.lastError) {
        console.error(
          "Error initializing local storage:",
          chrome.runtime.lastError
        )
      } else {
        console.log("Local storage initialized successfully.")
      }
    })
  }
})

chrome.alarms.onAlarm.addListener((alarm) => {
  if (alarm.name === "taskTimer") {
    let getTasks = retrieveTask()
    getTasks.then((message) => {
      message.forEach((task) => {
        chrome.storage.local.get([task], async (res) => {
          const original = { ...res }
          const originalTask = res[task]
          if (
            res[task].hours * 3600 + res[task].minutes * 60 <=
            res[task].timer
          ) {
            chrome.storage.local.set({
              ...original,
              [task]: { ...originalTask, isRunning: false, timer: 0 }
            })
          } else if (res[task].isRunning) {
            chrome.storage.local.set({
              ...original,
              [task]: { ...originalTask, timer: originalTask.timer + 1 }
            })
          }
        })
      })
    })
  }
})

//set current website to local storage to initialize into DB
chrome.tabs.onActivated.addListener(function (activeInfo) {
  chrome.tabs.get(activeInfo.tabId, function (tab) {
    domain = new URL(tab.url).hostname
    if (domain.endsWith(".com")) {
      day = new Date().getDay().toString()
      chrome.storage.local.get(day, (result) => {
        // Check if the entire day does not have an entry
        if (typeof result[day] === "undefined") {
          chrome.storage.local.set({ [day]: { [domain]: 0 } })
        }
        // Check if the website domain has not been entered.
        else if (typeof result[day][domain] === "undefined") {
          chrome.storage.local.set({ [day]: { ...result[day], [domain]: 0 } })
        }
      })
    } else {
      domain = "inactive"
    }
  })
})

chrome.alarms.onAlarm.addListener(async (alarm) => {
  if (alarm.name === "mostUsedTimer") {
    if (domain != "inactive") {
      chrome.storage.local.get(day, (result) => {
        const currentTime = result[day][domain]
        chrome.storage.local.set({
          [day]: { ...result[day], [domain]: 1 + currentTime }
        })
      })
    }
    // clear local storage at the start of the week (sunday)
    // idk if this works
    if (hour == 0 && min == 0 && day == "0") {
      for (let i = 0; i <= 7; i++) {
        if (
          Object.keys(await chrome.storage.local.get([i.toString()])).length > 0
        ) {
          chrome.storage.local.remove([i.toString()])
        }
      }
    }
    if (hour == 0 && min == 1 && day == "0") {
      // Initialize data for numbers 1-7 in Chrome's local storage
      const newData = {}
      for (let i = 0; i <= parseInt(day); i++) {
        newData[i.toString()] = {}
      }
      chrome.storage.local.set(newData, function () {
        if (chrome.runtime.lastError) {
          console.error(
            "Error initializing local storage:",
            chrome.runtime.lastError
          )
        } else {
          console.log("Local storage initialized successfully.")
        }
      })
    }
  }
})
