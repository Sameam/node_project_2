const path = require("path")
const bcrypt = require('bcryptjs');
const viewsPath = path.join(__dirname, "../../views")
const Quiz = require("../models/quiz")
const Result = require("../models/score")
const User = require("../models/user");
const { ensureAdmin } = require("./AdminController");

const renderQuizIntro = async(req, res) => {
  res.render("quiz", {title: "Quiz", 
                      showHeader: true, 
                      showFooter: true,
                      name: req.session.username})
}

const renderBeginnerQuiz = async(req, res) => {
  res.render("beginner", {title: "Beginner Quiz",
                          showHeader: true, 
                          showFooter: true, 
                          userID: req.session.userId,
                          name: req.session.username})
}

const renderIntermediateQuiz = async(req, res) => {
  res.render("intermediate", {title: "Intermediate Quiz", 
                              showHeader: true, 
                              showFooter: true,
                              userID: req.session.userId, 
                              name: req.session.username})
}

const renderAdvanceQuiz = async(req, res) => {
  res.render("advance", {title: "Advance Quiz", 
                          showHeader: true, 
                          showFooter: true, 
                          userID: req.session.userId, 
                          name: req.session.username})

}

const renderResult = async(req, res) => {
  try {
    var result;
    const userId = req.session.userId;
    if (ensureAdmin) {
      result = await Result.find();
    }
    else {
      result = await Result.find({ userID: userId });
    }
    res.render("result", {title: "Result",
                          showHeader: true,
                          showFooter: true,
                          users: result,
                          name: req.session.username}) 
  }
  catch (error) {
    console.error(error);
    res.status(500).send('Server error');
  }
}

const renderProgress = async(req, res) => {
  try {
    const userId = req.session.userId;
    const results = await Result.find({ userID: userId });
    const levelsCompleted = {
      Beginner: results.some(result => result.level === 'Beginner'),
      Intermediate: results.some(result => result.level === 'Intermediate'),
      Advanced: results.some(result => result.level === 'Advanced'),
    };
    const levelsCompletedCount = Object.values(levelsCompleted).filter(Boolean).length;
    res.render("progress", {title: "Progress",
                            showHeader: true,
                            showFooter: true,
                            users: results,
                            levelsCompleted,
                            levelsCompletedCount,
                            levelsLeft: 3 - levelsCompletedCount,
                            name: req.session.username})
  }
  catch (error) {
    console.error(error);
    res.status(500).send('Server error');
  }
}

const getQuiz = async(req, res) => {
  try {
    const level = req.query.level // you can pass the level as a query parameter
    const questions = await Quiz.find({ level: level });
    return res.json(questions);
  } catch (error) {
    res.status(500).send('Server error');
  }
}

const submitResults = async(req, res) => {
  try {
    const newScore = new Result({
      userID: req.body.userID,
      name : req.body.name,
      score: req.body.score,
      correctAnswers: req.body.correctAnswers,
      level: req.body.level,
      totalQuestions: req.body.totalQuestions
    })
    console.log("result: ", newScore)
    await newScore.save();
    return res.json({ message: 'Score submitted successfully.' });

  } catch (error) {
    console.log("error:", error)
    res.status(500).send('Server error');
  }

}


const renderUpdateResultForm = async (req, res) => {
  try {
    const result = await Result.findById(req.params.quizID).lean();
    if (!result) {
      // If no user is found, handle the error appropriately
      // You might want to render a different template or redirect
      return res.status(404).send('Quiz not found');
    }
    res.render('updateResult', { title: 'Update Result', 
                                name: result.name, 
                                showHeader: true, 
                                showFooter: true,
                                resultId: result._id,
                                results: result, 
                                errorMessages: req.flash('error') });
  } catch (error) {
    console.error(error);
    res.status(500).send('Server error');
  }

}

const deleteResult = async(req, res) => {
  try {
    const id = req.query.quizID;
    console.log(id)
    if (!id) {
      req.flash('error', 'Result is not updated, please change the result.');
      return res.status(404).send("Can't found the result");
    }
    await Result.findByIdAndDelete(id);
    console.log("delete User Sucessfully")
    return res.json({ message: "User deleted successfully." });
  } catch (error) {
    console.error(error);
    res.status(500).send('Server error');
  }
};

const updateResult = async(req, res) => {
  try {
    const { id, name, score, correctAnswers, level, totalQuestions } = req.body;
    const result = await Result.findById(id);
    if (!result) {
      req.flash('error', 'Cannot find a result to update');
      return res.redirect(`/result`);
    }; 

    result.name = name
    result.score = score
    result.correctAnswers = correctAnswers
    result.level = level;
    result.totalQuestions = totalQuestions;

    await result.save();
    return res.redirect('/result');
  }
  catch (error) {
    console.error(error);
    res.status(500).send('Server error');
  }
};



module.exports = {renderQuizIntro, 
                  renderBeginnerQuiz, 
                  getQuiz, 
                  renderIntermediateQuiz, 
                  renderAdvanceQuiz, 
                  renderUpdateResultForm,
                  renderResult, 
                  renderProgress,
                  deleteResult,
                  updateResult,
                  submitResults};
