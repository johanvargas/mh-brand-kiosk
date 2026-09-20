import { describe, it, expect, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router";
import QuestionSequence from "./QuestionSequence";
import questionnaireState from "../state/questionnaireState";
import questions from "../assets/mens-questions.json";

// The component calls NavLink and useNavigate, both of which need a router
// above them. MemoryRouter is the in-memory stand-in for the real one.
const renderQuiz = () =>
  render(
    <MemoryRouter initialEntries={["/questions"]}>
      <QuestionSequence />
    </MemoryRouter>,
  );

beforeEach(() => {
  questionnaireState.answerWeight = [0, 0, 0, 0, 0];
  questionnaireState.currentQuestionIndex = 0;
});

describe("QuestionSequence", () => {
  it("opens on the first question with all of its answers", () => {
    renderQuiz();

    expect(screen.getByRole("heading", { name: "Question 1" })).toBeInTheDocument();
    expect(screen.getByText(questions.questions[0].question)).toBeInTheDocument();

    for (const answer of questions.questions[0].sampleAnswers) {
      expect(screen.getByRole("button", { name: answer })).toBeInTheDocument();
    }
  });

  it("highlights the answer a visitor taps", async () => {
    const user = userEvent.setup();
    renderQuiz();

    const option = screen.getByRole("button", {
      name: questions.questions[0].sampleAnswers[1],
    });
    expect(option).not.toHaveClass("selected");

    await user.click(option);

    expect(
      screen.getByRole("button", { name: questions.questions[0].sampleAnswers[1] }),
    ).toHaveClass("selected");
  });

  it("records the chosen weight and moves to the next question", async () => {
    const user = userEvent.setup();
    renderQuiz();

    // Second answer (index 1) stores a weight of 2 against question 1.
    await user.click(
      screen.getByRole("button", { name: questions.questions[0].sampleAnswers[1] }),
    );
    await user.click(screen.getByRole("button", { name: "Next" }));

    expect(questionnaireState.answerWeight[0]).toBe(2);
    expect(questionnaireState.currentQuestionIndex).toBe(1);
    expect(screen.getByRole("heading", { name: "Question 2" })).toBeInTheDocument();
    expect(screen.getByText(questions.questions[1].question)).toBeInTheDocument();
  });

  it("starts the next question with no answer pre-selected", async () => {
    const user = userEvent.setup();
    renderQuiz();

    await user.click(
      screen.getByRole("button", { name: questions.questions[0].sampleAnswers[0] }),
    );
    await user.click(screen.getByRole("button", { name: "Next" }));

    for (const answer of questions.questions[1].sampleAnswers) {
      expect(screen.getByRole("button", { name: answer })).not.toHaveClass("selected");
    }
  });

  it("records 0 when Next is pressed without choosing an answer", async () => {
    const user = userEvent.setup();
    renderQuiz();

    await user.click(screen.getByRole("button", { name: "Next" }));

    expect(questionnaireState.answerWeight[0]).toBe(0);
    expect(questionnaireState.currentQuestionIndex).toBe(1);
  });
});
