import { ProjectList } from './projectList';
import { Project } from './project';
import { Task } from './task';
import { Storage } from './localSave';
import { CreateElement } from './domElements';

const dialogModal = document.querySelector('.addTodo');
const projectModal = document.querySelector('.projectModal');
const projectFormInput = document.querySelector('#newProjectForm > input');
const formDate = document.querySelector('#date');
const formTitle = document.querySelector('#title');
const formDetails = document.querySelector('#details');
const formFlag = document.querySelector('#flag');
const taskList = document.querySelector('.taskListWrapper');
const currentProjectList = new ProjectList();

class UiHandler {
  static loadPage() {
    this.firstPageLoad();

    this.modalButtonBinds();
    this.formListeners();

    //Inbox, Today, This Week button binds
    this.inboxTasksHandler();
    this.todaysTasksHandler();
    this.thisWeeksTasksHandler();

    this.defaultToInbox();
  }

  static firstPageLoad() {
    if (localStorage.length === 0) {
      currentProjectList.addProject(new Project('inbox'));
      currentProjectList.addProject(new Project('today'));
      currentProjectList.addProject(new Project('thisweek'));
      Storage.storeProjects();
    } else {
      Storage.initAddProjects();
    }

    if (Storage.getProjectList()) {
      this.createProjectsList();
    }
  }

  static createProjectsList() {
    Storage.getProjectList().forEach((listProject) => {
      CreateElement.createProject(listProject);
    });
  }

  static toggleCurrentProject() {
    const navLi = document.querySelectorAll('nav li');
    navLi.forEach((li) => {
      li.classList.remove('currentProject');
    });
  }

  static populateSelectedProject(project) {
    const tasks = Storage.getTasksFromProject(project);
    tasks.forEach((task) => {
      this.populateCurrentTask(task, project);
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

  static projectListHandler(elementForClass, elementTextContent) {
    const mainHeader = document.querySelector('.mainHeader');
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

  static modalReset() {
    formTitle.value = '';
    formDetails.value = '';
    formDate.value = '';
    formFlag.value = 'low';
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

  static deleteTaskFromProject(targProject, targTask, targDelete) {
    const targetProject = targProject;
    const targetTask = targTask;

    currentProjectList.getProject(targetProject).deleteTask(targetTask);
    Storage.taskUpdate(targetProject);
    targDelete.remove();
  }

  static checkValidity() {
    if (currentProjectList.checkForProject(projectFormInput.value)) {
      projectFormInput.setCustomValidity('Project names can not be duplicated');
    } else {
      projectFormInput.setCustomValidity('');
    }
    return projectFormInput.reportValidity();
  }

  static modalButtonBinds() {
    const addProjectButton = document.querySelector('.addProject');
    const projectCloseModal = document.querySelector('.projectCloseModal');
    const modalCloseButton = document.querySelector('.closeModal');
    const newTaskButton = document.querySelector('.createNew');
    const projectFormInput = document.querySelector('#newProjectForm > input');

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

  static formListeners() {
    const taskForm = document.querySelector('#newTaskForm');
    const projectForm = document.querySelector('#newProjectForm');

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
  }
}

export { UiHandler, currentProjectList };
