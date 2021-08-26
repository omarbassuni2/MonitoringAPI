const express = require('express');
const mongoose = require('mongoose');
const authRoutes = require('./routes/authRoutes.js');
const checkRoutes = require('./routes/checkRoutes.js');
const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');
const { requireAuth, checkUser } = require('./middleware/authMiddleware.js'); 


const app = express();

// middleware
app.use(express.static('public'));
app.use(express.json());
app.use(cookieParser());

// view engine
app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/public'));

// database connection
const dbURI = "mongodb+srv://bassuni:test1234@monitoringapi.sr77g.mongodb.net/myFirstDatabase";
mongoose.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex:true })
  .then((result) => app.listen(3000))
  .catch((err) => console.log(err));

// routes
app.get('*', checkUser); //applies checkuser to all get requests
app.get('/', (req, res) => res.render('landing_page'));
//app.get('/welcome', requireAuth, (req, res) => res.render('home'));
app.use(authRoutes);
app.use(checkRoutes);
