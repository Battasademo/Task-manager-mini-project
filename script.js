const form = document.getElementById("taskForm");
const input = document.getElementById("taskInput");
const list = document.getElementById("tasksList");
const tasksCount = document.getElementById("tasksCount");
const completedCount = document.getElementById("completedCount");

// Load saved tasks (empty array if nothing saved or data is broken)
let tasks = [];
try {
    tasks = JSON.parse(localStorage.getItem("tasks")) || [];
} catch (error) {
    tasks = [];
}

function saveTasks() {
    localStorage.setItem("tasks", JSON.stringify(tasks));
}

form.addEventListener("submit", function (event) {
    event.preventDefault();

    const taskName = input.value.trim();

    if (taskName === "") {
        return;
    }

    tasks.push({ name: taskName, completed: false });

    saveTasks();
    displayTasks();

    input.value = "";
    input.focus();
});

function createButton(label, className, index) {
    const button = document.createElement("button");
    button.textContent = label;
    button.className = className;
    button.dataset.index = index;
    return button;
}

function displayTasks() {
    list.innerHTML = "";

    tasks.forEach(function (task, index) {
        const item = document.createElement("div");
        item.className = "task" + (task.completed ? " completed" : "");

        // textContent (not innerHTML) so user text can never run as HTML/JS
        const name = document.createElement("span");
        name.textContent = task.name;

        const actions = document.createElement("div");
        actions.className = "task-actions";
        actions.append(
            createButton("Complete", "complete", index),
            createButton("Delete", "delete", index)
        );

        item.append(name, actions);
        list.appendChild(item);
    });

    const completed = tasks.filter(function (task) {
        return task.completed;
    }).length;

    tasksCount.textContent = `Tasks: ${tasks.length}`;
    completedCount.textContent = `Completed: ${completed}`;
}

// One listener for all buttons (event delegation)
list.addEventListener("click", function (event) {
    const button = event.target.closest("button");
    if (!button) return;

    const index = Number(button.dataset.index);

    if (button.classList.contains("delete")) {
        tasks.splice(index, 1);
    } else if (button.classList.contains("complete")) {
        tasks[index].completed = true;
    }

    saveTasks();
    displayTasks();
});

displayTasks();
