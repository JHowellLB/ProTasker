import React, { useState } from "react"

import {
  addTask,
  editTask,
  getHoursMinutes,
  removeTask,
  retrieveTask
} from "../../api/taskDB"

import "./task_styles.css"

export {}

const TaskTimer = () => {
  const [addVisibility, setAddVisibility] = useState(false)
  const [editVisibility, setEditVisibility] = useState(false)

  function loadTasks() {
    const logs = document.getElementById("logBody")
    try {
      while (logs.firstChild) {
        logs.removeChild(logs.firstChild)
      }
    } catch {}

    const combo = document.getElementById("selectTask")
    try {
      while (combo.firstChild) {
        combo.removeChild(combo.firstChild)
      }
    } catch {}

    let getTasks = retrieveTask()
    getTasks.then((message) => {
      let taskArray = new Array(message)
      taskArray = taskArray[0]
      for (let i = 0; i < taskArray.length; i++) {
        let getTime = getHoursMinutes(taskArray[i])
        getTime.then((message) => {
          if (taskArray[i].substring(0, 5) === "task-") {
            createRow(taskArray[i].substring(5), message.hours, message.minutes)
            console.log(taskArray[i], message)
            try {
              let selection = document.createElement(
                "option"
              ) as HTMLOptionElement
              selection.innerText = taskArray[i].substring(5)
              document.getElementById("selectTask").appendChild(selection)
            } catch {}
          }
        })
      }
    })
  }

  const createRow = (task: string, h: number, m: number) => {
    const row = document.createElement("div")
    row.className = "row"
    row.id = task

    const ltask = document.createElement("div")
    ltask.innerText = task
    ltask.className = "logEle"
    const ltime = document.createElement("div")
    ltime.innerText = h + " : " + m
    ltime.className = "timeEle"

    const lplay = document.createElement("button")
    lplay.className = "PP"
    lplay.addEventListener("click", function () {
      chrome.storage.local.get([`task-${task}`], (res) => {
        // console.log("result", res["task-" + task])
        console.log(res)
        const original = { ...res }
        const originalTask = res[`task-${task}`]
        chrome.storage.local.set({
          ...original,
          [`task-${task}`]: {
            ...originalTask,
            isRunning: !originalTask.isRunning
          }
        })
      })
    })

    const ledit = document.createElement("button")
    ledit.className = "E"
    ledit.addEventListener("click", function () {
      setEditVisibility(true)
    })

    row.innerHTML += ltask.outerHTML
    row.innerHTML += ltime.outerHTML
    row.appendChild(lplay)
    row.appendChild(ledit)

    document.getElementById("logBody").appendChild(row)
  }

  async function ATask() {
    // Get input values
    let task = (
      document.getElementById("task") as HTMLInputElement
    ).value.trim()
    let h = parseInt(
      (document.getElementById("hour") as HTMLInputElement).value
    )
    let m = parseInt(
      (document.getElementById("minute") as HTMLInputElement).value
    )

    // Validate inputs
    if (
      task === "" ||
      isNaN(h) ||
      isNaN(m) ||
      h < 0 ||
      h > 999 ||
      m < 0 ||
      m >= 60
    ) {
      alert("Invalid Input. Task Name, Hours and Minutes should be valid.")
      return
    }

    await addTask(task, h, m)
    setAddVisibility(!addVisibility)
  }

  async function DTask() {
    let box = document.getElementById("selectTask") as HTMLSelectElement
    let delete_index = box.selectedIndex
    let delete_task = box.options[delete_index].text
    await removeTask(delete_task)

    setEditVisibility(!editVisibility)
  }

  loadTasks()

  return (
    <section>
      <div className="addTask" onClick={() => setAddVisibility(!addVisibility)}>
        + Add Task
      </div>
      <div className="taskLog">
        <div className="logHeader">
          <h4>Tasks</h4>
          <h4>Timer</h4>
          <h4>Play/Pause</h4>
          <h4>Edit</h4>
        </div>
        <div id="logBody"></div>
      </div>

      {addVisibility && (
        <div id="popup" className="popup">
          <div className="popUpHeader">
            <h3 className="titleLabel">Add Task</h3>
            <div
              className="closeBox"
              onClick={() => setAddVisibility(!addVisibility)}>
              X
            </div>
          </div>
          <div>
            <h3>Task Name:</h3>
            <input
              id="task"
              className="task_input"
              type="text"
              placeholder="Input Name"></input>
            <h3>Task Timer:</h3>
            <div className="time_input">
              <input
                id="hour"
                className="time"
                type="text"
                placeholder="Hours"></input>
              <input
                id="minute"
                className="time"
                type="text"
                placeholder="Minutes"></input>
              <input
                className="time"
                type="submit"
                value="Save"
                onClick={() => ATask()}></input>
            </div>
          </div>
        </div>
      )}
      {editVisibility && (
        <div id="editPopup" className="popup">
          <div className="popUpHeader">
            <h3 className="titleLabel">Edit Task</h3>
            <div className="closeBox" onClick={() => setEditVisibility(false)}>
              X
            </div>
          </div>
          <div>
            <h3>Choose Task:</h3>
            <form>
              <select id="selectTask" className="comboBox"></select>
            </form>
            <h3>Edit Timer:</h3>
            <div className="edit_input">
              <input
                id="editHour"
                className="time"
                type="text"
                placeholder="Hours"></input>
              <input
                id="editMinute"
                className="time"
                type="text"
                placeholder="Minutes"></input>
              <input
                className="time"
                type="submit"
                value="Save"
                onClick={() => {}}></input>
              <input
                className="time"
                type="submit"
                value="Delete"
                onClick={() => DTask()}></input>
            </div>
          </div>
        </div>
      )}
    </section>
  )
}

export default TaskTimer
