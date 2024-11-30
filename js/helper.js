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