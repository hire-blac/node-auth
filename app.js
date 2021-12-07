require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const authRoutes = require('./routes/authRoutes');
const cookieParser = require('cookie-parser');
const { requireAuth, checkUser } = require('./middleware/authMiddleware');

// create react app
const app = express();

// register view engine
app.set('view engine', 'ejs');

// database connection
// const dbURI = process.env.DB_URI;
const dbURI = process.env.DB_URI;
const devPort = process.env.API_PORT;
const port = process.env.PORT || devPort;

mongoose.connect(dbURI)
.then(() => {
  console.log('Connected to Database');
  app.listen(port);
  console.log(`Server listening on port ${port}`)
})
.catch(err => console.log(err))

// middleware
app.use(express.static('public'));
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(cookieParser());

// routes
app.get('*', checkUser)

app.get('/', (req, res)=>{
  res.render('home');
});

app.get('/smoothies', requireAuth, (req, res)=>{
  res.render('smoothies');
});

app.use(authRoutes);