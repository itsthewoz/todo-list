import { ProjectList } from './projectList';
import { Project } from './project';
import { Task } from './task';
import { Storage } from './localSave';

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
const addProjectButton = document.querySelector('.addProject');
const taskForm = document.querySelector('#newTaskForm');
const projectsUl = document.querySelector('.projects-nav > ul');
const taskList = document.querySelector('.taskListWrapper');
const mainHeader = document.querySelector('.mainHeader');
//move these calls out
const currentProjectList = new ProjectList();

class UiHandler {
  static toggleCurrentProject() {
    const navLi = document.querySelectorAll('nav li');
    navLi.forEach((li) => {
      li.classList.remove('currentProject');
    });
  }

  static {
    if (localStorage.length === 0) {
      currentProjectList.addProject(new Project('inbox'));
      currentProjectList.addProject(new Project('today'));
      currentProjectList.addProject(new Project('thisweek'));
    } else {
      Storage.initAddProjects();
    }

    console.log(currentProjectList.getProjects);
    //Inbox, Today, This Week button binds
    this.todaysTasksHandler();
    this.thisWeeksTasksHandler();
    this.inboxTasksHandler();

    if (!Storage.getProjectList()) {
      Storage.storeProjectList();
    }
    Storage.storeProject();
    // Storage.initAddProjects();
    this.initProjectsList();
  }

  static initProjectsList() {
    Storage.getProjectList().forEach((listProject) => {
      if (
        listProject.name !== 'inbox' &&
        listProject.name !== 'today' &&
        listProject.name !== 'thisweek'
      ) {
        this.createProject(listProject.name);
      }
    });
  }

  static inboxTasksHandler() {
    const inbox = document.querySelector('#inbox > a');

    inbox.addEventListener('click', (e) => {
      e.preventDefault();
      this.projectListHandler(e.target.parentElement, e.target.textContent);
      this.populateSelectedProject(e.target.textContent);
    });
  }

  static thisWeeksTasksHandler() {
    const week = document.querySelector('#thisweek > a');

    week.addEventListener('click', (e) => {
      e.preventDefault();
      this.projectListHandler(e.target.parentElement, e.target.textContent);
      this.populateThisWeeksTasts();
    });
  }

  static populateThisWeeksTasts() {
    currentProjectList.getProjects.forEach((project) => {
      if (project.getName === 'today' || project.getName === 'thisweek') {
        return;
      }
      const currentProject = project.getName;
      project.getThisWeeksTasks.forEach((task) => {
        this.populateCurrentTask(task, currentProject);
      });
    });
  }

  static todaysTasksHandler() {
    const today = document.querySelector('#today > a');

    today.addEventListener('click', (e) => {
      e.preventDefault();
      this.projectListHandler(e.target.parentElement, e.target.textContent);
      this.populateTodaysTasks();
    });
  }

  //TODO: might need to fix logic of if statement
  static populateTodaysTasks() {
    currentProjectList.getProjects.forEach((project) => {
      if (project.getName === 'today' || project.getName === 'thisweek') {
        return;
      }
      const currentProject = project.getName;
      project.getTodaysTasks.forEach((task) =>
        this.populateCurrentTask(task, currentProject)
      );
    });
  }

  static populateSelectedProject(project) {
    // currentProjectList.getProject(project).getTasks.forEach((task) => {
    //   this.populateCurrentTask(task, project);
    // });
    const tasks = Storage.getTasksFromProject(project);
    tasks.forEach((task) => {
      this.populateCurrentTask(task, project);
    });
  }

  static projectListHandler(elementForClass, elementTextContent) {
    this.toggleCurrentProject();
    elementForClass.classList.add('currentProject');
    mainHeader.textContent = elementTextContent;
    taskList.textContent = '';
  }

  static deleteSelectedProject(e) {
    currentProjectList.deleteProject(e.target.parentElement.dataset.project);
    e.target.parentElement.remove();

    const projectList = document.querySelector('.projects-nav ul');

    if (projectList.children.length === 0) {
      this.defaultToInbox();
    }
  }

  static defaultToInbox() {
    const inbox = document.querySelector('#inbox');
    this.projectListHandler(inbox, 'Inbox');
    this.populateSelectedProject('inbox');
  }

  static createProject(projectName) {
    const projectsLi = document.createElement('li');
    const projectLink = document.createElement('a');
    const projectDeleteButton = document.createElement('button');

    projectDeleteButton.textContent = 'Del';

    projectDeleteButton.addEventListener('click', (e) => {
      this.deleteSelectedProject(e);
    });

    projectLink.href = '';
    projectLink.textContent = projectName.replace(/-+/g, ' ');

    projectLink.addEventListener('click', (e) => {
      e.preventDefault();
      this.projectListHandler(e.target.parentElement, e.target.textContent);
      this.populateSelectedProject(e.target.textContent);
    });

    projectsLi.appendChild(projectLink);
    projectsLi.appendChild(projectDeleteButton);

    projectDeleteButton.classList.add('deleteProject');

    projectsUl.appendChild(projectsLi);

    projectsLi.dataset.project = projectName.toLowerCase();
  }

  static populateCurrentTask(task, projectName) {
    const { title, details, date, priority, id } = task;
    this.createTask(title, details, date, priority, id, projectName);
  }

  static modalReset() {
    formTitle.value = '';
    formDetails.value = '';
    formDate.value = '';
    formFlag.value = 'low';
  }

  static deleteTaskFromProject(e) {
    const targetProject = e.target.parentElement.dataset.project;
    const targetTask = e.target.parentElement.dataset.id;

    currentProjectList.getProject(targetProject).deleteTask(targetTask);
    e.target.parentElement.remove();
  }

  static addTaskToProject(project) {
    currentProjectList
      .getProject(project)
      .addTask(
        new Task(
          formTitle.value,
          formDetails.value,
          formDate.value,
          formFlag.value
        )
      );
  }

  static {
    projectForm.addEventListener('submit', (e) => {
      e.preventDefault();
      this.projectFormHandler();
      Storage.storeProject();
      Storage.storeProjectList();
    });

    projectFormInput.addEventListener('input', () => {
      this.checkValidity();
    });

    addProjectButton.addEventListener('click', () => {
      projectModal.showModal();
    });

    projectCloseModal.addEventListener('click', () => {
      projectModal.close();
      projectFormInput.value = '';
    });

    modalCloseButton.addEventListener('click', () => {
      dialogModal.close();
      this.modalReset();
    });

    createNewButton.addEventListener('click', () => {
      dialogModal.showModal();
    });

    taskForm.addEventListener('submit', (e) => {
      e.preventDefault();
      this.taskFormHandler();
    });
  }

  static projectFormHandler() {
    currentProjectList.addProject(new Project(projectFormInput.value));

    this.createProject(
      currentProjectList.getProject(projectFormInput.value).getName
    );

    const lastProjectInList = document.querySelector(
      '.projects-nav li:last-child'
    );

    this.projectListHandler(lastProjectInList, projectFormInput.value);

    projectFormInput.value = '';
    projectModal.close();
  }

  static checkValidity() {
    if (currentProjectList.checkForProject(projectFormInput.value)) {
      projectFormInput.setCustomValidity('Project names can not be duplicated');
    } else {
      projectFormInput.setCustomValidity('');
    }
    return projectFormInput.reportValidity();
  }

  static taskFormHandler() {
    const targetProject = document.querySelector('.currentProject');
    const targetText = targetProject.children[0].textContent;

    //TODO: seperate into funtions
    if (targetText === 'today') {
      this.addTaskToProject('Inbox');
      Storage.storeTask('inbox');
      taskList.textContent = '';
      this.populateTodaysTasks();
    } else if (targetText === 'this week') {
      this.addTaskToProject('Inbox');
      Storage.storeTask('inbox');
      taskList.textContent = '';
      this.populateThisWeeksTasts();
    } else {
      this.addTaskToProject(targetText);
      Storage.storeTask(targetText);
      this.populateCurrentTask(
        currentProjectList.getProject(targetText).getLastTask,
        currentProjectList.getProject(targetText).getName
      );
    }

    dialogModal.close();
    this.modalReset();
  }

  //TODO: finish
  static editTaskHandler(elementToappend) {
    const textInput = document.createElement('textarea');
  }

  static editInput(
    titleElement,
    elementToCreate,
    inputType,
    inputId,
    elementToAppend
  ) {
    const input = document.createElement(elementToCreate);
    input.type = inputType;
    input.id = inputId;
    input.value = titleElement.textContent;

    titleElement.textContent = '';

    elementToAppend.appendChild(input);
  }

  static editPriority(taskDiv, e, priority) {
    const selectLabel = document.createElement('label');
    selectLabel.for = 'priority';

    const select = document.createElement('select');
    select.name = 'priority';
    select.id = 'priority';

    const optionLow = document.createElement('option');
    optionLow.value = 'low';
    optionLow.textContent = 'Low';

    const optionMed = document.createElement('option');
    optionMed.value = 'medium';
    optionMed.textContent = 'Medium';

    const optionHigh = document.createElement('option');
    optionHigh.value = 'high';
    optionHigh.textContent = 'High';

    select.appendChild(optionLow);
    select.appendChild(optionMed);
    select.appendChild(optionHigh);

    select.value = priority;

    taskDiv.insertBefore(selectLabel, e);
    taskDiv.insertBefore(select, e);
  }

  static editDetails() {}

  static createTask(title, details, dueDate, priority, id, projectName) {
    const taskDiv = document.createElement('div');

    const taskCheckbox = document.createElement('input');
    taskCheckbox.type = 'checkbox';
    taskCheckbox.id = 'taskCheckbox';
    taskDiv.appendChild(taskCheckbox);

    taskCheckbox.addEventListener('click', (e) => {
      setTimeout(() => {
        this.deleteTaskFromProject(e);
      }, 250);
    });

    const taskTitle = document.createElement('h4');
    taskTitle.textContent = title;
    taskDiv.appendChild(taskTitle);

    taskTitle.addEventListener(
      'click',
      (e) => {
        this.editInput(
          e.target.parentElement.children[1],
          'input',
          'text',
          'editTitle',
          taskTitle
        );
      },
      { once: true }
    );

    const taskDetails = document.createElement('p');
    taskDetails.textContent = details;
    taskDiv.appendChild(taskDetails);

    const taskDueDate = document.createElement('p');
    taskDueDate.textContent = dueDate;
    taskDiv.appendChild(taskDueDate);

    taskDueDate.addEventListener(
      'click',
      (e) => {
        this.editInput(
          e.target.parentElement.children[3],
          'input',
          'date',
          'editDate',
          taskDueDate
        );
      },
      { once: true }
    );

    const editButton = document.createElement('button');
    editButton.textContent = 'Edit';
    taskDiv.appendChild(editButton);
    editButton.classList.add('editButton');

    //TODO: Create this
    editButton.addEventListener('click', (e) => {
      //priority
      this.editPriority(taskDiv, e.target, priority);
    });

    const deleteButton = document.createElement('button');
    deleteButton.textContent = 'Delete';
    taskDiv.appendChild(deleteButton);
    deleteButton.classList.add('deleteButton');
    deleteButton.addEventListener('click', (e) => {
      this.deleteTaskFromProject(e);
    });

    taskList.appendChild(taskDiv);
    taskDiv.classList.add(priority);
    taskDiv.dataset.id = id;
    taskDiv.dataset.project = projectName;
  }
}

export { UiHandler, currentProjectList };
