// This javascript is responsible for the creation of helper function
// that are used in other javascript files

import * as components from "./components.js";

// Assertion function to validate conditions; throws an error if the condition is true
export const assert = (condition, message) => {
    if (condition) {
        throw new Error(message || "Assertion failed!");
    }
};

// Function to add a task object to localStorage
export const addToLocalStorage = (obj) => {
    assert(!obj, "object must non-empty");

    const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
    tasks.push(obj);
    console.log(tasks);

    localStorage.setItem("tasks", JSON.stringify(tasks));
};

// Function to clear all data from localStorage
export const clearLocalStorage = () => {
    localStorage.clear();
};

// Function to remove a toast notification element from the DOM
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

// Helper function to create a delay for asynchronous operations
export const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// Function to compare a given date with the current date
export const compareDates = (date) => {
    assert(!date, "undefined date");

    const taskDate = new Date(date);

    const dateNow = new Date();
    dateNow.setHours(0, 0, 0, 0);

    return taskDate < dateNow;
};

// Function to toggle a task's completion status
export const setCompleted = (id) => {
    assert(!id);
    console.log(id);

    const tasks = JSON.parse(localStorage.getItem("tasks"));
    const task = tasks.find((task) => task.id === id);

    task.completed = task.completed === true ? false : true;

    localStorage.setItem("tasks", JSON.stringify(tasks));
    return task.completed;
};

// Function to remove a task from localStorage by ID
export const removeTask = (id) => {
    assert(!id);

    const tasks = JSON.parse(localStorage.getItem("tasks"));
    const new_tasks = tasks.filter((task) => task.id !== id);

    localStorage.setItem("tasks", JSON.stringify(new_tasks));
};

// Function to retrieve a specific task by ID from localStorage
export const getTask = (id) => {
    assert(!id);

    const tasks = JSON.parse(localStorage.getItem("tasks"));
    const task = tasks.find((task) => task.id === id);

    return task;
};

// Function to retrieve all tasks from localStorage
export const getTasks = () => {
    return JSON.parse(localStorage.getItem("tasks"));
};

// Function to re-render a specific task card in the UI
export const reRenderTask = (id) => {
    assert(!id);

    const task = getTask(id);
    const node = document.getElementById(task.id);
    const new_node = components.createCard(task);
    new_node.classList.remove("card-enter");

    node.replaceWith(new_node);
};

// Function to render all tasks in the task grid
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

// Function to filter tasks based on selected filters
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

// Function to update the progress tracker in the UI
export const updateTracker = () => {
    const progress = calculateProgress();
    const work_text = document.getElementById("work-text");
    const personal_text = document.getElementById("personal-text");
    const shopping_text = document.getElementById("shopping-text");

    work_text.textContent = progress[0].toFixed() + "% Complete";
    personal_text.textContent = progress[1].toFixed() + "% Complete";
    shopping_text.textContent = progress[2].toFixed() + "% Complete";

    document.documentElement.style.setProperty("--work", `${-100 + progress[0]}%`);
    document.documentElement.style.setProperty("--personal", `${-100 + progress[1]}%`);
    document.documentElement.style.setProperty("--shopping", `${-100 + progress[2]}%`);
};

// Function to calculate the progress percentage for each task category
const calculateProgress = () => {
    const progress = [];
    const tasks = getTasks();

    const work_count = getCount("Work", tasks);
    const work_completed = getCompletedCount("Work", tasks);
    const personal_count = getCount("Personal", tasks);
    const personal_completed = getCompletedCount("Personal", tasks);
    const shopping_count = getCount("Shopping", tasks);
    const shopping_completed = getCompletedCount("Shopping", tasks);

    progress.push(work_completed === 0 ? 0 : work_completed / work_count);
    progress.push(
        personal_completed === 0 ? 0 : personal_completed / personal_count
    );
    progress.push(
        shopping_completed === 0 ? 0 : shopping_completed / shopping_count
    );

    return progress.map((num) => num * 100);
};

// Function to count tasks in a specific category
const getCount = (category, tasks) => {
    return tasks.filter((task) => task.select_category === category).length;
};

// Function to count completed tasks in a specific category
const getCompletedCount = (category, tasks) => {
    return tasks.filter(
        (task) => task.select_category === category && task.completed
    ).length;
};

// Function to hide tasks that do not match the filtered results
const hideFilteredTask = (tasks) => {
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

// Function to check if a task matches the current filter
const includeTask = (filter, category, task) => {
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
};
