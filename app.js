require('dotenv').config();
const express = require('express');
const bodyparser = require('body-parser');
const cors = require('cors');
const sequelize = require('./util/database');
const userRoutes = require('./routes/userRoutes');
const chatRoutes=require('./routes/chat')

const app = express();

const corsOptions = {
  origin: 'http://localhost:3000',
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
};

app.use(cors(corsOptions));
app.use(bodyparser.urlencoded({ extended: false }));
app.use(express.json());

// User Routes
app.use( userRoutes);
app.use(chatRoutes);

// Serving static files
app.use(express.static('public'));

// Database synchronization
sequelize.sync({ force: true })
  .then(() => {
    console.log("Database synced");
  })
  .catch((err) => {
    console.log(err);
  });

module.exports = app;
