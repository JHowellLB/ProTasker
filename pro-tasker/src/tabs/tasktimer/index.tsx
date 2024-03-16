import "./task_styles.css"
import React, { useState } from 'react';


const TaskTimer = () => {
  const [visibility, setVisibility] = useState(false);
  const [editVisibility, setEditVisibility] = useState(false);
  const [tasks, setTasks] = useState([]);
  const [currentTask, setCurrentTask] = useState({id: "", task: "", h: "", m: ""});

  const Task = ({ task, onDelete, onEdit }) => {
    return (
      <div className="row" id={task.id}>
        <div className="Log">
          <div className="logEle">{task.task}</div>
          <div className="logEle">{task.h} : {task.m}</div>
          <button className="PPE">Play/Pause</button>
        </div>
        <button className="PPE" onClick={() => { onEdit(task); setEditVisibility(true)}}>Edit</button>
      </div>
    );
  };

  const addTask = () => {
    let task = (document.getElementById("task") as HTMLInputElement).value;
    let h = (document.getElementById("hour") as HTMLInputElement).value;
    let m = (document.getElementById("minute")as HTMLInputElement).value;
    let id = Date.now().toString(); 
    setTasks([...tasks, {id, task, h, m}]);
    setVisibility(false);
  };

  const deleteTask = (id) => {
    setTasks(tasks.filter(task => task.id !== id));
    setEditVisibility(false);
  };

  return (
    <section>
      <div className="addTask" onClick={() => setVisibility(true)}>
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

export default TaskTimer;
