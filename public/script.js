const userForm = document.getElementById('userForm');
const userList = document.getElementById('userList');

// Функция для создания нового пользователя
userForm.addEventListener('submit', (event) => {
  event.preventDefault();

  const username = document.getElementById('username').value;
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;

  fetch('/api/users', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ username, email, password }),
  })
  .then(response => response.text())
  .then(message => {
    alert(message); // Показать сообщение об успешном создании
    userForm.reset(); // Очистить форму
    fetchUsers(); // Обновить список пользователей
  })
  .catch(error => {
    console.error('Ошибка создания пользователя:', error);
    alert('Ошибка создания пользователя');
  });
});

// Функция для загрузки и отображения списка пользователей
function fetchUsers() {
  fetch('/api/users')
  .then(response => response.json())
  .then(users => {
    userList.innerHTML = ''; // Очистить текущий список пользователей

    users.forEach(user => {
      const li = document.createElement('li');
      li.textContent = `Имя: ${user.username}, Email: ${user.email}`;
      userList.appendChild(li);
    });
  })
  .catch(error => {
    console.error('Ошибка загрузки пользователей:', error);
    alert('Ошибка загрузки пользователей');
  });
}

// Загрузить список пользователей при загрузке страницы
document.addEventListener('DOMContentLoaded', fetchUsers);

