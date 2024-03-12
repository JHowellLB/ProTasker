import "./task_styles.css"
import React, {useState} from "react"

const TaskTimer = () => {
  const [visibility, setVisibility] = useState(false);

  return (
    <section>
      <div className="addTask" onClick={() => setVisibility(!visibility)}>
        + Add Task
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
            <input className="task_input" type="text"></input>
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
              <input className="time" type="submit" value="Save"></input>
            </div>
          </div>
        </div>
      )}
    </section>
  )
}

export default TaskTimer 
