const express = require('express');
const app = express();
const bodyParser = require('body-parser');

require('dotenv').config();
// const middleware = require('./middleware/auth');
// const middlewarenotfound = require('./middleware/notFound');


// app.use(express.json());
// app.use(require)

const {register, login} = require('./routes/auth/auth.js');
const {user, user_id, user_todos} = require('./routes/user/user.js');
const {todo, todo_id} = require('./routes/todos/todos.js');

app.use(bodyParser.json());
// app.use(middleware.verifyToken);
// app.use(middlewarenotfound.notFound);
// app.use(middlewarenotfound.errorHandler);
app.use('/register', register);
app.use('/login', login);
app.use('/user', user);
app.use('/users/:id', user_id);
app.use('/users/:id/todos', user_todos);
app.use('/todos', todo);
app.use('/todos/:id', todo_id);

// app.use(express.urlencoded({ extended: true }));

const port = process.env.PORT;

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
