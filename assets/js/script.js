
// Retrieve tasks and nextId from localStorage
let taskList = JSON.parse(localStorage.getItem("tasks"))|| [];
let nextId = JSON.parse(localStorage.getItem("nextId"));


// Todo: create a function to generate a unique task id
function generateTaskId() {
    const timestamp = Date.now();
    const random = Math.floor(Math.random() * 1000);
    return `${timestamp}-${random}`;
}
// Todo: create a function to create a task card
function createTaskCard(task) {
    const card = $('<div>').addClass('card').attr('id', task.id);
    const cardHeader = $('<div>').addClass('card-header').text(task.title);
    const cardBody = $('<div>').addClass('card-body');
    const cardDescription = $('<p>').addClass('card-text').text(task.description);
    const cardDueDate = $('<p>').addClass('card-text').text(`Due Date: ${task.dueDate}`);
    const deleteButton = $('<button>').addClass('btn btn-danger delete').text('Delete');
    deleteButton.on('click', handleDeleteTask);
    if(task.dueDate&& task.status!== 'done'){
        const today = dayjs()
        if (today.isSame(task.dueDate, 'day')) {
            card.addClass('bg-warning text-white');
        }
        else if (today.isAfter(task.dueDate, 'day')) {
            card.addClass('bg-danger text-white');
        }
    }
    cardBody.append(cardDescription, cardDueDate, deleteButton);
    card.append(cardHeader, cardBody);
    return card;
}
// Todo: create a function to render the task list and make cards draggable
function renderTaskList() {
    $('#todo-cards').empty();
    $('#in-progress-cards').empty();
    $('#done-cards').empty();
    taskList.forEach(task => {
        const card = createTaskCard(task);
        if (task.status === 'to-do') {
            $('#todo-cards').append(card);
        } else if (task.status === 'in-progress') {
            $('#in-progress-cards').append(card);
        } else {
            $('#done-cards').append(card);
        }
       
    });
    $('.card').draggable({
        opacity: 0.7, zIndex: 100,});
        
}
// Todo: create a function to handle adding a new task
function handleAddTask(event){
    event.preventDefault();
    const title = $('#title').val();
    const description = $('#description').val();
    const dueDate = $('#due-date').val();
    const status = 'to-do';
    const id = generateTaskId();
    const newTask = { id, title, description, dueDate, status };
    console.log(newTask);
    taskList.push(newTask);
    localStorage.setItem('tasks', JSON.stringify(taskList));
    renderTaskList();
    $('#addTaskModal').modal('hide');
    $('#title').val('');
    $('#description').val('');
    $('#due-date').val('');
}
// Todo: create a function to handle deleting a task
function handleDeleteTask(event){
    const id = event.target.closest('.card').id;
    taskList = taskList.filter(task => task.id !== id);
    localStorage.setItem('tasks', JSON.stringify(taskList));
    renderTaskList();

}

// Todo: create a function to handle dropping a task into a new status lane
function handleDrop(event, ui) {
    const id = ui.draggable[0].id;
    const status = event.target.id;
    taskList = taskList.map(task => {
        if (task.id === id) {
            task.status = status;
        }
        return task;
    });
    localStorage.setItem('tasks', JSON.stringify(taskList));
    renderTaskList();
}
// Todo: when the page loads, render the task list, add event listeners, make lanes droppable, and make the due date field a date picker
$(document).ready(function () {

    if (!taskList) {
        taskList = [];
        localStorage.setItem('tasks', JSON.stringify(taskList));
    }
   
    renderTaskList();
    $('#taskForm').on('submit', handleAddTask);
    $('#todo, #in-progress, #done').droppable({
        drop: handleDrop
    });
});
