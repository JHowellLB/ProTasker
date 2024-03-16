export {}
import {addTask, editTask, retrieveTask, getHoursMinutes} from "../../api/taskDB"
import React, {useState} from "react"
import "./task_styles.css"

const TaskTimer = () => {
  const [addVisibility, setAddVisibility] = useState(false);

  function loadTasks() {
    let getTasks = retrieveTask();
    getTasks.then((message) => {
      let taskArray = new Array(message);
      taskArray = taskArray[0];
      for (let i = 0; i < taskArray.length; i++) {
        let getTime = getHoursMinutes(taskArray[i]);
        getTime.then((message) => {
          createRow(taskArray[i], message.hours, message.minutes);
        })
      }
    })
  }

  const createRow = (task:string, h:number, m:number) => {

    const row = document.createElement("div");
    row.className = "row";

    const ltask = document.createElement("div");
    ltask.innerText = task;
    ltask.className = "logEle";
    ltask.id = task;
    const ltime = document.createElement("div");
    ltime.innerText = h + " : " + m;
    ltime.className = "timeEle";
    const lplay = document.createElement("button");
    lplay.className = "PP";
    const ledit = document.createElement("button");
    ledit.className = "E";
    ledit.onclick = () => {setAddVisibility(!addVisibility)}; // FIXIT Needs to connect edit button to function

    row.innerHTML += ltask.outerHTML;
    row.innerHTML += ltime.outerHTML;
    row.innerHTML += lplay.outerHTML;
    row.innerHTML += ledit.outerHTML;

    document.getElementById("logBody").innerHTML += row.outerHTML;

  }

  async function Task() {
    // Get input values
    let task = (document.getElementById("task") as HTMLInputElement).value.trim();
    let h = parseInt((document.getElementById("hour") as HTMLInputElement).value);
    let m = parseInt((document.getElementById("minute") as HTMLInputElement).value);

    // Validate inputs
    if (task === "" || isNaN(h) || isNaN(m) || h < 0 || h > 999 || m < 0 || m >= 60) {
      alert("Invalid Input. Task Name, Hours and Minutes should be valid.");
      return;
    }

    await addTask(task, h, m);
    loadTasks();

    setAddVisibility(!addVisibility);
  }


  loadTasks();


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
        <div id="logBody">
        </div>
      </div>

      {addVisibility && (
        <div id="popup" className="popup">
          <div className="popUpHeader">
            <h3 className="titleLabel">Add Task</h3>
            <div className="closeBox" onClick={() => setAddVisibility(!addVisibility)}>
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
