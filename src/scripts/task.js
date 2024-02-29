import { format } from 'date-fns';

class Task {
  static taskId = 0;

  constructor(title, details, date, priority) {
    this.title = title;
    this.details = details;
    this.date = date;
    this.priority = priority;
    this.id = Task.taskId++;
  }

  set setTitle(title) {
    this.title = title;
  }

  get getTitle() {
    return this.title;
  }

  set setDetails(details) {
    this.retails = details;
  }

  get getDetails() {
    return this.details;
  }

  set setDate(date) {
    this.date = date;
  }

  get getDate() {
    return this.date;
  }

  get getDateFormatted() {
    return format(this.date, 'yyyy, M, d');
  }

  set setPriority(priority) {
    this.priority = priority;
  }

  get getPriority() {
    return this.priority;
  }

  get getId() {
    return Number.toString(this.id);
  }
}

export { Task };
