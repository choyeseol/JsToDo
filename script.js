document.addEventListener("DOMContentLoaded", () => {
  const loadTasks = (key) => JSON.parse(localStorage.getItem(key)) || [];
  const saveTasks = (key, tasks) =>
    localStorage.setItem(key, JSON.stringify(tasks));

  let initialTasks = loadTasks("tasks");
  let trashTasks = loadTasks("trashTasks");

  const taskList = document.getElementById("task-list");
  const trashList = document.getElementById("trash-list");
  const newTaskInput = document.getElementById("new-task");
  const addTaskButton = document.getElementById("add-task-button");
  const trashButton = document.getElementById("trash-button");
  const backButton = document.getElementById("back-button");
  const todoApp = document.getElementById("todo-app");
  const trashPage = document.getElementById("trash-page");

  const renderTasks = () => {
    taskList.innerHTML = "";
    initialTasks.forEach((task, index) => {
      const li = document.createElement("li");
      li.className = task.completed ? "completed" : "";
      li.innerHTML = `
          <input type="checkbox" ${task.completed ? "checked" : ""}>
          <span>${task.text}</span>
          <button>🗑️</button>
        `;
      li.querySelector("input").addEventListener("change", () =>
        handleToggleTask(index)
      );
      li.querySelector("button").addEventListener("click", () =>
        handleDeleteTask(index)
      );
      taskList.appendChild(li);
    });
  };

  const renderTrashTasks = () => {
    trashList.innerHTML = "";
    trashTasks.forEach((task, index) => {
      const li = document.createElement("li");
      li.innerHTML = `
          <span>${task.text}</span>
          <div>
            <button>복원</button>
            <button>삭제</button>
          </div>
        `;
      li.querySelector("button:first-child").addEventListener("click", () =>
        handleRestoreTask(index)
      );
      li.querySelector("button:last-child").addEventListener("click", () =>
        handleDeleteTaskPermanently(index)
      );
      trashList.appendChild(li);
    });
  };

  const handleAddTask = () => {
    const newTask = newTaskInput.value.trim();
    if (newTask === "") return;
    initialTasks.push({ text: newTask, completed: false });
    saveTasks("tasks", initialTasks);
    newTaskInput.value = "";
    renderTasks();
  };

  const handleToggleTask = (index) => {
    initialTasks[index].completed = !initialTasks[index].completed;
    saveTasks("tasks", initialTasks);
    renderTasks();
  };

  const handleDeleteTask = (index) => {
    const taskToDelete = initialTasks.splice(index, 1)[0];
    trashTasks.push(taskToDelete);
    saveTasks("tasks", initialTasks);
    saveTasks("trashTasks", trashTasks);
    renderTasks();
    renderTrashTasks();
  };

  const handleRestoreTask = (index) => {
    const taskToRestore = trashTasks.splice(index, 1)[0];
    initialTasks.push(taskToRestore);
    saveTasks("tasks", initialTasks);
    saveTasks("trashTasks", trashTasks);
    renderTasks();
    renderTrashTasks();
  };

  const handleDeleteTaskPermanently = (index) => {
    trashTasks.splice(index, 1);
    saveTasks("trashTasks", trashTasks);
    renderTrashTasks();
  };

  addTaskButton.addEventListener("click", handleAddTask);
  newTaskInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
      handleAddTask();
    }
  });
  trashButton.addEventListener("click", () => {
    todoApp.style.display = "none";
    trashPage.style.display = "flex";
  });
  backButton.addEventListener("click", () => {
    todoApp.style.display = "flex";
    trashPage.style.display = "none";
  });

  renderTasks();
  renderTrashTasks();
});
