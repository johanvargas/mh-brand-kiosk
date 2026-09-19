import questionnaireState from "../state/questionnaireState";

/**
 * Updates the answer weight based on the selected answer index.
 * A `null` selection falls through to the default and stores 0.
 *
 * @param selectedAnswer - The index of the selected answer (0-4), or null when unanswered
 * @param currentQuestionIndex - The current question index
 */
export const updateAnswerWeight = (
  selectedAnswer: number | null,
  currentQuestionIndex: number,
): void => {
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
