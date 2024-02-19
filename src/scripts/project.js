class Project {
  constructor(name) {
    this.name = name;
    this.tasks = [];
  }

  set setName(name) {
    this.name = name;
  }

  get getName() {
    return this.name;
  }

  addTask(task) {
    this.tasks.push(task);
  }

  get getTasks() {
    return this.tasks;
  }

  getTask(taskTitle) {
    return this.tasks.find((task) => task.getTitle() === taskTitle);
  }
}
