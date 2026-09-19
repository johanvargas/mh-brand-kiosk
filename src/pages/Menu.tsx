import { useState } from "react";
import { useNavigate, NavLink } from "react-router";
import useInactivityTimeout from "../components/useInactivityTimeout";
import "../index.css";

type MenuOption = "quiz" | "camera";

const Menu = () => {
  useInactivityTimeout(30000);
  const navigate = useNavigate();
  const [selectedOption, setSelectedOption] = useState<MenuOption | null>(null);

  const handleOptionClick = (option: MenuOption): void => {
    setSelectedOption(option);
  };

  const handleGoClick = (): void => {
    if (selectedOption === "quiz") {
      void navigate("/quiz", { viewTransition: true });
    } else if (selectedOption === "camera") {
      void navigate("/camera", { viewTransition: true });
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
          className="menu-go-button text-pretty"
          onClick={handleGoClick}
          disabled={!selectedOption}
        >
          {selectedOption ? "Go" : "Select An Option"}
        </button>
        <NavLink to="/" className="menu-home-link" viewTransition>Home</NavLink>
      </div>
    </>
  )
};

export default Menu;
