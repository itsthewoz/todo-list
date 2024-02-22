import { ProjectList } from './projectList';
import { Project } from './project';
import { Task } from './task';

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
const currentProjectList = new ProjectList();

class UiHandler {
  static toggleCurrentProject() {
    const navLi = document.querySelectorAll('nav li');
    navLi.forEach((li) => {
      li.classList.remove('currentProject');
    });
  }

  //initial 3 "projects"
  static {
    currentProjectList.addProject(new Project('inbox'));
    currentProjectList.addProject(new Project('today'));
    currentProjectList.addProject(new Project('thisweek'));

    //Inbox, Today, This Week button binds
    this.todaysTasksHandler();
    this.thisWeeksTasksHandler();
    this.inboxTasksHandler();
  }

  //Event Listner for Main Nav <a> that handles 'currentProject' class switching
  // static {
  //   const navLi = document.querySelectorAll('.main-nav li');
  //   navLi.forEach((a) => {
  //     a.addEventListener('click', (e) => {
  //       e.preventDefault();
  //       if (e.target.tagName !== 'A') {
  //         return;
  //       }

  //       this.projectListHandler(e);
  //       this.populateSelectedProject(e);
  //     });
  //   });
  // }

  static inboxTasksHandler() {
    const inbox = document.querySelector('#inbox');

    inbox.addEventListener('click', (e) => {
      e.preventDefault();
      this.projectListHandler(e);
      this.populateSelectedProject(e);
    });
  }

  static thisWeeksTasksHandler() {
    const week = document.querySelector('#thisweek');

    week.addEventListener('click', (e) => {
      e.preventDefault();
      this.projectListHandler(e);
      this.populateThisWeeksTasts();
    });
  }

  static populateThisWeeksTasts() {
    currentProjectList.getProjects.forEach((project) => {
      if (project.getName === 'today' || project.getName === 'thisweek') {
        return;
      }
      project.getThisWeeksTasks.forEach((task) => {
        this.populateCurrentTask(task);
      });
    });
  }

  static todaysTasksHandler() {
    const today = document.querySelector('#today');

    today.addEventListener('click', (e) => {
      e.preventDefault();
      this.projectListHandler(e);
      this.populateTodaysTasks();
    });
  }

  static populateTodaysTasks() {
    currentProjectList.getProjects.forEach((project) => {
      if (project.getName === 'today' || project.getName === 'thisweek') {
        return;
      }
      project.getTodaysTasks.forEach((task) => this.populateCurrentTask(task));
    });
  }

  static populateSelectedProject(e) {
    currentProjectList
      .getProject(e.target.textContent)
      .getTasks.forEach((task) => {
        this.populateCurrentTask(task);
      });
  }

  static projectListHandler(e) {
    this.toggleCurrentProject();
    e.target.parentElement.classList.add('currentProject');
    mainHeader.textContent = e.target.textContent;
    taskList.textContent = '';
  }

  static createProject(projectName) {
    const projectsLi = document.createElement('li');
    const projectLink = document.createElement('a');
    const projectDeleteButton = document.createElement('button');

    projectDeleteButton.textContent = 'Del';

    projectDeleteButton.addEventListener('click', (e) => {
      currentProjectList.deleteProject(
        e.target.parentElement.children[0].textContent.toLowerCase()
      );
      e.target.parentElement.remove();
    });

    projectLink.href = '';
    projectLink.textContent = projectName;
    projectLink.addEventListener('click', (e) => {
      e.preventDefault();
      this.projectListHandler(e);
      this.populateSelectedProject(e);
    });

    projectsLi.appendChild(projectLink);
    projectsLi.appendChild(projectDeleteButton);

    projectDeleteButton.classList.add('deleteProject');

    projectsUl.appendChild(projectsLi);
    projectsLi.dataset.project = projectName.toLowerCase().replace(/\s+/g, '');
  }

  static createTask(title, details, dueDate, priority, id) {
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

    //add proper function
    editButton.addEventListener('click', (e) => {});

    const deleteButton = document.createElement('button');
    deleteButton.textContent = 'Delete';
    taskDiv.appendChild(deleteButton);
    deleteButton.classList.add('deleteButton');
    //add proper function
    deleteButton.addEventListener('click', (e) => {
      const targetProject = document.querySelector('.currentProject');

      currentProjectList
        .getProject(targetProject.children[0].textContent)
        .deleteTask(e.target.parentElement.dataset.id);
      e.target.parentElement.remove();
    });

    taskList.appendChild(taskDiv);
    taskDiv.classList.add(priority);
    taskDiv.dataset.id = id;
  }

  static populateCurrentTask(array) {
    const { title, details, date, priority, id } = array;
    this.createTask(title, details, date, priority, id);
  }

  static modalReset() {
    formTitle.value = '';
    formDetails.value = '';
    formDate.value = '';
    formFlag.value = 'low';
  }

  static {
    //Working with classes
    projectForm.addEventListener('submit', (e) => {
      e.preventDefault();
      currentProjectList.addProject(new Project(projectFormInput.value));
      this.createProject(
        currentProjectList.getProject(projectFormInput.value).getName
      );
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

    modalCloseButton.addEventListener('click', () => {
      dialogModal.close();
      this.modalReset();
    });

    createNewButton.addEventListener('click', () => {
      dialogModal.showModal();
    });

    //Form sumbit handler
    taskForm.addEventListener('submit', (e) => {
      const targetProject = document.querySelector('.currentProject');
      e.preventDefault();

      currentProjectList
        .getProject(
          targetProject ? targetProject.children[0].textContent : 'inbox'
        )
        .addTask(
          new Task(
            formTitle.value,
            formDetails.value,
            formDate.value,
            formFlag.value
          )
        );
      //fix?
      this.populateCurrentTask(
        currentProjectList.getProject(
          targetProject ? targetProject.children[0].textContent : 'inbox'
        ).getLastTask
      );
      dialogModal.close();
      this.modalReset();
    });
  }
}

export { UiHandler };
