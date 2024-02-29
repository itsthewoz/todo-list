import { ProjectList } from './projectList';
import { Project } from './project';
import { Task } from './task';
import { Storage } from './localSave';
import { CreateElement } from './domElements';

const modalCloseButton = document.querySelector('.closeModal');
const dialogModal = document.querySelector('.addTodo');
const projectModal = document.querySelector('.projectModal');
const projectCloseModal = document.querySelector('.projectCloseModal');
const projectForm = document.querySelector('#newProjectForm');
const projectFormInput = document.querySelector('#newProjectForm > input');
const newTaskButton = document.querySelector('.createNew');

const formDate = document.querySelector('#date');
const formTitle = document.querySelector('#title');
const formDetails = document.querySelector('#details');
const formFlag = document.querySelector('#flag');

const addProjectButton = document.querySelector('.addProject');
const taskForm = document.querySelector('#newTaskForm');
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
    //On load logic
    if (localStorage.length === 0) {
      currentProjectList.addProject(new Project('inbox'));
      currentProjectList.addProject(new Project('today'));
      currentProjectList.addProject(new Project('thisweek'));
      Storage.storeProjects();
    } else {
      Storage.initAddProjects();
    }

    if (Storage.getProjectList()) {
      this.initProjectsList();
    }

    //Inbox, Today, This Week button binds
    this.todaysTasksHandler();
    this.thisWeeksTasksHandler();
    this.inboxTasksHandler();

    // Storage.initAddProjects();
    this.defaultToInbox();
    // this.initProjectsList();
  }

  static initProjectsList() {
    Storage.getProjectList().forEach((listProject) => {
      CreateElement.createProject(listProject);
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
      this.populateThisWeeksTasks();
    });
  }

  static populateThisWeeksTasks() {
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
    Storage.deleteProject(e.target.parentElement.dataset.project);

    e.target.parentElement.remove();

    Storage.htmlProjectsList();

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

  static populateCurrentTask(task, projectName) {
    const { title, details, date, priority, id } = task;
    CreateElement.createTask(title, details, date, priority, id, projectName);
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
    Storage.taskUpdate(targetProject);
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

  //Form submit and dialog modal event listeners
  static {
    taskForm.addEventListener('submit', (e) => {
      e.preventDefault();
      this.taskFormHandler();
    });

    projectForm.addEventListener('submit', (e) => {
      e.preventDefault();
      this.projectFormHandler();
      Storage.storeProject();
      Storage.htmlProjectsList();
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

    newTaskButton.addEventListener('click', () => {
      dialogModal.showModal();
    });
  }

  static projectFormHandler() {
    currentProjectList.addProject(new Project(projectFormInput.value));

    CreateElement.createProject(
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

    if (targetText === 'today') {
      this.addTaskToProject('Inbox');
      Storage.taskUpdate('inbox');
      taskList.textContent = '';
      this.populateTodaysTasks();
    }

    if (targetText === 'this week') {
      this.addTaskToProject('Inbox');
      Storage.taskUpdate('inbox');
      taskList.textContent = '';
      this.populateThisWeeksTasks();
    }

    this.addTaskToProject(targetText);
    Storage.taskUpdate(targetText);
    this.populateCurrentTask(
      currentProjectList.getProject(targetText).getLastTask,
      currentProjectList.getProject(targetText).getName
    );

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
}

export { UiHandler, currentProjectList };
