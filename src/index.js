import './style.css';

const modalCloseButton = document.querySelector('.closeModal');
const dialogModal = document.querySelector('.addTodo');
const createNewButton = document.querySelector('.createNew');
const formDate = document.querySelector('#date');
const formTitle = document.querySelector('#title');
const formDetails = document.querySelector('#details');
const formFlag = document.querySelector('#flag');
const taskList = document.querySelector('.taskListWrapper');
const addTodoButton = document.querySelector('.addTodoButton');
const addProjectButton = document.querySelector('.addProject > button');

addTodoButton.addEventListener('click', () => {
  taskArray.push(
    new SetTodo(
      formTitle.value,
      formDetails.value,
      formDate.value,
      formFlag.value
    ).taskObject
  );
  populateCurrentTask(taskArray[taskArray.length - 1]);
  dialogModal.close();
  modalReset();
});

modalCloseButton.addEventListener('click', () => {
  dialogModal.close();
  modalReset();
});

createNewButton.addEventListener('click', () => {
  dialogModal.showModal();
});

class SetTodo {
  constructor(title, details, dueDate, flag) {
    this.title = title;
    this.details = details;
    this.dueDate = dueDate;
    this.flag = flag;
  }

  // createTodoTask() {
  //   createTask(this.title, this.details, this.dueDate, this.flag);
  // }

  get taskObject() {
    return {
      title: this.title,
      details: this.details,
      dueDate: this.dueDate,
      flag: this.flag,
    };
  }
}

const taskArray = [];

//test code
// TODO: Currently populates entire array every time. Fix to only populate new element.
// function populateCurrentTask() {
//   // taskArray.forEach((item) => item.createTodoTask());
//   taskArray[taskArray.length - 1].createTodoTask();
// }

function populateCurrentTask(array) {
  const { title, details, dueDate, flag } = array;
  createTask(title, details, dueDate, flag);
}

// function to create div
//    Create checkbox
//    Create h4 with {title}
//    Create <p> with {details} if details === true
//    Create <p> with {dueDate}
//    Create button for EDIT
//    Create button for DELETE
//    Set div class = {flag}

function createTask(title, details, dueDate, flag) {
  const taskDiv = document.createElement('div');

  const taskTitle = document.createElement('h4');
  taskTitle.textContent = title;
  taskDiv.appendChild(taskTitle);

  if (details) {
    const taskDetails = document.createElement('p');
    taskDetails.textContent = details;
    taskDiv.appendChild(taskDetails);
  }

  const taskDueDate = document.createElement('p');
  taskDueDate.textContent = dueDate;
  taskDiv.appendChild(taskDueDate);

  const editButton = document.createElement('button');
  editButton.textContent = 'Edit';
  taskDiv.appendChild(editButton);

  const deleteButton = document.createElement('button');
  deleteButton.textContent = 'Delete';
  taskDiv.appendChild(deleteButton);

  // taskDiv.appendChild(taskDetails);
  taskList.appendChild(taskDiv);
  taskDiv.classList.add(flag);
}

function createProject(projectName) {
  const projectsLi = document.createElement('li');
  projectsLi.textContent = projectName;
  addProjectButton.before(projectsLi);
  // projectsLi.classList.add(projectName);
  // TODO: Remove whitespace to set as className
}

createProject('Dog stuff');
// function createCheckbox() {

function modalReset() {
  formTitle.value = '';
  formDetails.value = '';
  formDate.value = '';
  formFlag.value = 'low';
}
// }

// edit button functionality
// delete button functionality
// add project functionality
