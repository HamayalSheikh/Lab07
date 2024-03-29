const express = require('express');
const bodyParser = require('body-parser');

const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const tasks = [];

app.post('/tasks', (req, res) => {
    const { title, description, dueDate, category, priority } = req.body;
    const task = {
        id: tasks.length + 1,
        title,
        description,
        dueDate,
        category,
        priority,
        completed: false
    };
    tasks.push(task);
    res.status(201).json(task);
});

app.put('/tasks/:id/complete', (req, res) => {
    const taskId = parseInt(req.params.id);
    const task = tasks.find(task => task.id === taskId);
    if (task) {
        task.completed = true;
        res.status(200).json(task);
    } else {
        res.status(404).json({ message: 'Task not found' });
    }
});

app.get('/tasks', (req, res) => {
    const { sortBy } = req.query;
    let sortedTasks = [...tasks];
    if (sortBy === 'dueDate') {
        sortedTasks.sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));
    } else if (sortBy === 'category') {
        sortedTasks.sort((a, b) => a.category.localeCompare(b.category));
    } else if (sortBy === 'completionStatus') {
        sortedTasks.sort((a, b) => a.completed - b.completed);
    }
    res.status(200).json(sortedTasks);
});

app.put('/tasks/:id/priority', (req, res) => {
    const taskId = parseInt(req.params.id);
    const { priority } = req.body;
    const task = tasks.find(task => task.id === taskId);
    if (task) {
        task.priority = priority;
        res.status(200).json(task);
    } else {
        res.status(404).json({ message: 'Task not found' });
    }
});

const users = [];

app.post('/register', (req, res) => {
    const { username, password } = req.body;
    const user = {
        username,
        password,
        tasks: []
    };
    users.push(user);
    res.status(201).json({ message: 'User registered successfully' });
});

app.post('/login', (req, res) => {
    const { username, password } = req.body;
    const user = users.find(user => user.username === username && user.password === password);
    if (user) {
        res.status(200).json({ message: 'Login successful' });
    } else {
        res.status(401).json({ message: 'Invalid username or password' });
    }
});

app.get('/users/:username/tasks', (req, res) => {
    const { username } = req.params;
    const user = users.find(user => user.username === username);
    if (user) {
        res.status(200).json(user.tasks);
    } else {
        res.status(404).json({ message: 'User not found' });
    }
});

app.post('/users/:username/tasks', (req, res) => {
    const { username } = req.params;
    const { title, description, dueDate, category, priority } = req.body;
    const user = users.find(user => user.username === username);
    if (user) {
        const task = {
            id: user.tasks.length + 1,
            title,
            description,
            dueDate,
            category,
            priority,
            completed: false
        };
        user.tasks.push(task);
        res.status(201).json(task);
    } else {
        res.status(404).json({ message: 'User not found' });
    }
});

app.put('/users/:username/tasks/:id/complete', (req, res) => {
    const { username, id } = req.params;
    const user = users.find(user => user.username === username);
    if (user) {
        const taskId = parseInt(id);
        const task = user.tasks.find(task => task.id === taskId);
        if (task) {
            task.completed = true;
            res.status(200).json(task);
        } else {
            res.status(404).json({ message: 'Task not found' });
        }
    } else {
        res.status(404).json({ message: 'User not found' });
    }
});

app.put('/users/:username/tasks/:id/priority', (req, res) => {
    const { username, id } = req.params;
    const { priority } = req.body;
    const user = users.find(user => user.username === username);
    if (user) {
        const taskId = parseInt(id);
        const task = user.tasks.find(task => task.id === taskId);
        if (task) {
            task.priority = priority;
            res.status(200).json(task);
        } else {
            res.status(404).json({ message: 'Task not found' });
        }
    } else {
        res.status(404).json({ message: 'User not found' });
    }
});

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});


