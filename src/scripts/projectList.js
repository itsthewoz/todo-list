import { Project } from './project';

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
        project.getName === projectName.toLowerCase().replace(/\s+/g, '')
    );
  }

  deleteProject(project) {
    this.projects.splice(this.projects.indexOf(project), 1);
  }
}

export { ProjectList };

// handle deleting projects

//get project of task to delete
//project -> find task -> delete task

//currentProjectList.getProjects.forEach(project => {
//project.getTodaysTasks.forEach(task => { populateCurrentTask(task) })
//})
