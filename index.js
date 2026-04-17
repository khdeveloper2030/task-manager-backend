const express = require('express');
const cors = require('cors');
const db = require('./models');

const app = express();

// ១. ការកំណត់ CORS - អនុញ្ញាតឱ្យ Frontend ហៅចូល
app.use(cors({
  origin: ["https://task-manager-frontend.vercel.app"], // ប្តូរ URL នេះឱ្យត្រូវនឹង Frontend របស់អ្នក
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
}));

app.use(express.json());

// ២. Route សម្រាប់ទំព័រដើម (ដើម្បីកុំឱ្យលោត Cannot GET /)
app.get('/', (req, res) => {
    res.send('🚀 Taskly API is running successfully on Vercel!');
});

// --- API ROUTES ---

// ៣. ទាញយកភារកិច្ចទាំងអស់ (GET)
app.get('/api/tasks', async (req, res) => {
    try {
        const tasks = await db.Task.findAll({ order: [['createdAt', 'DESC']] });
        res.json(tasks);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// ៤. បន្ថែមភារកិច្ចថ្មី (POST)
app.post('/api/tasks', async (req, res) => {
    try {
        const newTask = await db.Task.create(req.body);
        res.status(201).json(newTask);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// ៥. កែប្រែភារកិច្ច (PUT)
app.put('/api/tasks/:id', async (req, res) => {
    try {
        const taskId = req.params.id;
        const [updated] = await db.Task.update(req.body, { where: { id: taskId } });
        if (updated) {
            res.json({ message: "Updated successfully" });
        } else {
            res.status(404).json({ message: "Task not found" });
        }
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// ៦. លុបភារកិច្ច (DELETE)
app.delete('/api/tasks/:id', async (req, res) => {
    try {
        const deleted = await db.Task.destroy({ where: { id: req.params.id } });
        if (deleted) {
            res.json({ message: "Deleted successfully" });
        } else {
            res.status(404).json({ message: "Task not found" });
        }
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// --- ការកំណត់សម្រាប់ DEPLOYMENT ---

// ៧. សំខាន់បំផុត៖ Export សម្រាប់ Vercel Serverless
module.exports = app;

// ៨. ដំណើរការ Listen តែក្នុង Local (Development) ប៉ុណ្ណោះ
if (process.env.NODE_ENV !== 'production') {
    const PORT = process.env.PORT || 5000;
    // ធ្វើការ Sync Database តែក្នុង Local ដើម្បីការពារការ Crash លើ Production
    db.sequelize.sync().then(() => {
        app.listen(PORT, () => console.log(`🚀 Server is running on http://localhost:${PORT}`));
    });
}