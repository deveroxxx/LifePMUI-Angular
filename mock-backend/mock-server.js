const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Mock Data Storage
let boards = [];
let boardColumns = [];
let todos = [];
let users = [{ id: "1", username: "testuser", password: "password123", expiresInSec: 3600 }];
let tokens = [];

let boardIdCounter = 1;
let columnIdCounter = 1;
let todoIdCounter = 1;
let tagIdCounter = 1;

// ====== AUTHENTICATION ======
app.post("/auth/login", (req, res) => {
    const { username, password } = req.body;
    const user = users.find(u => u.username === username && u.password === password);

    if (user) {
        const token = `mocked-token-${Date.now()}`;
        tokens.push(token);
        res.json({ token, expiresInSec: user.expiresInSec });
    } else {
        res.status(401).json({ message: "Invalid credentials" });
    }
});

app.post("/auth/refresh-token", (req, res) => {
    res.json({ token: `new-mocked-token-${Date.now()}`, expiresInSec: 3600 });
});

app.post("/auth/logout", (req, res) => {
    res.json({ message: "Logged out" });
});

// ====== BOARDS ======
app.post("/api/boards", (req, res) => {
    const board = {
        id: (boardIdCounter++).toString(),
        name: req.body.name,
        description: req.body.description || "",
        position: req.body.position || boards.length,
        columns: []
    };
    boards.push(board);
    res.status(201).json(board);
});

app.get("/api/boards", (req, res) => {
    res.json(boards);
});

app.get("/api/boards/:boardid", (req, res) => {
    const board = boards.find(b => b.id === req.params.boardid);
    board ? res.json(board) : res.status(404).json({ message: "Board not found" });
});

app.put("/api/boards/:boardid", (req, res) => {
    const board = boards.find(b => b.id === req.params.boardid);
    if (!board) return res.status(404).json({ message: "Board not found" });

    Object.assign(board, req.body);
    res.json(board);
});

app.delete("/api/boards/:boardid", (req, res) => {
    boards = boards.filter(b => b.id !== req.params.boardid);
    res.json({ message: "Board deleted" });
});

// ====== BOARD COLUMNS ======
app.post("/api/board-columns", (req, res) => {
    const column = {
        id: (columnIdCounter++).toString(),
        createdOn: new Date(),
        updatedOn: new Date(),
        name: req.body.name,
        position: req.body.position || 0,
        todos: []
    };

    const board = boards.find(b => b.id === req.body.boardId);
    if (!board) return res.status(404).json({ message: "Board not found" });

    boardColumns.push(column);
    res.status(201).json(column);
});

app.get("/api/board-columns", (req, res) => {
    res.json(boardColumns);
});

app.get("/api/board-columns/:columnid", (req, res) => {
    const column = boardColumns.find(c => c.id === req.params.columnid);
    column ? res.json(column) : res.status(404).json({ message: "Column not found" });
});

app.put("/api/board-columns/:columnid", (req, res) => {
    const column = boardColumns.find(c => c.id === req.params.columnid);
    if (!column) return res.status(404).json({ message: "Column not found" });

    Object.assign(column, req.body);
    column.updatedOn = new Date();
    res.json(column);
});

app.delete("/api/board-columns/:columnid", (req, res) => {
    boardColumns = boardColumns.filter(c => c.id !== req.params.columnid);
    res.json({ message: "Column deleted" });
});

app.put("/api/board-columns/:columnid/reorder", (req, res) => {
    res.json({ message: "Column reordered", newPosition: req.body.position });
});

// ====== TODOS ======
app.post("/api/todos", (req, res) => {
    const todo = {
        id: (todoIdCounter++).toString(),
        title: req.body.title,
        description: req.body.description || "",
        priority: req.body.priority || "medium",
        todoType: req.body.todoType || "task",
        archived: req.body.archived || false,
        todoTags: req.body.todoTags || [],
        position: req.body.position || 0
    };

    const column = boardColumns.find(c => c.id == req.body.columnId);
    if (!column) return res.status(404).json({ message: "Column not found" });

    column.todos.push(todo);
    res.status(201).json(todo);
});

app.get("/api/todos", (req, res) => {
    res.json(todos);
});

app.get("/api/todos/:todoid", (req, res) => {
    const todo = todos.find(t => t.id === req.params.todoid);
    todo ? res.json(todo) : res.status(404).json({ message: "Todo not found" });
});

app.put("/api/todos/:todoid", (req, res) => {
    const todo = todos.find(t => t.id === req.params.todoid);
    if (!todo) return res.status(404).json({ message: "Todo not found" });

    Object.assign(todo, req.body);
    res.json(todo);
});

app.delete("/api/todos/:todoid", (req, res) => {
    todos = todos.filter(t => t.id !== req.params.todoid);
    res.json({ message: "Todo deleted" });
});

app.put("/api/todos/:todoid/reorder", (req, res) => {
    res.json({ message: "Todo reordered", newPosition: req.body.position });
});

// ====== TODO TAGS ======
app.post("/api/todos/:todoid/tags", (req, res) => {
    const todo = todos.find(t => t.id === req.params.todoid);
    if (!todo) return res.status(404).json({ message: "Todo not found" });

    const tag = { id: (tagIdCounter++).toString(), name: req.body.name };
    todo.todoTags.push(tag);
    res.status(201).json(tag);
});

// ====== FILE UPLOAD (MOCK) ======
app.post("/api/todos/:todoid/image", (req, res) => {
    res.json({ message: "Mock image upload successful", filename: "mock-image.jpg" });
});

app.post("/api/todos/:todoid/file", (req, res) => {
    res.json({ message: "Mock file upload successful", filename: "mock-file.pdf" });
});

// ====== START SERVER ======
app.listen(8081, () => console.log("Mock API running on port 8081"));