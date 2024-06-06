const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../../config/db');

const user = express.Router();
const user_id = express.Router({mergeParams: true});
const user_todos = express.Router();


function authenticateToken(req, res, next) {
    const auth = req.headers['authorization'];
    const token = auth && auth.split(' ')[1];

    if (token == null) return res.sendStatus(401).json({msg: 'No token, authorization denied'});

    jwt.verify(token, process.env.SECRET, (err, user) => {
        if (err) {
            console.log(err);
            return res.sendStatus(403);
        }
        req.user = user;
        next();
    });
}

function formatDate(date) {
    return date.toISOString().slice(0, 19).replace('T', ' ');
}

user.get('/', authenticateToken, (req, res) => {
    const id = req.user.id;

    if (!id) return res.status(400).json({msg: 'Internal server error'});
    db.query('SELECT * FROM user WHERE id = ?', [id], (err, result) => {
        if (err) {
            console.log(err);
            return res.status(500).json({msg: 'Internal server error'});
        }
        if (result.length <= 0) return res.status(404).json({msg: 'Not found'});
        return res.status(200).json({
            id: result[0].id,
            email: result[0].email,
            password: result[0].password,
            create_at: formatDate(result[0].created_at),
            firstname: result[0].firstname,
            name: result[0].name
        });
    });
});

user_id.get('/', authenticateToken, (req, res) => {
    const id = req.params.id;
    if (!id) return res.status(400).json({msg: 'Bad parameters'});
    db.query('SELECT * FROM user WHERE id = ?', [id], (err, result) => {
        if (err) return res.status(404).json({msg: 'Not found'});
        if (result.length <= 0) return res.status(404).json({msg: 'Not found'});
        return res.status(200).json({
            id: result[0].id,
            email: result[0].email,
            password: result[0].password,
            create_at: formatDate(result[0].created_at),
            firstname: result[0].firstname,
            name: result[0].name
        });
    });
});

user_id.put('/', authenticateToken, (req, res) => {
    const id = req.params.id;
    const { email, password, name, firstname } = req.body;
    if (!id || !email || !password || !name || !firstname) return res.status(400).json({msg: 'Bad parameters'});
    db.execute('UPDATE `user` SET email = ?, password = ?, name = ?, firstname = ? WHERE id = ?', [email, password, name, firstname, id], (err, result) => {
        if (err) return res.status(404).json({msg: 'Not found'});
        return res.status(200).json({msg: 'User updated successfully'});
    });
});

user_id.delete('/', authenticateToken, (req, res) => {
    const id = req.params.id;
    if (!id) return res.status(400).json({msg: 'Bad parameters'});
    db.execute('DELETE FROM `user` WHERE id = ?', [id], (err, result) => {
        if (err) return res.status(404).json({msg: 'Not found'});
        return res.status(200).json({msg: `Successfully deleted record number: ${id}`});
    });
});

user_todos.get('/', authenticateToken, (req, res) => {
    const id = req.user.id;

    if (!id) return res.status(400).json({msg: 'Bad parameters'});
    db.query('SELECT * FROM todos WHERE user_id = ?', [id], (err, result) => {
        if (err) return res.status(404).json({msg: 'Not found'});
        if (result.length <= 0) return res.status(404).json({msg: 'Not found'});
        return res.status(200).json(result);
    });
});

module.exports = { user, user_id, user_todos };
