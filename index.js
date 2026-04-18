const express = require('express');
const cors = require('cors');
const db = require('./models');

const app = express();

// ១. ការកំណត់ CORS ឱ្យបានរឹងមាំ
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

// --- ទាញយក Task (បែងចែកតាម Email របស់ User) ---
app.get('/api/tasks', async (req, res) => {
    try {
        const { email } = req.query; // ទទួល Email ពី Frontend តាមរយៈ query string (?email=...)
        
        if (!email) {
            return res.status(400).json({ error: "Email is required to fetch tasks." });
        }

        const tasks = await db.Task.findAll({ 
            where: { userEmail: email }, // ទាញយកតែ Task របស់ម្ចាស់ Email នេះ
            order: [['createdAt', 'DESC']] 
        });
        res.json(tasks);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// --- បង្កើត Task ថ្មី (ភ្ជាប់ជាមួយ Email) ---
app.post('/api/tasks', async (req, res) => {
    try {
        // Frontend នឹងផ្ញើ req.body រួមមាន { title, ..., userEmail }
        const newTask = await db.Task.create(req.body);
        res.status(201).json(newTask);
    } catch (err) {
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

// ៤. ការ Sync Database (ប្រើ alter: true ដើម្បីឱ្យវាថែម Column userEmail ស្វ័យប្រវត្តិ)
db.sequelize.sync({ alter: true })
    .then(() => console.log("✅ Database Synced with User Auth Support!"))
    .catch(err => console.error("❌ Sync Error: ", err));

// ៥. Export សម្រាប់ Vercel
module.exports = app;

// ៦. សម្រាប់ Development (Localhost)
if (process.env.NODE_ENV !== 'production') {
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
        console.log(`🚀 Server running on http://localhost:${PORT}`);
    });
}