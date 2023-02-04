let taskCount = 0;

const updateIds = () => {
  const tasks = document.querySelectorAll(".task");
  const tasksId = document.querySelectorAll(".task > div > .task-id");
  const tasksButtons = document.querySelectorAll(".task > div > button");

  console.log(tasks);
  console.log(tasksId);
  console.log(tasksButtons);

  for (let i = 0; i < tasks.length; i++) {
    tasks[i].setAttribute("id", i + 1);
    tasksId[i].innerHTML = `${i + 1}.`;
    tasksButtons[i].setAttribute("onclick", `removeTask(${i + 1})`);
  }

  console.log("Task Ids get updated.");
};

const removeTask = (id) => {
  const task = document.getElementById(id);
  task.remove();
  updateIds();
  const content = document.querySelector(".content");
  ipcRenderer.send("write", content.innerHTML);
  console.log("Add req is sent.");
  taskCount--;
};

window.addEventListener("DOMContentLoaded", () => {
  const form = document.querySelector("form");
  const input = document.querySelector("input");
  const content = document.querySelector(".content");

  ipcRenderer.on("read", (e, data) => {
    content.innerHTML = data;
    taskCount = document.querySelectorAll(".task").length;
    console.log("Tasks showed.");
  });

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    taskCount++;
    const task = input.value;
    input.value = "";

    content.innerHTML += `
      <div id="${taskCount}" class="task">
        <div class="task-title">
          <h2 class="task-id">${taskCount}.</h2>
          <h2>${task}</h2>
        </div>
        <div>
          <button class="done-btn" onclick="removeTask(${taskCount})"></button>
        </div>
      </div>`;

    ipcRenderer.send("write", content.innerHTML);
    console.log("Add req is sent.");
  });
});
