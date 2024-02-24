TODO: Edit button functionality
TODO: Local storage system

TODO: Style everything

TODO: Logic

Edit Button ->
on press -> convert fields to editible fields

- Title -> input text
- Date -> input date
- Flag -> options flag
- description -> textfield

On save/enter ->

- call respective task functions
- update text content
- update priority class

edit.addeventlistener('click', () => {

})

taskEditTitle() {
const targtEl = doc.query('e.target.parentEl > h4');
targtEL.textCont = '';

}

//store array of projectList ->
//store project as key + projects array as value
// forEach stored project of projectList ->

- get key that matches project name
- for each value of key run add task

//when creating a project ->

- set localStorage to key(project) with value of getTasks

//when creating task

- target projectName as key
- update the array with getTasks

//when deleting a project

- localStorage.removeItem(projectName)

//when deleting a task

- target projectName as key
- update the array with getTasks

LOGIC:

- must grab initial inbox key and populate from said key on page load
