const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const fs = require("fs");
const path = require("path");

const app = express();
app.use(cors());
app.use(bodyParser.json());

const STORAGE_FILE = path.join(__dirname, "storage.json");

// ----- State & Persistence -----
let boards = []; // Each board: { id, name, description, position, columns: [ ... ] }
let users = [{ id: "1", username: "testuser", password: "password123", expiresInSec: 3600 }];
let tokens = [];

let boardIdCounter = 1;
let columnIdCounter = 1;
let todoIdCounter = 1;
let tagIdCounter = 1;

function loadState() {
  if (fs.existsSync(STORAGE_FILE)) {
    try {
      const data = JSON.parse(fs.readFileSync(STORAGE_FILE, "utf-8"));
      boards = data.boards || [];
      boardIdCounter = data.boardIdCounter || 1;
      columnIdCounter = data.columnIdCounter || 1;
      todoIdCounter = data.todoIdCounter || 1;
      tagIdCounter = data.tagIdCounter || 1;
    } catch (err) {
      console.error("Error parsing state file:", err);
    }
  }
}

function saveState() {
  const data = { boards, boardIdCounter, columnIdCounter, todoIdCounter, tagIdCounter };
  fs.writeFileSync(STORAGE_FILE, JSON.stringify(data, null, 2));
}

loadState();

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
    columns: [] // Columns will be nested here
  };
  boards.push(board);
  saveState();
  res.status(201).json(board);
});

app.get("/api/boards", (req, res) => {
  res.json(boards);
});

app.get("/api/boards/:boardid", (req, res) => {
  const board = boards.find(b => b.id === req.params.boardid);
  board ? res.json(board) : res.status(404).json({ message: "Board not found" });
});

app.patch("/api/boards/:boardid", (req, res) => {
  const board = boards.find(b => b.id === req.params.boardid);
  if (!board) return res.status(404).json({ message: "Board not found" });

  Object.assign(board, req.body);
  saveState();
  res.json(board);
});

app.delete("/api/boards/:boardid", (req, res) => {
  boards = boards.filter(b => b.id !== req.params.boardid);
  saveState();
  res.json({ message: "Board deleted" });
});

// ====== BOARD COLUMNS ======
app.post("/api/board-columns", (req, res) => {
  const board = boards.find(b => b.id === req.body.boardId);
  if (!board) return res.status(404).json({ message: "Board not found" });

  const column = {
    id: (columnIdCounter++).toString(),
    createdOn: new Date(),
    updatedOn: new Date(),
    name: req.body.name,
    position: req.body.position || board.columns.length,
    todos: [] // Todos will be nested here
  };

  board.columns.push(column);
  saveState();
  res.status(201).json(column);
});

app.get("/api/board-columns", (req, res) => {
  // Return all columns from all boards as a flat list.
  const allColumns = boards.reduce((cols, board) => cols.concat(board.columns), []);
  res.json(allColumns);
});

app.get("/api/board-columns/:columnid", (req, res) => {
  let foundColumn;
  for (const board of boards) {
    foundColumn = board.columns.find(c => c.id === req.params.columnid);
    if (foundColumn) break;
  }
  foundColumn ? res.json(foundColumn) : res.status(404).json({ message: "Column not found" });
});

app.patch("/api/board-columns/:columnid", (req, res) => {
  let foundColumn;
  for (const board of boards) {
    foundColumn = board.columns.find(c => c.id === req.params.columnid);
    if (foundColumn) break;
  }
  if (!foundColumn) return res.status(404).json({ message: "Column not found" });

  Object.assign(foundColumn, req.body);
  foundColumn.updatedOn = new Date();
  saveState();
  res.json(foundColumn);
});

app.delete("/api/board-columns/:columnid", (req, res) => {
  let columnFound = false;
  boards.forEach(board => {
    const originalLength = board.columns.length;
    board.columns = board.columns.filter(c => c.id !== req.params.columnid);
    if (board.columns.length < originalLength) columnFound = true;
  });
  if (!columnFound) return res.status(404).json({ message: "Column not found" });
  saveState();
  res.json({ message: "Column deleted" });
});

app.put("/api/board-columns/:columnid/reorder", (req, res) => {
  let foundColumn, boardObj;
  for (const board of boards) {
    foundColumn = board.columns.find(c => c.id === req.params.columnid);
    if (foundColumn) {
      boardObj = board;
      break;
    }
  }
  if (!foundColumn) return res.status(404).json({ message: "Column not found" });

  // Remove the column and reinsert it at the requested position.
  boardObj.columns = boardObj.columns.filter(c => c.id !== req.params.columnid);
  const newPosition = req.body.position;
  boardObj.columns.splice(newPosition, 0, foundColumn);
  foundColumn.position = newPosition;
  saveState();
  res.json({ message: "Column reordered", newPosition });
});

// ====== TODOS ======
app.post("/api/todos", (req, res) => {
  // Find the column (search in every board)
  let foundColumn;
  for (const board of boards) {
    foundColumn = board.columns.find(c => c.id === req.body.columnId);
    if (foundColumn) break;
  }
  if (!foundColumn) return res.status(404).json({ message: "Column not found" });

  const todo = {
    id: (todoIdCounter++).toString(),
    title: req.body.title,
    description: req.body.description || "",
    priority: req.body.priority || "medium",
    todoType: req.body.todoType || "task",
    archived: req.body.archived || false,
    todoTags: req.body.todoTags || [],
    position: req.body.position || foundColumn.todos.length
  };

  foundColumn.todos.push(todo);
  saveState();
  res.status(201).json(todo);
});

app.get("/api/todos", (req, res) => {
  // Return all todos from every board's columns.
  const allTodos = boards.reduce((todosAcc, board) => {
    board.columns.forEach(column => {
      todosAcc = todosAcc.concat(column.todos);
    });
    return todosAcc;
  }, []);
  res.json(allTodos);
});

app.get("/api/todos/:todoid", (req, res) => {
  let foundTodo;
  for (const board of boards) {
    for (const column of board.columns) {
      foundTodo = column.todos.find(t => t.id === req.params.todoid);
      if (foundTodo) break;
    }
    if (foundTodo) break;
  }
  foundTodo ? res.json(foundTodo) : res.status(404).json({ message: "Todo not found" });
});

app.patch("/api/todos/:todoid", (req, res) => {
  let foundTodo;
  for (const board of boards) {
    for (const column of board.columns) {
      foundTodo = column.todos.find(t => t.id === req.params.todoid);
      if (foundTodo) break;
    }
    if (foundTodo) break;
  }
  if (!foundTodo) return res.status(404).json({ message: "Todo not found" });

  Object.assign(foundTodo, req.body);
  saveState();
  res.json(foundTodo);
});

app.delete("/api/todos/:todoid", (req, res) => {
  let todoFound = false;
  boards.forEach(board => {
    board.columns.forEach(column => {
      const originalLength = column.todos.length;
      column.todos = column.todos.filter(t => t.id !== req.params.todoid);
      if (column.todos.length < originalLength) {
        todoFound = true;
      }
    });
  });
  if (!todoFound) return res.status(404).json({ message: "Todo not found" });
  saveState();
  res.json({ message: "Todo deleted" });
});

app.put("/api/todos/:todoid/reorder", (req, res) => {
  let foundTodo, parentColumn;
  for (const board of boards) {
    for (const column of board.columns) {
      foundTodo = column.todos.find(t => t.id === req.params.todoid);
      if (foundTodo) {
        parentColumn = column;
        break;
      }
    }
    if (foundTodo) break;
  }
  if (!foundTodo) return res.status(404).json({ message: "Todo not found" });

  // Remove and reinsert todo at the new position.
  parentColumn.todos = parentColumn.todos.filter(t => t.id !== req.params.todoid);
  const newPosition = req.body.position;
  parentColumn.todos.splice(newPosition, 0, foundTodo);
  foundTodo.position = newPosition;
  saveState();
  res.json({ message: "Todo reordered", newPosition });
});

// ====== TODO TAGS ======
app.post("/api/todos/:todoid/tags", (req, res) => {
  let foundTodo;
  for (const board of boards) {
    for (const column of board.columns) {
      foundTodo = column.todos.find(t => t.id === req.params.todoid);
      if (foundTodo) break;
    }
    if (foundTodo) break;
  }
  if (!foundTodo) return res.status(404).json({ message: "Todo not found" });

  const tag = { id: (tagIdCounter++).toString(), name: req.body.name };
  foundTodo.todoTags.push(tag);
  saveState();
  res.status(201).json(tag);
});

// ====== FILE UPLOAD (MOCK) ======
app.post("/api/todos/:todoid/images", (req, res) => {
  res.json({ message: "Mock image upload successful", url: "/mock-image.jpg" });
});

app.post("/api/todos/:todoid/file", (req, res) => {
  res.json({ message: "Mock file upload successful", filename: "mock-file.pdf" });
});

// ====== START SERVER ======
app.listen(8081, () => console.log("Mock API running on port 8081"));