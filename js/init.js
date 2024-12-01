import * as components from "./components.js";
import * as helper from "./helper.js";

let timeout;

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

create_task.addEventListener("click", (e) => {
    body.appendChild(components.createAddTaskModal());
});

search.addEventListener("keydown", (e) => {
    clearTimeout(timeout);

    timeout = setTimeout(() => {
        const tasks = document.getElementById("task-grid").childNodes;
        tasks.forEach((task) => {
            const title = task.getAttribute("name");

            if (!title.includes(search.value)) {
                task.classList.add("card-leave");
                task.classList.remove("card-enter");
                setTimeout(() => {
                    task.classList.add("hidden");
                }, 400);
            } else {
                task.classList.remove("card-leave");
                task.classList.remove("hidden");
                task.classList.add("card-enter");
            }
        });
    }, 200);
});

export const renderTasks = async () => {
    const tasks = helper.getTasks();

    if (tasks) {
        task_grid.innerHTML = "";
        for (const task of tasks) {
            task_grid.appendChild(components.createCard(task));
            await helper.delay(300);
        }
    }
};

renderTasks();
