class ProjectList {
  constructor() {
    this.projects = [];
  }

  addProject(name) {
    this.projects.push(name);
  }

  get getProjects() {
    return this.projects;
  }

  getProject(projectName) {
    return this.projects.find((project) => project.getName() === projectName);
  }
}
