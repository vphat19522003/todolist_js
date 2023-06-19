// const createTodoElement = (todo) => {
//   if (!todo) return null;
//   const liElement = document.createElement('li');
//   liElement.textContent = todo.content;
//   liElement.dataset.id = todo.id;

//   return liElement;
// };

// const renderTodoList = (todoList, id) => {
//   if (!Array.isArray(todoList) || todoList.length === 0) return;

//   const ulElement = document.getElementById(id);

//   if (ulElement) {
//     for (const todo of todoList) {
//       const liElement = createTodoElement(todo);

//       ulElement.appendChild(liElement);
//     }
//   }
// };

// // main
// (() => {
//   const todoList = [
//     {
//       id: 1,
//       content: 'Learn JS',
//     },
//     {
//       id: 2,
//       content: 'Learn VueJS',
//     },
//     {
//       id: 3,
//       content: 'Learn ReactJS',
//     },
//   ];

//   renderTodoList(todoList, 'todoList');
// })();
const record = document.querySelector('.record');
const playButton = document.getElementById('playButton');
const stopButton = document.getElementById('stopButton');

playButton.addEventListener('click', function () {
  record.classList.add('rotate');
});

stopButton.addEventListener('click', function () {
  record.classList.remove('rotate');
});
