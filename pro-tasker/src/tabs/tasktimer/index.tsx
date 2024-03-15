import "./task_styles.css"
import React, {useState} from "react"

const TaskTimer = () => {
  const [visibility, setVisibility] = useState(false);
 // Latest version
  const Task = () => {
    // Get input values
    let task = (document.getElementById("task") as HTMLInputElement).value.trim();
    let h = parseInt((document.getElementById("hour") as HTMLInputElement).value);
    let m = parseInt((document.getElementById("minute") as HTMLInputElement).value);

    // Validate inputs
    if (task === "" || isNaN(h) || isNaN(m) || h < 0 || m < 0 || m >= 60) {
      alert("Please enter valid inputs. Task name should not be empth, and minutes must be less than 60.");
      return;
    }

    const row = document.createElement("div");
    row.className = "row";
    
    const logger = document.createElement("div");
    logger.className = "Log";

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
