const form = document.querySelector(".form");
const input = document.querySelector(".addTextInput");
const listContainer = document.querySelector(".list_container");
const error = document.querySelector(".error");
const inputForEdit = document.querySelector(".inputForEdit");
const editForm = document.querySelector(".editForm");
const editInput = document.querySelector(".editInput");
const xMark = document.querySelector(".fa-circle-xmark");

const api = "https://676b884abc36a202bb84eb68.mockapi.io/todo";

fetch(api)
    .then((response) => response.json())
    .then((data) => getData(data))
    .catch((err) => console.error(err.message));

form.addEventListener("submit", (e) => {
    e.preventDefault();
    addItem(input.value.trim());
});

listContainer.addEventListener("click", (e) => {
    const list = e.target.closest(".list");
    const taskId = list.id;

    if (e.target.closest(".delete")) {
        const sure = confirm("Are you sure?");
        if (sure) deleteList(taskId, list);
    }

    if (e.target.closest(".edit")) {
        const currentText = list.querySelector("p");
        editInput.value = currentText.textContent;
        inputForEdit.classList.remove("hidden");
        inputForEdit.classList.add("flex");

        editForm.dataset.id = taskId;
        editForm.dataset.element = currentText;
    }
});

editForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const taskId = editForm.dataset.id;
    const updatedElement = editForm.dataset.element;

    if (editInput.value.trim() === "") {
        editInput.style.borderColor = "red";
        editForm.classList.toggle("shake");
    } else {
        editInput.style.borderColor = "#fff";
        editForm.classList.remove("shake");

        editList(taskId, editInput.value.trim(), updatedElement);
        inputForEdit.classList.add("hidden");
        inputForEdit.classList.remove("flex");
    }
});

xMark.addEventListener("click", () => {
    inputForEdit.classList.add("hidden");
    inputForEdit.classList.remove("flex");
});


function getData(data) {
    data.forEach((task) => createElement(task));
}

function addItem(list) {
    if (list === "") {
        error.classList.remove("hidden");
        error.classList.add("block");
        return;
    }

    error.classList.add("hidden");


    fetch(api, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: list }),
    })
        .then((response) => response.json())
        .then((newTask) => {
            createElement(newTask);
            input.value = "";
        })
        .catch((err) => console.error(err.message));
}

function editList(taskId, updatedTitle, element) {
    fetch(`${api}/${taskId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: updatedTitle }),
    })
        .then((response) => response.json())
        .then(() => {
            element.textContent = updatedTitle;
        })
        .catch((err) => console.error(err.message));
}

function deleteList(taskId, element) {
    fetch(`${api}/${taskId}`, {
        method: "DELETE",
    })
        .then(() => {
            element.remove();
        })
        .catch((err) => console.error(err.message));
}

function createElement(task) {
    const newDiv = document.createElement("div");
    newDiv.classList.add("list");
    newDiv.id = task.id;

    const Time = addTime(task.time);

    newDiv.innerHTML = `
        <p>${task.title}</p>
        <div class="list_btn">
            <button class="edit"><i class="fa-regular fa-pen-to-square"></i></button>
            <button class="delete"><i class="fa-regular fa-trash-can"></i></button>
            <div class="time">${Time}</div>
        </div>
    `;
    listContainer.appendChild(newDiv);
}

const searchForm = document.querySelector('.searchForm')
const searchInput = document.querySelector('.searchInput')

console.log(searchForm, searchInput);


function search(id) {
    searchForm.addEventListener("submit", (e)=> {
        e.preventDefault()
        
    })
}

function addTime(time) {
    const date = new Date(time);
    const hours = date.getHours();
    const minutes = date.getMinutes();
    return `${hours}:${minutes < 10 ? "0" + minutes : minutes}`;
}
