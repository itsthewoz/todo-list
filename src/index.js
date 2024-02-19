import './style.css';

const modalCloseButton = document.querySelector('.closeModal');
const dialogModal = document.querySelector('.addTodo');
const projectModal = document.querySelector('.projectModal');
const projectCloseModal = document.querySelector('.projectCloseModal');
const projectForm = document.querySelector('#newProjectForm');
const projectFormInput = document.querySelector('#newProjectForm > input');
const createNewButton = document.querySelector('.createNew');
const formDate = document.querySelector('#date');
const formTitle = document.querySelector('#title');
const formDetails = document.querySelector('#details');
const formFlag = document.querySelector('#flag');
const taskList = document.querySelector('.taskListWrapper');
const addProjectButton = document.querySelector('.addProject');
const taskForm = document.querySelector('#newTaskForm');
const projectsUl = document.querySelector('.projects-nav > ul');
const mainNavUl = document.querySelector('.main-nav > ul');
const navSections = document.querySelectorAll('section > ul');

navSections.forEach((section) => {
  section.addEventListener('click', (e) => {
    e.preventDefault();
    for (const child of section.children) {
      child.classList.remove('currentProject');
    }
    e.target.parentElement.classList.add('currentProject');
  });
});

// projectsUl.addEventListener('click', (e) => {
//   e.preventDefault();
// });

// mainNavUl.addEventListener('click', (e) => {
//   e.preventDefault();
// });

projectForm.addEventListener('submit', (e) => {
  e.preventDefault();
  // check if project already exists in projectsArray
  // if it doesnt then push to array
  // and do whats below
  // if it is then throw error saying that project names cannot be duplicated
  createProject(projectFormInput.value);
  projectsArray.push(projectFormInput.value);
  projectFormInput.value = '';
  projectModal.close();
});

addProjectButton.addEventListener('click', () => {
  projectModal.showModal();
});

projectCloseModal.addEventListener('click', () => {
  projectModal.close();
  projectFormInput.value = '';
});

taskForm.addEventListener('submit', (e) => {
  e.preventDefault();
  taskArray.push(
    new SetTodo(
      formTitle.value,
      formDetails.value,
      formDate.value,
      formFlag.value
    ).taskObject
  );
  populateCurrentTask(taskArray[taskArray.length - 1]);
  dataPosition++; // change to static value in class SetTodo, increment on call
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
  // static count
  // increment on call
  // have method to reset on json fetch local data
  constructor(title, details, dueDate, flag) {
    this.title = title;
    this.details = details;
    this.dueDate = dueDate;
    this.flag = flag;
  }

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
const projectsArray = [];

let dataPosition = 0;

function populateCurrentTask(array) {
  const { title, details, dueDate, flag } = array;
  createTask(title, details, dueDate, flag);
}

function createTask(title, details, dueDate, flag) {
  const taskDiv = document.createElement('div');

  const taskCheckbox = document.createElement('input');
  taskCheckbox.type = 'checkbox';
  taskCheckbox.id = 'taskCheckbox';
  taskDiv.appendChild(taskCheckbox);

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
  editButton.classList.add('editButton');

  const deleteButton = document.createElement('button');
  deleteButton.textContent = 'Delete';
  taskDiv.appendChild(deleteButton);
  deleteButton.classList.add('deleteButton');

  taskList.appendChild(taskDiv);
  taskDiv.classList.add(flag);
  taskDiv.dataset.id = `${dataPosition}`;
}

function createProject(projectName) {
  const projectsLi = document.createElement('li');
  const projectLink = document.createElement('a');
  const projectDeleteButton = document.createElement('button');
  projectDeleteButton.textContent = 'Del';
  projectLink.href = '';
  projectLink.textContent = projectName;
  projectsLi.appendChild(projectLink);
  projectsLi.appendChild(projectDeleteButton);
  projectDeleteButton.classList.add('deleteProject');
  // addProjectButton.parentElement.before(projectsLi);
  projectsUl.appendChild(projectsLi);
  projectsLi.dataset.project = projectName.toLowerCase().replace(/\s+/g, '');
}

function modalReset() {
  formTitle.value = '';
  formDetails.value = '';
  formDate.value = '';
  formFlag.value = 'low';
}

//handles deleting elements
document.addEventListener('click', (e) => {
  const deleteTargetTask = e.target.closest('.deleteButton');
  const deleteTargetProject = e.target.closest('.deleteProject');

  if (deleteTargetTask) {
    taskArray.splice(deleteTargetTask.parentElement.dataset.id, 1);
    deleteTargetTask.parentElement.remove();
  } else if (deleteTargetProject) {
    deleteTargetProject.parentElement.remove();
  }
});

// delete project functionality ->
// edit button functionality
// to recreate tasks -> loop over json file objects passing them into a new Class()
// must add project identifier

// on add project press -> turn into input field -> grab input on enter or click of or on + press -> remove input field and push button back into projects

//or press button -> add input field above button -> on enter/unfocus/or +, remove input field and push above button in UL
