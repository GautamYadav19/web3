"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const mongoose_1 = __importDefault(require("mongoose"));
const body_parser_1 = __importDefault(require("body-parser"));
const cors_1 = __importDefault(require("cors"));
const path = __importStar(require("path"));
const app = (0, express_1.default)();
app.set("view engine", "ejs");
app.set("views", "src/views");
const PORT = process.env.PORT || 3000;
const MONGODB_URI = "mongodb+srv://mongodb:9410011857@cluster0.ubjhkbn.mongodb.net/web3?retryWrites=true&w=majority";
mongoose_1.default.connect(MONGODB_URI);
app.use((0, cors_1.default)());
app.use(body_parser_1.default.json());
app.use(express_1.default.static(path.join(__dirname, "views")));
// Define a MongoDB schema and model for ToDo items
const todoSchema = new mongoose_1.default.Schema({
    text: { type: String, required: true },
    done: { type: Boolean, default: false },
});
const Todo = mongoose_1.default.model("Todo", todoSchema);
// API Routes
app.post("/api/todos", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { text } = req.body;
        const todo = new Todo({ text });
        const savedTodo = yield todo.save();
        res.status(201).json(savedTodo);
    }
    catch (error) {
        res.status(500).json({ error: "Could not create a ToDo item." });
    }
}));
app.get("/api/todos", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const todos = yield Todo.find();
        res.render("index1", { Tasks: todos });
        console.log({ Tasks: todos });
        // res.status(200).json(todos);
    }
    catch (error) {
        res.status(500).json({ error: "Could not fetch ToDo items." });
    }
}));
// app.get("/api/todo/:id", async (req, res) => {
//   try {
//     const todo = await Todo.findById(req.params.id);
//     res.redirect("/api/todos");
//     console.log(todo);
//   } catch (error) {}
// });
app.put("/api/todosUpdate/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const { done } = req.body;
        console.log("inside post", id);
        console.log(done);
        const updatedTodo = yield Todo.findByIdAndUpdate(id, { done }, { new: true });
        console.log(updatedTodo);
        res.status(200).json(true);
        // res.redirect("/api/todos");
    }
    catch (error) {
        res.status(500).json({ error: "Could not update the ToDo item." });
    }
}));
app.delete("/api/todos/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        yield Todo.findByIdAndRemove(id);
        res.status(204).end();
    }
    catch (error) {
        res.status(500).json({ error: "Could not delete the ToDo item." });
    }
}));
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
