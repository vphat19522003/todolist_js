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
      const textContent = currentStatus === 'pending' ? 'Finish' : 'Reset';

      const btnClass = currentStatus === 'pending' ? 'btn-success' : 'btn-dark';
      markAsDoneButton.textContent = textContent;
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

  return todoElement;
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
})();
