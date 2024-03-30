const User = require("../models/user")
const path = require("path")
const bcrypt = require('bcryptjs');
const viewsPath = path.join(__dirname, "../../views")


const registerUser = async (req, res) => {
  try {
    let { name, email, password, password2, phone } = req.body;
    let user = await User.findOne({ email });
    if (user) {
      return res.redirect('/login'); 
    }

    if (!password) {
      // Handle the case where password is not provided
      req.flash('error', 'Password is required');
      return res.status(400).send("Password is required");
    }
    name = name.toLowerCase()
    user = new User({ name, email, phone });
    await user.setPassword(password);
    await user.save();

    req.session.userId = user._id; // Set user session
    return res.redirect('/login');
  } catch (error) {
    console.error(error);
    res.status(500).send('Server error');
  }
};

const renderRegister = async(req, res) => {
  res.render('register', {title: "Registration Page", 
                          showHeader : false, 
                          showFooter: false, 
                          isUserLogin: true,
                          errorMessages: req.flash('error')})
}

const loginUser = async (req, res) => {
  let { name, password } = req.body;
  name = name.toLowerCase();
  try {
    // You'll need to handle the case where
    const user = await User.findOne({ name });
    if (!user) {
      // Handle wrong username
      req.flash('error', 'User name is incorrect, please input correct name');
      return res.redirect('/login');
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
        // Handle wrong password
        req.flash('error', 'Your password is incorrect, please input correct password');
        return res.redirect('/login');
    }

    // Handle successful login
    // You'll need to set up session or token-based authentication here
    req.session.userId = user._id; // Example with session-based authentication
    req.session.username = user.name;

    const next_page = req.query.next || '/introduction';
    return res.redirect(next_page);

  } catch (error) {
    console.error(error);
    res.status(500).send('Server error');
  }
};


const getUser = async (req, res) => {
  try {
    const userId = req.params.id;
    const user = await User.findById(userId);
    return res.json(user);
  } catch (error) {
    console.error(error);
    res.status(500).send('Server error');
  }
}

const renderLogin = async(req, res) => {
  res.render('login', {title: "Login", showHeader : false, showFooter: false,isAdminLogin: false, errorMessages: req.flash('error')})
}

const logoutUser = async (req, res) => {
  req.session.destroy(() => {
    res.redirect('/');
  });
}

module.exports = {registerUser, 
                  renderRegister, 
                  loginUser, 
                  renderLogin, 
                  logoutUser,
                  getUser}; 