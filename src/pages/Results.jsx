import React, { useState, useEffect } from "react";
import { useActionData, NavLink, redirect } from "react-router";
import products from "../database/products.js";
import { io } from "socket.io-client";
import useInactivityTimeout from "../components/useInactivityTimeout.js";

// Import images from each product folder
const imageModules = import.meta.glob('../assets/*/PNGs/*.png', { eager: true });

// Organize images by folder index
const productImages = {};
Object.entries(imageModules).forEach(([path, module]) => {
  const match = path.match(/\/assets\/(\d+)\/PNGs\//);
  if (match) {
    const folderIndex = parseInt(match[1]);
    if (!productImages[folderIndex]) {
      productImages[folderIndex] = [];
    }
    productImages[folderIndex].push(module.default);
  }
});

/* Socket IO connection */
// IP needs to be the IP of the pi with the http server
const socket = io("http://localhost:8081");
//const socket = io("http://192.168.0.195:8081");

export default function Results() {
  useInactivityTimeout(30000);
  const actData = useActionData();
  const [currentProductIndex, setCurrentProductIndex] = useState(0);
  const currentProduct = products[currentProductIndex] || products[0];
  const [idempote, setIdempote] = useState(0);
  const [carouselIndex, setCarouselIndex] = useState(0);

  // Get images for current product
  const currentImages = productImages[currentProductIndex] || [];

  useEffect(() => {
    setCurrentProductIndex(actData.selection);
  }, []);

  // Reset carousel when product changes
  useEffect(() => {
    setCarouselIndex(0);
  }, [currentProductIndex]);

  const nextImage = () => {
    setCarouselIndex((prev) => (prev + 1) % currentImages.length);
  };

  const prevImage = () => {
    setCarouselIndex((prev) => (prev - 1 + currentImages.length) % currentImages.length);
  };


  const updateIdem = () => {
    setIdempote(prev => prev + 1)

  }

  const setCubby = (cub) => {
    console.log(`cubby #${cub} illuminated`);
    console.log("idempotent item count: ", idempote);
    updateIdem();
    socket.emit("trigger", cub);

    //not working, this isn't a component, just a function
    if (idempote > 0) redirect("home")
  };

  return (
    <>
      <div className="quiz-navigation">
        <div className="results-header">
          <h1 className="title">
            {currentProduct.name}
            <span className="results-title-underline"></span>
          </h1>
          <p className="results-description">{currentProduct.description}</p>
        </div>

        <div className="product-image-container">
          {currentImages.length > 0 ? (
            <div className="carousel">
              <button className="carousel-btn carousel-btn-prev" onClick={prevImage}>
                &#8249;
              </button>
              <img
                src={currentImages[carouselIndex]}
                alt={`${currentProduct.name} ${carouselIndex + 1}`}
                className="product-image"
              />
              <button className="carousel-btn carousel-btn-next" onClick={nextImage}>
                &#8250;
              </button>
              <div className="carousel-dots">
                {currentImages.map((_, idx) => (
                  <span
                    key={idx}
                    className={`carousel-dot ${idx === carouselIndex ? 'active' : ''}`}
                    onClick={() => setCarouselIndex(idx)}
                  />
                ))}
              </div>
            </div>
          ) : (
            <img
              src={currentProduct.image || "/stand-in-1.png"}
              alt={currentProduct.name}
              className="product-image"
            />
          )}
        </div>
      </div>
      <button
        className="results-cta-button"
        onClick={() => setCubby(currentProductIndex)}

      >
        {idempote > 0 ? "Go Back Home" : "See Product at Shelf"}
      </button>
      <div className="results-links-container">
        <NavLink to="/" className="results-home-link" viewTransition>
          Home
        </NavLink>
        <span className="results-links-separator">&nbsp;|&nbsp;</span>
        <NavLink to="/camera" className="results-camera-link" viewTransition>
          Fun with Hair Styles
        </NavLink>
      </div>
    </>
  );
}
