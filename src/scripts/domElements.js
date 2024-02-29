import { UiHandler } from './uiHandler';

class CreateElement {
  static dropdown() {}

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

    const taskDiv = document.createElement('div');

    const checkBBox = this.element('input', false, '', taskDiv);
    checkBBox.type = 'checkbox';
    checkBBox.id = 'taskCheckBox';
    checkBBox.addEventListener('click', (e) => {
      setTimeout(() => {
        UiHandler.deleteTaskFromProject(e);
      }, 250);
    });

    const taskTTitle = this.element('h4', false, title, taskDiv);
    const taskDDetails = this.element('p', false, details, taskDiv);
    const taskDDueDate = this.element('p', false, dueDate, taskDiv);
    const editBButton = this.element('button', 'editButton', 'Edit', taskDiv);
    //TODO: Create this
    editBButton.addEventListener('click', (e) => {
      //priority
      UiHandler.editPriority(taskDiv, e.target, priority);
    });

    const deleteBButton = this.element(
      'button',
      'deleteButton',
      'delete',
      taskDiv
    );
    deleteBButton.addEventListener('click', (e) => {
      UiHandler.deleteTaskFromProject(e);
    });

    taskList.appendChild(taskDiv);
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
