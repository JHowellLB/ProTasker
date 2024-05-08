// This represents the amount of time spent on a website.
interface Duration {
  hours: number
  minutes: number
  timer: number
  isRunning: boolean
}

interface mostUsedDaily {
  [website : string]: Duration
}

// chrome.storage.local.get() must be wrapped in a promise to allow await.
const getResult = (mostUsedKey: string) => {
  return new Promise((resolve) => {
    chrome.storage.local.get(mostUsedKey, (result) => {
      if (chrome.runtime.lastError) {
        console.error(
          "Error checking for existing blocked site:",
          chrome.runtime.lastError.message
        )
        // Resolve with undefined in case of an error
        resolve(undefined)
      } else {
        resolve(result[mostUsedKey])
      }
    })
  })
}

// Function to add a most used website for a specified day.
// Function also checks if the website entry already exists for that specific day, if so, website is not added.
// Can potentially use an enum for days since it is a fixed set of values.
export async function addMostUsed(website: string, hours: number, minutes: number, day: string) {
  // Use the lowercase value for the key.
  const websiteKey = website.toLowerCase()

  const mostUsedDuration: Duration = {
    hours: hours,
    minutes: minutes,
    timer: 0,
    isRunning: false
  }

  const mostUsedDaily: mostUsedDaily = { 
    [websiteKey] : mostUsedDuration
  }

  // Result is used later on, so await is used to ensure it contains the correct value.
  const result = await getResult(day)

  // If the result's type is undefined, the day is not in use. Therefore, initialize the day with the single website.
  // Otherwise, append the value to the list of values.
  if (typeof result === "undefined") {
    chrome.storage.local.set({ [day]: mostUsedDaily }, () => {
      if (chrome.runtime.lastError) {
        console.error("Error adding most used site:", chrome.runtime.lastError)
      } else {
        console.log("Most used site added:", websiteKey)
      }
    })
  } 
  else {
    // Since there already exists values in day, check if the website being entered already exists.
    // If it doesn't, append it to the list of websites.
    if (typeof result[websiteKey] === "undefined"){
      chrome.storage.local.set({ [day]: {...result, [websiteKey] : mostUsedDuration } }, () => {
        if (chrome.runtime.lastError) {
          console.error("Error adding most used site:", chrome.runtime.lastError)
        } else {
          console.log("Most used site added:", websiteKey)
        }
      })
    }
    else {
      console.log("Most used site key already exists: ", websiteKey)
    }
  }
}

// Function to add to add time to a most used website.
// Function adds time for the specified day.
export async function addTimeToMostUsed(website: string, hours: number, minutes: number, day: string) {
  const websiteKey = website.toLowerCase()

  // Result is used later on, so await is used to ensure it contains the correct value.
  const result = await getResult(day)

  // If the result's type is not undefined, the day key exists.
  // Otherwise, do not update the value.
  if (typeof result != "undefined") {
    // Check if the website entry exists for the specified day.
    if (typeof result[websiteKey] != "undefined") {
      const currentDuration = result[website]

      let updatedHours = 0
      let updatedMinutes = 0

      // Add the times
      // Ensure that minutes do not exceed 59.
      if (currentDuration.minutes + minutes >= 60) {
        updatedHours = currentDuration.hours + hours + 1
        updatedMinutes = currentDuration.minutes + minutes - 60
      }
      else {
        updatedHours = currentDuration.hours + hours
        updatedMinutes = currentDuration.minutes + minutes
      }

      const updatedDuration: Duration = {
        hours: updatedHours,
        minutes: updatedMinutes,
        timer: 0,
        isRunning: false
      }

      chrome.storage.local.set({ [day]: {...result, [websiteKey] : updatedDuration } }, () => {
        if (chrome.runtime.lastError) {
          console.error("Error adding time to most used site:", chrome.runtime.lastError)
        } else {
          console.log("Most used site time updated:", websiteKey)
        }
      })
    }
    else {
      console.log("Most used site key does not exist: ", websiteKey)
    }
  }
  else {
    console.log("Day key does not exist: ", websiteKey)
  }
}
