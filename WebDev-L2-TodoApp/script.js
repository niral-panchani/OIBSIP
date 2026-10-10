
const taskForm = document.getElementById("taskForm");
const taskInput = document.getElementById("taskInput");
const pendingList = document.getElementById("pendingList");
const completedList = document.getElementById("completedList");
const pendingCount = document.getElementById("pendingCount");
const completedCount = document.getElementById("completedCount");
const pendingEmpty = document.getElementById("pendingEmpty");
const completedEmpty = document.getElementById("completedEmpty");
const message = document.getElementById("message");

let tasks = [];

try {
    const savedTasks = JSON.parse(localStorage.getItem("todoTasks") || "[]");

    if (Array.isArray(savedTasks)) {
        tasks = savedTasks.filter(function (task) {
            return task &&
                typeof task.id === "string" &&
                typeof task.text === "string" &&
                typeof task.completed === "boolean" &&
                typeof task.createdAt === "string";
        });
    }
} catch (error) {
    tasks = [];
}

function saveTasks() {
    try {
        localStorage.setItem("todoTasks", JSON.stringify(tasks));
        message.textContent = "";
        return true;
    } catch (error) {
        message.textContent = "Unable to save tasks in this browser.";
        return false;
    }
}

function formatTime(dateString) {
    const date = new Date(dateString);

    if (Number.isNaN(date.getTime())) {
        return "Date unavailable";
    }

    return date.toLocaleString();
}

function renderTasks() {
    pendingList.replaceChildren();
    completedList.replaceChildren();

    const pendingTasks = tasks.filter(function (task) {
        return !task.completed;
    });

    const completedTasks = tasks.filter(function (task) {
        return task.completed;
    });

    pendingCount.textContent = pendingTasks.length + " pending";
    completedCount.textContent = completedTasks.length + " completed";

    pendingEmpty.classList.toggle("hidden", pendingTasks.length > 0);
    completedEmpty.classList.toggle("hidden", completedTasks.length > 0);

    pendingTasks.forEach(function (task) {
        pendingList.appendChild(createTaskElement(task));
    });

    completedTasks.forEach(function (task) {
        completedList.appendChild(createTaskElement(task));
    });
}

function createTaskElement(task) {
    const item = document.createElement("li");
    item.className = "task-item";

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.className = "task-check";
    checkbox.checked = task.completed;
    checkbox.setAttribute(
        "aria-label",
        task.completed ? "Mark task pending" : "Mark task complete"
    );

    checkbox.addEventListener("change", function () {
        const wasCompleted = task.completed;
        task.completed = checkbox.checked;

        if (task.completed) {
            task.completedAt = new Date().toISOString();
        } else {
            delete task.completedAt;
        }

        if (!saveTasks()) {
            task.completed = wasCompleted;

            if (wasCompleted && task.completedAt) {
                // Keep the original completion time.
            } else {
                delete task.completedAt;
            }
        }

        renderTasks();
    });

    const content = document.createElement("div");
    content.className = "task-content";

    const text = document.createElement("p");
    text.className = "task-text";
    text.textContent = task.text;

    const time = document.createElement("p");
    time.className = "task-time";
    time.textContent = "Added: " + formatTime(task.createdAt);

    if (task.completed && task.completedAt) {
        time.textContent += " | Completed: " + formatTime(task.completedAt);
    }

    content.append(text, time);

    const actions = document.createElement("div");
    actions.className = "task-actions";

    const editButton = document.createElement("button");
    editButton.type = "button";
    editButton.textContent = "Edit";

    editButton.addEventListener("click", function () {
        const updatedText = prompt("Edit your task:", task.text);

        if (updatedText === null) return;

        const newText = updatedText.trim();

        if (!newText) {
            message.textContent = "Task cannot be empty.";
            return;
        }

        if (newText.length > 200) {
            message.textContent = "Task must be 200 characters or fewer.";
            return;
        }

        const oldText = task.text;
        task.text = newText;

        if (!saveTasks()) {
            task.text = oldText;
        }

        renderTasks();
    });

    const deleteButton = document.createElement("button");
    deleteButton.type = "button";
    deleteButton.textContent = "Delete";
    deleteButton.className = "delete-btn";

    deleteButton.addEventListener("click", function () {
        const confirmed = confirm("Delete this task permanently?");

        if (!confirmed) return;

        const oldTasks = tasks;
        tasks = tasks.filter(function (item) {
            return item.id !== task.id;
        });

        if (!saveTasks()) {
            tasks = oldTasks;
        }

        renderTasks();
    });

    actions.append(editButton, deleteButton);
    item.append(checkbox, content, actions);

    return item;
}

taskForm.addEventListener("submit", function (event) {
    event.preventDefault();

    const text = taskInput.value.trim();

    if (!text) {
        message.textContent = "Please enter a task.";
        return;
    }

    if (text.length > 200) {
        message.textContent = "Task must be 200 characters or fewer.";
        return;
    }

    const task = {
        id: Date.now().toString() + Math.random().toString(16).slice(2),
        text: text,
        completed: false,
        createdAt: new Date().toISOString()
    };

    tasks.push(task);

    if (!saveTasks()) {
        tasks.pop();
        return;
    }

    taskInput.value = "";
    renderTasks();
    taskInput.focus();
});

renderTasks();
