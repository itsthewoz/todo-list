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
    return this.projects.find(
      (project) =>
        project.getName.toLowerCase() ===
        projectName.toLowerCase().replace(/\s+/g, '-')
    );
  }

  checkForProject(projectName) {
    return this.projects.some(
      (project) =>
        project.getName.toLowerCase() ===
        projectName.toLowerCase().replace(/\s+/g, '-')
    );
  }

  deleteProject(project) {
    this.projects.splice(this.projects.indexOf(project), 1);
  }
}

export { ProjectList };
