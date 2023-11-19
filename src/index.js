import "./css/base.css";
import { fetch, add, edit, toggleComplete, remove } from "./js/storage";

function getRoute() {
  let re = /(?<=#)\/.*$/g;
  let url = window.location.hash
  let route;
  if(window.location.hash === '') route = '/';
  else route = url.slice(re.exec(url).index, url.length);

  return route;
}

function render(todos) {

  let list = document.querySelector('.todo-list');
  let route = getRoute();

  while(list.hasChildNodes()) list.removeChild(list.lastChild);

  if(route === '/pending') todos = todos.filter((todo)=>!todo.completed);
  else if(route === '/completed') todos = todos.filter((todo)=>todo.completed);

  todos.forEach((todo)=>{
    let liTodo = document.createElement("li");
    let view = document.createElement("div");
    let completeButton = document.createElement("input");
    let title = document.createElement("label"); 
    let destroyButton = document.createElement("button");
    let editInput = document.createElement("input");
  
    completeButton.type = "checkbox";
    completeButton.classList.add("toggle");
  
    title.innerText = todo.title;
  
    if(todo.completed) {
      liTodo.classList.add("completed");
      completeButton.checked = true;
    };
  
    destroyButton.classList.add("destroy");
  
    editInput.classList.add("edit");
  
    view.classList.add("view");
  
    view.append(completeButton, title, destroyButton);
    liTodo.append(view, editInput);
  
  
    completeButton.addEventListener("click", ()=> toggleComplete(localStorageKey, todo.id));
  
    destroyButton.addEventListener("click", ()=> remove(localStorageKey, todo.id));
  
    editInput.addEventListener("keydown", (e)=>{
      if(e.key === "Enter") {
        if(e.target.value.trim() !== "") edit(localStorageKey, todo.id, e.target.value.trim());
      }
      else if(e.key === "Escape") {
        editInput.style.display = "none";
        liTodo.classList.remove("editing");
      }
    });

    title.addEventListener("click", ()=>{
      editInput.style.display = "block";
      editInput.value = title.innerText;
      editInput.focus();
      liTodo.classList.add("editing");
    });
  
    list.appendChild(liTodo);
    
  });

  updateCounter(todos.filter((todo)=>!todo.completed).length);
}

function updateCounter(count) {
  let todoCount = document.querySelector(".todo-count");

  if(count === 1) todoCount.innerHTML = `<strong>${count}</strong> item left`;
  else todoCount.innerHTML = `<strong>${count}</strong> items left`;
}

function main() {
  let todos = fetch(localStorageKey);
  let createTodoInput = document.querySelector(".new-todo");

  render(todos);
  
  window.addEventListener("storage", () => {
    todos = fetch(localStorageKey);
    render(todos);
  });

  createTodoInput.addEventListener("keydown", (e)=>{
    if(e.key === "Enter") {
        if(e.target.value.trim() !== "") { 
          let id;
          todos = fetch(localStorageKey);
          id = todos.length > 0 ? todos[todos.length-1].id + 1 : 0;
          add(localStorageKey, {id, title: e.target.value.trim(), completed: false });
        }
    }
  });

  window.addEventListener('hashchange', (e)=>{
    todos = fetch(localStorageKey);
    render(todos);
  });
}

const localStorageKey = "mydayapp-js";


main();