let taskCount = 0;

const updateIds = (id) => {
  const tasks = document.querySelectorAll(".task");
  const tasksId = document.querySelectorAll(".task > div > .task-id");
  const tasksButtons = document.querySelectorAll(".task > div > button");

  for (let i = id - 1; i < tasks.length; i++) {
    tasks[i].setAttribute("id", i + 1);
    tasksId[i].innerHTML = `${i + 1}.`;
    tasksButtons[i].setAttribute("onclick", `removeTask(${i + 1})`);
  }
  console.log("Tasks Ids get updated.");
};

const removeAnimation = (id) => {
  const tasks = document.querySelectorAll(".task");
  for (let i = id - 1; i < tasks.length; i++) {
    tasks[i].classList.add("animate-bottom");

    tasks[i].addEventListener(
      "animationend",
      () => {
        tasks[i].classList.remove("animate-bottom");
      },
      { once: true }
    );
  }
};

const saveTasks = () => {
  const content = document.querySelector(".content");
  ipcRenderer.send("write", content.innerHTML);
  console.log("Overwrite request is sent.");
};

const removeTask = (id) => {
  const task = document.getElementById(id);
  task.remove();
  updateIds(id);
  saveTasks();
  removeAnimation(id);
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
          <h2 class="task-name" contenteditable onblur="saveTasks()">${task}</h2>
        </div>
        <div>
          <button class="done-btn" onclick="removeTask(${taskCount})"></button>
        </div>
      </div>`;

    ipcRenderer.send("write", content.innerHTML);
    console.log("Add request is sent.");

    const animatedTask = document.getElementById(taskCount);
    animatedTask.classList.add("animate-bottom-show");
    animatedTask.addEventListener(
      "animationend",
      () => {
        animatedTask.classList.remove("animate-bottom-show");
      },
      { once: true }
    );
  });
});
