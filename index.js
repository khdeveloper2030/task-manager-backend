const express = require('express');
const cors = require('cors');
const db = require('./models');

const app = express();

// ១. កំណត់ការអនុញ្ញាត CORS (ប្តូរទៅ URL របស់ Frontend របស់អ្នក)
app.use(cors({
  origin: ["https://task-manager-frontend.vercel.app"], // ត្រូវដាក់ URL របស់ Frontend
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
}));

app.use(express.json());

// --- API Routes ---

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

// ៤. លុប Task (DELETE)
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

// --- ការរៀបចំសម្រាប់ Deployment ---

// សម្រាប់ Vercel Serverless (ដាច់ខាតត្រូវតែមាន)
module.exports = app;

// ដំណើរការ Server តែក្នុង Local Development ប៉ុណ្ណោះ
if (process.env.NODE_ENV !== 'production') {
    const PORT = process.env.PORT || 5000;
    db.sequelize.sync().then(() => {
        app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));
    });
}