    const mysql = require('mysql2');

    const connection = mysql.createConnection({
      host: 'localhost',
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

