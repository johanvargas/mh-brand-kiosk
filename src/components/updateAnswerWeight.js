import questionnaireState from "../state/questionnaireState.js";

/**
 * Updates the answer weight based on the selected answer index
 * @param {number} selectedAnswer - The index of the selected answer (0-4)
 * @param {number} currentQuestionIndex - The current question index
 */
export const updateAnswerWeight = (selectedAnswer, currentQuestionIndex) => {
  switch (selectedAnswer) {
    case 0:
      questionnaireState.answerWeight[currentQuestionIndex] = 1;
      break;
    case 1:
      questionnaireState.answerWeight[currentQuestionIndex] = 2;
      break;
    case 2:
      questionnaireState.answerWeight[currentQuestionIndex] = 3;
      break;
    case 3:
      questionnaireState.answerWeight[currentQuestionIndex] = 4;
      break;
    case 4:
      questionnaireState.answerWeight[currentQuestionIndex] = 5;
      break;
    default:
      questionnaireState.answerWeight[currentQuestionIndex] = 0;
  }
};
