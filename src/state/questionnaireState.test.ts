import { describe, it, expect } from "vitest";
import questionnaireState, { resetQuestionnaireState } from "./questionnaireState";

describe("resetQuestionnaireState", () => {
  it("clears a part-finished quiz back to the starting state", () => {
    // Simulate someone who answered three questions and walked away.
    questionnaireState.currentQuestion = "What finish do you prefer?";
    questionnaireState.currentQuestionIndex = 3;
    questionnaireState.answerWeight = [2, 5, 1, 0, 0];

    resetQuestionnaireState();

    expect(questionnaireState.currentQuestion).toBe("");
    expect(questionnaireState.currentQuestionIndex).toBe(0);
    expect(questionnaireState.answerWeight).toEqual([0, 0, 0, 0, 0]);
  });

  it("leaves five answer slots, so the next visitor can answer every question", () => {
    resetQuestionnaireState();
    expect(questionnaireState.answerWeight).toHaveLength(5);
  });
});
