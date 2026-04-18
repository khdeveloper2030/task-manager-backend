const express = require('express');
const cors = require('cors');
const db = require('./models');

const app = express();

// ១. ការកំណត់ CORS (ត្រឹមត្រូវ)
app.use(cors({
  origin: "https://task-manager-frontend-tau-two.vercel.app", 
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true
}));

app.use(express.json());

// ២. Route ស្វាគមន៍
app.get('/', (req, res) => {
    res.send('🚀 Taskly API with User Auth is running successfully!');
});

// ៣. API Routes

// --- ទាញយក Task (បែងចែកតាម Email) ---
app.get('/api/tasks', async (req, res) => {
    try {
        const { email } = req.query; 
        if (!email) {
            return res.status(400).json({ error: "Email is required to fetch tasks." });
        }
        const tasks = await db.Task.findAll({ 
            where: { userEmail: email }, 
            order: [['createdAt', 'DESC']] 
        });
        res.json(tasks);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// --- បង្កើត Task ថ្មី ---
app.post('/api/tasks', async (req, res) => {
    try {
        console.log("Receiving data:", req.body); // បន្ថែមដើម្បីតេស្តមើលក្នុង Vercel Logs
        const newTask = await db.Task.create(req.body);
        res.status(201).json(newTask);
    } catch (err) {
        console.error("Create Error:", err.message);
        res.status(400).json({ error: err.message });
    }
});

// --- កែប្រែ Task ---
app.put('/api/tasks/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const [updated] = await db.Task.update(req.body, { where: { id: id } });
        if (updated) {
            const updatedTask = await db.Task.findByPk(id);
            res.json(updatedTask);
        } else {
            res.status(404).json({ error: "រកមិនឃើញភារកិច្ចនេះទេ" });
        }
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// --- លុប Task ---
app.delete('/api/tasks/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const deleted = await db.Task.destroy({ where: { id: id } });
        if (deleted) {
            res.json({ message: "ភារកិច្ចត្រូវបានលុប" });
        } else {
            res.status(404).json({ error: "រកមិនឃើញភារកិច្ចសម្រាប់លុប" });
        }
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// ៤. Sync Database
db.sequelize.sync({ alter: true })
    .then(() => console.log("✅ Database Synced with User Auth Support!"))
    .catch(err => console.error("❌ Sync Error: ", err));

module.exports = app;

if (process.env.NODE_ENV !== 'production') {
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
        console.log(`🚀 Server running on http://localhost:${PORT}`);
    });
}