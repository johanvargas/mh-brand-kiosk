import React, { useState, useEffect } from "react";
import { useActionData, NavLink, redirect } from "react-router";
import products from "../database/products.js";
import { io } from "socket.io-client";

/* Socket IO connection */
// IP needs to be the IP of the pi with the http server
const socket = io("http://localhost:8081");
//const socket = io("http://192.168.0.195:8081");

export default function Results() {
  const actData = useActionData();
  const [currentProductIndex, setCurrentProductIndex] = useState(0);
  const currentProduct = products[currentProductIndex] || products[0];
  const [idempote, setIdempote] = useState(0);

  useEffect(() => {
    setCurrentProductIndex(actData.selection);
  }, []);


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
