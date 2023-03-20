import jsonQuestions from './questions.json';

function Question(question, choices, answer) {
  this.question = question;
  this.choices = choices;
  this.answer = answer;
}

Question.prototype.isCorrect = function(choice) {
  return this.answer === choice;
}

function Quiz(question) {
  this.score = 0;
  this.correct = 0;
  this.question = question;
  this.currentQuestionIndex = 0;
}

Quiz.prototype.getCurrentQuestion = function() {
  return this.question[this.currentQuestionIndex];
}

Quiz.prototype.currentQuestion = function() {
  return this.currentQuestionIndex++;
}

Quiz.prototype.hasEnded = function() {
  return this.currentQuestionIndex >= this.question.length;
}

Quiz.prototype.letters = 'abcdef'.split(''); // ['a', 'b', 'c', 'd', 'e', 'f']

var QuizUI = {
  startQuiz: function () {
    this.cacheDOM();
    this.startButton.onclick = this.startEvent.bind(this);
  },
  startEvent: function() {
    this.startEl.classList.add('hide');
    this.quizEl.classList.remove('hide');
    this.displayNext();
  },
  cacheDOM: function() {
    this.startButton = document.getElementById('start-quiz');
    this.startEl = document.getElementById('start');
    this.quizEl = document.getElementById('quiz');
    this.choicesEl = document.getElementById('answers');
    this.choicesItems = this.choicesEl.getElementsByTagName('li');
    this.checkButton = document.getElementById('submit');
    this.nextButton = document.getElementById('next');
  },
  displayNext: function () {
    if (quiz.hasEnded()) {
      this.displayScore();
      this.gameOver();
    } else {
      this.displayScore();
      this.displayQuestionNumber();
      this.displayQuestion();
      this.displayChoices();
    }
  },
  displayQuestion: function() {
    this.populateIdWithHTML('question', quiz.getCurrentQuestion().question);
  },
  displayChoices: function() {
    var getChoices = quiz.getCurrentQuestion().choices;
    var self = this;

    for (var i = 0; i < getChoices.length; i++) {
      var liHTML = '<li class="choice dummy__item" data-choice-number="' + i + '">';
      liHTML += '<span class="choice__element">' + quiz.letters[i] + '</span>';
      liHTML += '<span class="answer">' + getChoices[i] + '</span>';
      liHTML += '</li>';
      this.choicesEl.innerHTML += liHTML;
    }

    setTimeout(function() {
      self.choicesEl.classList.add('dummy--active');
    }, 500);

    this.guessHandler();
  },
  populateIdWithHTML: function(id, text) {
    var element = document.getElementById(id);
    element.innerHTML = text;
  },
  guessHandler: function() {
    var self = this;

    for (var x = 0; x < this.choicesItems.length; x++) {
      this.choicesItems[x].addEventListener('click', function() {

        for (var x = 0; x < self.choicesItems.length; x++) {
          self.choicesItems[x].classList.remove('select');
        }

        self.checkButton.classList.add('button--show');
        self.checkButton.setAttribute('data-choice-number', this.getAttribute('data-choice-number'));
        this.classList.add('select');
      });
    }

    this.checkButton.onclick = this.checkQuestion;
    this.nextButton.onclick = this.nextQuestion;
  },
  test: function() {
    console.log(QuizUI.choicesEl);
    console.log(self);
    console.log(this);
  },
  checkQuestion: function() {
    var current = quiz.getCurrentQuestion(),
      attributeChoice = this.getAttribute('data-choice-number');

    this.classList.remove('button--show');
    QuizUI.nextButton.classList.add('button--show');
    QuizUI.choicesEl.classList.add('noclick');

    if (current.isCorrect(current.choices[attributeChoice])) {
      quiz.score = quiz.score + 10;
      quiz.correct = quiz.correct + 1;
      QuizUI.choicesItems[attributeChoice].classList.add('valid');
    } else {
      QuizUI.choicesItems[attributeChoice].classList.add('invalid');
    }

    QuizUI.choicesItems[attributeChoice].getElementsByTagName('span')[0].innerHTML = '';
  },
  nextQuestion: function() {
    this.classList.remove('button--show');
    QuizUI.choicesEl.classList.remove('noclick');

    QuizUI.choicesEl.classList.remove('dummy--active');
    setTimeout(function() {
      QuizUI.choicesEl.innerHTML = '';
      quiz.currentQuestion();
      QuizUI.displayNext();
    }, 500);
  },
  displayScore: function() {
    var score = document.getElementById('score').getElementsByTagName('span')[0],
      incorrect = document.getElementById('incorrect').getElementsByTagName('span')[0];

    score.innerHTML = quiz.score;
    incorrect.innerHTML = quiz.currentQuestionIndex - quiz.correct;
  },
  displayQuestionNumber: function() {
    var currentQuestionNumber = quiz.currentQuestionIndex + 1,
      questionNumber = document.getElementById('number').getElementsByTagName('span')[0];

    questionNumber.innerHTML = currentQuestionNumber + ' / ' + quiz.question.length;
  },
  gameOver: function() {
    var gameOver = '<li><div>Game over</div>';
    gameOver += '<p class="result">Result: ' + this.statistic() + '%</p>';
    gameOver += '<a class="start-again" href="/">Try again</a>';
    gameOver += '</li>';
    document.getElementsByClassName('content')[0].classList.add('game-over');
    this.choicesEl.innerHTML = gameOver;
  },
  statistic: function() {
    // 1/20 * 100
    return Math.round((quiz.correct / quiz.question.length) * 100);
  }
};

//Display Quiz
var question = [];

(function getQuestionJson() {
  console.log('jsonQuestions', jsonQuestions);
  processMyJson(jsonQuestions);
})();

function processMyJson(json) {
  var jsonQuest = json.questions;

  function shuffle() {
    return .5 - Math.random();
  }

  for (var i = 0; i < jsonQuest.length; i++) {
    // Shuffle choices
    var shuffleChoices = jsonQuest[i].choices.sort(shuffle);

    //Add questions to array
    question.push(new Question(jsonQuest[i].quest, shuffleChoices, jsonQuest[i].correct));
  }

  // Shuffle question
  question.sort(shuffle);

  //Display Quiz after callback
  QuizUI.startQuiz();
}

//Create Quiz
var quiz = new Quiz(question);
