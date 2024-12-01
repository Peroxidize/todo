import * as helper from "./helper.js";
import * as init from "./init.js";

// this javascript file serves as for creating components

export const createButton = (text, id) => {
    helper.assert(!text, "Failed creating button");
    helper.assert(!id, "Failed creating button");

    const element = document.createElement("button");
    element.classList =
        "mb-4 rounded-md border border-transparent bg-slate-900 px-4 py-2 text-center text-sm font-semibold text-white shadow-md transition-all hover:bg-slate-800 hover:shadow-lg focus:bg-slate-700 focus:shadow-none active:bg-slate-700 active:shadow-none disabled:pointer-events-none disabled:opacity-90 disabled:shadow-none";
    element.textContent = text;
    element.id = id;

    return element;
};

export const createInput = (placeholder, id) => {
    helper.assert(!placeholder, "Failed creating button");
    helper.assert(!id, "Failed creating button");

    const element = document.createElement("input");
    element.classList =
        "ease mb-4 w-full rounded-md border border-slate-200 bg-transparent px-3 py-3 text-sm text-slate-700 shadow-sm transition duration-300 placeholder:text-slate-400 hover:border-slate-300 focus:border-slate-400 focus:shadow focus:outline-none";
    element.placeholder = placeholder;
    element.id = id;

    return element;
};

export const createAddTaskModal = () => {
    const form = document.createElement("form");
    form.classList = "space-y-4";

    const task_title = createInput("Task title", "task-title");
    task_title.setAttribute("required", "true");
    task_title.classList.remove("mb-4");

    const task_desc = document.createElement("textarea");
    task_desc.placeholder = "Task description";
    task_desc.setAttribute("required", "true");
    task_desc.classList =
        "min-h[80px] ease w-full rounded-md border border-slate-200 bg-transparent px-3 py-3 text-sm text-slate-700 shadow-sm transition duration-300 placeholder:text-slate-400 hover:border-slate-300 focus:border-slate-400 focus:shadow focus:outline-none";

    const category = createSelect(
        ["Work", "Personal", "Shopping"],
        "task-category"
    );
    category.ariaLabel = "Select category";

    const priority = createSelect(["High", "Medium", "Low"], "task-priority");
    priority.ariaLabel = "Select priority";

    const date = createInput("Date input", "task-date");
    date.setAttribute("required", "true");
    date.type = "date";
    date.name = "due date of the task";

    const button = createButton("Add Task", "task-button");
    button.type = "submit";
    button.classList.add("w-full");

    form.appendChild(task_title);
    form.appendChild(task_desc);
    form.appendChild(category);
    form.appendChild(priority);
    form.appendChild(date);
    form.appendChild(button);

    button.addEventListener("click", (e) => {
        if (!form.checkValidity()) {
            return;
        }
        e.preventDefault();

        const select_category = document.getElementById("task-category");
        const select_priority = document.getElementById("task-priority");

        const task = {
            id: Math.floor(Date.now() / 1000),
            title: task_title.value,
            description: task_desc.value,
            select_category: select_category.value,
            select_priority: select_priority.value,
            date: date.value,
            completed: false,
        };

        helper.addToLocalStorage(task);
        createToast("✅ Task created");
        form.reset();
        document.getElementById("task-grid").appendChild(createCard(task));
    });

    return createModal("Add New Task", form);
};

export const createModal = (title, content) => {
    helper.assert(!title, "empty title");
    helper.assert(!content, "empty content");

    const parentDiv = document.createElement("div");
    parentDiv.classList =
        "fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50";
    parentDiv.classList.add("backdrop-enter");
    parentDiv.id = "modal";

    const modalContainer = document.createElement("div");
    modalContainer.classList = "w-full max-w-md rounded-lg bg-white p-6";
    modalContainer.classList.add("modal-enter");

    const modalHeader = document.createElement("div");
    modalHeader.classList =
        "flex justify-between items-center mb-4 content-enter";

    const modalName = document.createElement("h2");
    const closeButton = document.createElement("button");
    modalName.classList = "text-xl font-semibold";
    modalName.textContent = title;
    closeButton.classList =
        "inline-flex items-center justify-center rounded-md p-3 transition-all hover:bg-gray-100";
    closeButton.innerHTML += `
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            class="h-4 w-4"
        >
            <path d="M18 6 6 18"></path>
            <path d="m6 6 12 12"></path>
        </svg>`;

    content.classList.add("content-enter");

    parentDiv.appendChild(modalContainer);
    modalContainer.appendChild(modalHeader);
    modalHeader.appendChild(modalName);
    modalHeader.appendChild(closeButton);
    modalContainer.appendChild(content);

    function setAnimation() {
        parentDiv.classList.remove("backdrop-enter");
        modalContainer.classList.remove("modal-enter");

        parentDiv.classList.add("backdrop-leave");
        modalContainer.classList.add("modal-leave");

        setTimeout(() => {
            parentDiv.remove();
        }, 200);
    }

    window.addEventListener("click", (e) => {
        if (e.target === parentDiv) {
            setAnimation();
        }
    });

    closeButton.addEventListener("click", (e) => {
        e.preventDefault();
        setAnimation();
    });

    return parentDiv;
};

export const createSelect = (list, id) => {
    helper.assert(!list, "Failed creating select");
    helper.assert(!id, "Failed creating select");

    const parentDiv = document.createElement("div");
    parentDiv.classList = "relative";
    const select = document.createElement("select");
    select.classList =
        "w-full h-10 rounded-md border border-zinc-300 bg-white py-2 pl-4 pr-8 ring-zinc-400 focus:outline-none focus:ring-2 focus:ring-offset-2";
    select.ariaLabel = "Select: " + list[0].slice(3);
    select.id = id;

    list.map((str) => {
        const option = document.createElement("option");
        option.innerText = str;
        option.value = str;

        select.appendChild(option);
    });

    parentDiv.appendChild(select);
    parentDiv.innerHTML += `
        <svg
            class="absolute right-2 top-1/2 z-10 h-4 w-4 -translate-y-1/2 transform opacity-70"
            xmlns="http://www.w3.org/2000/svg"
            height="24px"
            viewBox="0 0 24 24"
            width="24px"
            fill="#e8eaed"
        >
            <path d="M0 0h24v24H0z" fill="none" />
            <path
                d="M16.59 8.59L12 13.17 7.41 8.59 6 10l6 6 6-6z"
                fill="black"
            />
        </svg>`;

    return parentDiv;
};

export const createToast = (content) => {
    helper.assert(!content);

    helper.removeToast();
    const body = document.querySelector("body");
    const toast = document.createElement("div");
    toast.classList =
        "fixed bottom-6 right-6 rounded-lg border border-gray-200 p-4 shadow-md text-sm toast-enter z-[99] bg-white";
    toast.id = "toast";
    toast.textContent = content;

    const handleToast = async (toast) => {
        await helper.delay(3000); // Wait for 3 seconds
        toast.classList.remove("toast-enter");

        await helper.delay(300); // Wait for transition to complete
        toast.classList.add("toast-leave");

        await helper.delay(300); // Wait for leave animation to complete
        toast.remove();
    };

    body.append(toast);
    handleToast(toast);
};

export const createCard = (obj) => {
    helper.assert(!obj, "undefined obj");

    const body = document.querySelector("body");
    const card = document.createElement("div");
    card.id = obj.id;
    card.setAttribute("name", obj.title);
    card.classList = "rounded-lg border shadow-sm mb-4 p-6 card-enter";
    card.classList +=
        helper.compareDates(obj.date) && !obj.completed
            ? " border-red-500"
            : "";

    const header = document.createElement("div");
    header.classList = "flex mb-6 items-center justify-between";

    const header_wrapper = document.createElement("div");
    header_wrapper.classList = "flex items-center";
    const title = document.createElement("h3");
    title.classList = "text-2xl font-semibold leading-none tracking-tight";
    title.textContent += obj.title;

    header_wrapper.innerHTML +=
        helper.compareDates(obj.date) && !obj.completed
            ? `
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-circle-alert w-5 h-5 text-red-500 mr-2" aria-label="Overdue task"><circle cx="12" cy="12" r="10"></circle><line x1="12" x2="12" y1="8" y2="12"></line><line x1="12" x2="12.01" y1="16" y2="16"></line></svg>
    `
            : "";
    header_wrapper.appendChild(title);

    const priority = createPill(obj.select_priority);

    const details = document.createElement("div");
    details.classList = "mb-6";

    const description = document.createElement("p");
    description.textContent = obj.description;
    description.classList = "text-gray-700 mb-2 truncate w-3/4";

    const category = document.createElement("p");
    category.textContent = "Category: " + obj.select_category;
    category.classList = "text-sm text-gray-500";

    const date = new Date(obj.date);
    const due_date = document.createElement("p");
    due_date.textContent = "Due: " + date.toLocaleDateString("en-US");
    due_date.textContent +=
        helper.compareDates(obj.date) && !obj.completed ? " (Overdue)" : "";
    due_date.classList = "text-sm";
    due_date.classList +=
        helper.compareDates(obj.date) && !obj.completed
            ? " font-bold text-red-500"
            : " text-gray-500";

    const button = createLightButton("View Details");

    card.appendChild(header);
    header.appendChild(header_wrapper);
    header.appendChild(priority);
    card.appendChild(details);
    details.appendChild(description);
    details.appendChild(category);
    details.appendChild(due_date);
    card.appendChild(button);

    button.addEventListener("click", (e) => {
        const task = helper.getTask(obj.id);

        const data = viewCardDetails(
            header,
            description,
            category,
            due_date,
            task.completed,
            obj,
            card
        );

        body.appendChild(createModal("Task Details", data));
    });

    return card;
};

export const viewCardDetails = (
    header,
    description,
    category,
    date,
    completed,
    obj,
    card
) => {
    helper.assert(!header, "undefined ");
    helper.assert(!description, "undefined description");
    helper.assert(!category, "undefined category");
    helper.assert(!date, "undefined date");

    const cloned_date = date.cloneNode(true);
    const cloned_category = category.cloneNode(true);
    const cloned_description = description.cloneNode(true);
    const cloned_header = header.cloneNode(true);

    cloned_description.classList.remove("truncate");
    cloned_description.classList.remove("w-3/4");
    cloned_description.classList.add("break-words");

    const wrapper = document.createElement("div");
    wrapper.classList = "space-y-4 content-enter";

    const button_wrapper = document.createElement("div");
    button_wrapper.classList = "flex gap-2 items-center leading-3";

    const checkmark_text = document.createElement("p");
    checkmark_text.textContent = "Mark as completed";

    const button_wrapper2 = button_wrapper.cloneNode(true);
    button_wrapper2.classList += " justify-end";

    const checkmark_button = createCheckmarkButton(completed, obj);
    const close_button = createLightButton("Close");
    const delete_button = createDangerButton("Delete Task");

    close_button.addEventListener("click", (e) => {
        const backdrop = document.getElementById("modal");
        backdrop.click();
    });

    delete_button.addEventListener("click", (e) => {
        card.classList.remove("card-enter");
        card.classList.add("card-leave");
        setTimeout(() => {
            card.remove();
        }, 500);
        helper.removeTask(obj.id);
        createToast("✅ Removed Task");

        const backdrop = document.getElementById("modal");
        backdrop.click();
    });

    button_wrapper.appendChild(checkmark_button);
    button_wrapper.appendChild(checkmark_text);

    button_wrapper2.appendChild(close_button);
    button_wrapper2.appendChild(delete_button);

    wrapper.appendChild(cloned_header);
    wrapper.appendChild(cloned_description);
    wrapper.appendChild(cloned_category);
    wrapper.appendChild(cloned_date);
    wrapper.appendChild(button_wrapper);
    wrapper.appendChild(button_wrapper2);

    return wrapper;
};

export const createPill = (priority) => {
    helper.assert(!priority, "undefined priority");

    const pill = document.createElement("div");
    pill.classList = "text-sm font-semibold px-2.5 py-0.5 rounded-full m-0 ";
    pill.textContent = priority;

    switch (priority) {
        case "High":
            pill.classList += "text-white bg-red-500";
            break;
        case "Medium":
            pill.classList += "text-white bg-black";
            break;
        case "Low":
            pill.classList += "text-black bg-gray-200";
            break;
    }

    return pill;
};

export const createLightButton = (text) => {
    helper.assert(!text, "undefined text");

    const button = document.createElement("button");
    button.classList =
        "text-gray-900 bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-100 font-semibold rounded-md text-sm px-5 py-2.5 me-2 mb-2";
    button.textContent = text;

    return button;
};

export const createDangerButton = (text) => {
    helper.assert(!text, "undefined text");

    const button = document.createElement("button");
    button.classList =
        "text-white bg-red-500 border focus:outline-none focus:ring-4 focus:ring-gray-100 font-semibold rounded-md text-sm px-5 py-2.5 me-2 mb-2 hover:opacity-70";
    button.textContent = text;

    return button;
};

export const createCheckmarkButton = (completed, obj) => {
    helper.assert(completed === undefined);

    const button = document.createElement("button");
    button.classList = "h-4 w-4 border border-gray-300 leading-[-16px]";
    button.textContent = completed ? "✓" : "";

    button.addEventListener("click", (e) => {
        const result = helper.setCompleted(obj.id);

        button.textContent = result ? "✓" : "";
        helper.reRenderTask(obj.id);
    });

    return button;
};
