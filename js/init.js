import * as components from "./components.js";
import * as helper from "./helper.js";

const body = document.querySelector("body");
const create_task = document.getElementById("create-task");
const select_grid = document.getElementById("select-grid");
const task_grid = document.getElementById("task-grid");

const categories = ["All Categories", "Work", "Personal", "Shopping"];
const priorities = ["All Priorities", "High", "Medium", "Low"];
const tasks = ["All Tasks", "Completed", "Incomplete"];

select_grid.innerHTML = "";
select_grid.appendChild(components.createSelect(categories, "category"));
select_grid.appendChild(components.createSelect(priorities, "priorities"));
select_grid.appendChild(components.createSelect(tasks, "tasks"));

create_task.addEventListener("click", (e) => {
    body.appendChild(components.createAddTaskModal());
});

export const renderTasks = () => {
    const tasks = helper.getTasks();

    if (tasks) {
        task_grid.innerHTML = "";
        tasks.map((task) => task_grid.appendChild(components.createCard(task)));
    }
};

renderTasks();