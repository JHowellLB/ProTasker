import { retrieveTask } from "~api/taskDB"

export {}
console.log("background")
chrome.alarms.create("taskTimer", {
  periodInMinutes: 1 / 60
})

chrome.alarms.onAlarm.addListener((alarm) => {
  if (alarm.name === "taskTimer") {
    let getTasks = retrieveTask()
    getTasks.then((message) => {
      message.forEach((task) => {
        chrome.storage.local.get([task], async (res) => {
          const original = { ...res }
          const originalTask = res[task]
          //console.log(res[task])
          if (res[task].isRunning) {
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
