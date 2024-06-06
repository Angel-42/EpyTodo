const express = require('express');
const db = require('../../config/db');
const { user_id } = require('../user/user');
const jwt = require('jsonwebtoken');

const todo = express.Router();
const todo_id = express.Router({mergeParams: true});

function authenticateToken(req, res, next) {
    const auth = req.headers['authorization'];
    const token = auth && auth.split(' ')[1];

    if (token == null) return res.sendStatus(401).json({msg: 'No token, authorization denied'});

    jwt.verify(token, process.env.SECRET, (err, user) => {
        if (err) return res.sendStatus(403);
        req.user = user;
        next();
    });
}

todo.get('/', authenticateToken, (req, res) => {
    const id = req.user.id;

    if (!id) return res.status(400).json({msg: 'Internal server error'});
    db.query('SELECT * FROM todos WHERE id = ?', [id], (err, result) => {
        if (err) return res.status(500).json({msg: 'Internal server error'});
        if (result.length <= 0) return res.status(404).json({msg: 'Not found'});
        return res.status(200).json(result[0]);
    });
});

todo.post('/', authenticateToken, (req, res) => {
    const id = req.user.id;
    const { title, description, done } = req.body;
    if (!id || !title || !description || !done) return res.status(400).json({msg: 'Missing parameters'});
    db.query('INSERT INTO todos (user_id, title, description, done) VALUES (?, ?, ?, ?)', [user_id, title, description, done], (err, result) => {
        if (err) return res.status(500).json({msg: 'Internal server error'});
        return res.status(201).json({msg: 'Todo created successfully', id: result.insertId});
    });
});

todo_id.get('/:todo_id', authenticateToken, (req, res) => {
    const todo_id = req.params.todo_id;
    const user_id = req.params.id;

    db.query('SELECT * FROM todos WHERE id = ? AND user_id = ?', [todo_id, user_id], (err, result) => {
        if (err) return res.status(500).json({msg: 'Internal server error'});
        if (result.length <= 0) return res.status(404).json({msg: 'Not found'});
        return res.status(200).json(result[0]);
    });
});

todo_id.put('/:todo_id', authenticateToken, (req, res) => {
    const todo_id = req.params.todo_id;
    const user_id = req.params.id;
    const { title, description, done } = req.body;
    if (!todo_id || !user_id || !title || !description || !done) return res.status(400).json({msg: 'Missing parameters'});
    db.execute('UPDATE `todos` SET title = ?, description = ?, done = ? WHERE id = ? AND user_id = ?', [title, description, done, todo_id, user_id], (err, result) => {
        if (err) return res.status(500).json({msg: 'Internal server error'});
        return res.status(200).json({msg: 'Todo updated successfully'});
    });
});

todo_id.delete('/:todo_id', authenticateToken, (req, res) => {
    const todo_id = req.params.todo_id;
    const user_id = req.params.id;

    db.execute('DELETE FROM `todos` WHERE id = ? AND user_id = ?', [todo_id, user_id], (err, result) => {
        if (err) return res.status(500).json({msg: 'Internal server error'});
        return res.status(200).json({msg: 'Todo deleted successfully'});
    });
});

module.exports = {todo, todo_id};
