// DOM Elements
const registerBtn = document.querySelector(".register");
const startBtn = document.querySelector(".start-game");
const nameInput = document.querySelector(".name");
const emailInput = document.querySelector(".email");
const passwordInput = document.querySelector(".password");
const quizTakerName = document.querySelector(".taker");
const scoreDisplay = document.querySelector(".score");
const currentQuestionDisplay = document.querySelector(".current-q");
const totalQuestionsDisplay = document.querySelector(".total-q");
const questionsContainer = document.querySelector(".container");
const questions = document.querySelectorAll(".questions");
const submitBtn = document.querySelector(".Submit");
const restartBtn = document.querySelector(".restart");
const nextBtn = document.querySelector(".next");
const prevBtn = document.querySelector(".previous");
const footer = document.querySelector("footer");
const header = document.querySelector("header");

// Quiz variables
let currentQuestionIndex = 0;
let score = 0;
let userAnswers = Array(questions.length).fill(null);
const totalQuestions = questions.length;

// Initialize quiz
totalQuestionsDisplay.textContent = totalQuestions;
updateNavButtons();

// Register button click handler
registerBtn.addEventListener("click", function (e) {
  e.preventDefault();

  const name = nameInput.value.trim();
  const email = emailInput.value.trim();
  const password = passwordInput.value.trim();

  if (!name || !email || !password) {
    alert("Please fill in all fields");
    return;
  }

  if (!validateEmail(email)) {
    alert("Please enter a valid email address");
    return;
  }

  quizTakerName.textContent = name;
  alert("Registration successful! You can now start the quiz.");
});

// Start quiz button click handler
startBtn.addEventListener("click", function () {
  const name = nameInput.value.trim();
  if (!name) {
    alert("Please enter your name and register first");
    return;
  }

  header.classList.add("hiding");
  questionsContainer.classList.remove("hiding");
  footer.classList.remove("footHide");
  showQuestion(currentQuestionIndex);
});

// Show a specific question
function showQuestion(index) {
  // Hide all questions first
  questions.forEach((q) => q.classList.remove("active"));

  // Show the current question
  questions[index].classList.add("active");
  currentQuestionDisplay.textContent = index + 1;

  // Highlight previously selected answer if exists
  if (userAnswers[index] !== null) {
    const choices = questions[index].querySelectorAll(".choice");
    choices[userAnswers[index]].classList.add("selected");
  }

  updateNavButtons();
}

// Handle answer selection
questionsContainer.addEventListener("click", function (e) {
  if (
    e.target.classList.contains("choose") ||
    e.target.classList.contains("choice")
  ) {
    const choiceItem = e.target.classList.contains("choice")
      ? e.target
      : e.target.closest(".choice");
    const questionDiv = choiceItem.closest(".questions");
    const questionIndex = Array.from(questions).indexOf(questionDiv);

    // Reset all choices in this question
    const choices = questionDiv.querySelectorAll(".choice");
    choices.forEach((choice) => {
      choice.classList.remove("selected");
    });

    // Highlight selected choice
    choiceItem.classList.add("selected");
    userAnswers[questionIndex] = Array.from(choices).indexOf(choiceItem);
  }
});

// Calculate score
function calculateScore() {
  let newScore = 0;
  questions.forEach((question, index) => {
    if (userAnswers[index] !== null) {
      const choices = question.querySelectorAll(".choice");
      if (choices[userAnswers[index]].querySelector(".correct")) {
        newScore++;
      }
    }
  });
  score = newScore;
  scoreDisplay.textContent = score;
  return score;
}

// Submit button click handler
submitBtn.addEventListener("click", function () {
  const finalScore = calculateScore();

  // Show all correct answers and highlight user's answers
  questions.forEach((question, index) => {
    const choices = question.querySelectorAll(".choice");
    const correctAnswer = question.querySelector(".correct").closest(".choice");

    // Mark correct answer
    correctAnswer.classList.add("correct-answer");

    // Mark wrong user selections
    if (userAnswers[index] !== null) {
      const userChoice = choices[userAnswers[index]];
      if (!userChoice.querySelector(".correct")) {
        userChoice.classList.add("wrong-answer");
      }
    }
  });

  // Show results
  alert(`Quiz completed!\nYour score: ${finalScore}/${totalQuestions}`);
});

// Restart button click handler
restartBtn.addEventListener("click", function () {
  // Reset quiz state
  currentQuestionIndex = 0;
  score = 0;
  userAnswers = Array(questions.length).fill(null);

  // Reset displays
  scoreDisplay.textContent = score;
  currentQuestionDisplay.textContent = currentQuestionIndex + 1;

  // Reset question styles
  questions.forEach((question) => {
    const choices = question.querySelectorAll(".choice");
    choices.forEach((choice) => {
      choice.classList.remove("selected", "correct-answer", "wrong-answer");
    });
  });

  // Show first question
  showQuestion(currentQuestionIndex);
});

// Next button handler
nextBtn.addEventListener("click", function () {
  if (currentQuestionIndex < totalQuestions - 1) {
    currentQuestionIndex++;
    showQuestion(currentQuestionIndex);
  }
});

// Previous button handler
prevBtn.addEventListener("click", function () {
  if (currentQuestionIndex > 0) {
    currentQuestionIndex--;
    showQuestion(currentQuestionIndex);
  }
});

// Update navigation buttons state
function updateNavButtons() {
  prevBtn.disabled = currentQuestionIndex === 0;
  nextBtn.disabled = currentQuestionIndex === totalQuestions - 1;
  submitBtn.style.display =
    currentQuestionIndex === totalQuestions - 1 ? "block" : "none";
}

// Helper function to validate email
function validateEmail(email) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
}
