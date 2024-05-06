import React, { useEffect, useState } from "react"
import { CgPlayButtonO, CgPlayPauseO } from "react-icons/cg"
import { FaEdit } from "react-icons/fa"

import { addTask, editTask, removeTask } from "../../api/taskDB"

import "./task_styles.css"

const TaskTimer = () => {
  const [addVisibility, setAddVisibility] = useState(false)
  const [editVisibility, setEditVisibility] = useState("")
  const [taskList, setTaskList] = useState([])
  const [editedHour, setEditedHour] = useState("")
  const [editedMinute, setEditedMinute] = useState("")
  const [addTaskName, setAddTaskName] = useState("")

  const handleEdit = (task) => {
    setEditVisibility(task)
  }

  const handleEditTask = async (task) => {
    if (
      isNaN(parseInt(editedHour)) ||
      isNaN(parseInt(editedMinute)) ||
      parseInt(editedHour) < 0 ||
      parseInt(editedMinute) < 0 ||
      parseInt(editedMinute) >= 60
    ) {
      alert("Invalid Input. Hours and Minutes should be valid.")
      return
    }

    await editTask(task, parseInt(editedHour), parseInt(editedMinute))
    setEditedHour("")
    setEditedMinute("")
    setEditVisibility("")
  }

  const handleAdd = (add) => {
    setAddVisibility(!add)
  }
  const handleTimer = (task) => {
    chrome.storage.local.get([`task-${task}`], (res) => {
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
  }

  async function ATask() {
    if (
      addTaskName == "" ||
      isNaN(parseInt(editedHour)) ||
      isNaN(parseInt(editedMinute)) ||
      parseInt(editedHour) < 0 ||
      parseInt(editedMinute) < 0 ||
      parseInt(editedMinute) >= 60
    ) {
      alert("Invalid Input. Hours and Minutes should be valid.")
      return
    }

    await addTask(addTaskName, parseInt(editedHour), parseInt(editedMinute))
    setEditedHour("")
    setEditedMinute("")
    setAddVisibility(!addVisibility)
  }
  const DTask = async (task) => {
    await removeTask(task)
  }

  const parseTaskList = async () => {
    const newTaskList = [...taskList]
    const retrieveData = await chrome.storage.local.get()
    for (const task in retrieveData) {
      if (task.startsWith("task-")) {
        const taskData = await chrome.storage.local.get(task)
        newTaskList[task.substring(5)] = taskData[task]
      }
    }
    setTaskList(newTaskList)
  }
  parseTaskList()
  useEffect(() => {
    const loadTimesInterval = setInterval(parseTaskList, 1000)

    return () => {
      clearInterval(loadTimesInterval)
    }
  }, [])

  return (
    <section>
      {addVisibility ? (
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
              placeholder="Input Name"
              onChange={(e) => setAddTaskName(e.target.value)}></input>
            <h3>Task Timer:</h3>
            <div className="time_input">
              <input
                id="hour"
                className="time"
                type="text"
                placeholder="Hours"
                onChange={(e) => setEditedHour(e.target.value)}></input>
              <input
                id="minute"
                className="time"
                type="text"
                placeholder="Minutes"
                onChange={(e) => setEditedMinute(e.target.value)}></input>
              <input
                className="time"
                type="submit"
                value="Save"
                onClick={() => ATask()}></input>
            </div>
          </div>
        </div>
      ) : (
        <div></div>
      )}
      <div onClick={() => handleAdd(addVisibility)} className="addSite">
        + Add Task
      </div>
      <div className="taskTimerContainer">
        <div className="taskTimerHeaders">
          <div className="taskTimerName">Website</div>
          <div className="taskTimerTime">Timer</div>
          <div className="taskTimerPlay">Play/Pause</div>
          <div className="taskTimerEdit">Edit</div>
        </div>
        <div className="taskDataContainer">
          {Object.entries(taskList).map(([task, taskData], index) => (
            <div key={index} className="taskData">
              <div className="taskName">{task}</div>
              <div className="timer">
                <div>
                  {`${Math.floor(((taskData.hours * 60 + taskData.minutes) * 60 - taskData.timer) / 3600)}`.padStart(
                    2,
                    "0"
                  )}
                  {":"}
                  {`${Math.floor(((taskData.hours * 60 + taskData.minutes) * 60 - taskData.timer) / 60) % 60}`.padStart(
                    2,
                    "0"
                  )}
                  {":"}
                  {`${((taskData.hours * 60 + taskData.minutes) * 60 - taskData.timer) % 60}`.padStart(
                    2,
                    "0"
                  )}
                </div>
              </div>
              {taskData.isRunning === false ? (
                <div
                  onClick={() => {
                    handleTimer(task)
                  }}
                  className="button">
                  <CgPlayButtonO size={28} />
                </div>
              ) : (
                <div
                  onClick={() => {
                    handleTimer(task)
                  }}
                  className="button">
                  <CgPlayPauseO size={28} />
                </div>
              )}
              <div
                onClick={() => {
                  handleEdit(task)
                }}
                className="button">
                <FaEdit size={28} />
              </div>
              <div>
                {
                  <div
                    id="editPopup"
                    className={editVisibility === task ? "popup" : "popupNone"}>
                    <div className="popUpHeader">
                      <h3 className="titleLabel">Edit Task</h3>
                      <div
                        className="closeBox"
                        onClick={() => setEditVisibility("")}>
                        X
                      </div>
                    </div>
                    <div>
                      <h3>Task:</h3>
                      <form>
                        <div className="comboBox">{task}</div>
                      </form>
                      <h3>Edit Timer:</h3>
                      <div className="edit_input">
                        <input
                          id="editHour"
                          className="time"
                          type="text"
                          placeholder={`${taskData.hours}`}
                          value={editedHour}
                          onChange={(e) =>
                            setEditedHour(e.target.value)
                          }></input>
                        <input
                          id="editMinute"
                          className="time"
                          type="text"
                          placeholder={`${taskData.minutes}`}
                          value={editedMinute}
                          onChange={(e) =>
                            setEditedMinute(e.target.value)
                          }></input>
                        <input
                          className="time"
                          type="submit"
                          value="Save"
                          onClick={() => handleEditTask(task)}></input>
                        <input
                          className="time"
                          type="submit"
                          value="Delete"
                          onClick={() => DTask(task)}></input>
                      </div>
                    </div>
                  </div>
                }
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default TaskTimer
