class Task {
  constructor(title, details, dueDate, priority) {
    this.title = title;
    this.details = details;
    this.date = dueDate;
    this.priority = priority;
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
    // format?
  }

  set setPriority(priority) {
    this.priority = priority;
  }

  get getPriority() {
    return this.priority;
  }
}
