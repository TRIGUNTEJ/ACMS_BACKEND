const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcrypt');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const AdminDetails = require('./models/admin');
const UserDetails = require('./models/users');
const CourseDetails = require('./models/course');

const app = express();
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(cors({
  origin: 'https://trigun-acms.netlify.app',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  credentials: true,
}));

app.use(session({
  secret: 'GOJO-143', 
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: 24 * 60 * 60 * 1000, 
    secure: false, 
    httpOnly: true,
  }
}));

mongoose.connect('mongodb+srv://root:trigun020903@cluster0.rq9xqrv.mongodb.net/ACRS?retryWrites=true&w=majority&appName=Cluster0', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

app.post('/register', async (req, res) => {
  try {
    const { email, name, password } = req.body;
    const hash = await bcrypt.hash(password, 10);
    const newUser = await UserDetails.create({ email, name, password: hash });
    res.json(newUser);
  } catch (err) {
    console.error('Error registering user:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    let user = await AdminDetails.findOne({ email });
    if (user) {
      const match = await bcrypt.compare(password, user.password);
      if (match) {
        req.session.user = { email: user.email, role: 'admin' };
        return res.json({ message: 'Login successful', role: 'admin' });
      }
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    user = await UserDetails.findOne({ email });
    if (user) {
      const match = await bcrypt.compare(password, user.password);
      if (match) {
        req.session.user = { email: user.email, role: 'user' };
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

app.post('/logout', (req, res) => {
  req.session.destroy(err => {
    if (err) {
      console.error('Error destroying session:', err);
      return res.status(500).json({ error: 'Internal server error' });
    }
    res.clearCookie('session-id'); 
    res.json({ message: 'Logged out successfully' });
  });
});

app.get('/admin-dashboard', (req, res) => {
  if (!req.session.user || req.session.user.role !== 'admin') {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  const { email } = req.session.user;
  AdminDetails.findOne({ email })
    .then(admin => {
      if (!admin) {
        return res.status(404).json({ error: 'Admin not found' });
      }
      res.json({ name: admin.name, email: admin.email });
    })
    .catch(err => {
      console.error('Error fetching admin details:', err);
      res.status(500).json({ error: 'Internal server error' });
    });
});
app.post('/add-course', async (req, res) => {
  try {
    const { CourseName, CourseCode, Department, Credits, Semester, Sections, Capacity } = req.body;
    const sectionsArray = Array.isArray(Sections) ? Sections : [Sections];

    const newCourse = await CourseDetails.create({CourseName, CourseCode, Department, Credits, Semester, Sections:sectionsArray, Capacity,});

    res.json(newCourse);
  } catch (err) {
    console.error('Error adding course:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});
app.get('/courses', async (req, res) => {
  try {
    const courses = await CourseDetails.find();
    res.json(courses);
  } catch (err) {
    console.error('Error fetching courses:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.listen(3041, () => {
  console.log('Server is running on port 3041');
});
