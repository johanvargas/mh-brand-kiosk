import React, { useState } from "react";
import "../index.css";
import { useNavigate, NavLink } from "react-router";

const Menu = () => {
  const navigate = useNavigate();
  const [selectedOption, setSelectedOption] = useState(null);

  const handleOptionClick = (option) => {
    setSelectedOption(option);
  };

  const handleGoClick = () => {
    if (selectedOption === "quiz") {
      navigate("/quiz");
    } else if (selectedOption === "camera") {
      navigate("/camera");
    }
  };

  return (
    <>
      <div className="question-container">
        <h1 className="title">
          Select One
          <span className="menu-title-underline"></span>
        </h1>
        <div className="options-container menu-options">
          <button
            type="button"
            className={`option-button menu-option-button ${selectedOption === "quiz" ? "selected" : ""}`}
            onClick={() => handleOptionClick("quiz")}
          >
            <span className="option-text">Find a product that's right for your hair</span>
          </button>
          <button
            type="button"
            className={`option-button menu-option-button ${selectedOption === "camera" ? "selected" : ""}`}
            onClick={() => handleOptionClick("camera")}
          >
            <span className="option-text">Try on different hairstyles</span>
          </button>
        </div>
        <button
          type="button"
          className="menu-go-button"
          onClick={handleGoClick}
          disabled={!selectedOption}
        >
          {selectedOption ? "Go" : "Select An Option"}
        </button>
        <NavLink to="/" className="menu-home-link">Home</NavLink>
      </div>
    </>
  )
};

export default Menu;
