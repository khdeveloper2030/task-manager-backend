const express = require('express');
const cors = require('cors');
const db = require('./models');

const app = express();

// ១. កំណត់ CORS ឱ្យត្រូវ (លុប / នៅខាងចុង URL ចេញ)
app.use(cors({
  origin: ["https://task-manager-frontend-tau-two.vercel.app"], 
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
}));

app.use(express.json());

// ២. Route ស្វាគមន៍
app.get('/', (req, res) => {
    res.send('🚀 Task Manager API is running...');
});

// ៣. API Routes
app.get('/api/tasks', async (req, res) => {
    try {
        const tasks = await db.Task.findAll({ order: [['createdAt', 'DESC']] });
        res.json(tasks); // បញ្ជូន Array ទៅឱ្យ Frontend
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.post('/api/tasks', async (req, res) => {
    try {
        const newTask = await db.Task.create(req.body);
        res.status(201).json(newTask);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

app.delete('/api/tasks/:id', async (req, res) => {
    try {
        await db.Task.destroy({ where: { id: req.params.id } });
        res.json({ message: "Deleted" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// ៤. បង្ខំឱ្យ Sync Table លើ Vercel (សំខាន់បំផុតដើម្បីបាត់ Error 500)
db.sequelize.sync({ alter: true })
  .then(() => console.log("Database synced"))
  .catch(err => console.log("Sync error:", err));

module.exports = app;