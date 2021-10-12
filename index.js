//set the letiables
const todoInput = document.querySelector(".todo-input");
const todoButton = document.querySelector(".todo-button");
const todoList = document.querySelector(".todo-list");
const filterOption = document.querySelector(".filter-todo");

//Event Listeners
document.addEventListener("DOMContentLoaded", getTodos);
todoButton.addEventListener("click", addTodo);
todoList.addEventListener("click", deleteTodo);
filterOption.addEventListener("click", filterTodo);

// get data from localstorage
function getItemFromLocalStorage() {
  const todos = JSON.parse(localStorage.getItem("todos")) || [];

  return todos;
}

function addTodo(e) {
  //Prevent natural behaviour
  e.preventDefault();
  if (todoInput.value.trim() === "") {    // if didn't type any input
    //alert("Fill the box");
    openmodal("red", "Fill the box");
    return;
  }

  //  if we try to enter the same task twice
  if (isDuplicate(todoInput.value)) {
    openmodal('red', 'Task already added');
    return;
  }

  //Create todo div
  const todoDiv = document.createElement("div");
  todoDiv.classList.add("todo");
  //Create list
  const newTodo = document.createElement("li");
  newTodo.innerText = todoInput.value;

  let newTodoItem = {
    id: Math.round(Math.random() * 100), //id for selection
    task: todoInput.value,
    status: "uncomplete",
  };
  todoDiv.setAttribute("key", newTodoItem.id);

  //Save to local - do this last
  //Save to local
  saveLocalTodos(newTodoItem);
  //
  newTodo.classList.add("todo-item");
  newTodo.classList.add("todo")
  todoDiv.appendChild(newTodo);
  todoInput.value = "";
  //  //Create Edit Button
  const edit = document.createElement("div");
  edit.innerHTML =
    ` <form class="editform">
    <input type="text" placeholder=` +
    `"${newTodoItem.task}"` +
    `id="` +
    `edit-${newTodoItem.id}` +
    `" required />
    <div class="editDiv" style="margin:auto;">
    <button id="editBtn-` +
    `${newTodoItem.id}` +
    `" type="submit">
      <i class="fas fa-plus-square"></i>
    </button>
  </div>
  </form>`;
  edit.classList.add("hide");
  todoDiv.appendChild(edit);
  //Create Completed Button
  const completedButton = document.createElement("button");
  completedButton.innerHTML = `<i class="fas fa-check"></i>`;
  completedButton.classList.add("complete-btn");
  todoDiv.appendChild(completedButton);
  //Create edit button
  const editButton = document.createElement("button");
  editButton.innerHTML = `<i class="fas fa-pen"></i>`;
  editButton.classList.add("edit-btn");
  editButton.addEventListener("click", () => editTodo(newTodoItem, todoDiv));  
  todoDiv.appendChild(editButton);
  //Create trash button
  const trashButton = document.createElement("button");
  trashButton.innerHTML = `<i class="fas fa-trash"></i>`;
  trashButton.classList.add("trash-btn");
  todoDiv.appendChild(trashButton);
  //attach final Todo
  todoList.appendChild(todoDiv);
}

function deleteTodo(e) {
  const item = e.target;

  if (item.classList[0] === "trash-btn") {
    // e.target.parentElement.remove();
    const todo = item.parentElement;
    todo.classList.add("fall");
    //at the end
    removeLocalTodos(todo);
    todo.addEventListener("transitionend", (e) => {
      todo.remove();
    });
  }
  if (item.classList[0] === "complete-btn") {
    const todo = item.parentElement;
    todo.classList.toggle("completed");
    const status = "completed";
    const id = todo.getAttribute("key");
    saveStatus(id, status);
  }
}

//save the status of the task -> and persist by saving it to the localstorage
function saveStatus(id, status) {
  const todos = getItemFromLocalStorage();
  const intId = Number(id);
  const newTodo = todos.find((todo) => todo.id === intId);
  const newStatus =
    newTodo.status === "uncomplete" ? "completed" : "uncomplete";
  const todoIndex = todos.indexOf(newTodo);
  todos.splice(todoIndex, 1);
  newTodo.status = newStatus;
  todos.splice(todoIndex, 0, newTodo);
  localStorage.setItem("todos", JSON.stringify(todos));
}
/// filter tasks by states : completed and uncompleted
function filterTodo(e) {
  const todos = todoList.childNodes;
  todos.forEach((todo) => {

    if (
      e.target.value === "completed" &&
      todo.classList.contains("completed")
    ) {
      todo.style.display = "flex";
    } else if (
      e.target.value === "completed" &&
      !todo.classList.contains("completed")
    ) {
      todo.style.display = "none";
    } else if (
      e.target.value === "uncomplete" &&
      !todo.classList.contains("completed")
    ) {
      todo.style.display = "flex";
    } else if (
      e.target.value === "uncomplete" &&
      !todo.classList.contains("uncomplete")
    ) {
      todo.style.display = "none";
    } else {
      todo.style.display = "flex";
    }
  });
}

//function to delete a task
function removeLocalTodos(id) {
  const intId = Number(id);
  let todos = getItemFromLocalStorage();
  const newTodo = todos.filter((todo) => todo.id !== intId);

  localStorage.setItem("todos", JSON.stringify(newTodo));
}

function editTodo(todo, todoDiv) {
  for (let i = 0; i < todoDiv.children.length; i++) {
    if (i == 1) {
      todoDiv.children[i].classList.remove("hide");
    } else {
      todoDiv.children[i].classList.add("hide");
    }
  }
  const editBtn = document.getElementById(`editBtn-` + `${todo.id}`);
  editBtn.addEventListener("click", () => editTask(todo, todoDiv));
}
/* ****************************************** */
function editTask(todo, todoDiv) {
  let todos = getItemFromLocalStorage();
  const editInput = document.getElementById(`edit-` + `${todo.id}`).value;
  if (editInput === "") {
    //alert("Fill the box");
    openmodal("red", "Fill the box");
    return;
  }
  todos.forEach((t) => {
    if (t.id == todo.id) {
      t.task = editInput;
    }
  });
  localStorage.setItem("todos", JSON.stringify(todos));
  todoDiv.children[0].innerText = editInput;
}

function isDuplicate() {
  let todos = getItemFromLocalStorage();
  let tasks = [];

  for (let i = 0; i < todos.length; i++) {
    tasks.push(todos[i].task);
  }

  return tasks.includes(todoInput.value);
}

function getTodos() {
  let todos = getItemFromLocalStorage();
  todos.forEach(function (todo) {
    //Create todo div
    const todoDiv = document.createElement("div");
    todoDiv.classList.add("todo");
    if (todo.status === "completed") {
      todoDiv.classList.add("completed");
    }
    todoDiv.setAttribute("key", todo.id);
    //Create list
    const newTodo = document.createElement("li");
    newTodo.innerText = todo.task;
    newTodo.classList.add("todo-item");
    todoDiv.appendChild(newTodo);
    //Create Completed Button
    const completedButton = document.createElement("button");
    completedButton.innerHTML = `<i class="fas fa-check"></i>`;
    completedButton.classList.add("complete-btn");
    todoDiv.appendChild(completedButton);
    //Create trash button
    const trashButton = document.createElement("button");
    trashButton.innerHTML = `<i class="fas fa-trash"></i>`;
    trashButton.classList.add("trash-btn");
    todoDiv.appendChild(trashButton);
    //attach final Todo
    todoList.appendChild(todoDiv);
  });
}

function saveLocalTodos(todo) {
  let todos;
  if (localStorage.getItem("todos") === null) {
    todos = [];
  } else {
    todos = JSON.parse(localStorage.getItem("todos"));
  }
  todos.push(todo);
  localStorage.setItem("todos", JSON.stringify(todos));
}

function removeLocalTodos(todo) {
  let todos;
  if (localStorage.getItem("todos") === null) {
    todos = [];
  } else {
    todos = JSON.parse(localStorage.getItem("todos"));
  }
  const todoIndex = todo.children[0].innerText;
  todos.splice(todos.indexOf(todoIndex), 1);
  localStorage.setItem("todos", JSON.stringify(todos));
}

function deleteAll() {
  [...document.getElementsByClassName("todo")].map((n) => n && n.remove());
  localStorage.removeItem("todos");
}

function openmodal(color, message) {
  //pass color as either 'red' (for error), 'blue' for info and 'green' for success
  console.log("in");
  document.getElementById("content").classList.add(color);
  document.getElementById("modal-text").innerText = message;
  document.getElementById("Modal").classList.add("true");
}
function closemodal() {
  document.getElementById("Modal").classList.remove("true");
}

let today = new Date();
let date = today.toString();
document.getElementById("d1").innerHTML = date;
