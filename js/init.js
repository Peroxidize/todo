// This javascript file is responsible for initializing components, event listeners, etc.

import * as components from "./components.js";
import * as helper from "./helper.js";

// Timeout variable for managing debounce logic in the search feature
let timeout;

// Filters array to manage selected category, priority, task status, and search input
const filters = ["All Categories", "All Priority", "All Tasks", ""];

// DOM element references for dynamically interacting with the UI
const create_task = document.getElementById("create-task");
const select_grid = document.getElementById("select-grid");
const task_grid = document.getElementById("task-grid");
const search = document.getElementById("search");

// Options for category, priority, and task status filters
const categories = ["All Categories", "Work", "Personal", "Shopping"];
const priorities = ["All Priorities", "High", "Medium", "Low"];
const tasks = ["All Tasks", "Completed", "Incomplete"];

// Clearing existing elements in the select grid and appending new dropdown menus
select_grid.innerHTML = "";
select_grid.appendChild(components.createSelect(categories, "category"));
select_grid.appendChild(components.createSelect(priorities, "priorities"));
select_grid.appendChild(components.createSelect(tasks, "tasks"));

// References to the created dropdown elements for filtering
const select_category = document.getElementById("category");
const select_priorities = document.getElementById("priorities");
const select_tasks = document.getElementById("tasks");

// Event listener for the category dropdown to update filters and trigger task filtering
select_category.addEventListener("change", (e) => {
    filters[0] = select_category.value;
    helper.filterTask(filters);
});

// Event listener for the priorities dropdown to update filters and trigger task filtering
select_priorities.addEventListener("change", (e) => {
    filters[1] = select_priorities.value;
    helper.filterTask(filters);
});

// Event listener for the task status dropdown to update filters and trigger task filtering
select_tasks.addEventListener("change", (e) => {
    filters[2] = select_tasks.value;
    helper.filterTask(filters);
});

// Event listener for the "Create Task" button to open a modal for adding a new task
create_task.addEventListener("click", (e) => {
    task_grid.appendChild(components.createAddTaskModal());
});

// Debounced event listener for the search input to filter tasks based on the search query
search.addEventListener("keydown", (e) => {
    clearTimeout(timeout);

    timeout = setTimeout(() => {
        filters[3] = search.value;
        helper.filterTask(filters);
    }, 200);
});

// Initial rendering of tasks in the task grid and updating the task tracker display
helper.renderTasks(task_grid);
helper.updateTracker();