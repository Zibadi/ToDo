let taskCount = 0;

const isScrolledToBottom = () => {
  const { scrollHeight, clientHeight, scrollTop } = document.documentElement;
  return scrollHeight - (clientHeight + scrollTop) < 1;
};

const scrollbarPosition = () => {
  return window.scrollY;
};

const isScrollbarVisible = () => {
  return Boolean(window.scrollY);
};

const playRemoveTaskAnimation = (id) => {
  const tasks = document.querySelectorAll(".task");
  let index;
  let condition;
  let animation;

  if (isScrollbarVisible() && isScrolledToBottom()) {
    index = 0;
    condition = id - 1;
    animation = "animate-top";
  } else {
    index = id - 1;
    condition = tasks.length;
    animation = "animate-bottom";
  }

  for (let i = index; i < condition; i++) {
    tasks[i].classList.add(animation);

    tasks[i].addEventListener(
      "animationend",
      () => {
        tasks[i].classList.remove(animation);
      },
      { once: true }
    );
  }
};

const playAddTaskAnimation = () => {
  const tasks = document.querySelectorAll(".task");
  const len = tasks.length;
  const index = isScrollbarVisible() ? 0 : len - 1;

  for (let i = index; i < len - 1; i++) {
    tasks[i].classList.add("animate-bottom");
    tasks[i].addEventListener(
      "animationend",
      () => {
        tasks[i].classList.remove("animate-bottom");
      },
      { once: true }
    );
  }

  tasks[len - 1].classList.add("animate-bottom-show");
  tasks[len - 1].addEventListener(
    "animationend",
    () => {
      tasks[len - 1].classList.remove("animate-bottom-show");
    },
    { once: true }
  );
};

const updateTasksId = (id) => {
  const tasksId = document.querySelectorAll(".task-id");

  for (let i = id - 1; i < tasksId.length; i++) {
    tasksId[i].innerHTML = `${i + 1}.`;
    tasksId[i].parentElement.parentElement.setAttribute("id", i + 1);
  }
};

const saveTasks = () => {
  const content = document.getElementById("content");
  ipcRenderer.send("write", content.innerHTML);
};

const removeTask = (element) => {
  const taskId = element.id;
  element.remove();
  updateTasksId(taskId);
  saveTasks();
  playRemoveTaskAnimation(taskId);
  taskCount--;
};

window.addEventListener("DOMContentLoaded", () => {
  const form = document.querySelector("form");
  const input = document.querySelector("input");
  const content = document.getElementById("content");

  ipcRenderer.on("tasks", (e, data) => {
    content.innerHTML = data;
    taskCount = document.querySelectorAll(".task").length;
  });

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    taskCount++;
    const task = input.value;
    input.value = "";

    content.innerHTML += `<div id="${taskCount}" class="task">
<div class="task-title">
<h2 class="task-id">${taskCount}.</h2>
<h2 class="task-name" contenteditable onblur="saveTasks()">${task}</h2>
</div>
<div>
<button class="done-btn" onclick="removeTask(this.parentElement.parentElement)"></button>
</div>
</div>`;

    ipcRenderer.send("write", content.innerHTML);
    window.scrollBy(0, 500);
    playAddTaskAnimation();
  });
});
