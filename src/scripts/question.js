export class Question {
  constructor(question, choices, answer) {
    this.question = question;
    this.choices = choices;
    this.answer = answer;
  }

  isCorrect(choice) {
    return this.answer === choice;
  }
}
