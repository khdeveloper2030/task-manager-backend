const express = require('express');
const cors = require('cors'); // ១. Import CORS
const db = require('./models');

const app = express();

// ២. កំណត់ការអនុញ្ញាត (Configuration)
app.use(cors({
  origin: ["https://taskly-api.vercel.app"], // ដាក់ URL របស់ Frontend ដែល Vercel ឱ្យមក
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
}));

app.use(express.json());

// ១. ទាញយក Task ទាំងអស់
app.get('/api/tasks', async (req, res) => {
    try {
        const tasks = await db.Task.findAll({ order: [['createdAt', 'DESC']] });
        res.json(tasks);
    } catch (err) { res.status(500).json({ error: err.message }); }
});

// ២. បង្កើត Task ថ្មី
app.post('/api/tasks', async (req, res) => {
    try {
        const newTask = await db.Task.create(req.body);
        res.status(201).json(newTask);
    } catch (err) { res.status(400).json({ error: err.message }); }
});

// ៣. កែប្រែ Task (UPDATE)
app.put('/api/tasks/:id', async (req, res) => {
    try {
        const taskId = req.params.id;
        const [updated] = await db.Task.update(req.body, { where: { id: taskId } });
        if (updated) {
            res.json({ message: "Updated successfully" });
        } else {
            res.status(404).json({ message: "Task not found" });
        }
    } catch (err) { res.status(500).json({ error: err.message }); }
});

// ៤. លុប Task (DELETE) - ត្រូវប្រាកដថាប្រើ req.params.id
app.delete('/api/tasks/:id', async (req, res) => {
    try {
        const taskId = req.params.id;
        const deleted = await db.Task.destroy({ where: { id: taskId } });
        if (deleted) {
            res.json({ message: "Deleted successfully" });
        } else {
            res.status(404).json({ message: "Task not found" });
        }
    } catch (err) { res.status(500).json({ error: err.message }); }
});

db.sequelize.sync().then(() => {
    app.listen(5000, () => console.log("🚀 Server running on http://localhost:5000"));
});