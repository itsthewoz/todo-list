import { UiHandler, currentProjectList } from './uiHandler';
import { Storage } from './localSave';
class CreateElement {
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
        UiHandler.deleteTaskFromProject(
          e.target.parentElement.dataset.project,
          e.target.parentElement.dataset.id,
          e.target.parentElement.parentElement
        );
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
      this.editForm(e, title, details, dueDate, priority, id, projectName);
      const target =
        e.target.parentElement.parentElement.parentElement.lastChild;
      target.classList.toggle('hidden');
    });

    const deleteButton = this.element(
      'button',
      'deleteButton',
      'delete',
      buttonWrapperDiv
    );
    deleteButton.addEventListener('click', (e) => {
      UiHandler.deleteTaskFromProject(
        e.target.parentElement.parentElement.dataset.project,
        e.target.parentElement.parentElement.dataset.id,
        e.target.parentElement.parentElement.parentElement
      );
    });
    taskDiv.appendChild(buttonWrapperDiv);
    wrapperDiv.appendChild(taskDiv);

    const detailsDropDown = this.element('p', 'dropDown', details, wrapperDiv);
    detailsDropDown.classList.add('hidden');

    taskDetails.addEventListener('click', (e) => {
      const target = e.target.parentElement.parentElement.lastChild;
      target.textContent = `Details: ${e.target.parentElement.children[2].textContent}`;
      target.classList.toggle('hidden');
    });

    taskList.appendChild(wrapperDiv);
    taskDiv.classList.add(priority);
    taskDiv.dataset.id = id;
    taskDiv.dataset.project = projectName;
  }

  static editForm(e, title, details, date, priority, id, projectName) {
    const target = e.target.parentElement.parentElement.parentElement.lastChild;
    target.textContent = '';
    target.dataset.id = id;
    target.dataset.project = projectName;

    //Input containing title
    const titleLabel = this.element('label', false, 'Title: ', target);
    const titleInput = this.element('input', false, '', titleLabel);
    titleInput.value = title;

    //TextArea containing details
    const detailsLabel = this.element('label', false, 'Details: ', target);
    const detailsInput = this.element('textArea', false, '', detailsLabel);
    detailsInput.value = details;

    //Date Input containing date
    const dateLabel = this.element('label', false, 'Date: ', target);
    const dateInput = this.element('input', false, '', dateLabel);
    dateInput.type = 'date';
    dateInput.value = date;

    //Priority Selector
    const priorityLabel = this.element('label', false, 'Priority: ', target);
    const priorityInput = this.element('select', false, '', priorityLabel);

    const optionLow = this.element('option', false, 'Low', priorityInput);
    optionLow.value = 'low';

    const optionMedium = this.element('option', false, 'Medium', priorityInput);
    optionMedium.value = 'medium';

    const optionHigh = this.element('option', false, 'High', priorityInput);
    optionHigh.value = 'high';

    priorityInput.value = priority;

    //Container for Buttons
    const buttonContainer = this.element('div', false, '', target);

    //Button to Submit
    const saveButton = this.element('button', false, 'Save', buttonContainer);
    saveButton.addEventListener('click', (e) => {
      this.saveEditButton(e.target.parentElement.parentElement);
    });

    //Button to Cancel
    const cancelButton = this.element(
      'button',
      false,
      'Cancel',
      buttonContainer
    );
    cancelButton.addEventListener('click', (e) => {
      this.cancelEditButton(e.target.parentElement.parentElement);
    });
  }

  static saveEditButton(target) {
    const taskList = document.querySelector('.taskListWrapper');

    //save values
    const titleValue = target.children[0].children[0].value;
    const detailsValue = target.children[1].children[0].value;
    const dateValue = target.children[2].children[0].value;
    const priorityValue = target.children[3].children[0].value;
    const taskId = target.dataset.id;
    const projectName = target.dataset.project;

    const targetTask = currentProjectList
      .getProject(projectName)
      .getTask(taskId);

    //set values to project -> target task
    targetTask.setTitle = titleValue;
    targetTask.setDetails = detailsValue;
    targetTask.setDate = dateValue;
    targetTask.setPriority = priorityValue;

    //Rerender Current Projects Task List
    Storage.taskUpdate(projectName);
    taskList.textContent = '';
    UiHandler.populateSelectedProject(projectName);
  }

  static cancelEditButton(target) {
    const dropDownEle = target;
    dropDownEle.classList.toggle('hidden');
    dropDownEle.textContent = '';
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
