const User = require("../models/user");
const Quiz = require("../models/quiz");
const path = require("path")
const bcrypt = require('bcryptjs');
const viewsPath = path.join(__dirname, "../../views")

const ensureAdmin = (req, res, next) => {
  if (req.session.userId && req.session.isAdmin) {
    // If the user is not logged in or not an admin, redirect or show an error
    next();
  }
  else {
    // The user is not logged in or not an admin, redirect to the login page
    res.redirect('/');
  }
};

const registerAdmin = async(req, res) => {
  try {
    let { name, email, password, password2, phone } = req.body;
    let admin = await User.findOne({ email });
    if (admin) {
      return res.redirect('/admin/studentInfo'); 
    }

    if (!password) {
      // Handle the case where password is not provided
      req.flash('error', 'Password is required');
      return res.status(400).send("Password is required");
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    name = name.toLowerCase()
    const user = new User({ name, email, password: hashedPassword, phone: phone, admin: true });
    await user.save();

    req.session.userId = user._id;

    return res.redirect("/admin/studentInfo");
  } catch (error) {
    console.error(error);
    res.status(500).send("Server error");
  }
}

const renderAdmin = async(req, res) => {
  res.render("registerAdmin", {title: "Create Admin Page", 
                              showHeader : false,
                              showFooter: false, 
                              errorMessages: req.flash('error')})
}

const loginAdmin = async(req, res) => {
  try {
    let { name, password } = req.body;
    name = name.toLowerCase();
    const user = await User.findOne({ name });
    if (!user) {
      // Handle wrong email
      req.flash('error', 'Username is incorrect, Please enter correct username');
      return res.redirect('/admin/login');
    }
    
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      // Handle wrong password
      req.flash('error', 'Password is incorrect, please enter correct password');
      return res.redirect('/admin/login');
    }
    req.session.userId = user._id;
    req.session.isAdmin = user.admin;
    req.session.username = user.name; 
    return res.redirect("/admin/studentInfo");
  } catch (error) {
    console.error(error);
    res.status(500).send("Server error");
  }

}

const renderLoginAdmin = async(req, res) => {
  res.render("login", {title: "Login Admin Page", 
                      showHeader : false, 
                      showFooter: false, 
                      isAdminLogin: true,
                      errorMessages: req.flash('error')})
}

const getUsers = async (req, res) => {
  try {
    let users = await User.find().lean();
    return res.render('studentInfo', { title: 'Student Information Panel', 
                                              showHeader: true, 
                                              showFooter: true,
                                              name: req.session.username, 
                                              users: users })
  } catch (error) {
    console.error(error);
    res.status(500).send('Server error');
  }
}

const updateUser = async (req, res) => {
  try {
    const { id, name, email, password, phone } = req.body;
    const user = await User.findById(id);

    if (!user) {
      req.flash('error', 'Cannot find a user to update');
      return res.redirect(`/admin/updateUser/${req.session.userId}`);
    }

    const existingUserWithEmail = await User.findOne({ email: email, _id: { $ne: id } });
    if (existingUserWithEmail) {
      // Handle the case where the email already exists
      req.flash('error', 'Email already being used, please update your email.');
      return res.redirect(`/admin/updateUser/${req.session.userId}`);
    }

    if (password && password.length > 0) {
      // Hash the new password before saving
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(password, salt);
    }

    user.name = name;
    user.email = email;
    user.phone = phone;
    await user.save();
    return res.redirect('/admin/studentInfo');
  } catch (error) {
    console.error(error);
    res.status(500).send('Server error');
  }

}

const renderUpdateUserForm = async (req, res) => {
  try {
    const user = await User.findById(req.params.userId).lean();
    if (!user) {
        // If no user is found, handle the error appropriately
        // You might want to render a different template or redirect
        return res.status(404).send('User not found');
    }
    res.render('updateUser', { title: 'Update User', 
                              name: user.name, 
                              showHeader: true, 
                              showFooter: true,
                              userId: user._id,
                              users: user, 
                              errorMessages: req.flash('error') });
  } catch (error) {
    console.error(error);
    res.status(500).send('Server error');
  }

}

const deleteUser = async (req, res) => {
  try {
    const { id, name, email, password, phone } = req.body;
    console.log(userId);
    await User.findByIdAndDelete(id);
    return res.redirect('/admin/studentInfo');
  } catch (error) {
    console.error(error);
    return res.status(500).send('Server error');
  }

}

const logoutAdmin = async (req, res) => {
  req.session.destroy((error) => {
    if (error) {
      console.error(error);
      return res.status(500).send('Server error');
    }
    else {
      console.log("Admin logged out successfully");
      req.flash('error', 'You have been logged out');
      
      res.redirect('/');
    }
  })
}

const getQuizzes = async (req, res) => {
  try {
    let quizzes = await Quiz.find().lean();
    return res.render('quizInfo', { title: 'Quiz Information Panel', 
                                    showHeader: true, 
                                    showFooter: true,
                                    name: req.session.username, 
                                    quizzes: quizzes })
  } catch (error) {
    console.error(error);
    res.status(500).send('Server error');
  }

}

const renderUpdateQuiz = async(req, res) => {
  try {
    const quiz = await Quiz.findById(req.params.quizId).lean();
    if (!quiz) {
        // If no quiz is found, handle the error appropriately
        // You might want to render a different template or redirect
        req.flash('error', 'Quiz is not updated, please change the quiz.');
        return res.status(404).send('Quiz not found');
    }
    res.render('updateQuiz', {title: 'Update Quiz', 
                              name: req.session.username, 
                              showHeader: true, 
                              showFooter: true,
                              quiz: quiz, 
                              errorMessages: req.flash('error') });
  } catch (error) {
    console.error(error);
    res.status(500).send('Server error');
  }
}

const updateQuiz = async(req, res) => {
  try {
    const {id, questions, options, answer, level} = req.body
    const quiz = await Quiz.findById(id);

    if (!quiz) {
      req.flash('error', 'Cannot find a quiz to update');
      return res.redirect(`/admin/updateQuiz/${id}`);
    }
    
    quiz.questions = questions;
    quiz.options = options;
    quiz.answer = answer;
    quiz.level = level;

    await quiz.save();
    return res.redirect('/admin/quizInfo');
  }
  catch (error) {
    console.error(error);
    res.status(500).send('Server error');
  }
}

const deleteQuiz = async (req, res) => {
  try {
    const {id, questions, options, answer, level} = req.body; 
    await Quiz.findByIdAndDelete(id);
    return res.redirect('/admin/quizInfo');
  }
  catch {
    console.error(error);
    res.status(500).send('Server error'); 
  }
}


module.exports = { registerAdmin, 
                    ensureAdmin, 
                    renderAdmin, 
                    renderLoginAdmin, 
                    loginAdmin, 
                    getUsers, 
                    updateUser, 
                    logoutAdmin, renderUpdateUserForm, deleteUser, getQuizzes, 
                    renderUpdateQuiz, updateQuiz, deleteQuiz};