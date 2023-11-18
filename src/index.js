import "./css/base.css";
import { fetch, add, edit, toggleComplete, remove } from "./js/storage";

function renderTodo(todo, todos) {
  let li_todo = document.createElement("li");
  let todo_view = document.createElement("div");
  let todo_input = document.createElement("input");
  let todo_label = document.createElement("label"); 
  let todo_button = document.createElement("button");
  let edit_todo_input = document.createElement("input");

  todo_input.type = "checkbox";
  todo_input.classList.add("toggle");

  todo_label.innerText = todo.title;

  if(todo.completed) {
    li_todo.classList.add("completed");
    todo_input.checked = true;
  };

  todo_button.classList.add("destroy");

  edit_todo_input.classList.add("edit");

  todo_view.classList.add("view");

  todo_view.append(todo_input, todo_label, todo_button);
  li_todo.append(todo_view, edit_todo_input);

  document.querySelector(".todo-list").append(li_todo);

  todo_input.addEventListener("click", ()=>{
    li_todo.classList.toggle("completed");
    toggleComplete(localStorageKey, todo.id);
    if(todo.completed === false) updateCounter(-1);
    else updateCounter(1);
    todo.completed = !todo.completed;

    let todoIndex = todos.findIndex((todo)=>todo.id === todo.id);
    todo[todoIndex].completed = !todo[todoIndex].completed;
  });

  todo_button.addEventListener("click", async ()=>{
    await remove(localStorageKey, todo.id);
    document.querySelector(".todo-list").removeChild(li_todo);
    if(todo.completed === false) updateCounter(-1);

    let todoIndex = todos.findIndex((todo)=>todo.id === todo.id);
    todos.splice(todoIndex, 1);
  });

  todo_label.addEventListener("click", ()=>{
    edit_todo_input.style.display = "block";
    edit_todo_input.value = todo_label.innerText;
    edit_todo_input.focus();
    li_todo.classList.add("editing");
  });

  edit_todo_input.addEventListener("keydown", (e)=>{
    if(e.key === "Enter") {
      if(e.target.value.trim() !== "") {
        let todoIndex = todos.findIndex((todo)=>todo.id === todo.id);
        todo[todoIndex].title = e.target.value.trim();

        todo_label.innerText = e.target.value.trim();
        edit_todo_input.style.display = "none";
        edit(localStorageKey, todo.id, e.target.value.trim());
        li_todo.classList.remove("editing");
    };
    }
    else if(e.key === "Escape") {
      edit_todo_input.style.display = "none";
      li_todo.classList.remove("editing");
    }
  })
}

async function createNewTodo(e, todos) {
  if(e.target.value.trim() !== ""){
    let id = todos.length > 0 ? todos[todos.length-1].id + 1 : 0;

    let todo = {
      id, 
      title:e.target.value.trim(), 
      completed: false
    };

    renderTodo(todo, todos);
    await add(localStorageKey, todo);
    updateCounter(1);
    e.target.value = "";

    todos.push(todo);
  }
}

function updateCounter(num) {
  counter += num;
  if(counter === 1) document.querySelector(".todo-count").innerHTML = `<strong>${counter}</strong> item left`;
  else document.querySelector(".todo-count").innerHTML = `<strong>${counter}</strong> items left`;
}

async function main() {
  let todos = await fetch(localStorageKey);

  todos.forEach(todo => {
    renderTodo(todo, todos);
    if(todo.completed === false) updateCounter(1);
  });

  document.querySelector(".new-todo").addEventListener("keydown", async (e)=>{
    if(e.key === 'Enter'){
      await createNewTodo(e, todos);
    }
  });
}

const localStorageKey = "mydayapp-js";
let counter = 0;

main();