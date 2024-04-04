// This represents the amount of time spent on a website.
interface Duration {
  hours: number
  minutes: number
}

// This represents the entire weeks worth of data from monday to sunday. This is stored as the value in the key-value storage.
// Values for each day are optional, since there may or may not be data for a particular day.
export interface WeeklyDuration {
  monday ?: Duration
  tuesday ?: Duration
  wednesday ?: Duration
  thursday ?: Duration
  friday ?: Duration
  saturday ?: Duration
  sunday ?: Duration
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

// Function to add a most used website.
// Function only creates a value for the specified day.
// Function also checks if the key already exists, if so, task is not added.
// Can potentially use an enum for days since it is a fixed set of values.
export async function addMostUsed(website: string, hours: number, minutes: number, day: string) {
  // Concatenate 'mostUsed-' to uniquely identify task keys.
  const websiteKey = "mostused-" + website.toLowerCase()

  const mostUsedDaily: Duration = {
    hours: hours,
    minutes: minutes,
  }

  // Create a duration object to store as the value
  const mostUsedWeekly: WeeklyDuration = {
    [day] : mostUsedDaily
  }

  // Result is used later on, so await is used to ensure it contains the correct value.
  const result = await getResult(websiteKey)

  // If the result's type is undefined, the key is not in use. Therefore, set the value.
  // Otherwise, do not set the value.
  if (typeof result === "undefined") {
    chrome.storage.local.set({ [websiteKey]: mostUsedWeekly }, () => {
      if (chrome.runtime.lastError) {
        console.error("Error adding most used site:", chrome.runtime.lastError)
      } else {
        console.log("Most used site added:", websiteKey)
      }
    })
  } else {
    console.log("Most used site key already exists: ", websiteKey)
  }
}
