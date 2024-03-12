import "./task_styles.css"
import React, {useState} from "react"

const TaskTimer = () => {
  const [visibility, setVisibility] = useState(false);

const Task = () => {
  const row = document.createElement("div");
  row.className = "row";
  
  const logger = document.createElement("div");
  logger.className = "Log";

  let task = (document.getElementById("task") as HTMLInputElement).value;
  let h = (document.getElementById("hour") as HTMLInputElement).value;
  let m = (document.getElementById("minute") as HTMLInputElement).value;

  const ltask = document.createElement("div");
  ltask.innerText = task;
  ltask.className = "logEle";
  const ltime = document.createElement("div");
  ltime.innerText = h + " : " + m;
  ltime.className = "logEle";
  const lplay = document.createElement("button");
  lplay.className = "PPE";

  logger.innerHTML += ltask.outerHTML;
  logger.innerHTML += ltime.outerHTML;
  logger.innerHTML += lplay.outerHTML;
  row.innerHTML += logger.outerHTML;

  const edit = document.createElement("button");
  edit.className = "PPE";

  row.innerHTML += edit.outerHTML;

  document.getElementById("logBody").innerHTML += row.outerHTML;

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
          <h4></h4>
          <h4>Timer</h4>
          <h4>Play/Pause</h4>
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
