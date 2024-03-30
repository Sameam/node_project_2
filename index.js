const express = require('express');
const { engine } = require('express-handlebars')
const path = require('path')
const flash = require('connect-flash');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const Handlebars = require('handlebars');

require('dotenv').config()
var app = express();
app.use(express.json());
const hostname = process.env.HOSTNAME || '127.0.0.1';
const port = process.env.PORT || 3000;
const router = require('./src/routes/routes');
const connectToMongo = require('./mongoose');
const viewsPath = path.join(__dirname, 'views');
const { allowInsecurePrototypeAccess } = require('@handlebars/allow-prototype-access');

app.engine('hbs', engine({
  handlebars: allowInsecurePrototypeAccess(Handlebars),
  extname: '.hbs', 
  defaultLayout: 'main', 
  layoutsDir: path.join(__dirname, 'views', 'layouts'), 
  helpers: { // Define custom helpers here
    capitalize: function(str) {
      return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
    }
  }
}));

Handlebars.registerHelper('capitalize', function(str) {
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
});


app.set('view engine', 'hbs');
app.set('views', viewsPath); // Specify the views directory

app.use(session({
  secret: process.env.SESSION_SECRET, // Replace with your secret key
  resave: false,
  saveUninitialized: true,
  store: MongoStore.create({ 
    mongoUrl: process.env.MONGO_URI// Replace with your MongoDB URL
  }),
  cookie: {
    maxAge: 1000 * 60 * 60 * 24 // e.g., 1 day
  }
}));

app.use((req, res, next) => {
  res.locals.userLoggedIn = req.session.userId != null;
  res.locals.isAdminLogin = req.session.isAdmin == true
  next();
});

app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.originalUrl}`);
  next();
});

app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.use(flash())


app.get("/", (req,res) => {
  res.render('index', {title: "Home", showHeader : true, showFooter: true})
})

app.use(router);

connectToMongo().then(() => {
  app.listen(port, hostname, () => {
    console.log(`Server running at http://${hostname}:${port}/`);
  });
}).catch(error => {
  console.error('Failed to connect to MongoDB:', error);
});