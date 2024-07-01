const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcrypt');
const UserDetails = require('./models/user');

const app = express();
app.use(express.json());
app.use(cors({
  origin: 'https://trigun-acms.netlify.app/',
  methods: ['GET', 'POST', 'UPDATE', 'DELETE'],
  credentials: true,
}));

mongoose.connect('mongodb+srv://root:trigun020903@cluster0.rq9xqrv.mongodb.net/ACRS?retryWrites=true&w=majority&appName=Cluster0');

app.post('/register', (req, res) => {
  const { email, name, password } = req.body;
  bcrypt.hash(password, 10)
    .then(hash => {
      UserDetails.create({ email, name, password: hash })
        .then(result => res.json(result))
        .catch(err => res.json(err));
    })
    .catch(err => res.json(err));
});

app.post('/login', (req, res) => {
  const { email, password } = req.body;
  UserDetails.findOne({ email })
    .then(user => {
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
      bcrypt.compare(password, user.password)
        .then(match => {
          if (match) {
            res.json({ message: 'Login successful' });
          } else {
            res.status(401).json({ error: 'Invalid credentials' });
          }
        });
    })
    .catch(err => res.json(err));
});

app.listen(3041, () => {
  console.log('Server is running');
});
