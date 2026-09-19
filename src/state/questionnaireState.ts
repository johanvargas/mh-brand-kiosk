import { proxy } from "valtio";

export interface QuestionnaireState {
  currentQuestion: string;
  currentQuestionIndex: number;
  answerWeight: number[];
  error: string | null;
}

// Database state management
const questionnaireState = proxy<QuestionnaireState>({
  currentQuestion: "",
  currentQuestionIndex: 0,
  answerWeight: [0, 0, 0, 0, 0],
  error: null,
});

const resetQuestionnaireState = (): void => {
  questionnaireState.currentQuestion = "";
  questionnaireState.currentQuestionIndex = 0;
  questionnaireState.answerWeight = [0, 0, 0, 0, 0];
  console.log("reset accessed");
};

export default questionnaireState;
export { resetQuestionnaireState };
