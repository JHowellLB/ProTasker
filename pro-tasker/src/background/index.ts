import { retrieveTask } from "~api/taskDB"

export {}
console.log("background")
var domain = "inactive"
var day = new Date().getDay().toString()
// activeTabId needed for the onUpdated listener
var activeTabId = null
chrome.alarms.create("taskTimer", {
  periodInMinutes: 1 / 60
})
chrome.alarms.create("siteLimitTimer", {
  periodInMinutes: 1 / 60
})
chrome.alarms.create("mostUsedTimer", {
  periodInMinutes: 1 / 60
})

// Listen for the onInstalled event
chrome.runtime.onInstalled.addListener(async function (details) {
  // Check if the reason is 'install' or 'update'
  if (details.reason === "install" || details.reason === "update") {
    // Initialize data for numbers 1-6 in Chrome's local storage
    const initialData = {}
    for (let i = 0; i <= 6; i++) {
      console.log(i)
      if (
        Object.keys(await chrome.storage.local.get([i.toString()])).length == 0
      ) {
        initialData[i.toString()] = {}
      }
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

// Every startup, check for and clear old website time tracking data
// Latest date is was cleared is stored in storage as cleared : dateString
chrome.runtime.onStartup.addListener(() => {
  chrome.storage.local.get("cleared", (result) => {
    const lastCleared = new Date(result["cleared"])
    const today = new Date()

    // Get the start date of the current week (monday)
    const currentWeekStartDate = new Date()
    // + 6) % 7 is done to shift the start of the week to monday.
    currentWeekStartDate.setDate(
      currentWeekStartDate.getDate() - ((currentWeekStartDate.getDay() + 6) % 7)
    )

    // Check if the last cleared date is invalid or if it is not in the current week
    if (
      lastCleared.toString() === "Invalid Date" ||
      lastCleared < currentWeekStartDate
    ) {
      chrome.storage.local.set({ cleared: today.toDateString() })
      for (let i = 0; i <= 6; i++) {
        chrome.storage.local.set({ [i.toString()]: {} })
      }
    }
  })
})

chrome.alarms.onAlarm.addListener((alarm) => {
  if (alarm.name === "taskTimer") {
    let getTasks = retrieveTask()
    getTasks.then((message) => {
      message.forEach((task) => {
        chrome.storage.local.get([task], async (res) => {
          if (task.startsWith("task-")) {
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
          }
        })
      })
    })
  }
})

chrome.alarms.onAlarm.addListener((alarm) => {
  if (alarm.name === "siteLimitTimer") {
    let getTasks = retrieveTask()
    getTasks.then((message) => {
      message.forEach((task) => {
        chrome.storage.local.get([task], async (res) => {
          if (task.startsWith("blocked-")) {
            const original = { ...res }
            const originalTask = res[task]
            if (
              res[task].hours * 3600 + res[task].minutes * 60 <=
              res[task].timer
            ) {
              console.log("siteLimit blocked website reset", res[task])
              chrome.storage.local.set({
                ...original,
                [task]: { ...originalTask, activated: false, timer: 0 }
              })
            } else if (res[task].activated == true) {
              chrome.storage.local.set({
                ...original,
                [task]: { ...originalTask, timer: originalTask.timer + 1 }
              })
            }
          }
        })
      })
    })
  }
})

// Function to handle URL extraction and storage
// Function to handle URL extraction and storage
function handleTab(tab: chrome.tabs.Tab) {
  if (tab && tab.url) {
    var tabUrl
    try {
      tabUrl = new URL(tab.url).hostname
    } catch (error) {
      // Handle invalid URLs or URLs not fully loaded
      tabUrl = "invalid"
    }
    if (tabUrl !== "invalid") {
      // Extract the domain from the URL
      domain = tabUrl

      // Retrieve the data for the website from storage
      chrome.storage.local.get(`blocked-${domain}`, (data) => {
        const websiteData = data[`blocked-${domain}`]

        // Check if the website is blocked and activated
        if (websiteData && websiteData.activated) {
          console.log("This website is activated and blocked:", domain)
          // Proceed with blocking the website
          const blockedHTML: string = chrome.runtime.getURL(
            "redirectwebsite/blocked_website.html"
          )
          chrome.tabs.update(tab.id, { url: blockedHTML })
        } else {
          console.log("This website is not activated or not blocked:", domain)
          // If the website is not activated or not blocked, proceed with normal handling
          // For example, store the website in local storage based on day
          if (domain.includes(".")) {
            const day = new Date().getDay().toString()
            chrome.storage.local.get(day, (result) => {
              if (typeof result[day] === "undefined") {
                chrome.storage.local.set({ [day]: { [domain]: 0 } })
              } else if (typeof result[day][domain] === "undefined") {
                chrome.storage.local.set({
                  [day]: { ...result[day], [domain]: 0 }
                })
              }
            })
          }
        }
      })
    }
  }
}

// Function to handle window focus change
function handleWindowFocusChange(windowId: number) {
  if (windowId === chrome.windows.WINDOW_ID_NONE) {
    domain = "inactive"
  } else {
    let queryOptions = { active: true, lastFocusedWindow: true }
    chrome.tabs.query(queryOptions, ([tab]) => {
      handleTab(tab)
    })
  }
}

// Handle tab activation
chrome.tabs.onActivated.addListener(function (activeInfo) {
  activeTabId = activeInfo.tabId // Update active tab ID
  chrome.tabs.get(activeTabId, (tab) => {
    handleTab(tab)
  })
})

// Handle tab updates
chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
  if (tabId === activeTabId) {
    // Check if the updated tab is the active tab
    handleTab(tab)
  }
})

// Handle idle detection
// Three possible states: locked, idle, active.
// If the screen locks, time tracking stops.
// If state is idle, checks if audio is playing before time tracking stops.
chrome.idle.onStateChanged.addListener((newState) => {
  if (newState === "locked") {
    domain = "inactive"
  } else if (newState === "idle") {
    domain = "inactive"
    let queryOptions = { active: true, lastFocusedWindow: true, audible: true }
    chrome.tabs.query(queryOptions, ([tab]) => {
      if (typeof tab === "undefined") {
        domain = "inactive"
      } else {
        handleTab(tab)
      }
    })
  } else {
    chrome.windows.getLastFocused(null, (window) => {
      if (window && window.focused) {
        let queryOptions = { active: true, lastFocusedWindow: true }
        chrome.tabs.query(queryOptions, ([tab]) => {
          handleTab(tab)
        })
      } else {
        // Window is not focused
        domain = "inactive"
      }
    })
  }
})

// Handle window focus change
chrome.windows.onFocusChanged.addListener(handleWindowFocusChange)

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
  }
})
