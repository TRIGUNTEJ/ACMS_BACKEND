const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcrypt');
const AdminDetails = require('./models/admin');
const UserDetails = require('./models/users')

const app = express();
app.use(express.json());
app.use(cors({
 origin: 'https://trigun-acms.netlify.app',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  credentials: true,
}));

// Connect to MongoDB
mongoose.connect('mongodb+srv://root:trigun020903@cluster0.rq9xqrv.mongodb.net/ACRS?retryWrites=true&w=majority&appName=Cluster0', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

// Register endpoint
app.post('/register', async (req, res) => {
  try {
    const { email, name, password } = req.body;
    const hash = await bcrypt.hash(password, 10);
    const newuser = await UserDetails.create({ email, name, password: hash });
    res.json(UserDetails);
  } catch (err) {
    console.error('Error registering user:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Login endpoint
app.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if the user is an admin
    let user = await AdminDetails.findOne({ email });
    if (user) {
      const match = await bcrypt.compare(password, user.password);
      if (match) {
        return res.json({ message: 'Login successful', role: 'admin' });
      }
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Check if the user is a regular user
    user = await UserDetails.findOne({ email });
    if (user) {
      const match = await bcrypt.compare(password, user.password);
      if (match) {
        return res.json({ message: 'Login successful', role: 'user' });
      }
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    return res.status(404).json({ error: 'User not found' });
  } catch (err) {
    console.error('Error logging in:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});
app.get('/admin-dashboard', async (req, res) => {
  try {
    const { email } = req.query;
    const admin = await AdminDetails.findOne({ email });

    if (!admin) {
      return res.status(404).json({ error: 'Admin not found' });
    }
    res.json({ name: admin.name, email: admin.email });
  } catch (err) {
    console.error('Error fetching admin details:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.listen(3041, () => {
  console.log('Server is running on port 3041');
});
