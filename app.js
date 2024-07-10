const bodyParser = require('body-parser');
const express = require('express');
const app = express();
const port = 3000;

const db = require('./db');

app.get('/api/users', (req, res) => {
	db.query('SELECT * FROM users', (err, results) => {
		if (err) {
			return res.status(500).send('Ошибка выполнения запроса: ' + err);
		}
		res.json(results);
	});
});

app.use(bodyParser.json());

app.post('/api/users', (req, res) => {
	if (!req.body || !req.body.username || !req.body.email || !req.body.password) {
		return res.status(400).send('Некорректные данные пользователя');
	}

	const { username, email, password } = req.body;

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

app.use(express.static('public'));

app.listen(port, () => {
	console.log(`Приложение запущено на http://localhost:${port}`);
});

