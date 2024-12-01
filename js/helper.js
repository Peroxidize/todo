import * as components from "./components.js";

export const assert = (condition, message) => {
    if (condition) {
        throw new Error(message || "Assertion failed!");
    }
};

export const addToLocalStorage = (obj) => {
    assert(!obj, "object must non-empty");

    const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
    tasks.push(obj);
    console.log(tasks);

    localStorage.setItem("tasks", JSON.stringify(tasks));
};

export const clearLocalStorage = () => {
    localStorage.clear();
};

export const removeToast = () => {
    const toast = document.getElementById("toast");

    const handleRemove = async () => {
        toast.classList.add("toast-leave");
        await helper.delay(300); // Wait for transition to complete
        toast.remove();
    };

    if (toast) {
        handleRemove();
    }
};

// Helper function to create a delay
export const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export const compareDates = (date) => {
    assert(!date, "undefined date");

    const taskDate = new Date(date);

    const dateNow = new Date();
    dateNow.setHours(0, 0, 0, 0);

    return taskDate < dateNow;
};

export const setCompleted = (id) => {
    assert(!id);
    console.log(id);

    const tasks = JSON.parse(localStorage.getItem("tasks"));
    const task = tasks.find((task) => task.id === id);

    task.completed = task.completed === true ? false : true;

    localStorage.setItem("tasks", JSON.stringify(tasks));
    return task.completed;
};

export const removeTask = (id) => {
    assert(!id);

    const tasks = JSON.parse(localStorage.getItem("tasks"));
    const new_tasks = tasks.filter((task) => task.id !== id);

    localStorage.setItem("tasks", JSON.stringify(new_tasks));
};

export const getTask = (id) => {
    assert(!id);

    const tasks = JSON.parse(localStorage.getItem("tasks"));
    const task = tasks.find((task) => task.id === id);

    return task;
};

export const getTasks = () => {
    return JSON.parse(localStorage.getItem("tasks"));
};

export const reRenderTask = (id) => {
    assert(!id);

    const task = getTask(id);
    const node = document.getElementById(task.id);
    const new_node = components.createCard(task);
    new_node.classList.remove("card-enter");

    node.replaceWith(new_node);
};

export const renderTasks = async (task_grid) => {
    assert(!task_grid);

    const tasks = getTasks();

    if (tasks) {
        task_grid.innerHTML = "";
        for (const task of tasks) {
            task_grid.appendChild(components.createCard(task));
            await delay(300);
        }
    }
};

export const filterTask = (filters) => {
    const tasks = getTasks();

    const filtered_tasks = tasks.filter((task) => {
        return (
            includeTask(filters[0], "category", task) &&
            includeTask(filters[1], "priority", task) &&
            includeTask(filters[2], "completed", task) &&
            includeTask(filters[3], "search", task)
        );
    });

    return hideFilteredTask(filtered_tasks);
};

export const hideFilteredTask = (tasks) => {
    const nodes = document.getElementById("task-grid").childNodes;

    nodes.forEach(async (node) => {
        const id = node.getAttribute("id");

        if (tasks.some((task) => task.id === Number(id))) {
            node.classList.remove("hidden");
            node.classList.remove("card-leave");
            node.classList.add("card-enter");
            await delay(400);
        } else {
            node.classList.add("card-leave");
            await delay(400);
            node.classList.add("hidden");
        }
    });
};

function includeTask(filter, category, task) {
    if (filter.includes("All") || filter === "") {
        return true;
    }

    switch (category) {
        case "category":
            return task.select_category === filter;
        case "priority":
            return task.select_priority === filter;
        case "completed":
            return task.completed === (filter === "Completed" ? true : false);
        case "search":
            return task.title.toLowerCase().includes(filter);
    }
}
