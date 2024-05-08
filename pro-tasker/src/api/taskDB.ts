// Define an interface for the duration entry, this will be stored as the value in the key-value storage.
// This represents the duration of the task in hours and minutes.
interface Duration {
  hours: number
  minutes: number
  isRunning: boolean
  isSetAlarm: boolean
  timer: number
}

// Type definition for the chrome object
declare namespace chrome {
  namespace runtime {
    const lastError:
      | {
          message?: string
        }
      | undefined
  }

  namespace storage {
    interface StorageArea {
      set: (items: { [key: string]: any }, callback?: () => void) => void
      get: (
        keys: string | string[] | null,
        callback: (items: { [key: string]: any }) => void
      ) => void
      remove: (
        keys: string | string[],
        callback: (items: { [key: string]: any }) => void
      ) => void
    }
    const local: StorageArea
  }
}

// chrome.storage.local.get() must be wrapped in a promise to allow await.
const getResult = (taskKey: string) => {
  return new Promise((resolve) => {
    chrome.storage.local.get(taskKey, (result) => {
      if (chrome.runtime.lastError) {
        console.error(
          "Error checking for existing task:",
          chrome.runtime.lastError.message
        )
        // Resolve with undefined in case of an error
        resolve(undefined)
      } else {
        resolve(result[taskKey])
      }
    })
  })
}

// Function to add a task entry to storage
// Function also checks if the key already exists, if so, task is not added.
export async function addTask(
  taskName: string,
  taskHours: number,
  taskMinutes: number,
  isRunning: boolean = false,
  isSetAlarm: boolean = false
) {
  // Concatenate 'task-' to uniquely identify task keys.
  const taskKey = "task-" + taskName.toLowerCase()

  // Create a duration object to store as the value
  const taskDuration: Duration = {
    hours: taskHours,
    minutes: taskMinutes,
    isRunning: isRunning,
    isSetAlarm: false,
    timer: 0
  }

  // Result is used later on, so await is used to ensure it contains the correct value.
  const result = await getResult(taskKey)

  // If the result's type is undefined, the key is not in use. Therefore, set the value.
  // Otherwise, do not set the value.
  if (typeof result === "undefined") {
    chrome.storage.local.set({ [taskKey]: taskDuration }, () => {
      if (chrome.runtime.lastError) {
        console.error("Error adding task:", chrome.runtime.lastError)
      } else {
        console.log("Task added:", taskKey)
      }
    })
  } else {
    console.log("Task key already exists: ", taskKey)
  }
}

// Function to edit a task entry in storage
// Function also checks if the key does not exist, if so, task is not edited.
export async function editTask(
  taskName: string,
  taskHours: number,
  taskMinutes: number,
  isRunning: boolean = false
) {
  // Concatenate 'task-' to uniquely identify task keys.
  const taskKey = "task-" + taskName.toLowerCase()
  console.log(taskName)
  // Create a duration object to store as the value
  const taskDuration: Duration = {
    hours: taskHours,
    minutes: taskMinutes,
    isRunning: isRunning,
    isSetAlarm: false,
    timer: 0
  }

  // Result is used later on, so await is used to ensure it contains the correct value.
  const result = await getResult(taskKey)

  // If the result's type is not undefined, the key is in use. Therefore, set the value as the new edit value.
  // Otherwise, the key is not in use. Log the error.
  if (typeof result != "undefined") {
    chrome.storage.local.set({ [taskKey]: taskDuration }, () => {
      if (chrome.runtime.lastError) {
        console.error("Error editing task:", chrome.runtime.lastError)
      } else {
        console.log("Task edited:", taskKey)
      }
    })
  } else {
    console.log("Task key does not exist: ", taskKey)
  }
}

// Function to remove a task entry in storage
// Function also checks if the key does not exist, if so, task can not be removed.
export async function removeTask(taskName: string) {
  // Concatenate 'task-' to uniquely identify task keys.
  const taskKey = "task-" + taskName.toLowerCase()

  // Result is used later on, so await is used to ensure it contains the correct value.
  const result = await getResult(taskKey)

  // If the result's type is not undefined, the key is in use. Therefore, the task can be removed.
  // Otherwise, the key is not in use, so the task can not be removed. Log the error.
  if (typeof result != "undefined") {
    chrome.storage.local.remove(taskKey, () => {
      if (chrome.runtime.lastError) {
        console.error("Error removing task:", chrome.runtime.lastError)
      } else {
        console.log("Task removed:", taskKey)
      }
    })
  } else {
    console.log("Task key does not exist: ", taskKey)
  }
}

export async function retrieveTask(task = null) {
  return new Promise((resolve, reject) => {
    chrome.storage.local.get(task, function (items) {
      let allKeys = Object.keys(items)
      resolve(allKeys)
    })
  })
}

export async function getHoursMinutes(taskKey: string) {
  const result = await getResult(taskKey)

  return result
}
