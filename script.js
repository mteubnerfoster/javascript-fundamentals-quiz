// All variables to be used
var introEl = document.getElementById("intro");
var highScoreBtnEl = document.getElementById("highScoreBtn");
var startButton = document.getElementById("startButton");
var getQuiz = document.getElementById("quizContainer");
var timer = document.getElementById("time");
var questionEl = document.getElementById("question");
var answerButtonEl = document.getElementById("answerButton");
var gameOverScreen = document.getElementById("gameOver");
var highScoreScreen = document.getElementById("highScore");
var finalScoreEl = document.getElementById("finalScore");
var goBack = document.getElementById("goBack");
var clearScore = document.getElementById("clearScore");

var questionIndex = 0;
var score = 0;
var secondsLeft = 90;

//Question list
var quizQuestions = [{

    question: "Inside which HTML element do we insert JavaScript?",
    answers: ["<script>", "<scripting>", "<js>", "<javascript>"],
    correct: 0

}, {

    question: "How do you write an IF statement in JavaScript?",
    answers: ["if [i === 5]", "if {i === 5}", "if (i === 5)", "if i === 5"],
    correct: 2

}, {

    question: "Which one of this is not a HTML element?",
    answers: ["HTML", "div", "head", "time"],
    correct: 3

}, {

    question: "How do you add a comment in a JavaScript?",
    answers: ["<!--hello-->", "hello", "'hello'", "//hello"],
    correct: 3

}, {

    question: "Which event occurs when a user clicks on an HTML element?",
    answers: ["onclick", "onmouseclick", "onhover", "dblclick"],
    correct: 0
},];

//Function for screen shift
function showHide(show, hide) {
    show.classList.remove("hide");
    hide.classList.add("hide");
}

//Set the Timer
function setTime() {
    var timerInterval = setInterval(function () {
        secondsLeft--;
        timer.textContent = "Time Remaining: " + secondsLeft;

        //Stops the timer when time runs out or the quiz is done.
        if (secondsLeft === 0 || questionIndex >= quizQuestions.length) {
            clearInterval(timerInterval);
            //Shows Game Over screen
            viewGameOverScreen();
        }

    }, 1000);
    //if secondsLeft === 0 show a Game Over and Retry screen
}

//Set questions and check answers

//Quiz start button
function startQuiz() {
    //Removes the initial screen and displays the quiz questions; begins the quiz for the user
    showHide(getQuiz, introEl);

    //Start timer
    setTime();

    //Show the question based on index that increase by increments
    showQuestion();

}

//Shows the quiz's questions and answers
function showQuestion() {
    var correctAns = quizQuestions[questionIndex].correct;

    //Showing the quiz's questions
    questionEl.textContent = quizQuestions[questionIndex].question;

    //Prints out the quiz's multiple choice
    for (var i = 0; i < quizQuestions[questionIndex].answers.length; i++) {
        var ansBtn = document.createElement("button");
        answerButtonEl.appendChild(ansBtn);
        ansBtn.setAttribute("class", "block btn btn-primary ansBtn")
        ansBtn.textContent = quizQuestions[questionIndex].answers[i];

        //Marks correct answers with 'true' attribute
        if (quizQuestions[questionIndex].answers[i] === quizQuestions[questionIndex].answers[correctAns]) {
            ansBtn.setAttribute("true", "true");
        }
    }
    nextQuestion();
}

//Moves to the next question and set of answers after an answer is selected; populates the next question and answers
function nextQuestion() {
    document.querySelectorAll(".ansBtn").forEach(ans => {
        ans.addEventListener("click", function (e) {
            checkAnswer(e);

            questionIndex++;
            answerButtonEl.innerHTML = "";

            if (questionIndex < quizQuestions.length) {
                console.log("show");
                showQuestion();
            } else {
                viewGameOverScreen();
            }
        })
    })
}

//When an answer button is pressed, tallies the score and logs it to the High Score
function checkAnswer(e) {

    //Targets the clicked button with 'true' attribute and increase the user's score by 20 points
    console.log(e.currentTarget);
    if (e.currentTarget.hasAttribute("true")) {
        score += 20;
        console.log(score);
        //Removes 10 seconds when user selects incorrect answer
    } else {
        secondsLeft -= 10;
    }
}

//Scores and Storing 
var scoreStorage = [];
var userSubmitBtnEl = document.getElementById("userSubmitBtn");
var userInitialEl = document.getElementById("userInitial");
var highScoreListEl = document.getElementById("highScoreList");

init();

function renderScoreStorage() {
    highScoreListEl.innerHTML = "";

    //Creates a new li for each Submit
    for (var i = 0; i < scoreStorage.length; i++) {
        var scoreList = scoreStorage[i];
        var li = document.createElement("li");
        li.textContent = scoreList;
        li.setAttribute("data-index", i);
        highScoreListEl.appendChild(li);
    }
}

//Grabs an item from local storage and parses it
function init() {
    var storedScores = JSON.parse(localStorage.getItem("storage"));
    if (storedScores !== null) {
        scoreStorage = storedScores;
    }
    renderScoreStorage();
}

// Stringify and set "storage" in localStorage to scoreStorage array
function storeScores() {
    localStorage.setItem("storage", JSON.stringify(scoreStorage));
}

//Function for user to type and submit their initials
function submitIni(e) {
    e.preventDefault();

    var initial = userInitialEl.value.trim();
    //If the user does not input their name, return nothing
    if (initial === "") {
        return;
    }

    //Push the user's entered initials and score into scoreStorage array, then sets them back to empty and 0
    scoreStorage.push(scoreStorage.length + 1 + ". " + initial + " - " + score + " points")
    userInitialEl.value = "";
    score = 0;

    storeScores();
    renderScoreStorage();
    viewHighScore();
}

//Clears the High Scores
function clearHighScore() {
    var listAmt = highScoreListEl.childElementCount;
    var index = document.querySelectorAll("li");

    scoreStorage.splice(index, listAmt);

    storeScores();
    renderScoreStorage();
}

//View Game Over screen
function viewGameOverScreen() {
    showHide(gameOverScreen, getQuiz);
    finalScoreEl.textContent = "Your final score is: " + score;
}

//View High Score screen
function viewHighScore() {
    showHide(highScoreScreen, gameOverScreen);
    showHide(highScoreScreen, getQuiz);
    showHide(highScoreScreen, introEl);
}

//Go back to Start screen and take the quiz again
function goBackToStart() {
    location.reload();
}

//Button list
startButton.addEventListener("click", startQuiz);
highScoreBtnEl.addEventListener("click", viewHighScore);
goBack.addEventListener("click", goBackToStart);
clearScore.addEventListener("click", clearHighScore);
userSubmitBtnEl.addEventListener("click", submitIni);