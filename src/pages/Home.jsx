import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import image1 from "../assets/carousel_mens/AdobeStock_220536548.jpeg";
import image2 from "../assets/carousel_mens/AdobeStock_282261700.jpeg";
import image3 from "../assets/carousel_mens/AdobeStock_287429773.jpeg";
import image4 from "../assets/carousel_mens/AdobeStock_303333387.jpeg";
import { resetQuestionnaireState } from "../state/questionnaireState.js";

const carouselImages = [
  { src: image1, alt: "Men's styling image 1" },
  { src: image2, alt: "Men's styling image 2" },
  { src: image3, alt: "Men's styling image 3" },
  { src: image4, alt: "Men's styling image 4" },
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
      setCurrentIndex((prevIndex) => 
        (prevIndex + 1) % carouselImages.length
      );
    }, 4000); // Change image every 4 seconds

    return () => clearInterval(interval);
  }, [isPaused]);
  //reset the state-questionnaire
  //
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
            className={`home-image ${index === currentIndex ? 'active' : ''}`}
          />
        ))}
      </div>
      <div className="home-content-section">
        <h1 className="home-title">
          Find Your<br />
          Men's Styling<br />
          Match
        </h1>
        <button 
          className="home-cta-button"
          onClick={() => { navigate("/menu") }}
        >
          Start Here
        </button>
        <p className="home-footer-link">Find more at Walmart.com</p>
      </div>
    </>
  );
}
