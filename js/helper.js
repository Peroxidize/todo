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

const getCount = (category, tasks) => {
    return tasks.filter((task) => task.select_category === category).length;
};

const getCompletedCount = (category, tasks) => {
    return tasks.filter(
        (task) => task.select_category === category && task.completed
    ).length;
};

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
