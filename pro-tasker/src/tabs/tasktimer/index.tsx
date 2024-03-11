<<<<<<< HEAD
import "./task_styles.css"

const togglePopup = () => {
    let popup = document.getElementById("popup");
    if (popup?.style.display === "none") {
        popup.style.display = "block";
    } else {
        popup!.style.display = "none";
    }
  }

=======
import "./tasktimer.css"

const togglePopup = () => {
  let popup = document.getElementById("popup")
  if (popup?.style.display === "none") {
    popup.style.display = "block"
  } else {
    popup!.style.display = "none"
  }
}
>>>>>>> main

const TaskTimer = () => {
  return (
    <section>
<<<<<<< HEAD
        <div className="addTask" onClick={() => togglePopup()}>
             + Add Task
        </div>
        <div id="popup" className="popup">
            <div className="popUpHeader">
              <h3 className="titleLabel">Add Task</h3>
              <div className="closeBox" onClick={() => togglePopup()}>X</div>
            </div>
            <div>
              <h3>Task Name:</h3>
              <input className="task_input" type="text"></input>
              <h3>Task Timer:</h3>
              <div className="time_input">
                <input id="hour" className="time" type="text" placeholder="Hours"></input>
                <input id="minute" className="time" type="text" placeholder="Minutes"></input>
                <input className="time" type="submit" value="Save"></input>
              </div>
            </div>
        </div>
    </section>
  );
};

export default TaskTimer;
=======
      <div className="addTask" onClick={() => togglePopup()}>
        + Add Task
      </div>
      <div id="popup" className="popup">
        <div className="popUpHeader">
          <h3 className="titleLabel">Add Task</h3>
          <div className="closeBox" onClick={() => togglePopup()}>
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
    </section>
  )
}

export default TaskTimer
>>>>>>> main
