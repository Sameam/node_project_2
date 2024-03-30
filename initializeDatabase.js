const mongoose = require('mongoose');
const Quiz = require('./src/models/quiz'); // Adjust the path according to your project structure
require('dotenv').config();


const mongoUri = process.env.MONGO_URI;
mongoose.connect(mongoUri);

const myQuestions = [
  {
    level: 'Advanced',
    questions: "2 main types of statistical tests",
    options: ['t_test, ANOVA', 'Parametric, Non_parametric', 'p-value, significant level', 't_test, p_value'],
    answer: 'Parametric, Non_parametric'
  },
  {
    level: 'Advanced',
    questions: "How many steps in hypothesis testing?",
    options: ['2', '3', '4', '5'],
    answer: '5'
  },
  {
    level: 'Advanced',
    questions: "How many types of regression testing?",
    options: ['1', '2', '3', '4'],
    answer: '3'
  },
  {
    level: 'Advanced',
    questions: "What do we compare to p-value to make conclusion?",
    options: ['t-critical', 'hypothesis', 'signicant level', 'null hypothesis'],
    answer: 'signicant level'
  },
  {
    level: 'Advanced',
    questions: "Assumption of regression",
    options: ['Linear', 'qualitative data', 'Unbalance Dataset', 'Interval dataset'],
    answer: 'Linear'
  },
  {
    level: 'Advanced',
    questions: "One condition that must satisfy on multiple linear regression is:",
    options: ['Collinearity', 'Non_collinearity', 'More than 2 variables', 'Not correlated'],
    answer: 'Non_collinearity'
  },
  {
    level: 'Advanced',
    questions: "Another name for dependent variable",
    options: ['Predictor', 'Predicted', 'Mean', 'Beta'],
    answer: 'Predicted'
  },
  {
    level: 'Advanced',
    questions: "Another name for independent variable",
    options: ['Predictor', 'Predicted', 'Mean', 'Beta'],
    answer: 'Predictor'
  },
  {
    level: 'Advanced',
    questions: "What is regression used for?",
    options: ['Make prediction', 'Test hypothesis', 'Test research question', 'Calculate the past dataset'],
    answer: 'Make prediction'
  },
  {
    level: 'Advanced',
    questions: "Scenario: You want to test a group of sport students the difference between before they taking protein and training and after taking protein and training. What is the suitable statistical test?",
    options: ['1 t_test', '2 t-test', 'Paired t-test', 'All of the above'],
    answer: 'Paired t-test'
  }
];


async function addQuestionsToDatabase(questions) {
  try {
      await Quiz.insertMany(questions);
      console.log('Questions added successfully');
  } catch (error) {
      console.error('Error adding questions to database:', error);
  }
}

addQuestionsToDatabase(myQuestions).then(() => {
  mongoose.disconnect();
});
