// preload.js

// All the Node.js APIs are available in the preload process.
// It has the same sandbox as a Chrome extension.
window.addEventListener("DOMContentLoaded", () => {
  //   const replaceText = (selector, text) => {
  //     const element = document.getElementById(selector);
  //     if (element) element.innerText = text;
  //   };

  //   for (const dependency of ["chrome", "node", "electron"]) {
  //     replaceText(`${dependency}-version`, process.versions[dependency]);
  //   }

  const form = document.querySelector("form");
  const input = document.querySelector("input");
  const content = document.querySelector(".content");
  let id = 1;

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    let task = input.value;
    content.innerHTML += `
    <div class="task">
      <h2>${id}. ${task}</h2>
    </div>`;
    id++;
    let fs = require("fs");
    fs.appendFile("ToDo_List.txt", task, function (err) {
      if (err) throw err;
      console.log("Content appended/file created.");
    });
  });
});
