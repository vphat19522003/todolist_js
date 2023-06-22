let isChecked = false;
const createTodoElement = (todo, params) => {
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

  todoElement.hidden = !isMatch(todoElement, params);
  console.log(todoElement.hidden);

  // TODO: attach events for buttons
  // attach event for mark-as-done button
  const markAsDoneButton = todoElement.querySelector('button.mark-as-done');
  const btnColor = todo.status === 'pending' ? 'btn-dark' : 'btn-success';
  markAsDoneButton.classList.add(btnColor);
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
  const editButton = todoElement.querySelector('button.edit');
  if (editButton) {
    editButton.addEventListener('click', () => {
      const checkBoxContain = document.getElementById('checkBoxContain');
      checkBoxContain.classList.remove('hide');
      const todoList = getTodoList();
      const lastestTodo = todoList.find((x) => x.id === todo.id);
      const checkBoxElement = document.getElementById('todoCheckBox');
      if (!checkBoxElement) return;
      checkBoxElement.checked = todoElement.dataset.status === 'completed' ? true : false;

      if (!lastestTodo) return;
      // populate data to todo form
      populateTodoForm(lastestTodo);
    });
  }

  const checkBoxElement = document.getElementById('todoCheckBox');
  if (!checkBoxElement) return;

  checkBoxElement.addEventListener('change', (e) => {
    if (e.target.checked) {
      isChecked = true;
    } else {
      isChecked = false;
    }
  });
  return todoElement;
};

const populateTodoForm = (todo) => {
  // query todo form
  const todoForm = document.getElementById('todoFormId');

  if (!todoForm) return;

  todoForm.dataset.id = todo.id;

  // set value for form controls
  // set todoText
  const todoInput = document.getElementById('todoText');
  if (!todoInput) return;
  todoInput.value = todo.content;
};

const renderTodoList = (todoList, id, params) => {
  if (!Array.isArray(todoList) || todoList.length === 0) return;

  const ulElement = document.getElementById(id);

  if (ulElement) {
    for (const todo of todoList) {
      const liElement = createTodoElement(todo, params);

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

    todoList[index].status = isChecked ? 'completed' : 'pending';

    // save
    localStorage.setItem('todo_list', JSON.stringify(todoList));

    // apply dom
    const liElemet = document.querySelector(`ul#todoList > li[data-id="${todoForm.dataset.id}"]`);
    if (liElemet) {
      liElemet.dataset.status = isChecked ? 'completed' : 'pending';
      const titleElement = liElemet.querySelector('.todo__title');
      if (titleElement) titleElement.textContent = todoInput.value;
      const backgroundElemet = isChecked ? 'alert-success' : 'alert-secondary';
      const divElement = liElemet.querySelector('div.todo');
      divElement.classList.remove('alert-success', 'alert-secondary');
      divElement.classList.add(backgroundElemet);
      const btnColor = isChecked ? 'btn-success' : 'btn-dark';
      const btnElement = liElemet.querySelector('.mark-as-done');
      btnElement.classList.remove('btn-success', 'btn-dark');
      btnElement.classList.add(btnColor);
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
  const checkBoxContain = document.getElementById('checkBoxContain');
  checkBoxContain.classList.add('hide');
}

const isMatchSearch = (liElement, searchTerm) => {
  if (!liElement) return false;

  // searchTerm === empty ---> show all
  // searchTerm !== empty ---> filter

  if (searchTerm === '') return true;

  const titleElement = liElement.querySelector('p.todo__title');
  if (!titleElement) return false;

  return titleElement.textContent.toLowerCase().includes(searchTerm.toLowerCase());
};

const isMatchStatus = (liElement, filterStatus) => {
  return filterStatus === 'all' || liElement.dataset.status === filterStatus;
};

const isMatch = (liElement, params) => {
  const url = new URL(window.location.href);

  return (
    isMatchStatus(liElement, url.searchParams.get('status')) &&
    isMatchSearch(liElement, url.searchParams.get('searchTerm'))
  );
};

const initSearchInput = (params) => {
  const searchTerm = document.getElementById('searchTerm');
  if (!searchTerm) return;

  if (params.get('searchTerm')) {
    searchTerm.value = params.get('searchTerm');
  }

  searchTerm.addEventListener('input', (e) => {
    // console.log('change', e.target.value);
    // searchTodo(searchTerm.value);
    handleFilterChange('searchTerm', searchTerm.value);
  });
};

const initFilterStatus = (params) => {
  // find select
  const filterStatusSelect = document.querySelector('#filterStatus');
  if (!filterStatusSelect) return;

  if (params.get('status')) {
    filterStatusSelect.value = params.get('status');
  }
  // attach event change
  filterStatusSelect.addEventListener('change', (e) => {
    // filterTodo(filterStatusSelect.value);
    handleFilterChange('status', filterStatusSelect.value);
  });
};

const handleFilterChange = (filterName, filterValue) => {
  const url = new URL(window.location.href);
  url.searchParams.set(filterName, filterValue);
  history.pushState({}, '', url);

  const todeElementList = document.querySelectorAll('#todoList > li');

  for (const todo of todeElementList) {
    const needToShow = isMatch(todo, url.searchParams);
    todo.hidden = !needToShow;
  }
};

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

  const params = new URLSearchParams(window.location.search);

  const todoList = getTodoList();
  renderTodoList(todoList, 'todoList', params);

  // register submit event for todo form
  const todoForm = document.getElementById('todoFormId');
  if (todoForm) {
    todoForm.addEventListener('submit', handleTodoFormSubmit);
  }

  initSearchInput(params);
  initFilterStatus(params);
})();
