import { describe, it, expect, beforeEach } from "vitest";
import { updateAnswerWeight } from "./updateAnswerWeight";
import questionnaireState from "../state/questionnaireState";

// `questionnaireState` is a module-level singleton, so every test starts from a
// known baseline instead of inheriting whatever the previous test wrote.
beforeEach(() => {
  questionnaireState.answerWeight = [0, 0, 0, 0, 0];
  questionnaireState.currentQuestionIndex = 0;
});

describe("updateAnswerWeight", () => {
  // Answer index 0 is the lightest option and 4 the heaviest, so the stored
  // weight is always the index plus one.
  it.each([
    [0, 1],
    [1, 2],
    [2, 3],
    [3, 4],
    [4, 5],
  ])("stores weight %i + 1 = %i for the matching answer", (answer, weight) => {
    updateAnswerWeight(answer, 0);
    expect(questionnaireState.answerWeight[0]).toBe(weight);
  });

  it("stores 0 when nothing was selected", () => {
    updateAnswerWeight(null, 0);
    expect(questionnaireState.answerWeight[0]).toBe(0);
  });

  it("stores 0 for an answer index outside 0-4", () => {
    updateAnswerWeight(9, 0);
    expect(questionnaireState.answerWeight[0]).toBe(0);
  });

  it("writes to the given question slot and leaves the others alone", () => {
    updateAnswerWeight(2, 3);
    expect(questionnaireState.answerWeight).toEqual([0, 0, 0, 3, 0]);
  });

  it("overwrites a previous answer for the same question", () => {
    updateAnswerWeight(0, 1);
    updateAnswerWeight(3, 1);
    expect(questionnaireState.answerWeight[1]).toBe(4);
  });
});
