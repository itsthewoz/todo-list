import { UiHandler } from './uiHandler';
class CreateElement {
  static dropdown(e, details, title, dueDate, priority, projectName) {
    const detailModal = document.querySelector('#detailModal');
    dropDown.showModal();
  }

  static element(elementType, className, text, appendTo) {
    const element = document.createElement(elementType);
    element.textContent = text;
    appendTo.appendChild(element);

    if (className !== false) {
      element.classList.add(className);
    }

    return element;
  }

  static createTask(title, details, dueDate, priority, id, projectName) {
    const taskList = document.querySelector('.taskListWrapper');

    const wrapperDiv = document.createElement('div');
    const buttonWrapperDiv = document.createElement('div');
    const taskDiv = document.createElement('div');

    const checkBox = this.element('input', false, '', taskDiv);
    checkBox.type = 'checkbox';
    checkBox.id = 'taskCheckBox';
    checkBox.addEventListener('click', (e) => {
      setTimeout(() => {
        UiHandler.deleteTaskFromProject(e);
      }, 250);
    });

    const taskTitle = this.element('h4', false, title, taskDiv);
    const taskDetails = this.element('p', 'details', details, taskDiv);

    const taskDueDate = this.element('p', false, dueDate, taskDiv);

    const editButton = this.element(
      'button',
      'editButton',
      'Edit',
      buttonWrapperDiv
    );
    //TODO: Create this
    editButton.addEventListener('click', (e) => {
      //priority
      UiHandler.editPriority(taskDiv, e.target, priority);
    });

    const deleteButton = this.element(
      'button',
      'deleteButton',
      'delete',
      buttonWrapperDiv
    );
    deleteButton.addEventListener('click', (e) => {
      UiHandler.deleteTaskFromProject(e);
    });
    taskDiv.appendChild(buttonWrapperDiv);
    wrapperDiv.appendChild(taskDiv);

    const detailsDropDown = this.element(
      'p',
      'detailsDropDown',
      details,
      wrapperDiv
    );
    detailsDropDown.classList.add('hidden');

    taskDetails.addEventListener('click', (e) => {
      e.target.parentElement.parentElement.lastChild.classList.toggle('hidden');
    });

    taskList.appendChild(wrapperDiv);
    taskDiv.classList.add(priority);
    taskDiv.dataset.id = id;
    taskDiv.dataset.project = projectName;
  }

  static createProject(projectName) {
    const projectsUl = document.querySelector('.projects-nav > ul');
    const projectsLi = document.createElement('li');
    projectsLi.dataset.project = projectName.toLowerCase();

    const link = this.element(
      'a',
      false,
      projectName.replace(/-+/g, ' '),
      projectsLi
    );
    link.href = '';
    link.addEventListener('click', (e) => {
      e.preventDefault();
      UiHandler.projectListHandler(
        e.target.parentElement,
        e.target.textContent
      );
      UiHandler.populateSelectedProject(e.target.textContent.toLowerCase());
    });

    const deleteButton = this.element(
      'button',
      'deleteProject',
      'Del',
      projectsLi
    );
    deleteButton.addEventListener('click', (e) => {
      UiHandler.deleteSelectedProject(e);
    });

    projectsUl.appendChild(projectsLi);
  }
}

export { CreateElement };
