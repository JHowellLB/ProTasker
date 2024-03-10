import "./format.css"

const togglePopup = () => {
    var popup = document.getElementById("popup");
    if (popup.style.display === "none") {
        popup.style.display = "block";
    } else {
        popup.style.display = "none";
    }
  }


const TaskTimer = () => {
  return (
    <section>
        <div class="addTask" onClick={() => togglePopup()}>
             + Add Task
        </div>
        <div id="popup" class="popup">
            <div class="popUpHeader">
                <h3 class="titleLabel">Add Task</h3>
                <div class="closeBox" onClick={() => togglePopup()}>X</div>
            </div>
        </div>
    </section>
  );
};

export default TaskTimer;
