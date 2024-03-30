const express = require('express');
const path = require('path');
const { registerUser, renderRegister, loginUser, renderLogin, logoutUser } = require('../controllers/UserController');
const { registerAdmin, 
        renderAdmin, 
        ensureAdmin, 
        renderLoginAdmin, 
        loginAdmin, 
        getUsers, 
        updateUser, 
        logoutAdmin, 
        renderUpdateUserForm, deleteUser, getQuizzes, renderUpdateQuiz, updateQuiz, 
        deleteQuiz } = require('../controllers/AdminController');

const { renderQuizIntro, 
        renderBeginnerQuiz, 
        getQuiz, 
        renderIntermediateQuiz, 
        renderAdvanceQuiz, 
        renderResult, 
        renderUpdateResultForm, 
        updateResult, 
        deleteResult,
        submitResults, 
        renderProgress} = require('../controllers/ContentController');

const viewsPath = path.join(__dirname, "../../views")
const router = express.Router();

router.get('/users', (req, res) => {
  res.render("users")
});


// create a register User 
router.post('/register',registerUser)
router.get('/register', renderRegister)

//create a login User 
router.post('/login', loginUser)
router.get('/login', renderLogin)
router.get('/logout', logoutUser)

//content api

router.get('/content', (req, res) => {
  res.render("content", {title: "Descriptive Statistics", 
                        showHeader : true, 
                        showFooter: true, 
                        })
});

router.get('/introduction', (req, res) => {
  res.render("introduction", {title: "Introduction", 
                              name: req.session.username, 
                              showHeader : true, 
                              showFooter: true, 
                              })
}); 

router.get('/inferential', (req, res) => {
  res.render("inference", {title:"Inference Statistics", 
                          showHeader : true, 
                          showFooter: true, 
                          })
})

// admin page 
router.get('/admin/register', renderAdmin); 
router.post('/admin/register', registerAdmin);

router.get('/admin/login', renderLoginAdmin);
router.post('/admin/login', loginAdmin);

router.get('/admin/studentInfo', ensureAdmin, getUsers); 
router.post('/admin/studentInfo', ensureAdmin, updateUser);
router.get('/admin/updateUser/:userId', ensureAdmin, renderUpdateUserForm);
router.post('/admin/deleteUser', ensureAdmin, deleteUser);

router.get('/admin/quizInfo', ensureAdmin, getQuizzes);
router.post("/admin/quizInfo", ensureAdmin, updateQuiz);
router.get("/admin/updateQuiz/:quizId", ensureAdmin, renderUpdateQuiz);
router.post('/admin/deleteQuiz', ensureAdmin, deleteQuiz);


router.get('/admin/logout', logoutAdmin);

// render quiz content
router.get("/quiz", renderQuizIntro); 
router.get("/beginner", renderBeginnerQuiz);
router.get("/intermediate", renderIntermediateQuiz);
router.get("/advanced", renderAdvanceQuiz);
router.post("/quiz", getQuiz);

// render result content 
router.get("/result", renderResult);
router.get("/progress", renderProgress)
router.post("/result", submitResults);
router.get("/renderUpdate/:quizID", renderUpdateResultForm);
router.post("/update", updateResult);
router.post("/delete", deleteResult);


module.exports = router;