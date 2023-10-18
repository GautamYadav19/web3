import express from "express";
import mongoose from "mongoose";
import bodyParser from "body-parser";
import cors from "cors";
import * as path from "path";

const app = express();
app.set("view engine", "ejs");
app.set("views", "src/views");
const PORT = process.env.PORT || 3000;
const MONGODB_URI =
  "mongodb+srv://mongodb:9410011857@cluster0.ubjhkbn.mongodb.net/web3?retryWrites=true&w=majority";

mongoose.connect(MONGODB_URI);

app.use(cors());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, "views")));

// Define a MongoDB schema and model for ToDo items
const todoSchema = new mongoose.Schema({
  text: { type: String, required: true },
  done: { type: Boolean, default: false },
});

const Todo = mongoose.model("Todo", todoSchema);

// API Routes
app.post("/api/todos", async (req, res) => {
  try {
    const { text } = req.body;
    const todo = new Todo({ text });
    const savedTodo = await todo.save();
    res.status(201).json(savedTodo);
  } catch (error) {
    res.status(500).json({ error: "Could not create a ToDo item." });
  }
});

app.get("/api/todos", async (req, res) => {
  try {
    const todos = await Todo.find();
    res.render("index1", { Tasks: todos });
    console.log({ Tasks: todos });
    // res.status(200).json(todos);
  } catch (error) {
    res.status(500).json({ error: "Could not fetch ToDo items." });
  }
});

// app.get("/api/todo/:id", async (req, res) => {
//   try {
//     const todo = await Todo.findById(req.params.id);
//     res.redirect("/api/todos");

//     console.log(todo);
//   } catch (error) {}
// });

app.put("/api/todosUpdate/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { done } = req.body;
    console.log("inside post", id);
    console.log(done);
    const updatedTodo = await Todo.findByIdAndUpdate(
      id,
      { done },
      { new: true }
    );
    console.log(updatedTodo);
    res.status(200).json(true);
    // res.redirect("/api/todos");
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Could not update the ToDo item." });
  }
});

app.delete("/api/todos/:id", async (req, res) => {
  try {
    const { id } = req.params;
    await Todo.findByIdAndRemove(id);
    res.status(204).end();
  } catch (error) {
    res.status(500).json({ error: "Could not delete the ToDo item." });
  }
});

app.get("/", (req, res) => {
  res.render("home");
});
// Serve the EJS template
// router.get("/", async (req, res) => {
//   try {
//     // res.json("task is running");
//     res.render("/index1");
//   } catch (error) {
//     res.json("Error" + error);
//   }
// });

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
