import React, { useState, useEffect } from "react";
import { Form, NavLink } from "react-router";
import { proxy, useSnapshot } from "valtio";
import questionnaireState from "../state/questionnaireState.js";
import { updateAnswerWeight } from "../components/updateAnswerWeight.js";
import * as questions from "../database/mens-questions.json";
import "../index.css";

// question-answer store
const quest = proxy(questions);

const QuestionSequence = () => {
  const snap = useSnapshot(quest);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  let questionSet = snap.questions[questionnaireState.currentQuestionIndex];

  useEffect(() => {
    questionnaireState.currentQuestionIndex = 0;
  }, []);

  // function to move to next
  const handleNext = () => {
    console.log("question index: ", questionnaireState.currentQuestionIndex);
    console.log("selected answer: ", selectedAnswer);
    if (selectedAnswer <= 4 && questionnaireState.currentQuestionIndex < 4) {
      updateAnswerWeight(
        selectedAnswer,
        questionnaireState.currentQuestionIndex,
      );
      // clears answer state to allow next answer to be set
      setSelectedAnswer(null);
      questionnaireState.currentQuestionIndex += 1;
    }
  };

  const Button = () => {
    return (
      <>
        <div className="quiz-navigation">
          {questionnaireState.currentQuestionIndex === 4 && Number.isInteger(selectedAnswer) ? (
            <Form action="/results" method="post">
              <input
                type="hidden"
                name="weightValue0"
                value={questionnaireState.answerWeight[0]}
              />

              <input
                type="hidden"
                name="weightValue1"
                value={questionnaireState.answerWeight[1]}
              />

              <input
                type="hidden"
                name="weightValue2"
                value={questionnaireState.answerWeight[2]}
              />

              <input
                type="hidden"
                name="weightValue3"
                value={questionnaireState.answerWeight[3]}
              />

              <input
                type="hidden"
                name="weightValue4"
                value={questionnaireState.answerWeight[4]}
              />
              <button type="submit" className="nav-button next-button">
                See Your Results
              </button>
            </Form>
          ) : (
            <button
              className="nav-button next-button"
              onClick={() => handleNext()}
            >
              Next
            </button>
          )}
        </div>
      </>
    );
  };

  // Nested Component
  const SelectQuestions = () => {
    const handleOptionClick = (optionIndex) => {
      //console.log("handle option trig: ");
      //console.log("option: ", optionIndex);
      setSelectedAnswer(optionIndex);
    };

    // Calculate progress: fill from right to left
    // Question 1 (index 0) = 20% filled from right
    // Question 2 (index 1) = 40% filled from right
    // Question 3 (index 2) = 60% filled from right
    // Question 4 (index 3) = 80% filled from right
    // Question 5 (index 4) = 100% filled from right
    const totalQuestions = snap.questions.length;
    const currentQuestion = questionnaireState.currentQuestionIndex + 1; // 1-5
    const fillPercentage = (currentQuestion / totalQuestions) * 100;

    return (
      <div className="question-container">
        <h1 className="title">
          Question {questionnaireState.currentQuestionIndex + 1}
        </h1>
        <div 
          className="question-progress-line"
          style={{ '--fill-percentage': `${fillPercentage}%` }}
        ></div>
        <h2 className="question-text">{questionSet.question}</h2>
        <div className="options-container">
          {questionSet.sampleAnswers.map((option, index) => (
            <button
              key={index}
              type="button"
              className={`option-button ${selectedAnswer === index ? "selected" : ""}`}
              onClick={() => handleOptionClick(index)}
            >
              <span className="option-text">{option}</span>
            </button>
          ))}
        </div>
      </div>
    );
  };

  return (
    <>
      <SelectQuestions />
      <Button />
          <div className="results-links-container">
            <NavLink to="/" className="home-link">Home</NavLink>
            <span className="results-links-separator">|</span>
            <NavLink to="/camera" className="results-camera-link">Fun with Hair Styles</NavLink>
          </div>
    </>
  );
};

export default QuestionSequence;
