// This represents the amount of time spent on a website.
interface Duration {
  hours: number
  minutes: number
}

// This represents the entire weeks worth of data from monday to sunday. This is stored as the value in the key-value storage.
export interface WeeklyDuration {
  monday : Duration
  tuesday : Duration
  wednesday : Duration
  thursday : Duration
  friday : Duration
  saturday : Duration
  sunday : Duration
}

// chrome.storage.local.get() must be wrapped in a promise to allow await.
const getResult = (mostUsedKey: string) => {
  return new Promise<WeeklyDuration>((resolve) => {
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

  // Create a duration object with all durations initialized to 0.
  const weeklyDuration: WeeklyDuration = {
    monday: { hours: 0, minutes: 0, },
    tuesday: { hours: 0, minutes: 0, },
    wednesday: { hours: 0, minutes: 0, },
    thursday: { hours: 0, minutes: 0, },
    friday: { hours: 0, minutes: 0, },
    saturday: { hours: 0, minutes: 0, },
    sunday: { hours: 0, minutes: 0, }
  }

  // Use the spread operator to create a new interface that has the single added value.
  const mostUsedWeekly = {
    ...weeklyDuration,
    [day]: mostUsedDaily
};

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

// Function to add to add time to a most used website.
// Function adds time for the specified day.
export async function addTimeToMostUsed(website: string, hours: number, minutes: number, day: string) {
  // Concatenate 'mostUsed-' to uniquely identify task keys.
  const websiteKey = "mostused-" + website.toLowerCase()

  // Result is used later on, so await is used to ensure it contains the correct value.
  const result = await getResult(websiteKey)

  // If the result's type is not undefined, the key is in use. Therefore, update the value.
  // Otherwise, do not update the value.
  if (typeof result != "undefined") {
    const currentDuration = result[day]

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
      minutes: updatedMinutes
    }

    // Spread operator is used to update the current day's value while maintaining old values.
    const weeklyDuration = {
      ...result,
      [day]: updatedDuration
    }

    chrome.storage.local.set({ [websiteKey]: weeklyDuration }, () => {
      if (chrome.runtime.lastError) {
        console.error("Error adding time to most used site:", chrome.runtime.lastError)
      } else {
        console.log("Most used site time updated:", websiteKey)
      }
    })
  } else {
    console.log("Most used site key does not exist: ", websiteKey)
  }
}
