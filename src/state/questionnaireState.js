import { proxy } from "valtio";

// Database state management
const questionnaireState = proxy({
  currentQuestion: "",
  currentQuestionIndex: 0,
  answerWeight: [0, 0, 0, 0, 0],
  error: null,
});

const resetQuestionnaireState = () => {
  questionnaireState.currentQuestion = "";
  questionnaireState.currentQuestionIndex = 0;
  questionnaireState.answerWeight = [0, 0, 0, 0, 0];
  console.log("reset accessed");
};

export default questionnaireState;
export { resetQuestionnaireState };
