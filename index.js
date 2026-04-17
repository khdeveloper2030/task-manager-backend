const express = require('express');
const cors = require('cors');
const db = require('./models');

const app = express();

// ១. ការកំណត់ CORS ឱ្យបានរឹងមាំ (ដោះស្រាយបញ្ហា Error 400 Pre-flight)
app.use(cors({
  origin: "https://task-manager-frontend-tau-two.vercel.app", // កុំដាក់ [] និង / នៅខាងចុង
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true
}));

app.use(express.json());

// ២. Route ស្វាគមន៍សម្រាប់តេស្តលើ Browser
app.get('/', (req, res) => {
    res.send('🚀 Task Manager API is running successfully!');
});

// ៣. API Routes

// --- ទាញយក Task ទាំងអស់ ---
app.get('/api/tasks', async (req, res) => {
    try {
        const tasks = await db.Task.findAll({ order: [['createdAt', 'DESC']] });
        res.json(tasks);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// --- បង្កើត Task ថ្មី ---
app.post('/api/tasks', async (req, res) => {
    try {
        const newTask = await db.Task.create(req.body);
        res.status(201).json(newTask);
    } catch (err) {
        // បើ Error 400 កើតឡើងនៅទីនេះ មានន័យថាទិន្នន័យផ្ញើមកខុសទម្រង់ Database
        res.status(400).json({ error: err.message });
    }
});

// --- កែប្រែ Task (សំខាន់៖ លោកអ្នកត្រូវការ Route នេះដើម្បីឱ្យប៊ូតុង Edit ដើរ) ---
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

// ៤. ការ Sync Database (ប្រើ alter: true ដើម្បីឱ្យវា Update Column ស្វ័យប្រវត្តិ)
db.sequelize.sync({ alter: true })
    .then(() => console.log("✅ Database & Tables Synced!"))
    .catch(err => console.error("❌ Sync Error: ", err));

// ៥. Export សម្រាប់ Vercel
module.exports = app;

// ៦. សម្រាប់ដំណើរការលើ Localhost (Development)
if (process.env.NODE_ENV !== 'production') {
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
        console.log(`🚀 Server running on http://localhost:${PORT}`);
    });
}