import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import image1 from "../assets/carousel_mens/Men's Passive Image 1.png";
import image2 from "../assets/carousel_mens/Men's Passive Image 2.png";
import image3 from "../assets/carousel_mens/Men's Passive Image 3.png";
import image4 from "../assets/carousel_mens/Men's Passive Image 4.png";
import image5 from "../assets/carousel_mens/Men's Passive Image 5.png";
import { resetQuestionnaireState } from "../state/questionnaireState.js";

const carouselImages = [
  { src: image1, alt: "Men's styling image 1" },
  { src: image2, alt: "Men's styling image 2" },
  { src: image3, alt: "Men's styling image 3" },
  { src: image4, alt: "Men's styling image 4" },
  { src: image5, alt: "Men's styling image 5" },
];

export default function Home() {
  const navigate = useNavigate();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    resetQuestionnaireState();
  }, []);

  useEffect(() => {
    if (isPaused) return;

    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % carouselImages.length);
    }, 4000); // Change image every 4 seconds

    return () => clearInterval(interval);
  }, [isPaused]);

  //reset the state-questionnaire
  //button needs to reset the values in the state-questionnaire before going to next page (quiz)

  return (
    <>
      <div
        className="home-image-section"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        {carouselImages.map((image, index) => (
          <img
            key={index}
            src={image.src}
            alt={image.alt}
            className={`home-image ${index === currentIndex ? "active" : ""}`}
          />
        ))}
      </div>
      <div className="home-content-section">
        <h1 className="home-title">
          Find Your
          <br />
          Men's Styling
          <br />
          Match
        </h1>

        <button
          className="home-cta-button"
          onClick={() => navigate("/menu", { viewTransition: true })}
        >
          Start Here
        </button>

        <div>
          <p className="home-footer-link h-10">Find more at Walmart.com</p>
        </div>
      </div>
    </>
  );
}
