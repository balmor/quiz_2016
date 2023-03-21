import jsonQuestions from './questions.json';

class Question {
  constructor(question, choices, answer) {
    this.question = question;
    this.choices = choices;
    this.answer = answer;
  }

  isCorrect(choice) {
    return this.answer === choice;
  }
}

class Quiz {
  constructor(question) {
    this.score = 0;
    this.correct = 0;
    this.question = question;
    this.currentQuestionIndex = 0;
    this.letters = 'abcdef'.split(''); // ['a', 'b', 'c', 'd', 'e', 'f']
  }
  getCurrentQuestion() {
    return this.question[this.currentQuestionIndex];
  }
  currentQuestion() {
    return this.currentQuestionIndex++;
  }
  hasEnded() {
    return this.currentQuestionIndex >= this.question.length;
  }
}

const QuizUI = {
  startQuiz() {
    this.cacheDOM();
    this.startButton.onclick = this.startEvent.bind(this);
  },
  startEvent() {
    this.startEl.classList.add('hide');
    this.quizEl.classList.remove('hide');
    this.displayNext();
  },
  cacheDOM() {
    this.startButton = document.getElementById('start-quiz');
    this.startEl = document.getElementById('start');
    this.quizEl = document.getElementById('quiz');
    this.choicesEl = document.getElementById('answers');
    this.choicesItems = this.choicesEl.getElementsByTagName('li');
    this.checkButton = document.getElementById('submit');
    this.nextButton = document.getElementById('next');
  },
  displayNext() {
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
  displayQuestion() {
    this.populateIdWithHTML('question', quiz.getCurrentQuestion().question);
  },
  displayChoices() {
    let getChoices = quiz.getCurrentQuestion().choices,
      self = this;

    for (let i = 0; i < getChoices.length; i++) {
      let createQuestion = `<li class="choice dummy__item" data-choice-number="${i}"><span class="choice__element">${quiz.letters[i]}</span>${getChoices[i]}</li>`;
      this.choicesEl.innerHTML += createQuestion;
    };

    setTimeout(function() {
      self.choicesEl.classList.add('dummy--active');
    }, 500);

    this.guessHandler();
  },
  populateIdWithHTML(id, text) {
    let element = document.getElementById(id);
    element.innerHTML = text;
  },
  guessHandler() {
    let self = this;

    for (let x = 0; x < this.choicesItems.length; x++) {
      this.choicesItems[x].addEventListener('click', function() {

        for (let i = 0; i < self.choicesItems.length; i++) {
          self.choicesItems[i].classList.remove('select');
        }

        self.checkButton.classList.add('button--show');
        self.checkButton.setAttribute('data-choice-number',
        this.getAttribute('data-choice-number'));
        this.classList.add('select');
      });
    }

    this.checkButton.onclick = this.checkQuestion;
    this.nextButton.onclick = this.nextQuestion;
  },
  test() {
    console.log(QuizUI.choicesEl);
    console.log(self);
    console.log(this);
  },
  checkQuestion() {
    let choice = quiz.getCurrentQuestion().choices,
      answer = quiz.getCurrentQuestion().answer,
      attributeChoice = this.getAttribute('data-choice-number');

    this.classList.remove('button--show');
    QuizUI.nextButton.classList.add('button--show');
    QuizUI.choicesEl.classList.add('noclick');

    if (choice[attributeChoice] === answer) {
      quiz.score = quiz.score + 10;
      quiz.correct = quiz.correct + 1;
      QuizUI.choicesItems[attributeChoice].classList.add('valid');
    } else {
      QuizUI.choicesItems[attributeChoice].classList.add('invalid');
    }

    QuizUI.choicesItems[attributeChoice].getElementsByTagName('span')[0].innerHTML = '';
  },
  nextQuestion() {
    this.classList.remove('button--show');
    QuizUI.choicesEl.classList.remove('noclick');

    QuizUI.choicesEl.classList.remove('dummy--active');
    setTimeout(function() {
      QuizUI.choicesEl.innerHTML = '';
      quiz.currentQuestion();
      QuizUI.displayNext();
    }, 500);
  },
  displayScore() {
    let score = document.getElementById('score').getElementsByTagName('span')[0],
      incorrect = document.getElementById('incorrect').getElementsByTagName('span')[0];

    score.innerHTML = quiz.score;
    incorrect.innerHTML = quiz.currentQuestionIndex - quiz.correct;
  },
  displayQuestionNumber() {
    let currentQuestionNumber = quiz.currentQuestionIndex + 1,
      questionNumber = document.getElementById('number').getElementsByTagName('span')[0];

    questionNumber.innerHTML = `${currentQuestionNumber} / ${quiz.question.length}`;
  },
  gameOver() {
    let gameOver = `<li><div>Game over</div><p class="result">Result:
    ${this.statistic()}%</p><a class="start-again" href="/">Try again</a></li>`;
    document.getElementsByClassName('content')[0].classList.add('game-over');
    this.choicesEl.innerHTML = gameOver;
  },
  statistic() {
    // 1/20 * 100
    return Math.round((quiz.correct / quiz.question.length) * 100);
  }
};

//Display Quiz
let question = [];

(function getQuestionJson() {
  processMyJson(jsonQuestions);
})();

function processMyJson(json) {
  let jsonQuest = json.questions;

  function shuffle() {
    return .5 - Math.random();
  }

  for (let i = 0; i < jsonQuest.length; i++) {
    // Shuffle choices
    let shuffleChoices = jsonQuest[i].choices.sort(shuffle);

    //Add questions to array
    question.push(new Question(
      jsonQuest[i].quest,
      shuffleChoices,
      jsonQuest[i].correct
    ));
  }

  // Shuffle question
  question.sort(shuffle);

  //Display Quiz after callback
  QuizUI.startQuiz();
}

//Create Quiz
const quiz = new Quiz(question);
