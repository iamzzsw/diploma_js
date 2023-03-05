export const renderTasksTodo = (task) => {
    return `
    <li class='taskTodo ${task.status}' id=${task.id}>
        <div class="taskTodo_info">
            <h2>${task.title}</h2>
            <p>${task.description}</p>
            </br><div class="time-user"><span>${task.user}</span> <span>${task.time}</span></div> 
            <button data-task-id=${task.id}  class='prev'><</button> 
            <button data-task-id=${task.id} class='next'>></button>
        </div>
        <button data-task-id=${task.id} class='delete'>X</button>
    </li>
      `
}