import { Project } from './project';
import { ProjectList } from './projectList';
import { Task } from './task';
import { currentProjectList } from './uiHandler';

class Storage {
  static storeProject() {
    currentProjectList.getProjects.forEach((project) => {
      localStorage.setItem(
        project.getName.toLowerCase(),
        JSON.stringify(project.getTasks)
      );
    });
  }

  static storeProjectList() {
    localStorage.setItem(
      'currentProjectList',
      JSON.stringify(currentProjectList.getProjects)
    );
  }

  static getProjectList() {
    return JSON.parse(localStorage.getItem('currentProjectList'));
  }

  static storeTask(projectName) {
    const targetProject = currentProjectList.getProject(projectName).getTasks;

    localStorage.setItem(
      projectName.toLowerCase().replace(/\s+/g, '-'),
      JSON.stringify(targetProject)
    );
  }

  static getTasksFromProject(projectName) {
    return JSON.parse(localStorage.getItem(projectName));
  }

  static getListOfKeys() {
    for (let i = 0; i < localStorage.length; i++) {
      console.log(localStorage.key(i));
    }
  }

  static initAddProjects() {
    for (let i = 0; i < localStorage.length; i++) {
      if (localStorage.key(i) !== 'currentProjectList') {
        currentProjectList.addProject(new Project(localStorage.key(i)));
      }
    }
  }
}

export { Storage };

//if localStorage > 0
// On Load ->
// Get list of keys
// For Each Key ->
//  - currentProjectList.addProject(new Project(key))
//  - For Each Task ->
//    - currentProjectList.getProject(key).addTask(new Task())

//else if ->
// storage.storeProjectList();

//get tasks from target project

//inbox needs to not reset

//populateSelectedProject(project)
// const tasks = getTasksFromProject(e.target.textContent.toLowerCase())
// tasks.forEach(task => {this.populateCurrentTask(task, e.target.textContent)})
// currentProjectList.getProject(project).getTasks.forEach((task) => {
//   this.populateCurrentTask(task, project);
// });
