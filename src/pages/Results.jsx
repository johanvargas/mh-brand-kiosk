import React, { useState, useEffect } from "react";
import { useActionData, NavLink } from "react-router";
import products from "../database/products.js"; 
import { io } from "socket.io-client";

/* Socket IO connection */
const socket = io("http://localhost:8081");

export default function Results() {
  const actData = useActionData();
  const [currentProductIndex, setCurrentProductIndex] = useState(0);
  const currentProduct = products[currentProductIndex] || products[0];

  useEffect(() => {
    setCurrentProductIndex(actData.selection);
  },[]);

  const setCubby = (cub) => {
    console.log("cubby number: ", cub)
    socket.emit("trigger", cub)
  }

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
            <img 
              src={currentProduct.image || "/stand-in-1.png"} 
              alt={currentProduct.name}
              className="product-image"
            />
        </div>
      </div>
        <button 
          className="results-cta-button"
          onClick={() => setCubby(currentProductIndex)}
        >
          See Product at Shelf
        </button>

        <div className="results-links-container">
          <NavLink to="/" className="results-home-link">Home</NavLink>
          <span className="results-links-separator">|</span>
          <NavLink to="/camera" className="results-camera-link">Fun with Hair Styles</NavLink>
        </div>
      </>
  );
}
