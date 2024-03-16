export {}
import {addTask, editTask, retrieveTask, getHoursMinutes} from "../../api/taskDB"
import React, {useState} from "react"
import "./task_styles.css"

const TaskTimer = () => {
  const [visibility, setVisibility] = useState(false);

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

    setVisibility(!visibility);
  }


  loadTasks();


  return (
    <section>
      <div className="addTask" onClick={() => setVisibility(true)}>
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
          {tasks.map(task => <Task key={task.id} task={task} onDelete={deleteTask} onEdit={setCurrentTask} />)}
        </div>
      </div>
      
      {visibility && (
        <div id="popup" className="popup">
          <div className="popUpHeader">
            <h3 className="titleLabel">Add Task</h3>
            <div className="closeBox" onClick={() => setVisibility(false)}>
              X
            </div>
          </div>
          <div>
            <h3>Task Name:</h3>
            <input id="task" className="task_input" type="text"></input>
            <h3>Task Timer:</h3>
            <div className="time_input">
              <input id="hour" className="time" type="text" placeholder="Hours"></input>
              <input id="minute" className="time" type="text" placeholder="Minutes"></input>
              <input className="time" type="submit" value="Save" onClick={addTask}></input>
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
            <h3>Task Name:</h3>
            <input id="editTask" className="task_input" type="text" value={currentTask.task}></input>
            <h3>Task Timer:</h3>
            <div className="time_input">
              <input id="editHour" className="time" type="text" placeholder="Hours" value={currentTask.h}></input>
              <input id="editMinute" className="time" type="text" placeholder="Minutes" value={currentTask.m}></input>
              <input className="time" type="submit" value="Save" onClick={() => {}}></input>
              <input className="time" type="submit" value="Delete" onClick={() => deleteTask(currentTask.id)}></input>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default TaskTimer
