// Define an interface for the duration entry, this will be stored as the value in the key-value storage.
// This represents the duration of the task in hours and minutes.
interface Duration {
    hours: number;
    minutes: number;
    schedules: Schedule[];
}
  
export interface Schedule {
    day: string; // Maybe use an enum for days
    startTime: string;
}

// chrome.storage.local.get() must be wrapped in a promise to allow await.
const getResult = (blockedKey: string) => {
    return new Promise(resolve => {
        chrome.storage.local.get(blockedKey, result => {
            if (chrome.runtime.lastError) {
                console.error('Error checking for existing blocked site:', chrome.runtime.lastError.message);
                // Resolve with undefined in case of an error
                resolve(undefined);
            } else {
                resolve(result[blockedKey]);
            }
        });
    });
};

// Function to add a blocked website with schedule to storage
// Since schedule is optional, an empty list is a valid input and will be added to storage.
// Function also checks if the key already exists, if so, task is not added.
export async function addBlocked(blockedSite: string, blockedHours: number, blockedMinutes: number, schedules: Schedule[]) {
    // Concatenate 'blocked-' to uniquely identify task keys.
    const blockedKey = 'blocked-' + blockedSite.toLowerCase();
    console.log(schedules)

    // Create a duration object to store as the value
    const blockedDuration: Duration = {
        hours: blockedHours,
        minutes: blockedMinutes,
        schedules: schedules,
    };

    // Result is used later on, so await is used to ensure it contains the correct value.
    const result = await getResult(blockedKey)

    // If the result's type is undefined, the key is not in use. Therefore, set the value.
    // Otherwise, do not set the value.
    if (typeof result === 'undefined') {
        chrome.storage.local.set({ [blockedKey]: blockedDuration }, () => {
            if (chrome.runtime.lastError) {
                console.error('Error adding blocked site:', chrome.runtime.lastError);
            } else {
                console.log('Blocked site added:', blockedKey);
            }
        });
    }
    else {
        console.log('Blocked site key already exists: ', blockedKey)
    }
}