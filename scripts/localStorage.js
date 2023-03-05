export function getTasksFromLocalStorage() {
    const tasks = localStorage.getItem('tasks');

    if (tasks) return JSON.parse(tasks);

    return [];
}

export function setTasksToLocalStorage(tasks) {
    localStorage.setItem('tasks', JSON.stringify(tasks));
}