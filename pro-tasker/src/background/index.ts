export {}
import test from 'node:test'
import { addTask, editTask, removeTask } from '~api/taskDB'
console.log("Background here")

const sampleTaskName = 'Sample Task'
const sampleHours = 1
const sampleMinutes = 30
const sampleHours2 = 2
const sampleMinutes2 = 45

async function testAddtask() {

    await chrome.storage.local.clear()

    await addTask(sampleTaskName, sampleHours, sampleMinutes)

    await addTask('hello', sampleHours2, sampleMinutes2)

    await addTask('hello', sampleHours, sampleMinutes)

    await editTask('hello', sampleHours, sampleMinutes)

    await removeTask('no-exist')

    await removeTask(sampleTaskName)
}

testAddtask()