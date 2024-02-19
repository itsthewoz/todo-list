const taskList = document.querySelector('.taskListWrapper');

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
  // taskDiv.dataset.id = `${dataPosition}`;
}

export { createTask };
