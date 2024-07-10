# Fullstack tutorial

## Шаг 1: Установка MySQL

### Установка MySQL на Ubuntu 20

1. Обновите список пакетов:
    ```sh
    sudo apt update
    ```

2. Установите MySQL:
    ```sh
    sudo apt install mysql-server
    ```

3. Запустите MySQL и настройте его для автоматического запуска:
    ```sh
    sudo systemctl start mysql
    sudo systemctl enable mysql
    ```

4. Запустите скрипт безопасности для начальной настройки:
    ```sh
    sudo mysql_secure_installation
    ```
    Следуйте инструкциям для настройки БД, удаления тестовой базы данных и анонимных пользователей.

## Шаг 2: Настройка MySQL

1. Подключитесь к MySQL:
    ```sh
    sudo mysql -u root -p
    ```

2. Создайте новую базу данных (если требуется):
    ```sql
    CREATE DATABASE tutorial;
    ```

3. Создайте нового пользователя и дайте ему права на новую базу данных:
    ```sql
    CREATE USER 'tutorial'@'localhost' IDENTIFIED BY 'tutorial';
    GRANT ALL PRIVILEGES ON tutorial.* TO 'tutorial'@'localhost';
    FLUSH PRIVILEGES;
    ```

## Шаг 3: Подключение MySQL к бэкенду

### Установка Node.js и NPM

  ```sh
  sudo apt install npm
  cd ~
  curl -sL https://deb.nodesource.com/setup_18.x -o /tmp/nodesource_setup.sh
  sudo apt install nodejs -y
  ```

### Установка необходимых модулей

1. Убедитесь, что у вас установлены Node.js и npm. Затем установите модуль `mysql2` для подключения к MySQL:
    ```sh
    npm install express mysql2 body-parser
    ```

### Создание конфигурационного файла

1. Создайте файл `db.js` для настройки соединения с базой данных MySQL:
    ```js
    const mysql = require('mysql2');

    const connection = mysql.createConnection({
      host: '127.0.0.1',
      user: 'tutorial',
      password: 'tutorial',
      database: 'tutorial'
    });

    connection.connect((err) => {
      if (err) {
        console.error('Ошибка подключения: ' + err.stack);
        return;
      }
      console.log('Подключение установлено как id ' + connection.threadId);
    });

    module.exports = connection;
    ```

2. Создайте файл `migration.sql`:
  ```sql
  CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL,
    email VARCHAR(100) NOT NULL,
    password VARCHAR(255) NOT NULL
  );
  ```
3. Импортируйте таблицу в базу данных:

  ```sh
  mysql -u root -p tutorial < migration.sql
  ````

### Использование соединения в Express-приложении

1. Создайте файл `app.js` для вашего Express-приложения и подключите MySQL:
    ```js
    const bodyParser = require('body-parser');
    const express = require('express');
    const app = express();
    const port = 3000;

    // Импортируем соединение с базой данных
    const db = require('./db');

    // Пример маршрута, использующего базу данных
    app.get('/users', (req, res) => {
      db.query('SELECT * FROM users', (err, results) => {
        if (err) {
          return res.status(500).send('Ошибка выполнения запроса: ' + err);
        }
        res.json(results);
      });
    });

    // Middleware для обработки JSON в запросах
    app.use(bodyParser.json());

    // Middleware для хостинга статических файлов фронтенда
    app.use(express.static('public'));

    // Роут для создания пользователя
    app.post('/api/users', (req, res) => {
      // Проверка наличия данных в теле запроса
      if (!req.body || !req.body.username || !req.body.email || !req.body.password) {
        return res.status(400).send('Некорректные данные пользователя');
      }

      // Извлечение данных из тела запроса
      const { username, email, password } = req.body;

      // Пример запроса к базе данных для создания пользователя
      const sql = 'INSERT INTO users (username, email, password) VALUES (?, ?, ?)';
      db.query(sql, [username, email, password], (err, result) => {
        if (err) {
          console.error('Ошибка при создании пользователя: ' + err.message);
          return res.status(500).send('Ошибка сервера при создании пользователя');
        }
        console.log('Новый пользователь создан с ID:', result.insertId);
        res.send('Пользователь успешно создан');
      });
    });


    app.listen(port, () => {
      console.log(`Приложение запущено на http://localhost:${port}`);
    });
    ```

### Запуск приложения

1. Запустите приложение командой:
    ```sh
    node app.js
    ```

Теперь ваше Express-приложение должно быть подключено к MySQL и готово к обработке запросов.

##  Шаг 4: Подключение бэкенда к фронтенду (пример)

Создайте файлы в public папке

1. **HTML (`index.html`):**
   ```html
   <!DOCTYPE html>
   <html lang="en">
   <head>
     <meta charset="UTF-8">
     <meta name="viewport" content="width=device-width, initial-scale=1.0">
     <title>Управление пользователями</title>
     <link rel="stylesheet" href="styles.css">
   </head>
   <body>
     <div class="container">
       <h1>Управление пользователями</h1>

       <!-- Форма создания нового пользователя -->
       <h2>Создать пользователя</h2>
       <form id="userForm">
         <input type="text" id="username" placeholder="Имя пользователя" required>
         <input type="email" id="email" placeholder="Email" required>
         <input type="password" id="password" placeholder="Пароль" required>
         <button type="submit">Создать</button>
       </form>

       <!-- Список пользователей -->
       <h2>Список пользователей</h2>
       <ul id="userList"></ul>
     </div>

     <script src="script.js"></script>
   </body>
   </html>
   ```
2. CSS (styles.css):
  ```css
  body {
    font-family: Arial, sans-serif;
    background-color: #f0f0f0;
    margin: 0;
    padding: 0;
  }

  .container {
    max-width: 800px;
    margin: 20px auto;
    padding: 20px;
    background-color: #fff;
    border-radius: 5px;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  }

  h1, h2 {
    color: #333;
  }

  form {
    margin-bottom: 20px;
  }

  input[type="text"], input[type="email"], input[type="password"], button {
    padding: 10px;
    margin-bottom: 10px;
    width: 100%;
    box-sizing: border-box;
  }

  button {
    background-color: #007bff;
    color: #fff;
    border: none;
    cursor: pointer;
  }

  button:hover {
    background-color: #0056b3;
  }

  ul {
    list-style-type: none;
    padding: 0;
  }

  li {
    padding: 10px;
    background-color: #f9f9f9;
    margin-bottom: 5px;
    border-radius: 3px;
  }
  ```
  3. JavaScript (script.js):
  ```js
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
  ```
