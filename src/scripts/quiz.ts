import { shuffle } from 'lodash';
import jsonQuestions from './questions.json';

type TQuizData = {
  question: string;
  choices: string[];
  correct?: string;
}

type TQuestions = TQuizData[] | never[];

let questions: TQuestions = [];

class Quiz {
  score: number;
  correct: number;
  questions: TQuestions;
  currentQuestionIndex: number;
  letters: string[];

  constructor(questions: TQuestions) {
    this.score = 0;
    this.correct = 0;
    this.questions = questions;
    this.currentQuestionIndex = 0;
    this.letters = 'abcdef'.split('');
  }

  getCurrentQuestion() {
    return this.questions[this.currentQuestionIndex];
  }

  nextQuestion() {
    return this.currentQuestionIndex++;
  }

  hasEnded() {
    return this.currentQuestionIndex === this.questions.length;
  }

  isCorrect(selected: number) {
    const currentSelect = this.getCurrentQuestion().choices[selected];
    return currentSelect === this.getCurrentQuestion().correct;
  }

  setScore() {
    this.score += 10;
    this.correct += 1;
  }

  getCorrectPercent() {
    // 1/20 * 100
    return Math.round((this.correct / this.questions.length) * 100);
  }
}

const choicesEl = document.getElementById('answers') as HTMLUListElement;
const choicesItems = choicesEl.getElementsByTagName('li')! as HTMLCollectionOf<HTMLLIElement>;
const checkButton = document.getElementById('submit')!;
const nextButton = document.getElementById('next')!;

const startQuiz = () => {
  const startButton = document.getElementById('start-quiz');
  const startEl = document.getElementById('start');
  const quizEl = document.getElementById('quiz');

  startButton?.addEventListener('click', () => {
    startEl?.classList.add('hide');
    quizEl?.classList.remove('hide');

    displayNext();
  });
}

const displayNext = () => {
  if (quiz.hasEnded()) {
    displayScore();
    gameOver();
  } else {
    displayScore();
    displayQuestionNumber();
    displayQuestion();
    displayChoices();
  }
}

const displayScore = () => {
  const scoreElement = document.querySelector('#score span') as HTMLSpanElement;
  const incorrectElement = document.querySelector('#incorrect span') as HTMLSpanElement;

  scoreElement.textContent = String(quiz.score);
  incorrectElement.textContent = String(quiz.currentQuestionIndex - quiz.correct);
}

const displayQuestionNumber = () => {
  const currentQuestionNumber = quiz.currentQuestionIndex + 1;
  const questionNumberElement = document.querySelector('#number span') as HTMLSpanElement;

  questionNumberElement.textContent = `${currentQuestionNumber} / ${quiz.questions.length}`;
};

const displayQuestion = () => {
  const questionContent = quiz.getCurrentQuestion().question;
  const questionEl = document.getElementById('question')!;
  questionEl.textContent = questionContent;
};

const displayChoices = () => {
  const getChoices = quiz.getCurrentQuestion().choices;

  getChoices.forEach((choice, index) => {
    const createQuestion = `
      <li class="choice dummy__item" data-choice-number="${index}">
        <span class="choice__element">${quiz.letters[index]}</span>
        ${choice}
      </li>
    `;

    choicesEl.innerHTML += createQuestion;
  });

  setTimeout(function() {
    choicesEl.classList.add('dummy--active');
  }, 100);

  guessHandler();
};

const guessHandler = () => {
  Array.from(choicesItems).forEach((choice: HTMLLIElement) => {
    choice.addEventListener('click', function() {

      Array.from(choicesItems).forEach((choice: HTMLLIElement) => {
        choice.classList.remove('select');
      })

      checkButton.classList.add('button--show');
      checkButton.setAttribute('data-choice-number',
      this.getAttribute('data-choice-number')!);
      this.classList.add('select');
    })
  });

  checkButton.addEventListener('click', checkQuestion);
  nextButton.addEventListener('click', nextQuestion);
};

const checkQuestion = () => {
  const choiceNumber = Number(checkButton.dataset.choiceNumber);

  checkButton.classList.remove('button--show');
  nextButton.classList.add('button--show');
  choicesEl.classList.add('noclick');

  if (quiz.isCorrect(choiceNumber)) {
    quiz.setScore();
    choicesItems[choiceNumber].classList.add('valid');
  } else {
    choicesItems[choiceNumber].classList.add('invalid');
  }

  choicesItems[choiceNumber].querySelector('span')!.textContent = '';
};
const nextQuestion = () => {
  nextButton.classList.remove('button--show');
  choicesEl.classList.remove('noclick');

  choicesEl.classList.remove('dummy--active');
  setTimeout(function() {
    choicesEl.textContent = '';
    quiz.nextQuestion();
    displayNext();
  }, 700);
};

const gameOver = () => {
  const gameOver = `
    <li>
      <div>Game over</div>
      <p class="result">Result: ${quiz.getCorrectPercent()}%</p>
      <a class="start-again" href="/">Try again</a>
    </li>
  `;
  document.getElementsByClassName('content')[0].classList.add('game-over');
  choicesEl.innerHTML = gameOver;
};

const initQuiz = (quizData: TQuizData[]) => {
  const shuffleQuestions = quizData.map(({ question, choices}: TQuizData) => ({
      question,
      choices: shuffle(choices),
      correct: choices[0]
  }));

  // Shuffle questions
  questions = shuffle(shuffleQuestions);

  //Display Quiz after callback
  startQuiz();
}

// Run Quiz
initQuiz(jsonQuestions);

const quiz = new Quiz(questions);