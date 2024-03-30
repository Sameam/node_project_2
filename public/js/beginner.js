var quiz = document.getElementById('quiz');
var results = document.getElementById('results');
var submit = document.getElementById('check');
const userID = document.querySelector('meta[name="user-id"]').getAttribute('content');
const name = document.getElementById('name').dataset.name;
var numCorrect = 0;

fetch('/quiz?level=Beginner', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
    // Include any other headers your API might require
  }
  }) // Adjust the URL as needed
  .then(response => response.json())
  .then(data => {
    generateQuiz(data, quiz, results, submit);
      // Bind the submitQuiz function to the submit button
  })
  .catch(error => console.error('Error fetching questions:', error));


function generateQuiz(questions, quizContainer, resultsContainer, submitButton) {
  function showQuestions(questions, quizContainer) {
      var output = [];  // To store HTML output
      var answers;

      // Loop over each question
      for (var i = 0; i < questions.length; i++) {
          answers = [];

          // Loop over each option for the current question
          for (var j = 0; j < questions[i].options.length; j++) {
            answers.push(
                '<label>' +
                    '<input type="radio" name="question' + i + '" value="' + questions[i].options[j] + '">' + ' ' + 
                    String.fromCharCode(97 + j) + ': ' + // Convert index to letter (a, b, c, d)
                    questions[i].options[j] +
                '</label>'
            );
          }

          // Add question number and its answers to the output
          output.push(
              '<div class="question">' + (i + 1) + '. ' + questions[i].questions + '</div>' +
              '<div class="answers">' + answers.join('') + '</div>'
          );
      }

      // Combine output list into one string of HTML and put it on the page
      quizContainer.innerHTML = output.join('');
  }

    function showResults(questions, quizContainer, resultsContainer) {
        var answerContainers = quizContainer.querySelectorAll('.answers');
        var userAnswer = '';


        for (var i = 0; i < questions.length; i++) {
            userAnswer = (answerContainers[i].querySelector('input[name=question' + i + ']:checked') || {}).value;

            if (userAnswer === questions[i].answer) {
                numCorrect++;
                answerContainers[i].style.color = 'lightgreen';
            } else {
                answerContainers[i].style.color = 'red';
            }
        }

        resultsContainer.innerHTML = numCorrect + ' out of ' + questions.length;
    }

    // Show the questions
    showQuestions(questions, quizContainer);
    

    // When user clicks submit, show results
    submitButton.onclick = async function () {
        showResults(questions, quizContainer, resultsContainer);
        await sendResult(questions)
        .then(() => {
            // Redirect to /result page after sendResult completes
            window.location.href = '/result';
        })
        .catch((error) => {
            console.error('Error submitting results:', error);
            // Optionally handle the error, maybe display a message to the user
        });
    }
}


async function sendResult(questions) {
    var data = {
        userID: userID,
        name: name,
        score: numCorrect,
        correctAnswers: numCorrect,
        level: "Beginner",
        totalQuestions: questions.length
    };

    try {
        const response = await fetch('/result', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });
        console.log('Response:', response);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const resultData = await response.json();
        console.log('Success:', resultData);
    } catch (error) {
        console.error('Error:', error);
    }
}









