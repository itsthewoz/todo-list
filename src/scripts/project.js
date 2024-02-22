import {
  isThisWeek,
  isToday,
  compareAsc,
  differenceInCalendarDays,
} from 'date-fns';
class Project {
  constructor(name) {
    this.name = name.toLowerCase().replace(/\s+/g, '');
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

  getTask(taskId) {
    return this.tasks.find((task) => task.getId === Number.toString(taskId));
  }

  get getLastTask() {
    return this.tasks[this.tasks.length - 1];
  }

  deleteTask(taskId) {
    this.tasks.splice(this.tasks.indexOf(taskId), 1);
  }

  get getTodaysTasks() {
    return this.tasks.filter((task) =>
      isToday(new Date(task.getDateFormatted))
    );
  }

  get getThisWeeksTasks() {
    return this.tasks
      .filter((task) => isThisWeek(new Date(task.getDateFormatted)))
      .sort((a, b) => compareAsc(a.getDateFormatted, b.getDateFormatted));
  }
}

export { Project };

//for later
//return (
//   isThisWeek(new Date(task.getDateFormatted)) &&
//   differenceInCalendarDays(
//     new Date(task.getDateFormatted),
//     new Date()
//   ) >= 0
// );
