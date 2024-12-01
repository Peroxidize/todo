import * as components from "./components.js";
import * as helper from "./helper.js";

let timeout;

const filters = ["All Categories", "All Priority", "All Tasks", ""];

const body = document.querySelector("body");
const create_task = document.getElementById("create-task");
const select_grid = document.getElementById("select-grid");
const task_grid = document.getElementById("task-grid");
const search = document.getElementById("search");

const categories = ["All Categories", "Work", "Personal", "Shopping"];
const priorities = ["All Priorities", "High", "Medium", "Low"];
const tasks = ["All Tasks", "Completed", "Incomplete"];

select_grid.innerHTML = "";
select_grid.appendChild(components.createSelect(categories, "category"));
select_grid.appendChild(components.createSelect(priorities, "priorities"));
select_grid.appendChild(components.createSelect(tasks, "tasks"));

const select_category = document.getElementById("category");
const select_priorities = document.getElementById("priorities");
const select_tasks = document.getElementById("tasks");

select_category.addEventListener("change", (e) => {
    filters[0] = select_category.value;
    helper.filterTask(filters);
});

select_priorities.addEventListener("change", (e) => {
    filters[1] = select_priorities.value;
    helper.filterTask(filters);
});

select_tasks.addEventListener("change", (e) => {
    filters[2] = select_tasks.value;
    helper.filterTask(filters);
});

create_task.addEventListener("click", (e) => {
    task_grid.appendChild(components.createAddTaskModal());
});

search.addEventListener("keydown", (e) => {
    clearTimeout(timeout);

    timeout = setTimeout(() => {
        filters[3] = search.value;
        helper.filterTask(filters);
    }, 200);
});

helper.renderTasks(task_grid);
helper.updateTracker();