const form = document.getElementById("taskForm");
const input = document.getElementById("taskInput");
const pendingList = document.getElementById("pendingList");
const completedList = document.getElementById("completedList");
const completedCount = document.getElementById("completedCount");
const remainingCount = document.getElementById("remainingCount");

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

function createCell(content, className) {
    const cell = document.createElement("td");
    if (className) cell.className = className;
    cell.append(content);
    return cell;
}

function emptyRow(text, colspan) {
    const row = document.createElement("tr");
    const cell = document.createElement("td");
    cell.colSpan = colspan;
    cell.className = "empty";
    cell.textContent = text;
    row.appendChild(cell);
    return row;
}

function displayTasks() {
    pendingList.innerHTML = "";
    completedList.innerHTML = "";

    let completed = 0;
    let remaining = 0;

    // index = position in the main tasks array (used by the buttons)
    tasks.forEach(function (task, index) {
        const row = document.createElement("tr");

        // textContent (not innerHTML) so user text can never run as HTML/JS
        const name = document.createElement("span");
        name.textContent = task.name;

        const actions = document.createElement("div");
        actions.className = "task-actions";

        if (task.completed) {
            completed++;
            actions.append(createButton("Delete", "delete", index));
            row.append(
                createCell(name, "name"),
                createCell("Done", "status-col"),
                createCell(actions, "actions-col")
            );
            completedList.appendChild(row);
        } else {
            remaining++;
            actions.append(
                createButton("Complete", "complete", index),
                createButton("Delete", "delete", index)
            );
            row.append(createCell(name, "name"), createCell(actions, "actions-col"));
            pendingList.appendChild(row);
        }
    });

    if (remaining === 0) pendingList.appendChild(emptyRow("No tasks left", 2));
    if (completed === 0) completedList.appendChild(emptyRow("Nothing completed yet", 3));

    completedCount.textContent = `Completed: ${completed}`;
    remainingCount.textContent = `Remaining: ${remaining}`;
}

// One listener for both tables (event delegation)
document.addEventListener("click", function (event) {
    const button = event.target.closest("td button");
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
