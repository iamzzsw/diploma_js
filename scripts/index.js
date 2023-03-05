import { getTasksFromLocalStorage, setTasksToLocalStorage } from './localStorage.js';
import { clock } from './clock.js';
import {renderTasksTodo} from './renderTasksTodo.js'
import { getUsers, renderUser } from './getUsers.js'

clock();

const tasks = {
    list: getTasksFromLocalStorage(),
    setTask(title, description, user) {
        const task = {
            id: Math.random(),
            title,
            description,
            time: new Date().toLocaleDateString(),
            user,
            status: 'todo',
        }
        this.list.unshift(task)
        setTasksToLocalStorage(this.list);
    },
    deleteById(id) {
        this.list = this.list.filter((task) => task.id !== id);
        setTasksToLocalStorage(this.list)
    },
    deleteAll() {
        this.list = this.list.filter((task) => task.status !== 'done')
        setTasksToLocalStorage(this.list);
    },
    changeStatysToInProgress(id) {
        const task = this.list.find(task => task.id === id);

        if (task) {
            task.status = 'inProgress';
            setTasksToLocalStorage(this.list)
        }
    },
    changeStatysToDone(id) {
        const task = this.list.find(task => task.id === id);

        if (task) {
            task.status = 'done';
            setTasksToLocalStorage(this.list)
        }
    },
    changeStatysToTodo(id) {
        const task = this.list.find(task => task.id === id);

        if (task) {
            task.status = 'todo';
            setTasksToLocalStorage(this.list)
        }
    },
    editByID(id, title, description, user) {
        const task = this.list.find(task => task.id === id);

        if (task) {
            task.title = title,
                task.description = description,
                task.user = user,
                task.time = new Date().toLocaleDateString()
            setTasksToLocalStorage(this.list)
        }
    },
    getInfoById(id) {
        const task = this.list.find(task => task.id === id);

        if (task) {
            return [task.title, task.description, task.user]
        }
    }
}

const modal = document.querySelector('.modal');
const close = modal.querySelector('#close');
const create = modal.querySelector('#create');
let user = modal.querySelector('#user');

const modalEdit = document.querySelector('.modal-edit');
const closeEdit = modalEdit.querySelector('#close');
const edit = modalEdit.querySelector('#edit');
let userEdit = modalEdit.querySelector('#user-edit');

getUsers().then((users) => {
    renderUser(users, user);
    renderUser(users, userEdit);
});

close.addEventListener('click', () => {
    modal.classList.add('modal-none');
})
closeEdit.addEventListener('click', () => {
    modalEdit.classList.add('modal-none');
})

const renderTasks = () => {
    let boards_item = document.querySelector('.boards_item_todo');
    boards_item.innerHTML = ''

    let boards_item_inProgress = document.querySelector('.boards_item_inProgress');
    boards_item_inProgress.innerHTML = '';

    let boards_item_done = document.querySelector('.boards_item_done');
    boards_item_done.innerHTML = '';

    let spanTitle = document.createElement('span')
    spanTitle.classList.add('title')
    spanTitle.textContent = 'todo:'

    let spanTitleInProgress = document.createElement('span')
    spanTitleInProgress.classList.add('title')
    spanTitleInProgress.textContent = 'in progress:'

    let spanTitleDone = document.createElement('span')
    spanTitleDone.classList.add('title')
    spanTitleDone.textContent = 'done:'

    let ul = document.createElement('ul');
    ul.classList.add('cardsTodo');

    let ulInProgress = document.createElement('ul');
    ulInProgress.classList.add('cardsInProgress');

    let ulDone = document.createElement('ul');
    ulDone.classList.add('cardsDone');

    let addButton = document.createElement('button');
    addButton.classList.add('addTask');
    addButton.textContent = 'Add task';

    let deleteButton = document.createElement('button');
    deleteButton.classList.add('deleteAll');
    deleteButton.textContent = 'Delete all';

    boards_item.append(spanTitle);
    boards_item_inProgress.append(spanTitleInProgress)
    boards_item_done.append(spanTitleDone)

    ul.addEventListener('click', (e) => {
        let liTask = ul.querySelector('.taskTodo');
        liTask.addEventListener('click', (e) => {
            const taskId = e.currentTarget.id;
            if (!taskId) return;

            modalEdit.classList.remove('modal-none');

            const nameEdit = modalEdit.querySelector('#titile-edit');
            const descriptionEdit = modalEdit.querySelector('#description-edit');

            let [title, description, user] = tasks.getInfoById(+taskId);
            nameEdit.value = title;
            descriptionEdit.value = description;
            userEdit.value = user;

            edit.addEventListener('click', () => {
                if (nameEdit.value === '' || descriptionEdit.value.length === '') {
                    alert('empty field');
                    return;
                }
                tasks.editByID(+taskId, nameEdit.value, descriptionEdit.value, userEdit.value);
                renderTasks();
            })

        })
        const taskId = e.target.getAttribute("data-task-id");
        if (!taskId) return;

        if (e.target.classList.contains("delete")) {
            tasks.deleteById(+taskId);
            renderTasks();
        }
        if (e.target.classList.contains('next')) {
            tasks.changeStatysToInProgress(+taskId);
            renderTasks()
        }

    })

    ulInProgress.onclick = (e) => {
        const taskId = e.target.getAttribute("data-task-id");
        if (!taskId) return;

        if (e.target.classList.contains("delete")) {
            tasks.deleteById(+taskId);
            renderTasks();
        }
        if (e.target.classList.contains('next')) {
            tasks.changeStatysToDone(+taskId);
            renderTasks()
        }
        if (e.target.classList.contains('prev')) {
            tasks.changeStatysToTodo(+taskId);
            renderTasks()
        }
    }
    ulDone.onclick = (e) => {
        const taskId = e.target.getAttribute("data-task-id");
        if (taskId) {
            if (e.target.classList.contains("delete")) {
                tasks.deleteById(+taskId);
                renderTasks();
            }
            if (e.target.classList.contains('prev')) {
                tasks.changeStatysToInProgress(+taskId);
                renderTasks()
            }
        }
    }

    deleteButton.onclick = (e) => {
        const arg = confirm('Are you sure?');
        if (arg) {
            tasks.deleteAll();
            renderTasks();
        }
    }

    create.onclick = (e) => {
        e.preventDefault();

        const nameInput = modal.querySelector('#titile');
        const description = modal.querySelector('#description');

        const nameValue = nameInput.value.trim();
        const descriptionValue = description.value.trim();

        if (nameValue === '' || descriptionValue.length === '') {
            alert('empty field');
            return;
        }

        tasks.setTask(nameValue, descriptionValue, user.value);

        nameInput.value = '';
        description.value = '';
        modal.classList.add('modal-none');

        renderTasks();
    }

    addButton.addEventListener('click', () => {
        modal.classList.remove('modal-none');

    })

    tasks.list.forEach(task => {
        let li = renderTasksTodo(task);
        if (task.status === 'done') ulDone.innerHTML += li;
        if (task.status === 'inProgress') ulInProgress.innerHTML += li;
        if (task.status === 'todo') ul.innerHTML += li;
    });
    boards_item.append(ul);
    boards_item_inProgress.append(ulInProgress);
    boards_item_done.append(ulDone);
    boards_item.append(addButton);
    boards_item_done.append(deleteButton);

}

renderTasks()

