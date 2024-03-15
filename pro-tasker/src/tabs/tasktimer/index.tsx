export {}
import {addTask, editTask, retrieveTask, getHoursMinutes} from "../../api/taskDB"
import React, {useState} from "react"
import "./task_styles.css"

const TaskTimer = () => {
  const [visibility, setVisibility] = useState(false);



  

  async function loadTasks() {
    await chrome.storage.local.clear()
    await addTask('Sample Task', 1, 30)
    await addTask('Task1', 2, 45)
    await addTask('Task-2', 999, 24)

    let allKeys = retrieveTask();
    console.log("Key", allKeys);
    let duration = getHoursMinutes(allKeys[0]);
    console.log("Time:", duration);
    
    

  }

  loadTasks();







  const Task = () => {
    // Get input values
    let task = (document.getElementById("task") as HTMLInputElement).value.trim();
    let h = parseInt((document.getElementById("hour") as HTMLInputElement).value);
    let m = parseInt((document.getElementById("minute") as HTMLInputElement).value);

    // Validate inputs
    if (task === "" || isNaN(h) || isNaN(m) || h < 0 || h > 999 || m < 0 || m >= 60) {
      alert("Invalid Input. Task Name, Hours and Minutes should be valid.");
      return;
    }


    // Placeholder
    const row = document.createElement("div");
    row.className = "row";
    
    const logger = document.createElement("div");
    logger.className = "Log";

    const ltask = document.createElement("div");
    ltask.innerText = task;
    ltask.className = "logEle";
    const ltime = document.createElement("div");
    ltime.innerText = h + " : " + m;
    ltime.className = "timeEle";
    const lplay = document.createElement("button");
    lplay.className = "PP";

    logger.innerHTML += ltask.outerHTML;
    logger.innerHTML += ltime.outerHTML;
    logger.innerHTML += lplay.outerHTML;
    row.innerHTML += logger.outerHTML;

    const edit = document.createElement("button");
    edit.className = "E";

    row.innerHTML += edit.outerHTML;

    document.getElementById("logBody").innerHTML += row.outerHTML;
    // Placeholder


    setVisibility(!visibility);
  }

  return (
    <section>
      <div className="addTask" onClick={() => setVisibility(!visibility)}>
        + Add Task
      </div>

      <div className="taskLog">
        <div className="logHeader">
          <h4>Tasks</h4>
          <h4>Timer</h4>
          <h4>Play/Pause</h4>
          <h4>Edit</h4>
        </div>
        <div id="logBody">
        </div>
      </div>

      {visibility && (
        <div id="popup" className="popup">
          <div className="popUpHeader">
            <h3 className="titleLabel">Add Task</h3>
            <div className="closeBox" onClick={() => setVisibility(!visibility)}>
              X
            </div>
          </div>
          <div>
            <h3>Task Name:</h3>
            <input id="task" className="task_input" type="text"></input>
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
              <input className="time" type="submit" value="Save" onClick={() => Task()}></input>
            </div>
          </div>
        </div>
      )}
    </section>
  )
}

export default TaskTimer
