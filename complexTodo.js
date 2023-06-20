const createTodoElement = (todo) => {
  if (!todo) return null;

  // find template
  const todoTemplate = document.getElementById('todoTemplate');
  if (!todoTemplate) return null;

  // clone li element
  const todoElement = todoTemplate.content.firstElementChild.cloneNode(true);
  todoElement.dataset.id = todo.id;
  todoElement.dataset.status = todo.status;

  // render todo status
  const divElement = todoElement.querySelector('div.todo');
  if (divElement) {
    const alertClass = todo.status === 'completed' ? 'alert-success' : 'alert-secondary';
    divElement.classList.remove('alert-secondary');
    divElement.classList.add(alertClass);
  }

  // update content where needed
  const titleElement = todoElement.querySelector('.todo__title');
  if (titleElement) titleElement.textContent = todo.content;

  // TODO: attach events for buttons
  // attach event for mark-as-done button
  const markAsDoneButton = todoElement.querySelector('button.mark-as-done');
  if (markAsDoneButton)
    markAsDoneButton.addEventListener('click', () => {
      console.log('done');
      const currentStatus = todoElement.dataset.status;
      todoElement.dataset.status = currentStatus === 'pending' ? 'completed' : 'pending';
      const alertClass = currentStatus === 'pending' ? 'alert-success' : 'alert-secondary';

      const btnClass = currentStatus === 'pending' ? 'btn-success' : 'btn-dark';

      markAsDoneButton.classList.remove('btn-success', 'btn-dark');
      markAsDoneButton.classList.add(btnClass);

      divElement.classList.remove('alert-success', 'alert-secondary');

      divElement.classList.add(alertClass);

      const todoList = getTodoList();
      const newTodoList = todoList.map((item) => {
        if (item.id === todo.id) {
          item.status = todoElement.dataset.status;
        }
        return item;
      });

      localStorage.setItem('todo_list', JSON.stringify(newTodoList));
    });

  // attach event for remove button
  const removeButton = todoElement.querySelector('button.remove');
  if (removeButton)
    removeButton.addEventListener('click', () => {
      const todoList = getTodoList();
      const newTodoList = todoList.filter((item) => item.id !== todo.id);

      localStorage.setItem('todo_list', JSON.stringify(newTodoList));

      todoElement.remove();
    });

  // attach event for edit button
  const editButton = document.querySelector('button.edit');
  if (editButton) {
    editButton.addEventListener('click', () => {
      const todoList = getTodoList();
      const lastestTodo = todoList.find((x) => x.id === todo.id);
      if (!lastestTodo) return;
      // populate data to todo form
      populateTodoForm(lastestTodo);
    });
  }
  return todoElement;
};

const populateTodoForm = (todo) => {
  // query todo form
  const todoForm = document.getElementById('todoFormId');

  if (!todoForm) return;

  todoForm.dataset.id = todo.id;
  console.log('fdsa');

  // set value for form controls
  // set todoText
  const todoInput = document.getElementById('todoText');
  if (!todoInput) return;
  todoInput.value = todo.content;
};

const renderTodoList = (todoList, id) => {
  if (!Array.isArray(todoList) || todoList.length === 0) return;

  const ulElement = document.getElementById(id);

  if (ulElement) {
    for (const todo of todoList) {
      const liElement = createTodoElement(todo);

      ulElement.appendChild(liElement);
    }
  }
};

function getTodoList() {
  try {
    return JSON.parse(localStorage.getItem('todo_list') || []);
  } catch {
    return [];
  }
}

function handleTodoFormSubmit(event) {
  event.preventDefault();
  const todoForm = document.getElementById('todoFormId');
  if (!todoForm) return;

  // get form values
  const todoInput = document.getElementById('todoText');
  if (!todoInput) return;

  // determine add or edit mode
  const isEdit = Boolean(todoForm.dataset.id);

  if (isEdit) {
    //find current todo
    const todoList = getTodoList();
    const index = todoList.findIndex((x) => x.id.toString() === todoForm.dataset.id);
    if (index < 0) return;

    // update content
    todoList[index].content = todoInput.value;

    // save
    localStorage.setItem('todo_list', JSON.stringify(todoList));

    // apply dom
    const liElemet = document.querySelector(`ul#todoList > li[data-id="${todoForm.dataset.id}"]`);
    if (liElemet) {
      const titleElement = liElemet.querySelector('.todo__title');
      if (titleElement) titleElement.textContent = todoInput.value;
    }
  } else {
    const newTodo = {
      id: Date.now(),
      content: todoInput.value,
      status: 'pending',
    };

    const todoList = getTodoList();
    todoList.push(newTodo);
    // validate form values
    // save localstorage
    localStorage.setItem('todo_list', JSON.stringify(todoList));
    // apply DOM
    const ulElement = document.getElementById('todoList');
    const liElement = createTodoElement(newTodo);
    if (ulElement) {
      ulElement.appendChild(liElement);
    }
  }

  // reset form
  delete todoForm.dataset.id;
  todoForm.reset();
}

// main
(() => {
  // localStorage.setItem(
  //   'todo_list',
  //   JSON.stringify([
  //     {
  //       id: 1,
  //       content: 'Learn JS',
  //       status: 'pending',
  //     },
  //     {
  //       id: 2,
  //       content: 'Learn VueJS',
  //       status: 'completed',
  //     },
  //     {
  //       id: 3,
  //       content: 'Learn ReactJS',
  //       status: 'pending',
  //     },
  //   ])
  // );
  const todoList = getTodoList();
  renderTodoList(todoList, 'todoList');

  // register submit event for todo form
  const todoForm = document.getElementById('todoFormId');
  if (todoForm) {
    todoForm.addEventListener('submit', handleTodoFormSubmit);
  }
})();
