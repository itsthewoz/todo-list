import { Project } from './project';
import { Task } from './task';
import { currentProjectList } from './uiHandler';

class Storage {
  static storeProjects() {
    currentProjectList.getProjects.forEach((project) => {
      localStorage.setItem(
        project.getName.toLowerCase(),
        JSON.stringify(project.getTasks)
      );
    });
  }

  static storeProject() {
    const lastProject = currentProjectList.getLastProject;
    localStorage.setItem(
      lastProject.getName.toLowerCase(),
      JSON.stringify(lastProject.getTasks)
    );
  }

  static getProjectList() {
    return JSON.parse(localStorage.getItem('orderOfProjects'));
  }

  static deleteProject(project) {
    localStorage.removeItem(project);
  }

  static taskUpdate(projectName) {
    const targetProject = currentProjectList.getProject(projectName).getTasks;

    localStorage.setItem(
      projectName.toLowerCase().replace(/\s+/g, '-'),
      JSON.stringify(targetProject)
    );
  }

  static getTasksFromProject(projectName) {
    return JSON.parse(localStorage.getItem(projectName));
  }

  static htmlProjectsList() {
    const projectsLi = document.querySelectorAll('.projects-nav a');
    const projects = [];

    projectsLi.forEach((a) => projects.push(a.textContent));

    localStorage.setItem('orderOfProjects', JSON.stringify(projects));
  }

  static initAddProjects() {
    for (let i = 0; i < localStorage.length; i++) {
      if (localStorage.key(i) !== 'orderOfProjects') {
        currentProjectList.addProject(new Project(localStorage.key(i)));
        for (
          let j = 0;
          j < JSON.parse(localStorage.getItem(localStorage.key(i))).length;
          j++
        ) {
          const { title, details, date, priority } = JSON.parse(
            localStorage.getItem(localStorage.key(i))
          )[j];
          currentProjectList
            .getProject(localStorage.key(i))
            .addTask(new Task(title, details, date, priority));
        }
      }
    }
  }
}

export { Storage };

//TODO: edit functionality!
