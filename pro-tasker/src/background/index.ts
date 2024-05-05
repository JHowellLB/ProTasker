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
chrome.runtime.onStartup.addListener(() => {
  const date = new Date()
  const today = new Date().getDay()
  // There are no days after sunday, therefore data does not need to be cleared if it is sunday
  if(today === 0){
    return
  }
  // If it is Monday, clear the data if it hasn't been cleared for the current date
  if(today === 1){
    chrome.storage.local.get("cleared", (result) => {
      if (result["cleared"] != date.toDateString()){
        chrome.storage.local.set({ "1": {} })
        chrome.storage.local.set({ "cleared": date.toDateString() })
      }
    })
  }
  // For other days, check if monday was cleared in the last 7 days
  else{
    chrome.storage.local.get("cleared", (result) => {
      if( typeof result["cleared"] === "undefined"){
        chrome.storage.local.set({ "1": {} })
        chrome.storage.local.set({ "cleared": date.toDateString() })
        return
      }
      const lastCleared = new Date(result["cleared"]);
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
      // If monday was last cleared over 7 days ago, clear it
      if (lastCleared < sevenDaysAgo){
        chrome.storage.local.set({ "1": {} })
        chrome.storage.local.set({ "cleared": date.toDateString() })
      }
    })
  }
  // Clear sunday's data
  chrome.storage.local.set({ "0": {} });
  // Check if there is data for days in the week after the current day. If so, clear that data.
  for (let i = today + 1; i <= 6; i++) {
    chrome.storage.local.get(i.toString(), (result) => {
      if (JSON.stringify(result[i.toString()]) != "{}") {
          chrome.storage.local.set({ [i.toString()]: {} });
      }
    });
  }
});

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

// Function to handle URL extraction and storage
function handleTab(tab: chrome.tabs.Tab) {
  if (tab && tab.url) {
      var tabUrl;
      try {
          tabUrl = new URL(tab.url).hostname;
      } catch (error) {
          // Handle invalid URLs or URLs not fully loaded
          tabUrl = "invalid";
      }
      if (tabUrl !== "invalid") {
          domain = tabUrl;
          chrome.storage.local.get(null, function(data) {
            const blockedWebsites: string[] = Object.keys(data).filter(key => key.startsWith("blocked-")).map(key => key.replace("blocked-", ""));
            if (blockedWebsites.includes(domain)) {
              console.log("This website is blocked:", domain)
              const blockedHTML: string = chrome.runtime.getURL("src/tabs/sitelimit/redirectwebsite/blocked_website.html")
              console.log(blockedHTML)
              chrome.tabs.update(tab.id, { url: blockedHTML });
            }
          })
          if (domain.includes(".")) {
              day = new Date().getDay().toString();
              chrome.storage.local.get(day, (result) => {
                  if (typeof result[day] === "undefined") {
                      chrome.storage.local.set({ [day]: { [domain]: 0 } });
                  } else if (typeof result[day][domain] === "undefined") {
                      chrome.storage.local.set({ [day]: { ...result[day], [domain]: 0 } });
                  }
              });
          } else {
              domain = "inactive";
          }
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
  }
  else if (newState === "idle") {
    domain = "inactive"
    let queryOptions = { active: true, lastFocusedWindow: true, audible: true }
          chrome.tabs.query(queryOptions, ([tab]) => {
            console.log(newState)
            console.log(tab)
            console.log(typeof tab)
            if(typeof tab === "undefined"){
              domain = "inactive"
            }
            else {
              handleTab(tab)
            }
          })
  }
  else {
    chrome.windows.getLastFocused(null, window => {
      if (window && window.focused) {
        let queryOptions = { active: true, lastFocusedWindow: true }
        chrome.tabs.query(queryOptions, ([tab]) => {
          handleTab(tab)
        })
      } 
      else {
        // Window is not focused
        domain = "inactive"
      }
  });  
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
